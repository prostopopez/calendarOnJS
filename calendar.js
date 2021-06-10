// Переменные - день, месяц, год, выходные
const currentDay = document.querySelector("#dayCur");
const currentMonth = document.querySelector("#monthCur");
const currentDate = document.querySelector("#dateCur");
const currentYear = document.querySelector("#yearCur");
const calendarMonth = document.querySelector("#monthActual");
const calendarYear = document.querySelector("#yearActual");
const holidays = document.querySelector(".holidays p");
let select = document.getElementById("selectNumber");
const removeHoliday = document.getElementById("removeHoliday");
const addHoliday = document.getElementById("addHoliday");

// Кнопки - следующий, предыдущий месяц
document.querySelector("#nextMonthClick").addEventListener("click", prevMonth);
document.querySelector("#prevMonthClick").addEventListener("click", nextMonth);

// Выносим из даты составляющие. Так как день недели у нас начинается с Понедельника,
// а в JS с Воскресенья, вычтем 1 день и добавим проверку на отрицательное значение
// (при помощи тернарного оператора)
const todayDay = (new Date().getDay() - 1) > 0 ? (new Date().getDay() - 1) : 6;
const todayDate = new Date().getDate();
const todayMonth = new Date().getMonth();
const todayYear = new Date().getFullYear();

// Объект, содержащий актуальные состояния даты
let state = {
    todayDay,
    todayDate,
    todayMonth,
    todayYear
};

// Объект, содержащий названия дней недели
const daysList = {
    0: "Понедельник",
    1: "Вторник",
    2: "Среда",
    3: "Четверг",
    4: "Пятница",
    5: "Суббота",
    6: "Воскресенье"
};

// Объект, содержащий индексы дней недели
const daysIndexes = {
    Mon: 0,
    Tue: 1,
    Wed: 2,
    Thu: 3,
    Fri: 4,
    Sat: 5,
    Sun: 6
};

// Объект, содержащий переменные месяцев и перевод на русский язык
const monthsList = {
    0: {
        var: 'Jan',
        rus: 'Январь'
    },
    1: {
        var: 'Feb',
        rus: 'Февраль'
    },
    2: {
        var: 'Mar',
        rus: 'Март'
    },
    3: {
        var: 'Apr',
        rus: 'Апрель'
    },
    4: {
        var: 'May',
        rus: 'Май'
    },
    5: {
        var: 'Jun',
        rus: 'Июнь'
    },
    6: {
        var: 'Jul',
        rus: 'Июль'
    },
    7: {
        var: 'Aug',
        rus: 'Август'
    },
    8: {
        var: 'Sep',
        rus: 'Сентябрь'
    },
    9: {
        var: 'Oct',
        rus: 'Октябрь'
    },
    10: {
        var: 'Nov',
        rus: 'Ноябрь'
    },
    11: {
        var: 'Dec',
        rus: 'Декабрь'
    }
};

// Объект, содержащий индексы месяцев
const monthsIndexes = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11
};

// Массив праздников
let holidaysList = [
    {
        name: 'Международный день защиты детей',
        month: 'Jun',
        dayIndex: 9
    },
    {
        name: 'Ещё один праздник',
        month: 'Jun',
        dayIndex: 9
    },
    {
        name: 'Третий праздник',
        month: 'Jun',
        dayIndex: 1
    },
    {
        name: 'Четвёртый праздник',
        month: 'Jun',
        dayIndex: 9
    },
    {
        name: 'Какой-то праздник',
        month: 'Jun',
        dayIndex: 15
    }
];

// Сохранение информации о праздниках после перезагрузки страницы
if (localStorage.getItem('holidaysLocal') == null) {
    holidaysList = [];
} else {
    holidaysList = JSON.parse(localStorage.getItem('holidaysLocal'));
}

// Выпадающий лист с праздниками
for (let i = 0; i < holidaysList.length; i++) {
    let opt = holidaysList[i].name;
    let el = document.createElement("option");
    el.textContent = opt;
    el.value = opt;
    select.appendChild(el);
}

// Кол-во дней в зависимости от месяца в select
document.getElementById('month').onchange = function () {
    for (let i = 0; i < document.getElementById('day').children.length; i++) {
        document.getElementById('day').innerHTML = '';
    }

    for (let i = 0; i <= (fullYear.months[document.getElementById('month').value]).daysLength; i++) {
        let el = document.createElement("option");
        el.textContent = (i + 1).toString();
        el.value = (i + 1).toString();
        document.getElementById('day').appendChild(el);
    }
};

// Удалить праздник
removeHoliday.onclick = function () {
    for (let i = 0; i < holidaysList.length; i++) {
        if (holidaysList[i].name === select.value) {
            holidaysList.splice(i, 1);
        }
    }

    localStorage.setItem('holidaysLocal', JSON.stringify(holidaysList));
    document.location.reload();
};
console.log(holidaysList);

