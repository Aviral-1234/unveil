from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

# Sub-models for the "Spicy" features
class Prompt(BaseModel):
    question: str
    answer: str

class Sliders(BaseModel):
    social_battery: int = Field(..., ge=1, le=10, description="1=Hermit, 10=Party Animal")
    texting_style: int = Field(..., ge=1, le=10, description="1=Novelist, 10=One Word")
    planning_style: int = Field(..., ge=1, le=10)
    humor: int = Field(..., ge=1, le=10)

# a dedicated model for Google-based user creation
class UserCreateGoogle(BaseModel):
    token: str  # The JWT from Google
    username: str # They might still want a custom display name
    age: int
    gender: str
    aura_color: str = Field(..., description="Hex code like #7B1FA2")
    prompts: List[Prompt]
    sliders: Sliders
    
    # New Fields matching Frontend Onboarding
    bio_emojis: Optional[str] = None
    music_taste: Optional[str] = None
    description: Optional[str] = None # The "About Me" section
    red_flags: Optional[str] = None   # The "My Red Flags" input
    looking_for: List[str] = []       # Replaces or works alongside tags
    tags: List[str] = []              # Kept for compatibility
    
    # Requested Feature
    blocked_users: List[str] = []     # List of user IDs that are blocked

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    username: str
    age: int
    gender: str
    aura_color: str = Field(..., description="Hex code like #7B1FA2")
    prompts: List[Prompt]
    sliders: Sliders
    
    # New Fields
    bio_emojis: Optional[str] = None
    music_taste: Optional[str] = None
    description: Optional[str] = None
    red_flags: Optional[str] = None
    looking_for: List[str] = []
    tags: List[str] = []
    
    blocked_users: List[str] = []
    
    class Config:
        schema_extra = {
            "example": {
                "email": "spicy@example.com",
                "password": "securepassword",
                "username": "MysteryGuest",
                "age": 24,
                "gender": "F",
                "aura_color": "#7B1FA2",
                "prompts": [
                    { "question": "My toxic trait is...", "answer": "I steal hoodies." },
                    { "question": "Unpopular opinion...", "answer": "Mint chocolate is toothpaste." }
                ],
                "sliders": {
                    "social_battery": 3,
                    "texting_style": 8,
                    "planning_style": 5,
                    "humor": 10
                },
                "bio_emojis": "👽 🎧 🌙",
                "music_taste": "Indie Rock & 90s Hip Hop",
                "description": "Just here for the vibes.",
                "red_flags": "I put milk before cereal",
                "looking_for": ["Relationship", "Gaming Buddy"],
                "tags": ["3AM Drives"],
                "blocked_users": []
            }
        }

class UserInDB(UserCreate):
    hashed_password: str

class UserResponse(BaseModel):
    id: str
    username: str
    aura_color: str
    age: Optional[int]
    gender: Optional[str]
    bio_emojis: Optional[str]
    
    class Config:
        allow_population_by_field_name = True