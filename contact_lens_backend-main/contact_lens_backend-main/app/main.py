import sentry_sdk
from fastapi import FastAPI, Request, HTTPException, status
from fastapi.routing import APIRoute
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from starlette.responses import JSONResponse
from sqlmodel import Session
import logging

from app.api.main import api_router
from app.core.config import settings
from app.core.db import engine, init_sql_db

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

def custom_generate_unique_id(route: APIRoute) -> str:
    return f"{route.tags[0]}-{route.name}"

def init_db():
    with Session(engine) as session:
        init_sql_db(session)

if settings.SENTRY_DSN and settings.ENVIRONMENT != "local":
    sentry_sdk.init(dsn=str(settings.SENTRY_DSN), enable_tracing=True)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    generate_unique_id_function=custom_generate_unique_id,
)

if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        # allow_origins=[
        #     str(origin).strip("/") for origin in settings.BACKEND_CORS_ORIGINS
        # ],
         allow_origins=[
            "*"
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.add_middleware(SessionMiddleware, secret_key=settings.SECRET_KEY)

@app.get("/api/health", tags=["Health"])
async def health_check():
    return JSONResponse(status_code=status.HTTP_200_OK, content={"status": "healthy"})

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.exception_handler(HTTPException)
async def custom_http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logging.error(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An unexpected error occurred. Please try again later."},
    )

@app.on_event("startup")
async def startup_event():
    logger.info("Application startup")
    try:
        init_db()
        logger.info("Database initialized")
    except Exception as e:
        logger.critical(f"Failed to initialize database: {e}")
        raise RuntimeError("Database initialization failed") from e

@app.on_event("shutdown")
async def shutdown_event():
    logging.info("Application shutdown")
