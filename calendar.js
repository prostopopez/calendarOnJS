const currentDayDOM = document.querySelector("#dayCur");
const currentMonthDOM = document.querySelector("#monthCur");
const currentDateDOM = document.querySelector("#dateCur");
const currentYearDOM = document.querySelector("#yearCur");
const calenderMonthDOM = document.querySelector("#monthActual");
const calenderYearDOM = document.querySelector("#yearActual");

document.querySelector("#nextMonthClick").addEventListener("click", prevMonth);
document.querySelector("#prevMonthClick").addEventListener("click", nextMonth);

const now = new Date();

//for testing purposes use 'let' instead of 'const'
const todayDay = now.getDay(),
    todayDate = now.getDate(),
    todayMonth = now.getMonth(),
    todayYear = now.getFullYear();

const state = {
    todayDay,
    todayDate,
    todayMonth,
    todayYear
};

const daysStr = {
    0: "Пн",
    1: "Вт",
    2: "Ср",
    3: "Чт",
    4: "Пт",
    5: "Сб",
    6: "Вс"
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

const monthsStr = {
    0: {
        var: 'Jan',
        rus: 'Янв'
    },
    1: {
        var: 'Feb',
        rus: 'Фев'
    },
    2: {
        var: 'Mar',
        rus: 'Мар'
    },
    3: {
        var: 'Apr',
        rus: 'Апр'
    },
    4: {
        var: 'May',
        rus: 'Май'
    },
    5: {
        var: 'Jun',
        rus: 'Июн'
    },
    6: {
        var: 'Jul',
        rus: 'Июл'
    },
    7: {
        var: 'Aug',
        rus: 'Авг'
    },
    8: {
        var: 'Sep',
        rus: 'Сен'
    },
    9: {
        var: 'Oct',
        rus: 'Окт'
    },
    10: {
        var: 'Nov',
        rus: 'Ноя'
    },
    11: {
        var: 'Dec',
        rus: 'Дек'
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

currentDayDOM.innerHTML = daysStr[todayDay];
currentDateDOM.innerHTML = todayDate;
currentMonthDOM.innerHTML = monthsStr[state.todayMonth].rus;
currentYearDOM.innerHTML = todayYear;
let currentFullYear = analyizYear(state.todayYear);
let currentFullMonth = currentFullYear.months[monthsStr[state.todayMonth].var];

//run App
showCalenderInfo();

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
        prevMonthDays = currentFullYear.months[monthsStr[prevMonthIdx].var].days_length;
    }
    let result = [];
    for (let i = 1; i <= firstDayIndex; i++) {
        const day = prevMonthDays - firstDayIndex + i;
        result.push({ day, state: "prevMonth" });
    }

    return result;
    //**** previous version of this code was returning just days without state
    //**** like [1,2,3] instead of day and its state like [{day:1,"prevMonth"}]
    // return Array.from(
    // 	{ length: firstDayIndex },
    // 	(_, i) => prevMonthDays - firstDayIndex + i
    // );
}

// this will print an array of with days of prev month and next month crosponds to the calender table
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
                let todayFullDate =
                    state.todayYear +
                    " " +
                    (state.todayMonth + 1) +
                    " " +
                    state.todayDate;

                // week.children[j].innerHTML = viewNote;
                // week.children[j].id = notesFound.id;
                let viewNote = "";
                week.children[j].innerHTML = `${currentWeek[j].day}`;
                // week.children[j].innerHTML = currentWeek[j].day;
                week.children[j].id = "current-day";
                week.children[j].classList.add("currMonth");
                week.children[j].style.backgroundColor = "#e1e1e1";
                currentMonthStarted = false;
                currentMonthEnd = false;
            } else {
                week.children[j].style.cursor = "";
                week.children[j].style.backgroundColor = "white"; //.style.backgroundColor = "white";
                week.children[j].style.color = "black";
                week.children[j].innerHTML = currentWeek[j].day;
                week.children[j].removeAttribute("id");
                if (currentWeek[j].state !== "currMonth") {
                    week.children[j].style.opacity = 0.6;
                    week.children[j].style.color = "rgba(255, 255, 255,0.4)";
                    week.children[j].style.cursor = "default";
                    week.children[j].classList.remove("currMonth");
                    week.children[j].classList.remove("tooltip-container");
                }
                if (currentWeek[j].state == "currMonth") {
                    //exp 2019 10 24
                    week.children[j].classList.add("currMonth");
                    let currentFullDate =
                        currentFullMonth.year +
                        " " +
                        (currentFullMonth.month_idx + 1) +
                        " " +
                        currentWeek[j].day;
                }
            }
            // console.log("xZx: ", currentWeek[j]);
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
    currentFullMonth = currentFullYear.months[monthsStr[state.todayMonth].var];
    showCalenderInfo();
}

function prevMonth() {
    state.todayMonth -= 1;
    if (state.todayMonth == 0) {
        state.todayYear -= 1;
        currentFullYear = analyizYear(state.todayYear);
        state.todayMonth = 11;
    }
    currentFullMonth = currentFullYear.months[monthsStr[state.todayMonth].var];
    showCalenderInfo();
}

function showCalenderInfo() {
    calenderMonthDOM.innerHTML = monthsStr[state.todayMonth].rus;
    calenderYearDOM.innerHTML = state.todayYear;
    printMonthCalendarInDOM();
}

// to change the year manually
calenderYearDOM.addEventListener("input", e => {
    let numberPattern = /\d+/g;
    let year = parseInt(e.target.innerHTML.match(numberPattern).join(""));
    if (
        e.target.innerHTML.match(numberPattern).join("").length > 3 &&
        typeof year === "number"
    ) {
        currentFullYear = analyizYear(year);
        currentFullMonth = currentFullYear.months[monthsStr[state.todayMonth].var];
        state.todayYear = year;
        showCalenderInfo();
    }
});
