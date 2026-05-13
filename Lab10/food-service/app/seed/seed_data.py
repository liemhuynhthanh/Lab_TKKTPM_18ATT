from sqlalchemy.orm import Session
from app.domain.food_model import Food

def seed(db: Session):
    if db.query(Food).count() > 0:
        return

    foods = [
        Food(name="Phở bò", price=30000, description="Phở truyền thống", category="Món nước"),
        Food(name="Bánh mì", price=20000, description="Bánh mì thịt", category="Ăn nhanh"),
        Food(name="Trà sữa", price=25000, description="Trà sữa trân châu", category="Đồ uống"),
    ]

    db.add_all(foods)
    db.commit()