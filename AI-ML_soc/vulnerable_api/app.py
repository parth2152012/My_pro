import os
import asyncio
from fastapi import FastAPI, HTTPException
import psycopg2
from psycopg2.extras import RealDictCursor

# --- Configuration ---
DB_HOST = os.environ.get("DB_HOST", "localhost")
DB_NAME = os.environ.get("DB_NAME", "userdb")
DB_USER = os.environ.get("DB_USER", "user")
DB_PASS = os.environ.get("DB_PASS", "password")

app = FastAPI()

def get_db_connection():
    """Establishes a connection to the PostgreSQL database."""
    conn = psycopg2.connect(
        host=DB_HOST,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASS
    )
    return conn

async def init_db():
    """Initializes the database with a users table and some dummy data."""
    print("Vulnerable API: Initializing database...")
    await asyncio.sleep(10) # Wait for DB to be ready
    try:
        conn = get_db_connection()
        with conn.cursor() as cur:
            cur.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
                    username VARCHAR(50) UNIQUE NOT NULL,
                    email VARCHAR(100) NOT NULL,
                    password_hash VARCHAR(255) NOT NULL
                );
            """)
            # Add some dummy users if the table is empty
            cur.execute("SELECT COUNT(*) FROM users;")
            if cur.fetchone()[0] == 0:
                cur.execute("""
                    INSERT INTO users (username, email, password_hash) VALUES
                    ('alice', 'alice@example.com', 'hash_of_alice_password'),
                    ('bob', 'bob@example.com', 'hash_of_bob_password'),
                    ('secret_admin', 'admin@internal.corp', 'super_secret_admin_hash');
                """)
            conn.commit()
        conn.close()
        print("Vulnerable API: Database initialized successfully.")
    except Exception as e:
        print(f"Vulnerable API: Database initialization failed: {e}")

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(init_db())

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/")
def read_root():
    return {"message": "This is a vulnerable API. Be careful!"}

@app.get("/users/{username}")
def get_user(username: str):
    """
    This endpoint is intentionally vulnerable to SQL injection.
    An attacker can use it to extract data from the database.
    Example attack: /users/' OR '1'='1
    """
    try:
        conn = get_db_connection()
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            # THIS IS THE VULNERABILITY! Never format SQL strings like this.
            query = f"SELECT id, username, email FROM users WHERE username = '{username}'"
            print(f"Vulnerable API: Executing query: {query}")
            cur.execute(query)
            users = cur.fetchall()
        conn.close()

        if not users:
            raise HTTPException(status_code=404, detail="User not found")
        # Return a list for SQLi, or a single object for a normal query
        return users if len(users) > 1 else users[0]
    except Exception as e:
        print(f"Vulnerable API: An error occurred: {e}")
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
