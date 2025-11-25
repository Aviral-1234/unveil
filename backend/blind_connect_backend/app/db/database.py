from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

class Database:
    client: AsyncIOMotorClient = None

db = Database()

async def get_database():
    return db.client[settings.DB_NAME]

async def connect_to_mongo():
    db.client = AsyncIOMotorClient('mongodb+srv://unveil:ZLwf7538Qyfo1G5h@cluster0.mtzx9qy.mongodb.net/')
    print("��� Connected to MongoDB")

async def close_mongo_connection():
    db.client.close()
    print("��� Disconnected from MongoDB")
