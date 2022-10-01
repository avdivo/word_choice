from fastapi import FastAPI
from choice.word_choice import word_choice

app = FastAPI()


@app.get("/")
def index():
    li, summ = word_choice()
    return {'list': li, 'summ': summ}
