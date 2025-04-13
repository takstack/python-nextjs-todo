from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session
import logging
from pydantic import BaseModel
import time
import random
from database import SessionLocal, engine, Base
from models import TodoModel, UserModel

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()
origins=[
        "http://localhost:3000",  # Next.js frontend
        "http://frontend:3000",   # Docker service name
        "http://10.10.21.51:3000",  # access vm ip
        "http://10.10.21.51:8000",  # access vm ip
        "http://10.10.21.51",  # access vm ip
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/all_todos")
async def get_all_todos(db: Session = Depends(get_db)):
    queryString = text("SELECT * FROM todos JOIN users ON users.uuid = todos.user_id")
    todos = db.execute(queryString)

    logger.info(f"Todos: {todos}")
    result = todos.fetchall()

    logger.info(f"Result: {result}")

     # Convert Row objects to dictionaries using dict(zip())
    column_names = result[0]._mapping.keys()
    todos_list = [dict(zip(column_names, row)) for row in result]
    
    logger.info(f"Todos: {todos_list}")

    return todos_list
        
    # Convert Row objects to dictionaries
    todos_list = [
        {
            "id": row.id,
            "title": row.title,
            "completed": row.completed,
            "created_at": str(row.created_at),  # Convert datetime to string
            "user_id": row.user_id
        } for row in result
    ]
    
    logger.info(f"Todos: {todos_list}")
    
    return result


@app.get("/todos")
async def get_todos(user_id: str, db: Session = Depends(get_db)):
    # logger.info(f"User ID: {user_id}")
    # return {"message": "Hello World"}
    todos = db.query(TodoModel).filter(TodoModel.user_id == user_id).order_by(TodoModel.created_at.desc()).all()
    logger.info(f"Todos: {todos}")
    return todos

def create_todo_id():
    timestamp = int(time.time() * 1000)
    random_num = random.randint(1000, 9999)
    return f"{timestamp}{random_num}"

class TodoBase(BaseModel):
    title: str
    completed: int = 0
    user_id: str

@app.post("/todo")
async def create_todo(todo: TodoBase, db: Session = Depends(get_db)):
    logger.info(f"Attempting to create todo with user_id: {todo.user_id}")
    
    # Debug: Check all users in the database
    all_users = db.query(UserModel).all()
    logger.info(f"All users in database: {[(u.uuid, u.email) for u in all_users]}")
    
    # Check if user exists
    user = db.query(UserModel).filter(UserModel.uuid == todo.user_id).first()
    if not user:
        return {
            "status": "error",
            "message": f"User not found with ID: {todo.user_id}"
        }

    logger.info(f"Creating todo: {todo}")
    db_todo = TodoModel(title=todo.title, completed=todo.completed, user_id=todo.user_id)
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo

class TodoUpdate(BaseModel):
    completed: int

@app.put("/todo/{id}")
async def update_todo(id: int, todo: TodoUpdate, db: Session = Depends(get_db)):
    logger.info(f"todo value: {todo}")
    logger.info(f"Updating todo: {id}")
    try:
        res = db.query(TodoModel).filter(TodoModel.id == id).update({"completed": todo.completed})
        db.commit()
        return res
    except Exception as e:
        logger.error(f"Error updating todo: {e}")
        return {"status": "error"}

@app.delete("/todo/{id}")
async def delete_todo(id: int, db: Session = Depends(get_db)):
    logger.info(f"Deleting todo: {id}")
    try:    
        res = db.query(TodoModel).filter(TodoModel.id == id).delete()
        db.commit()
        return res
    except Exception as e:
        logger.error(f"Error deleting todo: {e}")
        return {"status": "error"}
    
class UserBase(BaseModel):
    email: str
    name: str
    uuid: str

    
@app.post("/user")
async def create_user(user: UserBase, db: Session = Depends(get_db)):
    logger.info(f"Creating user: {user}")
    existing_user = db.query(UserModel).filter(
        (UserModel.email == user.email) | (UserModel.uuid == user.uuid)
    ).first()

    if existing_user:
        return {
            "status": "error",
            "message": "User already exists"
        }
    
    db_user = UserModel(name=user.name, email=user.email, uuid=user.uuid)
    db.add(db_user)
    db.commit()

     # Verify user was created
    # created_user = db.query(UserModel).filter(UserModel.uuid == user.uuid).first()
    # logger.info(f"Created user with UUID: {created_user.uuid if created_user else 'Not found'}")
    print("db_user: ", db_user)
    db.refresh(db_user)
    return db_user

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Create tables
Base.metadata.create_all(bind=engine) 