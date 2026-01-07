# database.py
from motor.motor_asyncio import AsyncIOMotorClient
import os

# =====================
# MongoDB Connection
# =====================
MONGO_URI = os.getenv("MONGO_URI")

client = AsyncIOMotorClient(MONGO_URI)

# Database name
db = client["fitness_app"]

# =====================
# Collections
# =====================
users_collection = db["users"]                 # stores user info (email, full_name, password)
fitness_plans_collection = db["fitness_plans"] # stores CONFIRMED fitness plans only

# =====================
# Helper functions (optional but clean)
# =====================
def get_users_collection():
    return users_collection

def get_fitness_plans_collection():
    return fitness_plans_collection

def close_database_connection():
    client.close()
