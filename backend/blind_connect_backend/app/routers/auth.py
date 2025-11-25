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
    token = token_data.get("token")
    try:
        google_user = verify_google_token(token)
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid Google Token")

    email = google_user.get("email")
    existing_user = await db["users"].find_one({"email": email})
    
    if existing_user:
        access_token = create_access_token(data={"sub": email})
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
    
    return {"msg": "User not registered", "email": email, "is_new_user": True}


@router.post("/google-signup", status_code=status.HTTP_201_CREATED)
async def google_signup(user_data: UserCreateGoogle, db = Depends(get_database)):
    
    # --- DEBUGGING LOGS ---
    print("\n🔥 --- GOOGLE SIGNUP ATTEMPT ---")
    print(f"Received User Data: {user_data.model_dump()}") 
    # ----------------------

    # 1. Verify Token
    try:
        google_info = verify_google_token(user_data.token)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid Google Token during signup")
        
    email = google_info.get("email")
    print(f"🔥 Email extracted: {email}")

    # 2. Check if already exists
    existing_user = await db["users"].find_one({"email": email})
    
    # PREPARE DATA (Use model_dump for Pydantic V2 compatibility)
    data_to_save = user_data.model_dump()
    data_to_save.pop("token", None) 
    
    if existing_user:
        print("🔥 User exists, UPDATING record...")
        
        await db["users"].update_one(
            {"_id": existing_user["_id"]},
            {"$set": data_to_save}
        )
        
        # Fetch the updated user to return fresh data
        updated_user = await db["users"].find_one({"_id": existing_user["_id"]})
        updated_user["id"] = str(updated_user["_id"])
        del updated_user["_id"]
        
        access_token = create_access_token(data={"sub": email})
        
        print("🔥 Update complete. Returning success.")
        return {
            "access_token": access_token, 
            "token_type": "bearer", 
            "id": updated_user["id"],
            "user": updated_user
        }
        
    # 3. New User Logic
    print("🔥 New User, CREATING record...")
    random_password = secrets.token_urlsafe(16) 
    hashed_password = get_password_hash(random_password)
    
    final_user_data = {
        **data_to_save,
        "email": email,
        "hashed_password": hashed_password,
        "auth_provider": "google"
    }
    
    new_user = await db["users"].insert_one(final_user_data)
    print(f"🔥 User created with ID: {new_user.inserted_id}")
    
    access_token = create_access_token(data={"sub": email})
    
    final_user_data["id"] = str(new_user.inserted_id)
    if "hashed_password" in final_user_data: del final_user_data["hashed_password"]
    if "_id" in final_user_data: del final_user_data["_id"]

    return {
        "access_token": access_token, 
        "token_type": "bearer", 
        "id": str(new_user.inserted_id),
        "user": final_user_data
    }