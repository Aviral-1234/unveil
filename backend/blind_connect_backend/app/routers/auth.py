from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from app.db.database import get_database
from app.models.user import UserCreate, UserInDB, UserCreateGoogle
from app.core.security import get_password_hash, verify_password, create_access_token
from app.core.google_utils import verify_google_token 
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
    # Verify the token logic (assumed verify_google_token handles exceptions)
    try:
        google_user = verify_google_token(token)
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid Google Token")

    email = google_user.get("email")
    
    # Check if user exists in your DB
    existing_user = await db["users"].find_one({"email": email})
    
    if existing_user:
        # User exists, log them in immediately
        access_token = create_access_token(data={"sub": email})
        
        # Prepare user data for frontend
        user_response = existing_user.copy()
        user_response["id"] = str(user_response["_id"])
        del user_response["_id"]
        if "hashed_password" in user_response: del user_response["hashed_password"]

        return {
            "access_token": access_token, 
            "token_type": "bearer", 
            "is_new_user": False,
            "user": user_response
        }
    
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
    try:
        google_info = verify_google_token(user_data.token)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid Google Token during signup")
        
    email = google_info.get("email")
    
    # 2. Check if already exists (double check)
    existing_user = await db["users"].find_one({"email": email})
    
    if existing_user:
        # FIX: Instead of raising 400 Error, we UPDATE the user and Log them in.
        # This fixes the "User already exists" crash if an existing user enters the onboarding flow.
        
        update_data = user_data.dict()
        update_data.pop("token", None) # Don't save the token
        
        # We assume the user wanted to update their profile since they went through onboarding
        await db["users"].update_one(
            {"_id": existing_user["_id"]},
            {"$set": update_data}
        )
        
        # Generate Token
        access_token = create_access_token(data={"sub": email})
        
        # Return success (Login)
        return {
            "access_token": access_token, 
            "token_type": "bearer", 
            "id": str(existing_user["_id"]),
            "user": {**update_data, "email": email, "id": str(existing_user["_id"])}
        }
        
    # 3. Prepare User Data (New User)
    random_password = secrets.token_urlsafe(16) 
    hashed_password = get_password_hash(random_password)
    
    user_dict = user_data.dict()
    user_dict.pop("token", None) # Remove token
    
    final_user_data = {
        **user_dict,
        "email": email, # Taken securely from Google
        "hashed_password": hashed_password,
        "auth_provider": "google"
    }
    
    # 4. Insert
    new_user = await db["users"].insert_one(final_user_data)
    
    # 5. Auto-Login (Return Token)
    access_token = create_access_token(data={"sub": email})
    
    # Prepare response data
    final_user_data["id"] = str(new_user.inserted_id)
    if "hashed_password" in final_user_data: del final_user_data["hashed_password"]
    if "_id" in final_user_data: del final_user_data["_id"]

    return {
        "access_token": access_token, 
        "token_type": "bearer", 
        "id": str(new_user.inserted_id),
        "user": final_user_data
    }

@router.post("/signup", status_code=status.HTTP_201_CREATED)
async def signup(user: UserCreate, db = Depends(get_database)):
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
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db = Depends(get_database)):
    user = await db["users"].find_one({"email": form_data.username})
    
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user["email"]})
    return {"access_token": access_token, "token_type": "bearer"}