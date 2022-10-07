// Классы для списков (черный, белый, дубли, буквы)
class Lists {
    // Устанавливает общие свойства и методы всех списков
    constructor(element) {
        this.element = element // Объекд в DOM отвечающий за выбор этой группы настроек
        this.list = [];  // Список выбранных букв
    }


}

// Класс для букв наследуем от общего, добавляем свойства и методы
class Letters extends Lists {
    constructor(element) {
        this.element = element
        this.list = [];  // Список выбранных букв
        this.here = false;  // Определяет, стоит ли в этой позиции буква из списка. Или она в этом слове, но не здксь
    }

}


// Заполнение фильтров, контроль. Отправление, получение данных. Вывод списка слов
$(document).ready(function(){

    var black_list = new Lists($('#black_list'));  // Черный список. Объект
    var white_list = new Lists($('#white_list'));  // Белый список. Объект
    var double_letter = new Lists($('#double_letter'));  // Дубликаты букв
    var existing_letters = [];  // Массив с объектами для каждоой буквы
//    var kb = Keyboard();  // Инициализация клавиатуры

//    var ban = false;  // Запрет дубликатов букв


    alert(double_letter.element.css({'background-color' : '#ff0000'}));










});