// Добавить праздник
addHoliday.onclick = function () {
    let isHol = true;

    let name = document.getElementById('name').value;
    let month = document.getElementById('month').value;
    let day = document.getElementById('day').value;

    for (let i = 0; i < holidaysList.length; i++) {
        if (name === holidaysList[i].name) {
            isHol = false;
        }
    }

    console.log(month, day);
    if (month !== 'Выбор месяца' && day !== 'Выбор дня') {
        if (isHol) {
            holidaysList.push({ name: name, month: month, dayIndex: day });

            localStorage.setItem('holidaysLocal', JSON.stringify(holidaysList));
            document.location.reload();
        } else {
            alert('Такой праздник уже есть');
        }
    } else {
        alert('Выберите корректные месяц и день');
    }
};

// Замена данных о сегодняшнем дне
currentYear.innerHTML = todayYear;
currentDay.innerHTML = daysList[todayDay] + ',';
currentMonth.innerHTML = monthsList[state.todayMonth].rus + ',';
currentDate.innerHTML = todayDate + ' число';

// Проверка на соответствие месяца и дня дате праздника
for (let y = 0; y < holidaysList.length; y++) {
    if (holidaysList[y].month == monthsList[todayMonth].var && holidaysList[y].dayIndex == todayDate) {
        holidays.innerHTML += holidaysList[y].name + `<br/>`;
    }
}

// Получение подробностей по году и месяцу
let fullYear = checkYearDays(state.todayYear);
let fullMonth = fullYear.months[monthsList[state.todayMonth].var];

// Вызов основной функции
changeCalendar();

// Заменяет в календаре месяц и день на актуальные
function changeCalendar() {
    calendarMonth.innerHTML = monthsList[state.todayMonth].rus;
    calendarYear.value = state.todayYear;
    printCalendar();
}

// Проверка года
function checkYearDays(year) {
    const currentYear = {
        year: year,
        isLeap: false,
        months: {
            Jan: 0,
            Feb: 1,
            Mar: 2,
            Apr: 3,
            May: 4,
            Jun: 5,
            Jul: 6,
            Aug: 7,
            Sep: 8,
            Oct: 9,
            Nov: 10,
            Dec: 11
        }
    };

    // Заполняет год информацией о месяцах
    Object.keys(currentYear.months).forEach(month => {
        currentYear.months[month] = checkMonthDays(month, year);
    });

    // Проверяет, високосный ли год (29 дней в Феврале)
    if (currentYear.months["Feb"].daysLength === 29) {
        currentYear.isLeap = true;
    }

    return currentYear;
}

// Проверка месяца
function checkMonthDays(month, year) {
    const maxDays = 31;
    const monthObj = {
        year: year,
        month: month,
        monthIndex: monthsIndexes[month],
        firstDay: "",
        firstDayIndex: null,
        daysLength: 0,
        lastDayIndex: null
    };

    // Добавление в объект месяца названия и индекса первого и последнего дней
    for (let i = 1; i < maxDays; ++i) {
        const dateTest = i + ' ' + month + ' ' + year;

        // Преобразование в массив: день недели/месяц/число/год при помощи разделения пробелами
        const dateArray = new Date(dateTest).toDateString().split(" ");

        if (dateArray[1] === month) {
            if (i === 1) {
                monthObj.firstDay = dateArray[0];
                monthObj.firstDayIndex = daysIndexes[dateArray[0]];
            }

            monthObj.daysLength++;
            monthObj.lastDay = dateArray[0];
            monthObj.lastDayIndex = daysIndexes[dateArray[0]];
        } else {
            return monthObj;
        }
    }

    return monthObj;
}

// Получение кол-ва дней предыдущего месяца
function makePrevMonthArr(firstDayIndex) {
    let prevMonthIndex;
    let prevMonthDays;
    let result = [];

    if (state.todayMonth === 0) {
        // Применение функции определения дней к Декабрю предыдущего года
        prevMonthDays = checkMonthDays("Dec", state.todayYear - 1).daysLength;
    } else {
        // Получение кол-ва дней из предыдущего месяца нынешнего года
        prevMonthIndex = monthsIndexes[fullMonth.month] - 1;
        prevMonthDays = fullYear.months[monthsList[prevMonthIndex].var].daysLength;
    }

    // Заполнение return цифровыми значениями дней относящихся к предыдущему месяцу,
    // но влезающих в нынешний календарь
    for (let i = 1; i <= firstDayIndex; i++) {
        const day = prevMonthDays - firstDayIndex + i;
        result.push({ day, state: "prevMonth" });
    }

    return result;
}

