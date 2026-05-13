from fastapi import FastAPI
from app.controller.food_controller import router
from app.config.database import engine, Base, SessionLocal
from app.seed.seed_data import seed
from fastapi.middleware.cors import CORSMiddleware
import time

app = FastAPI()

@app.on_event("startup")
def startup():
    retries = 10
    while retries > 0:
        try:
            print("⏳ Đang kết nối DB...")

            # tạo table
            Base.metadata.create_all(bind=engine)

            # seed data
            db = SessionLocal()
            seed(db)
            db.close()

            print("✅ DB ready + seeded")
            break
        except Exception as e:
            print("❌ DB chưa sẵn sàng, retry...")
            retries -= 1
            time.sleep(3)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)