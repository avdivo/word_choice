var kb = {};  // Представляет объект клавиатуры, доступный везде
var ban;  // Представляет объект ban, запрещающий дубликаты букв в слове, доступный везде

// ------------------------------------------------------------------------------------
// Класс снопки Запрет дублей букв в слове
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
        // Вернет результат, а именно состояние
            if (this.ban) {
                this.element.css({'background-color': this.old_bg});
                this.element.css({'color': this.old_ink});
                this.ban = false;
                return false
            } else {
                let dl = Lists.getFilter('double_letter')
                if (dl.isActive() || dl.getList().length > 0) {
                    return false
                } else {
                    this.element.css({'background-color': '#0d6efd'});
                    this.element.css({'color': 'white'});
                    this.ban = true;
                    return true
                }
            }

    }


}

// ------------------------------------------------------------------------------
// Классы фильтров для списков (черный, белый, дубли, буквы)
class Lists {

    static filter = {} // Ассоциированный массив - id DOM элемента : объект этого класса

    // Устанавливает общие свойства и методы всех списков
    constructor(element) {
        this.element = element // Объекд в DOM отвечающий за выбор фильтра
        this.name = element.attr('id')
        this.list = new String('');  // Список выбранных букв
        this.old_bg = element.css('background-color'); // Запомнить цвет фона
        this.old_ink = element.css('color'); // Запомнить цвет текста
        Lists.filter[this.name] = this
    }

    // Список букв в фильтре
    getList() {
        return this.list;
    }

    // Вернет True, если этот фильтр активен
    isActive() {
        return (this == kb.getActive());
    }

    // Активация фильтра (изменение вида переключателя) в случае успешной активации вернет true
    activate() {
        if (this.name == 'double_letter' && ban.get()) {
            return false  // Нельзя активировать фильтр дублей, если дубли запрещены
        }
        Lists.deactivate();
        this.element.css({'background-color': '#0d6efd'});
        this.element.css({'color': 'white'});
        return true
    }

    // Деактивация всех переключателей (возврат в исходное состояние)
    static deactivate() {
        for (let item of Object.values(Lists.filter)) {
            item.element.css({'background-color': item.old_bg});
            item.element.css({'color': item.old_ink});
        }
    }

    // Получить объект фильтра по ключу (id DOM объекта)
    static getFilter(key) {
        return Lists.filter[key]
    }



}

// -----------------------------------------------------------------------------------
// Класс для букв наследуем от общего, добавляем свойства и методы
class Letters extends Lists {
    constructor(element) {
        super(element)
        this.element = element // Объекд в DOM отвечающий за выбор фильтра
        this.list = new String('');  // Список выбранных букв
        this.old_bg = element.css('background-color');
        this.old_ink = element.css('color');
        this.here = false;  // Определяет, стоит ли в этой позиции буква из списка. Или она в этом слове, но не здксь
        Lists.filter[element.attr('id')] = this
    }

}

// -------------------------------------------------------------------------------------
// Класс экранной клавиатуры
class Keyboard {
    constructor (keys, filter) {
        this.keys = keys; // Ассоциированнй массив id в DOM и самих объектов клавиш
        this.old_bg = keys[Object.keys(keys)[0]].css('background-color'); // Исходный цвет клавиш
        this.old_ink = keys[Object.keys(keys)[0]].css('color'); // Исходный цвет текста клавиш
        this.filter = filter;  // Объект класса фильтр, активный в данный момент
        filter.activate();
        this.clearKB();
    }

    // Вернет активный в данный момент фильтр (его объект)
    getActive() {
        return this.filter;
    }

    // Активация фильтров, клавиатура переходит к новому фильтру
    activateFilter(filter) {
        if (filter.activate()) {
            // Активация фильтра успешна
            this.filter = filter;
            this.clearKB();
            this.initKeyboard();
        }
    }

    // Включение или выключение на клавиатуре буквы. Изменение активного фильтра
    pressKey(keyID) {

        let letter = this.keys[keyID].text().toLowerCase();
        if (this.filter.list.indexOf(letter) > -1) {
            this.keys[keyID].css({'background-color': this.old_bg});
            this.keys[keyID].css({'color': this.old_ink});
            this.filter.list = this.filter.list.replace(letter, '')
        } else {
            this.keys[keyID].css({'background-color': '#0d6efd'});
            this.keys[keyID].css({'color': 'white'});
            this.filter.list = this.filter.list + letter;
        }
    }

    // Включение на клавиатуре выбранных в фильтре букв
    initKeyboard() {
        let alphabet = 'абвгдежзийклмнопрстуфхцчшщъыбэюя';
        for (let i = 0; i < this.filter.list.length; i++) {
            this.keys['key' + (alphabet.indexOf(this.filter.list[i])+1)].css({'background-color': '#0d6efd'})
            this.keys['key' + (alphabet.indexOf(this.filter.list[i])+1)].css({'color': 'white'});
        }
    }

    // Очистка клавиатуры
    clearKB() {
        for (let i = 1; i < 33; i++) {
            this.keys['key' + i].css({'background-color': this.old_bg})
            this.keys['key' + i].css({'color': this.old_ink});
        }
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
    for (let i = 1; i < 34; i++) {
        kb['key' + i] = $('#key' + i)
    }
    kb = new Keyboard(kb, Lists.filter['black_list']);  // Инициализация клавиатуры

    ban = new Ban($('#ban'));  // Фильтр разрешает или запещает дубли букв в слове

// ------------------ Обработка событий -------------------------
    // Списки (черный, белый, дубли)
    $('.btn').click(function(){
        if (this.id in Lists.filter ){
            kb.activateFilter(Lists.filter[this.id]);
        }
    });

    // Буквы слова
    $('.letter').click(function(){
        kb.activateFilter(Lists.filter[this.id]);
    });

    // Запрет дублей
    $('#ban').click(function(){
        ban.set();
    });

    // Нажатие клавиш на клавиатуре
    $('.key').click(function(){
        kb.pressKey(this.id);
    });

});