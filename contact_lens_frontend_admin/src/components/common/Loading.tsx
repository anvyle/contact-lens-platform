export default function Loader({className = ""}) {
    return (
        <div className="flex w-full items-center justify-center">
            <div className={`animate-spin rounded-full border-4 border-solid border-primary border-t-transparent ${className}`}></div>
        </div>
    );
};
