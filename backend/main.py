from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from calculator import calculate
from database import init_db, add_history, get_history, clear_history
from models import CalculateRequest, CalculateResponse, HistoryResponse, MessageResponse


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize the database on startup
    init_db()
    yield


app = FastAPI(
    title="Calculator API",
    description="REST API for arithmetic calculations and calculation history",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for frontend clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": "Invalid mathematical expression"}
    )


@app.get("/api/health")
def health_check():
    return {"status": "ok", "app": "Calculator API v1.0"}


@app.post(
    "/api/calculate",
    response_model=CalculateResponse,
    responses={
        200: {"description": "Calculation successful"},
        400: {"description": "Division by zero or invalid math operation"},
        422: {"description": "Invalid mathematical expression"}
    }
)
def calculate_expression(req: CalculateRequest):
    try:
        result = calculate(req.expression)
    except ZeroDivisionError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e)
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Invalid mathematical expression"
        )

    # Persist successfully evaluated calculation to history
    add_history(req.expression, result)

    return CalculateResponse(
        expression=req.expression,
        result=result
    )


@app.get(
    "/api/history",
    response_model=HistoryResponse,
    responses={
        200: {"description": "List of previous calculations"}
    }
)
def fetch_history():
    history_items = get_history()
    return HistoryResponse(history=history_items)


@app.delete(
    "/api/history",
    response_model=MessageResponse,
    responses={
        200: {"description": "History cleared successfully"}
    }
)
def remove_history():
    clear_history()
    return MessageResponse(message="Calculation history cleared successfully")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
