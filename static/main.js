
// ------------------------------------------------------------------------------
// Классы фильтров для списков (черный, белый, дубли, буквы)
class Lists {

    static filter = {} // Ассоциированный массив - id DOM элемента : объект этого класса

    // Устанавливает общие свойства и методы всех списков
    constructor(element) {
        this.element = element // Объекд в DOM отвечающий за выбор фильтра
        this.name = element.attr('id')
        this.list = [];  // Список выбранных букв
        this.old_bg = element.css('background-color'); // Запомнить цвет фона
        this.old_ink = element.css('color'); // Запомнить цвет текста
        Lists.filter[this.name] = this
    }

    // Активация фильтра (изменение вида переключателя) в случае успешной активации вернет true
    activate() {
        if (this.name == 'double_letter' & Lists.ban) {
            return false  // Нельзя активировать фильтр дублей, если дубли запрещены
        }
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

// -----------------------------------------------------------------------------------
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

// Запрет дублей букв в слове
class Ban {
    constructor(element){
        this.element = element
        this.ban = false
        this.old_bg = element.css('background-color');
        this.old_ink = element.css('color');
    }

    get() {
        // Читаем фильтр ban
        return this.ban
    }

    set() {
        // Инвертируем ban, если разрешено (нет дублей и этот фильтр не активен)
            if (this.ban) {
                this.element.css({'background-color': this.old_bg});
                this.element.css({'color': this.old_ink});
                this.ban = false;
            } else {
                this.element.css({'background-color': '#0d6efd'});
                this.element.css({'color': 'white'});
                this.ban = true;
            }

    }


}

// -------------------------------------------------------------------------------------
// Класс экранной клавиатуры
class Keyboard {
    constructor (keys, filter='') {
        this.keys = keys // Ассоциированнй массив id в DOM и самих объектов клавиш
        this.old_bg = keys[Object.keys(keys)[0]].css('background-color'); // Исходный цвет клавиш
        this.old_ink = keys[Object.keys(keys)[0]].css('color'); // Исходный цвет текста клавиш
        this.filter = filter // Объект класса фильтр, активный в данныймомент
        console.log(this.keys)
    }

    // Активация фильтров, клавиатура переходит к новому фильтру
    activate_filter(filter) {

    }
}

// -------------------------------------------------------------------------------------
$(document).ready(function(){

    // Инициализация фильтров
    new Lists($('#black_list'));  // Черный список
    new Lists($('#white_list'));  // Белый список
    new Lists($('#double_letter'));  // Дубликаты букв

    // Для каждоой буквы слова
    for (let i = 1; i < 6; i++) {
        new Letters($('#l' + i))
    }

    // Для клавиш клавиатуры
    var kb = {}
    for (let i = 1; i < 34; i++) {
        kb['key' + i] = $('#key' + i)
    }
    kb = new Keyboard(kb, Lists.filter['black_list']);  // Инициализация клавиатуры

    ban = new Ban($('#ban'));  // Фильтр разрешает или запещает дубли букв в слове

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

    // Запрет дублей>
    $('#ban').click(function(){
        ban.set()
    });

});