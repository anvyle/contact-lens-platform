import uuid
from datetime import timedelta
from typing import Annotated, Any, List

from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from fastapi.responses import HTMLResponse
from sqlmodel import col, delete, func, select, text

from app import crud
from app.api.deps import (
    CurrentUser,
    SessionDep,
)
from app.core.config import settings
from app.core import security
from app.core.security import get_password_hash, verify_password
from app.models import (
    Message,
)

# chat_client = OpenAIChatter(
#     model_name="gpt-4",
#     temperature=0.2,
#     max_tokens=250,
#     prompt="Convert this text into SQL query."
#     )

router = APIRouter()

@router.get("/get-sl-all")
async def get_all_soft_lens(session: SessionDep, limit: int=10, offset: int=0):
    count_query = text("SELECT COUNT(*) FROM lenses;")
    count = session.execute(count_query).one()
    query = text(f"SELECT * FROM lenses LIMIT {limit} OFFSET {offset};")
    all_soft_lens = session.execute(query).fetchall()
    all_soft_lens_list = [dict(row._mapping) for row in all_soft_lens]
    return {"total_count": count[0], "soft_lens": all_soft_lens_list}

@router.get("/get-gpl-all")
async def get_all_gpl_lens(session: SessionDep, limit: int=10, offset: int=0):
    count_query = text("SELECT COUNT(*) FROM tbl_gp_lenses;")
    count = session.execute(count_query).one()
    query = text(f"SELECT * FROM tbl_gp_lenses LIMIT {limit} OFFSET {offset};")
    all_gas_permeable_lens = session.execute(query).fetchall()
    all_gas_permeable_lens_list = [dict(row._mapping) for row in all_gas_permeable_lens]
    return {"total_count": count[0], "gas_permeable_lens": all_gas_permeable_lens_list}

@router.get("/get-hybl-all")
async def get_all_hybl_lens(session: SessionDep, limit: int=10, offset: int=0):
    count_query = text("SELECT COUNT(*) FROM tbl_hyb_lenses;")
    count = session.execute(count_query).one()
    query = text(f"SELECT * FROM tbl_hyb_lenses LIMIT {limit} OFFSET {offset};")
    all_hybrid_lens = session.execute(query).fetchall()
    all_hybrid_lens_list = [dict(row._mapping) for row in all_hybrid_lens]
    return {"total_count": count[0], "hybrid_lens": all_hybrid_lens_list}

@router.get("/get-hlm-all")
async def get_all_hl_materials(session: SessionDep, sort_by: str="name", limit: int=10, offset: int=0):
    count_query = text("SELECT COUNT(*) FROM tbl_hl_materials;")
    count = session.execute(count_query).one()
    query = text(f"SELECT * FROM tbl_hl_materials LIMIT {limit} OFFSET {offset};")
    all_hl_materials = session.execute(query).fetchall()
    all_hl_materials_list = [dict(row._mapping) for row in all_hl_materials]
    return {"total_count": count[0], "hl_materials": all_hl_materials_list}

@router.get("/get-lp-all")
async def get_all_lens_product(session: SessionDep, limit: int=10, offset: int=0):
    count_query = text("SELECT COUNT(*) FROM tbl_lp_lensproducts;")
    count = session.execute(count_query).one()
    query = text(f"SELECT * FROM tbl_lp_lensproducts LIMIT {limit} OFFSET {offset};")
    all_lens_product = session.execute(query).fetchall()
    all_lens_product_list = [dict(row._mapping) for row in all_lens_product]
    return {"total_count": count[0], "lens_product": all_lens_product_list}

# @router.post("/chat/user")
# def user_chat(user_input: str) -> Message:
#     """
#     Endpoint for user chat with OpenAI.
#     """
#     if not user_input:
#         raise HTTPException(status_code=400, detail="No input provided")
#     res_msg = chat_client.create_chat(user_input)
#     return res_msg
    