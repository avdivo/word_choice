

// Классы для списков (черный, белый, дубли, буквы)
class Lists {

    static filter = {} // Ассоциированный массив - id DOM элемента : объект этого класса

    // Устанавливает общие свойства и методы всех списков
    constructor(element) {
        this.element = element // Объекд в DOM отвечающий за выбор фильтра
        this.list = [];  // Список выбранных букв
        this.old_bg = element.css('background-color'); // Запомнить цвет фона
        this.old_ink = element.css('color'); // Запомнить цвет текста
        Lists.filter[element.attr('id')] = this
    }

    // Активация фильтра (изменение вида переключателя)
    activate() {
        Lists.deactivate();
        this.element.css({'background-color': '#0d6efd'});
        this.element.css({'color': 'white'});
    }

    // Деактивация всех переключателей (возврат в исходное состояние)
    static deactivate() {
        for (let item of Object.values(Lists.filter)) {
            item.element.css({'background-color': item.old_bg});
            item.element.css({'color': item.old_ink});
        }
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
        Lists.filter[element.attr('id')] = this
    }

}


// Заполнение фильтров, контроль. Отправление, получение данных. Вывод списка слов
$(document).ready(function(){
    new Lists($('#black_list'));  // Черный список
    new Lists($('#white_list'));  // Белый список
    new Lists($('#double_letter'));  // Дубликаты букв
    // Для каждоой буквы
    for (let i = 1; i < 6; i++) {
        new Letters($('#l' + i))
    }
//    var kb = Keyboard();  // Инициализация клавиатуры

//    var ban = false;  // Запрет дубликатов букв


//double_letter.element.css({'background-color' : '#ff0000'});




// ------------------ Обработка событий -------------------------
    // Черный список
    $('.btn').click(function(){
        if (this.id in Lists.filter ){
            Lists.filter[this.id].activate()
        };
    });

    // Белый> список
    $('.letter').click(function(){
        Lists.filter[this.id].activate()
    });


});