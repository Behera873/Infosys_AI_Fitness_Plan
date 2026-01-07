from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from datetime import datetime, timedelta
import random
import bcrypt
import jwt

from database import users_collection, fitness_plans_collection

# =====================
# CONFIG
# =====================
SECRET_KEY = "SECRET_KEY_123"
ALGORITHM = "HS256"

app = FastAPI(title="AI Fitness Planner")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================
# MODELS
# =====================
class SignupRequest(BaseModel):
    full_name: str
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


class FitnessRequest(BaseModel):
    age: int = Field(..., ge=10, le=80)
    gender: str
    height: int = Field(..., ge=100, le=250)
    weight: int = Field(..., ge=30, le=200)
    goal: str
    level: str


class ConfirmPlanRequest(BaseModel):
    fitness_data: FitnessRequest
    schedule: dict


# =====================
# STARTUP
# =====================
@app.on_event("startup")
async def startup_event():
    await users_collection.create_index("email", unique=True)
    await fitness_plans_collection.create_index("user_id", unique=True)


# =====================
# AUTH HELPERS
# =====================
def hash_password(password: str):
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt())


def verify_password(password: str, hashed: bytes):
    return bcrypt.checkpw(password.encode(), hashed)


def create_token(user_id: str):
    payload = {
        "user_id": user_id,
        "exp": datetime.utcnow() + timedelta(days=1),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except:
        raise HTTPException(status_code=401, detail="Invalid token")


# =====================
# SIGNUP
# =====================
@app.post("/signup")
async def signup(data: SignupRequest):
    if await users_collection.find_one({"email": data.email}):
        raise HTTPException(status_code=400, detail="Email already exists")

    user = {
        "full_name": data.full_name,
        "email": data.email,
        "password": hash_password(data.password),
        "created_at": datetime.utcnow(),
    }

    result = await users_collection.insert_one(user)
    token = create_token(str(result.inserted_id))

    return {"access_token": token}


# =====================
# LOGIN
# =====================
@app.post("/login")
async def login(data: LoginRequest):
    user = await users_collection.find_one({"email": data.email})

    if not user or not verify_password(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_token(str(user["_id"]))
    return {
        "access_token": token,
        "full_name": user["full_name"]
    }


# =====================
# GENERATE PLAN (TEMP ONLY)
# =====================
@app.post("/generate-plan")
async def generate_plan(
    data: FitnessRequest,
    authorization: str = Header(...)
):
    decode_token(authorization)

    weeks = random.randint(4, 8)

    workout_pool = {
        "Flexibility": ["Yoga", "Stretching", "Mobility"],
        "Muscle Gain": ["Upper Body", "Lower Body", "Strength"],
        "Weight Loss": ["HIIT", "Cardio", "Core"],
    }

    selected = workout_pool.get(data.goal, workout_pool["Flexibility"])

    schedule = {}
    for w in range(1, weeks + 1):
        schedule[f"Week {w}"] = {
            "Mon": random.choice(selected),
            "Tue": random.choice(selected),
            "Wed": "Rest",
            "Thu": random.choice(selected),
            "Fri": random.choice(selected),
            "Sat": "Light Cardio",
            "Sun": "Rest",
        }

    return {
        "message": "Temporary plan generated",
        "fitness_data": data.dict(),
        "schedule": schedule,
    }


# =====================
# CONFIRM PLAN (SAVE)
# =====================
@app.post("/confirm-plan")
async def confirm_plan(
    data: ConfirmPlanRequest,
    authorization: str = Header(...)
):
    payload = decode_token(authorization)
    user_id = payload["user_id"]

    await fitness_plans_collection.update_one(
        {"user_id": user_id},
        {
            "$set": {
                "user_id": user_id,
                "fitness_data": data.fitness_data.dict(),
                "schedule": data.schedule,
                "confirmed_at": datetime.utcnow(),
            }
        },
        upsert=True
    )

    return {"message": "Fitness plan saved successfully"}


# =====================
# GET MY PLAN (AFTER LOGIN)
# =====================
@app.get("/my-plan")
async def my_plan(authorization: str = Header(...)):
    payload = decode_token(authorization)
    user_id = payload["user_id"]

    plan = await fitness_plans_collection.find_one({"user_id": user_id})

    if not plan:
        raise HTTPException(status_code=404, detail="No plan found")

    return {
        "fitness_data": plan["fitness_data"],
        "schedule": plan["schedule"],
    }
