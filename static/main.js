var kb = {};  // Представляет объект клавиатуры, доступный везде
var ban;  // Представляет объект ban, запрещающий дубликаты букв в слове, доступный везде
// ------------------------------------------------------------------------------------

// Вывод предупреждения
function warning(mess, color='red') {
    $('#warning').css('color', color); // Установка цвета для строки
    $('#warning').text(mess); // Показать сообщение

    // Скрываем сообщение
    setTimeout(function(){
        $('#warning').text('');
    }, 5000);
}

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
                    warning('Нельзя запрещать дубли, если они указаны в фильтре Выбор дублей или фильтр активен')
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
        this.what_type = 'Lists';
        this.element = element; // Объекд в DOM отвечающий за выбор фильтра
        this.name = element.attr('id');
        this.list = new String('');  // Список выбранных букв
        Lists.filter[this.name] = this;
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
            warning('Нельзя активировать фильтр Выбор дублей, если дубли запрещены');
            return false
        }
        Lists.deactivate();
        this.element.addClass('letter_active');
        return true
    }

    // Вернуть цвета фона и текста, которые нужно установить для фильтра когда он не активен
    colors() {
        return 'btn btn-outline-primary';
    }

    // Деактивация всех переключателей фильтров кроме букв(возврат в исходное состояние)
    static deactivate() {
        for (let item of Object.values(Lists.filter)) {
            let old_class = item.colors();
            item.element.removeClass();
            item.element.addClass(old_class);
        }
    }

    // Получить объект фильтра по ключу (id DOM объекта)
    static getFilter(key) {
        return Lists.filter[key];
    }

    // Есть ли буква в списке. Если нет - добавить, если есть удалить. Вернуть результат, была или нет
    is_letter(letter) {
        let list = this.list.toLowerCase(); // Список букв в нижнем регистре
        if (list.indexOf(letter) > -1){
            this.list = list.replace(letter, '');
            this.out_letters();
            return true;
        } else {
            if (this.what_type == 'Letters') {
                if (this.here && this.list.length > 0) {
                    warning('Нельзя постваить вторую угадонную букву в одну позицию');
                    return true;  // Попытка постваить вторую угадонную букву в одну позицию
                }
            }
            this.list = list + letter;
            this.out_letters();
            return false;
        }
    }

    // Метод вывода выбранных букв в поле фильтра. В этом классе уфильтра нет поля и метод пустой
    out_letters() {
    }

}

// -----------------------------------------------------------------------------------
// Класс для букв наследуем от общего, добавляем свойства и методы
class Letters extends Lists {
    constructor(element) {
        super(element);
        this.what_type = 'Letters';
        this.element = element; // Объекд в DOM отвечающий за выбор фильтра
        this.list = new String('');  // Список выбранных букв
        this.here = false;  // Определяет, стоит ли в этой позиции буква из списка. Или она в этом слове, но не здксь
        Lists.filter[element.attr('id')] = this
    }

    // Вернуть цвета фона и текста, которые нужно установить для фильтра когда он не активен
    // Этот класс имеет другие цвета для фильтров, когда буква стоит на месте
    colors() {
        return this.here ? 'letter' : 'letter-mini';
    }

    // Изменение чекбокса буквы (меняется стстус: эта буква стоит тут или эта буква есть в этом слове, но не тут)
    // В обоих случаях меняется вид поля (стиль)
    change(here) {
        this.here = here;
        if (here) {
            // Включается режим угаданной буквы для этой позиции
            if (this.list.length > 1) {
                this.list = '';  // Очищаем фильтр, если в нем более 1 буквы (угаданная будет только 1)
            }
            // изменим значение DOM-свойства className
            this.element.prop('className', 'letter letter_active');
            warning('Определена буква для этой позиции', 'blue');
        } else {
            this.element.prop('className', 'letter-mini letter_active');
            warning('Для этой позиции буква не определена', 'blue');
        }
        this.out_letters();
    }

    // Метод вывода выбранных букв в поле фильтра и изменения регистра для случая угаданной буквы
    out_letters() {
        if (this.here) {
            this.list = this.list.toUpperCase();
        }
        this.element.text(this.list);
    }

}

// -------------------------------------------------------------------------------------
// Класс экранной клавиатуры
class Keyboard {
    constructor (keys, filter) {
        this.keys = keys; // Ассоциированнй массив id в DOM и самих объектов клавиш
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
        if (this.filter.name == filter.name) {
            return;
        }
        if (filter.activate()) {
            // Активация фильтра успешна
            this.filter = filter;
            this.clearKB();
            this.initKeyboard();
        }
    }

    // Включение или выключение на клавиатуре буквы. Изменение активного фильтра
    pressKey(keyID) {
        if (keyID == 'key33') {
            // Очистка фильтра
            this.clearKB();
            this.filter.list = new String('');
            warning('Фильтр очищен', 'blue');
        }

        let letter = this.keys[keyID].text().toLowerCase();
        if (this.filter.is_letter(letter)) {
            // Буква была в фильтре
            this.keys[keyID].removeClass('key_color_active');
//            this.keys[keyID].addClass('key_color');

        } else {
            // Буквы не было в фильтре
//            this.keys[keyID].removeClass('key_color');
            this.keys[keyID].addClass('key_color_active');
        }
    }

    // Включение на клавиатуре выбранных в фильтре букв
    initKeyboard() {
        let alphabet = 'абвгдежзийклмнопрстуфхцчшщъыбэюя';
        for (let i = 0; i < this.filter.list.length; i++) {
//            this.keys['key' + (alphabet.indexOf(this.filter.list[i])+1)].removeClass('key_color');
            this.keys['key' + (alphabet.indexOf(this.filter.list[i])+1)].addClass('key_color_active');
        }
    }

    // Очистка клавиатуры
    clearKB() {
        for (let i = 1; i < 33; i++) {
            this.keys['key' + i].removeClass('key_color_active');
//            this.keys['key' + i].addClass('key_color');
        }
    }

}

// -------------------------------------------------------------------------------------
// Инициализация
function init() {
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
}


// -------------------------------------------------------------------------------------
$(document).ready(function(){

    init(); // Инициализация

// ------------------ Обработка событий -------------------------
    // Списки (черный, белый, дубли)
    $('.btn').click(function(){
        if (this.id in Lists.filter ){
            kb.activateFilter(Lists.filter[this.id]);
        }
        if (this.id == 'refresh') {
            location.reload();
        }
    });

    // Буквы слова
    $('.letter').add('.letter-mini').click(function(){
        kb.activateFilter(Lists.filter[this.id]);
    });

    // Чекбоксы для букв слова
    $('.form-check-input').click(function(){
        id = 'l' + this.id[2];
        Lists.filter[id].change(this.checked);
        kb.activateFilter(Lists.filter[id]);
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