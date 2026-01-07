from pydantic import BaseModel

class FitnessRequest(BaseModel):
    user_id: str
    age: int
    gender: str
    height: float
    weight: float
    goal: str
    experience: str

class FitnessResponse(BaseModel):
    analysis: str
    exercises: list
