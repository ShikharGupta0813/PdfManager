import psycopg2
from psycopg2.extras import RealDictCursor
from config import POSTGRES_CONFIG

def get_db_conn():
    conn = psycopg2.connect(POSTGRES_CONFIG, cursor_factory=RealDictCursor)
    return conn
