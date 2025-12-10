import psycopg2
from config import POSTGRES_CONFIG

def create_tables():
    conn = psycopg2.connect(
        dbname=POSTGRES_CONFIG["dbname"],
        user=POSTGRES_CONFIG["user"],
        password=POSTGRES_CONFIG["password"],
        host=POSTGRES_CONFIG["host"],
        port=POSTGRES_CONFIG["port"],
    )
    cur = conn.cursor()

    # USERS table
    cur.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
    );
    """)

    # DOCUMENTS table
    cur.execute("""
    CREATE TABLE IF NOT EXISTS documents (
        id SERIAL PRIMARY KEY,
        filename TEXT NOT NULL,
        filepath TEXT NOT NULL,
        filesize BIGINT NOT NULL,
        created_at TIMESTAMP NOT NULL,
        user_id INTEGER REFERENCES users(id)
    );
    """)

    conn.commit()
    cur.close()
    conn.close()
    print("✔ PostgreSQL tables initialized!")
