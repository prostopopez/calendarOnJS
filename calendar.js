// Переменные - день, месяц, год
const currentDay = document.querySelector("#dayCur");
const currentMonth = document.querySelector("#monthCur");
const currentDate = document.querySelector("#dateCur");
const currentYear = document.querySelector("#yearCur");
const calendarMonth = document.querySelector("#monthActual");
const calendarYear = document.querySelector("#yearActual");

// Кнопки - следующий, предыдущий месяц
document.querySelector("#nextMonthClick").addEventListener("click", prevMonth);
document.querySelector("#prevMonthClick").addEventListener("click", nextMonth);

// Выносим из даты составляющие
const todayDay = new Date().getDay();
const todayDate = new Date().getDate();
const todayMonth = new Date().getMonth();
const todayYear = new Date().getFullYear();

const state = {
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

const daysIndex = {
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

const monthsIndex = {
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

currentDay.innerHTML = daysList[todayDay];
currentDate.innerHTML = todayDate;
currentMonth.innerHTML = monthsList[state.todayMonth].rus;
currentYear.innerHTML = todayYear;
let currentFullYear = analyizYear(state.todayYear);
let currentFullMonth = currentFullYear.months[monthsList[state.todayMonth].var];

//run App
showCalendarInfo();

//exp: analyizYear(2021) will get you all months length,first day,last day with indexes
function analyizYear(year) {
    let counter = 0;
    const currentYear = {
        year: year,
        is_leap: false,
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

    while (counter < 12) {
        Object.keys(currentYear.months).forEach(month => {
            currentYear.months[month] = analyizMonth(month, year);
        });
        counter++;
    }
    if (currentYear.months["Feb"].days_length === 29) {
        currentYear.is_leap = true;
    }
    return currentYear;
}

//exp: run analyizMonth(String:'Dec',Int:2019) note:(must capitalize month like Sep,Nov)
function analyizMonth(month, year) {
    const testDays = 31;
    let counter = 0;

    const monthObj = {
        year: year,
        month: month,
        month_idx: monthsIndex[month],
        first_day: "",
        first_day_index: null,
        days_length: 0,
        last_day_index: null
    };

    while (counter < testDays) {
        counter++;
        const dateTest = `${counter} ${month} ${year}`;
        const dateArr = new Date(dateTest).toDateString().split(" ");
        if (dateArr[1] === month) {
            if (counter === 1) {
                monthObj.first_day = dateArr[0];
                monthObj.first_day_index = daysIndex[dateArr[0]];
            }
            monthObj.days_length++;
            monthObj.last_day = dateArr[0];
            monthObj.last_day_index = daysIndex[dateArr[0]];
        } else {
            return monthObj;
        }
    }
    return monthObj;
}

//get last month days in current month view
function makePrevMonthArr(firstDayIndex) {
    let prevMonthIdx;
    let prevMonthDays;
    if (state.todayMonth === 0) {
        prevMonthDays = analyizMonth("Dec", state.todayYear - 1).days_length;
    } else {
        prevMonthIdx = monthsIndex[currentFullMonth.month] - 1;
        prevMonthDays = currentFullYear.months[monthsList[prevMonthIdx].var].days_length;
    }
    let result = [];
    for (let i = 1; i <= firstDayIndex; i++) {
        const day = prevMonthDays - firstDayIndex + i;
        result.push({ day, state: "prevMonth" });
    }

    return result;
}

// this will print an array of with days of prev month and next month crosponds to the calendar table
function calcMonthCalendar() {
    // Create array: [1, 2, 3, ..., 30, 31]
    const currMonth = Array.from(
        { length: currentFullMonth.days_length },
        (_, i) => ({ day: i + 1, state: "currMonth" })
    );

    const nextMonth = Array.from(
        { length: currentFullMonth.days_length },
        (_, i) => ({ day: i + 1, state: "nextMonth" })
    );

    // Create a flat array with leading zeros and trailing last week:
    // [0, 0, 0, 0, 1, 2, 3, ..., 30, 31, 1, 2, 3, 4, 5, 6, 7]
    const flatResultArr = [
        ...makePrevMonthArr(currentFullMonth.first_day_index),
        ...currMonth,
        ...nextMonth // this includes extra numbers that will be trimmed
    ].slice(0, 7 * 6); // 7 days/week * 6 weeks

    // Chunk the flat array into slices of 7:
    const resultArr = [];
    for (let i = 0; i < 7; i++) {
        resultArr.push(flatResultArr.slice(i * 7, (i + 1) * 7));
    }
    return resultArr;
}

// print each cell its day number and color
function printMonthCalendarInDOM() {
    const monthArr = calcMonthCalendar();

    let currentMonthStarted = false;
    let currentMonthEnd = true;
    for (let i = 0; i < 6; i++) {
        let currentWeek = monthArr[i];
        //
        const week = document.querySelector("#calendarBody").children[i];
        for (let j = 0; j < 7; j++) {
            week.children[j].style.backgroundColor = "white";
            week.children[j].style.opacity = 1;
            // console.log(currentWeek[j].day);
            if (currentWeek[j].day === 1) {
                currentMonthStarted = true;
            }
            if (
                currentMonthEnd &&
                currentMonthStarted &&
                currentWeek[j].day === todayDate &&
                currentFullMonth.month_idx === todayMonth &&
                currentFullYear.year === todayYear
            ) {
                week.children[j].innerHTML = `${currentWeek[j].day}`;
                week.children[j].id = "current-day";
                week.children[j].classList.add("currMonth");
                week.children[j].style.backgroundColor = "wheat";
                currentMonthStarted = false;
                currentMonthEnd = false;
            } else {
                week.children[j].style.backgroundColor = "white";
                // week.children[j].style.color = "black";
                week.children[j].innerHTML = currentWeek[j].day;
                week.children[j].removeAttribute("id");
                if (currentWeek[j].state !== "currMonth") {
                    week.children[j].style.backgroundColor = '#f4e1d2';
                    week.children[j].style.color = "#3b3a30";
                    week.children[j].classList.remove("currMonth");
                }
                if (currentWeek[j].state == "currMonth") {
                    week.children[j].classList.add("currMonth");
                }
            }
        }
    }
}

function nextMonth() {
    state.todayMonth += 1;
    if (state.todayMonth == 12) {
        state.todayYear += 1;
        currentFullYear = analyizYear(state.todayYear);
        state.todayMonth = 0;
    }
    currentFullMonth = currentFullYear.months[monthsList[state.todayMonth].var];
    showCalendarInfo();
}

function prevMonth() {
    state.todayMonth -= 1;
    if (state.todayMonth == 0) {
        state.todayYear -= 1;
        currentFullYear = analyizYear(state.todayYear);
        state.todayMonth = 11;
    }
    currentFullMonth = currentFullYear.months[monthsList[state.todayMonth].var];
    showCalendarInfo();
}

function showCalendarInfo() {
    calendarMonth.innerHTML = monthsList[state.todayMonth].rus;
    calendarYear.innerHTML = state.todayYear;
    printMonthCalendarInDOM();
}

// to change the year manually
calendarYear.addEventListener("input", e => {
    let numberPattern = /\d+/g;
    let year = parseInt(e.target.innerHTML.match(numberPattern).join(""));
    if (
        e.target.innerHTML.match(numberPattern).join("").length > 3 &&
        typeof year === "number"
    ) {
        currentFullYear = analyizYear(year);
        currentFullMonth = currentFullYear.months[monthsList[state.todayMonth].var];
        state.todayYear = year;
        showCalendarInfo();
    }
});

console.log(state);