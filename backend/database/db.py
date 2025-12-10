import psycopg2
from psycopg2.extras import RealDictCursor
from config import POSTGRES_CONFIG

def get_db_conn():
    conn = psycopg2.connect(
        dbname=POSTGRES_CONFIG["dbname"],
        user=POSTGRES_CONFIG["user"],
        password=POSTGRES_CONFIG["password"],
        host=POSTGRES_CONFIG["host"],
        port=POSTGRES_CONFIG["port"],
        cursor_factory=RealDictCursor
    )
    return conn
