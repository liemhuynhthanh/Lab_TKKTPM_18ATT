from pydantic import BaseModel

class FoodCreate(BaseModel):
    name: str
    price: float
    description: str
    category: str  
class FoodResponse(BaseModel):
    id: str
    name: str
    price: float
    description: str
    category: str   

    class Config:
        from_attributes = True