// Создание массива дней предыдущего и следующего месяцев
function calcMonthCalendar() {
    const resultArr = [];

    // Новые массивы из кол-ва дней нынешнего месяца со значением
    // state - нынешний и следующий месяцы
    const currMonth = Array.from(
        { length: fullMonth.daysLength },
        (_, i) => ({ day: i + 1, state: "currMonth", holidays: findHolidays(i + 1) })
    );

    // Заполнение массива названиями праздников
    function findHolidays(day) {
        let holidays = [];

        for (let y = 0; y < holidaysList.length; y++) {
            if (holidaysList[y].month == fullMonth.month && holidaysList[y].dayIndex == day) {
                holidays.push(holidaysList[y].name);
            }
        }

        return holidays;
    }

    const nextMonth = Array.from(
        { length: fullMonth.daysLength },
        (_, i) => ({ day: i + 1, state: "nextMonth" })
    );

    // Создание массива, состоящего из:
    // влезающих в нынешний календарь дней предыдущего месяца,
    // дней нынешнего месяца,
    // дней следующего месяца (при этом лишние дни обрезаются при помощи slice,
    // получаются 42 видимых дня)
    const longDaysArray = [
        ...makePrevMonthArr(fullMonth.firstDayIndex),
        ...currMonth,
        ...nextMonth
    ].slice(0, 7 * 6);

    // Преобразование однородного массива состоящий из 7 небольших
    // Каждый охватывает одну неделю
    for (let i = 0; i < 7; i++) {
        resultArr.push(longDaysArray.slice(i * 7, (i + 1) * 7));
    }

    return resultArr;
}

// Функция, заполняющая td в календаре
function printCalendar() {
    const monthArr = calcMonthCalendar();

    let currentMonthStarted = false;
    let currentMonthEnd = true;

    for (let i = 0; i < 6; i++) {
        let currentWeek = monthArr[i];

        // Занос в массив всех строк в таблице
        const week = document.querySelectorAll("#calendarBody tr")[i];

        // Занос в массив всех столбов в строке
        const weekDays = week.querySelectorAll("td");

        for (let j = 0; j < 7; j++) {
            // Определение первого дня месяца
            if (currentWeek[j].day === 1) {
                currentMonthStarted = true;
            }

            // Заполнение ячеек числами
            weekDays[j].innerHTML = currentWeek[j].day;

            // Сегодняшний день, если: нынешний месяц, день, год
            if (
                currentMonthEnd &&
                currentMonthStarted &&
                currentWeek[j].day === todayDate &&
                fullMonth.monthIndex === todayMonth &&
                fullYear.year === todayYear
            ) {
                // Перекрашивание актуальной ячейки
                weekDays[j].style.backgroundColor = "#ffcdcd";

                // Отмена покраски следующего/предыдущего месяцев
                currentMonthStarted = false;
                currentMonthEnd = false;
            } else {
                // Повторная покраска (чтобы перекрыть актуальный день)
                weekDays[j].style.backgroundColor = "white";

                // Если дни не относятся к актуальному месяцу, покрасить в бежевый
                if (currentWeek[j].state !== "currMonth") {
                    weekDays[j].style.backgroundColor = '#f4e1d2';
                }
            }

            // Заполнение праздничных дней подсказками и изменение их цвета
            if (currentWeek[j].hasOwnProperty('holidays') && currentWeek[j].holidays.length > 0) {
                // Перекрашивание ячейки с праздником
                weekDays[j].style.backgroundColor = "lightgreen";
                weekDays[j].setAttribute('data-tooltip', currentWeek[j].holidays.map(item => item));
            }
        }
    }
}

// Переход на следующий месяц
function nextMonth() {
    // Прибавляет 1 месяц
    state.todayMonth += 1;

    // Если месяце последний в году, прибавляет год и проверяет кол-во дней в нём
    if (state.todayMonth == 12) {
        state.todayYear += 1;

        // Замена данных о годе
        fullYear = checkYearDays(state.todayYear);
        state.todayMonth = 0;
    }

    // Замена данных о месяце
    fullMonth = fullYear.months[monthsList[state.todayMonth].var];

    // Вызов функции изменения календаря
    changeCalendar();
}

// Переход на предыдущий месяц
function prevMonth() {
    // Вычитает 1 месяц
    state.todayMonth -= 1;

    // Если месяц первый в году, убавляет год и проверяет кол-во дней в нём
    if (state.todayMonth == 0) {
        state.todayYear -= 1;

        // Замена данных о годе
        fullYear = checkYearDays(state.todayYear);
        state.todayMonth = 11;
    }

    // Замена данных о месяце
    fullMonth = fullYear.months[monthsList[state.todayMonth].var];

    // Вызов функции изменения календаря
    changeCalendar();
}

// Изменение года вводом в input
calendarYear.addEventListener("input", e => {
    // Преобразование введённого в численное значение
    let year = parseInt(e.target.value);

    if (
        typeof year === "number"
    ) {
        // Присваивание всем необходимым переменным нового значения
        fullYear = checkYearDays(year);
        fullMonth = fullYear.months[monthsList[state.todayMonth].var];
        state.todayYear = year;
        changeCalendar();
    }
});