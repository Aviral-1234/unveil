from fastapi import FastAPI, Request  # Import Request
from starlette.middleware.base import BaseHTTPMiddleware # Import BaseHTTPMiddleware
from app.routers import auth
from app.db.database import connect_to_mongo, close_mongo_connection
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Blind Connect API")

# --- 1. DEFINE THE FIX ---
# This middleware forces the server to allow popup communication
class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["Cross-Origin-Opener-Policy"] = "same-origin-allow-popups"
        return response

# --- 2. ADD THE FIX ---
# Add this BEFORE your CORS middleware
app.add_middleware(SecurityHeadersMiddleware)


origins = [
    "http://localhost:5173",  # Your React/Vite frontend
    "http://127.0.0.1:5173",
    "http://localhost:8000",
]

# Add the middleware to the application
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,      
    allow_credentials=True,     
    allow_methods=["*"],        
    allow_headers=["*"],        
)

# Events
app.add_event_handler("startup", connect_to_mongo)
app.add_event_handler("shutdown", close_mongo_connection)

# Routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])

@app.get("/")
async def root():
    return {"message": "Welcome to Blind Connect API - Where Personality Comes First"}