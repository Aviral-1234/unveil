from pydantic import BaseModel, Field, EmailStr, ConfigDict, BeforeValidator
from typing import List, Optional, Annotated
from bson import ObjectId

# Helper to handle MongoDB ObjectId
PyObjectId = Annotated[str, BeforeValidator(str)]

# --- Sub-models ---
class Prompt(BaseModel):
    question: str
    answer: str

class Sliders(BaseModel):
    social_battery: int = Field(..., ge=1, le=10)
    texting_style: int = Field(..., ge=1, le=10)
    planning_style: int = Field(..., ge=1, le=10)
    humor: int = Field(..., ge=1, le=10)

# --- Creation Models ---
class UserCreateGoogle(BaseModel):
    token: str  
    username: str 
    age: int
    gender: str
    aura_color: str
    prompts: List[Prompt]
    sliders: Sliders
    bio_emojis: Optional[str] = ""
    music_taste: Optional[str] = ""
    description: Optional[str] = ""
    red_flags: Optional[str] = ""
    looking_for: List[str] = []
    tags: List[str] = []
    blocked_users: List[str] = []

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    username: str
    age: int
    gender: str
    aura_color: str
    prompts: List[Prompt]
    sliders: Sliders
    bio_emojis: Optional[str] = ""
    music_taste: Optional[str] = ""
    description: Optional[str] = ""
    red_flags: Optional[str] = ""
    looking_for: List[str] = []
    tags: List[str] = []
    blocked_users: List[str] = []

# --- MISSING CLASS RESTORED ---
class UserInDB(UserCreate):
    hashed_password: str
# ------------------------------

# --- Response Model ---
class UserResponse(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    username: str
    email: EmailStr 
    aura_color: str
    age: int        
    gender: str     
    
    # The "Spicy" Fields
    sliders: Sliders
    prompts: List[Prompt]
    bio_emojis: Optional[str] = ""
    music_taste: Optional[str] = ""
    description: Optional[str] = ""
    red_flags: Optional[str] = ""
    looking_for: List[str] = []
    tags: List[str] = []
    
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
    )