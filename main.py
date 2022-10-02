from fastapi import FastAPI
from choice.word_choice import word_choice
from model.model import Filter
from typing import List


app = FastAPI()


@app.post("/", response_model=List[List[str]])
def index(filter: Filter):
    li = word_choice(filter)
    # print(filter.existing_letters)
    return li
