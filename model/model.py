from pydantic import BaseModel, root_validator
from typing import Dict
import re


class Filter(BaseModel):
    black_list: str = ''  # Этих букв не должно быть в слове
    white_list: str = ''  # Эти буквы должны быть в слове
    existing_letters: Dict[int, str] = {0: '', 1: '', 2: '', 3: '', 4: ''}  # Ключи 0, 1, 2, 3, 4
    # соответствуют позициям букв в слове. Значения - строки:
    # заглавная буква - она в этой позиции;
    # одна или есколько маленьких - эти буквы есть в слове, но в другой позиции
    double_letter: str = ''  # Какие буквы должны повторяться ('*' - любые)
    ban: bool = False  # Запретить слова в которых буква встречается больше 1 раза (True), False - разрешено

    @root_validator()
    def verify_password_match(cls, filter):
        """Проверка согласованности данных фильтра"""

        black_list = filter.get("black_list")
        white_list = filter.get('white_list')
        existing_letters = filter.get("existing_letters")
        double_letter = filter.get('double_letter')
        ban = filter.get('ban')
        mes = ''
        filter['black_list'] = filter.get("black_list").lower()
        print(re.fullmatch(r'[а-я]+', filter['black_list']))

        if set(black_list) & set(white_list):
            mes = 'Одинаковые буквы в Черном и Белом списках. '

        if set(black_list) & set(double_letter):
            mes += 'Буква, которая в слове должна дублироваться занесена в Черный список. '

        if ban and double_letter:
            mes += 'Дублирование букв в слове запрещено, однако ведется поиск с дублируемой буквой. '

        if set(black_list) & set([x.lower() for x in existing_letters.values()]):
            mes += 'В Черном списке указаны буквы которые должны писутствовать в слове.'

        if mes:
            raise ValueError(mes)

        return filter
