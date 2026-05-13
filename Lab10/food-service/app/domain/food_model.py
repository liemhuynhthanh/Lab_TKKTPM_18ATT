from sqlalchemy import Column, String, Float
from app.config.database import Base
import uuid

class Food(Base):
    __tablename__ = "foods"

    id = Column(String(50), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    price = Column(Float, nullable=False)
    description = Column(String(500))
    category = Column(String(100)) 