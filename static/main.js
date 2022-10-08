// Классы для списков (черный, белый, дубли, буквы)
class Lists {

    static obj = [] // Список объектов класса

    // Устанавливает общие свойства и методы всех списков
    constructor(element) {
        this.element = element // Объекд в DOM отвечающий за выбор фильтра
        this.list = [];  // Список выбранных букв
        this.old_bg = element.css('background-color'); // Запомнить цвет фона
        this.old_ink = element.css('color'); // Запомнить цвет текста
        Lists.obj.push(this)
    }

    // Активация фильтра (изменение вида переключателя)
    activate() {
        Lists.deactivate();
        this.element.css({'background-color': '#0d6efd'});
        this.element.css({'color': 'white'});
    }

    // Деактивация всех переключателей (возврат в исходное состояние)
    static deactivate() {
        Lists.obj.forEach(function(item, i, arr) {
            item.element.css({'background-color': item.old_bg});
            item.element.css({'color': item.old_ink});
        });
    }
}

// Класс для букв наследуем от общего, добавляем свойства и методы
class Letters extends Lists {
    constructor(element) {
        super(element)
        this.element = element // Объекд в DOM отвечающий за выбор фильтра
        this.list = [];  // Список выбранных букв
        this.old_bg = element.css('background-color');
        this.old_ink = element.css('color');
        this.here = false;  // Определяет, стоит ли в этой позиции буква из списка. Или она в этом слове, но не здксь
        Lists.obj.push(this)
    }

}


// Заполнение фильтров, контроль. Отправление, получение данных. Вывод списка слов
$(document).ready(function(){

    var black_list = new Lists($('#black_list'));  // Черный список. Объект
    var white_list = new Lists($('#white_list'));  // Белый список. Объект
    var double_letter = new Lists($('#double_letter'));  // Дубликаты букв
    var existing_letters = [];  // Массив с объектами для каждоой буквы
    for (let i = 1; i < 6; i++) {
    alert($('#l' + i).attr('id'))
        existing_letters.push(new Letters($('#l' + i)))
    }
//    var kb = Keyboard();  // Инициализация клавиатуры

//    var ban = false;  // Запрет дубликатов букв


//double_letter.element.css({'background-color' : '#ff0000'});




// ------------------ Обработка событий -------------------------

    // Черный список
    $('#black_list').click(function(){
        black_list.activate()
    });

    // Белый> список
    $('#white_list').click(function(){
        white_list.activate()
    });

    // Дубли
    $('#double_letter').click(function(){
        double_letter.activate()
    });


});