from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.config.database import SessionLocal
from app.service.food_service import FoodService
from app.schemas.food_schema import FoodCreate, FoodResponse

router = APIRouter()
service = FoodService()

# Dependency giống @Autowired
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/foods", response_model=list[FoodResponse])
def get_foods(db: Session = Depends(get_db)):
    return service.get_all(db)


@router.post("/foods", response_model=FoodResponse)
def create_food(food: FoodCreate, db: Session = Depends(get_db)):
    return service.create(db, food)


@router.put("/foods/{food_id}", response_model=FoodResponse)
def update_food(food_id: str, food: FoodCreate, db: Session = Depends(get_db)):
    updated = service.update(db, food_id, food)
    if not updated:
        raise HTTPException(status_code=404, detail="Food not found")
    return updated


@router.delete("/foods/{food_id}")
def delete_food(food_id: str, db: Session = Depends(get_db)):
    success = service.delete(db, food_id)
    if not success:
        raise HTTPException(status_code=404, detail="Food not found")
    return {"message": "Deleted successfully"}