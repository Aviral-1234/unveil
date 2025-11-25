from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from app.db.database import get_database
from app.models.user import UserCreate, UserInDB
from app.core.security import get_password_hash, verify_password, create_access_token
from app.core.security import create_access_token
# Import the helper created in Step 2
from app.core.google_utils import verify_google_token 
from app.models.user import UserCreateGoogle # Import the model from Step 3
import secrets


router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@router.post("/google-login")
async def google_login(token_data: dict, db = Depends(get_database)):
    """
    1. Verifies Google Token.
    2. If user exists -> Returns Access Token (Login).
    3. If user DOES NOT exist -> Returns 404 (Telling frontend to go to Signup Page).
    """
    token = token_data.get("token")
    google_user = verify_google_token(token)
    email = google_user.get("email")
    
    # Check if user exists in your DB
    existing_user = await db["users"].find_one({"email": email})
    
    if existing_user:
        # User exists, log them in immediately
        access_token = create_access_token(data={"sub": email})
        return {"access_token": access_token, "token_type": "bearer", "is_new_user": False}
    
    # User does not exist
    return {"msg": "User not registered", "email": email, "is_new_user": True}


@router.post("/google-signup", status_code=status.HTTP_201_CREATED)
async def google_signup(user_data: UserCreateGoogle, db = Depends(get_database)):
    """
    1. Verify Google Token again (security).
    2. Extract email from Google Token.
    3. Create user with the provided profile data (sliders, prompts).
    """
    # 1. Verify Token
    google_info = verify_google_token(user_data.token)
    email = google_info.get("email")
    
    # 2. Check if already exists (double check)
    existing_user = await db["users"].find_one({"email": email})
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")
        
    # 3. Prepare User Data
    # Since they logged in with Google, they don't have a password.
    # We generate a random one just to satisfy the DB schema, or mark it as None.
    # Here we generate a random complex string so no one can brute force it.
    random_password = secrets.token_urlsafe(16) 
    hashed_password = get_password_hash(random_password)
    
    user_dict = user_data.dict()
    user_dict.pop("token") # Remove token, we don't save it
    
    final_user_data = {
        **user_dict,
        "email": email, # Taken securely from Google, not the user input
        "hashed_password": hashed_password,
        "auth_provider": "google" # Good for tracking
    }
    
    # 4. Insert
    new_user = await db["users"].insert_one(final_user_data)
    
    # 5. Auto-Login (Return Token)
    access_token = create_access_token(data={"sub": email})
    return {"access_token": access_token, "token_type": "bearer", "id": str(new_user.inserted_id)}

@router.post("/signup", status_code=status.HTTP_201_CREATED)
async def signup(user: UserCreate, db = Depends(get_database)):
    # db = await get_database()
    
    # Check if user exists
    existing_user = await db["users"].find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash password and prepare DB object
    user_dict = user.dict()
    hashed_password = get_password_hash(user_dict.pop("password"))
    final_user_data = {**user_dict, "hashed_password": hashed_password}
    
    # Insert into MongoDB
    new_user = await db["users"].insert_one(final_user_data)
    return {"id": str(new_user.inserted_id), "msg": "User created successfully"}

@router.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends(),db = Depends(get_database)):
    # db = await get_database()
    user = await db["users"].find_one({"email": form_data.username})
    
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user["email"]})
    return {"access_token": access_token, "token_type": "bearer"}
