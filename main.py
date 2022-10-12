from fastapi import FastAPI
from choice.word_choice import word_choice
from model.model import Filter
from typing import List
from fastapi.staticfiles import StaticFiles

# uvicorn main:app --reload

app = FastAPI()

app.mount("/static", StaticFiles(directory="static", html=True))

@app.post("/", response_model=dict())
def index(filter: Filter):
    li, t = word_choice(filter)
    print(t)
    return {'words': li, 'time': t}
