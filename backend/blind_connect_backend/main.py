from fastapi import FastAPI
from app.routers import auth
from app.db.database import connect_to_mongo, close_mongo_connection
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI(title="Blind Connect API")

origins = [
    "http://localhost:5173",  # Your React/Vite frontend
    "http://127.0.0.1:5173",  # Sometimes localhost resolves to this IP
    "http://localhost:8000",  # FastAPI default port
    
]

# Add the middleware to the application
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,      # Allows connections from the defined origins
    allow_credentials=True,     # Allows cookies/authentication headers
    allow_methods=["*"],        # Allows all methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],        # Allows all headers
)

# Events
app.add_event_handler("startup", connect_to_mongo)
app.add_event_handler("shutdown", close_mongo_connection)

# Routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])

@app.get("/")
async def root():
    return {"message": "Welcome to Blind Connect API - Where Personality Comes First"}
