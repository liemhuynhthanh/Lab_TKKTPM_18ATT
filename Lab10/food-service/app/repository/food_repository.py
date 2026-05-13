from sqlalchemy.orm import Session
from app.domain.food_model import Food

class FoodRepository:

    def find_all(self, db: Session):
        return db.query(Food).all()

    def find_by_id(self, db: Session, food_id: str):
        return db.query(Food).filter(Food.id == food_id).first()

    def save(self, db: Session, food: Food):
        db.add(food)
        db.commit()
        db.refresh(food)
        return food

    def update(self, db: Session, food: Food):
        db.commit()
        db.refresh(food)
        return food

    def delete(self, db: Session, food: Food):
        db.delete(food)
        db.commit()