from typing import List, Union
from pydantic import BaseModel, Field


class CalculateRequest(BaseModel):
    expression: str = Field(..., min_length=1, max_length=100, description="Mathematical expression to evaluate")


class CalculateResponse(BaseModel):
    expression: str
    result: Union[int, float]


class HistoryItem(BaseModel):
    id: int
    expression: str
    result: Union[int, float]
    timestamp: str


class HistoryResponse(BaseModel):
    history: List[HistoryItem]


class MessageResponse(BaseModel):
    message: str
