from sqlalchemy.orm import Session
from app.repository.food_repository import FoodRepository
from app.domain.food_model import Food
from app.schemas.food_schema import FoodCreate

class FoodService:

    def __init__(self):
        self.repo = FoodRepository()

    def get_all(self, db: Session):
        return self.repo.find_all(db)

    def create(self, db: Session, data: FoodCreate):
        food = Food(
            name=data.name,
            price=data.price,
            description=data.description,
            category=data.category 
        )
        return self.repo.save(db, food)

    def update(self, db: Session, food_id: str, data: FoodCreate):
        food = self.repo.find_by_id(db, food_id)
        if not food:
            return None

        food.name = data.name
        food.price = data.price
        food.description = data.description
        food.category = data.category  

        return self.repo.update(db, food)

    def delete(self, db: Session, food_id: str):
        food = self.repo.find_by_id(db, food_id)
        if not food:
            return False

        self.repo.delete(db, food)
        return True