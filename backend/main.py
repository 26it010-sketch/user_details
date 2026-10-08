from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from pathlib import Path

from database import get_connection


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class User(BaseModel):
    name: str
    age: int


@app.get("/api/hello")
def hello():
    return {"message": "FastAPI is working"}


# POST → Save user into PostgreSQL
@app.post("/users")
def create_user(user: User):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        "INSERT INTO users (name, age) VALUES (%s, %s)",
        (user.name, user.age)
    )

    connection.commit()

    cursor.close()
    connection.close()

    return {
        "message": "User saved successfully",
        "name": user.name,
        "age": user.age
    }


# GET → Get users from PostgreSQL
@app.get("/users")
def get_users():

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("SELECT id, name, age FROM users")

    rows = cursor.fetchall()

    cursor.close()
    connection.close()

    users = []

    for row in rows:
        users.append({
            "id": row[0],
            "name": row[1],
            "age": row[2]
        })

    return users


# React frontend
BASE_DIR = Path(__file__).resolve().parent
FRONTEND_DIR = BASE_DIR / "dist"


app.mount(
    "/assets",
    StaticFiles(directory=FRONTEND_DIR / "assets"),
    name="assets"
)


@app.get("/{path:path}")
def serve_frontend(path: str):

    file_path = FRONTEND_DIR / path

    if file_path.is_file():
        return FileResponse(file_path)

    return FileResponse(FRONTEND_DIR / "index.html")