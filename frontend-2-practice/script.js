// Данные учебного расписания.
const TODAY = {year: 2026, month: 10, day: 6};
const TIMES = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
const OCCUPIED = {even: ["11:00", "13:00"], odd: ["10:00", "14:00", "17:00"]};

function getSlots(date) {
  const blocked = date.day % 2 === 0 ? OCCUPIED.even : OCCUPIED.odd;
  return TIMES.map(time => ({time, available: !blocked.includes(time)}));
}

// Состояние страницы.
let month = TODAY;
let selectedDate = TODAY;
let selectedTime = null;

// Функции работы с датами.
const dayFormat = new Intl.DateTimeFormat("ru-RU", {day: "numeric", month: "long"});
const fullDateFormat = new Intl.DateTimeFormat("ru-RU", {day: "numeric", month: "long", year: "numeric"});
const monthFormat = new Intl.DateTimeFormat("ru-RU", {month: "long", year: "numeric"});
const ariaDateFormat = new Intl.DateTimeFormat("ru-RU", {dateStyle: "full"});
const asDate = ({year, month, day}) => new Date(year, month, day);
const dateParts = date => ({year: date.getFullYear(), month: date.getMonth(), day: date.getDate()});
const dateKey = date => [date.year, String(date.month + 1).padStart(2, "0"), String(date.day).padStart(2, "0")].join("-");
const titleCase = text => text[0].toUpperCase() + text.slice(1);
const weekdayFormat = new Intl.DateTimeFormat("ru-RU", {weekday: "long"});
const displayDay = date => dayFormat.format(asDate(date)) + ", " + weekdayFormat.format(asDate(date));
const displayDate = date => fullDateFormat.format(asDate(date)).replace(/\s*г\.$/, "");
const displayMonth = date => titleCase(monthFormat.format(asDate(date)).replace(/\s*г\.$/, ""));
const shiftMonth = (date, delta) => dateParts(new Date(date.year, date.month + delta, 1));

function buildCalendarGrid({year, month}) {
  const offset = (new Date(year, month, 1).getDay() + 6) % 7;
  return Array.from({length: 42}, (_, index) => dateParts(new Date(year, month, index - offset + 1)));
}

function visitTime(time) {
  const [hour, minute] = time.split(":");
  const endHour = String((Number(hour) + 1) % 24).padStart(2, "0");
  return time + "–" + endHour + ":" + minute;
}

// Отрисовка и обработчики.
const element = selector => document.querySelector(selector);

function renderCalendar() {
  element("#month").textContent = displayMonth(month);
  element(".calendar-days").innerHTML = buildCalendarGrid(month).map(date => {
    const outside = date.month !== month.month;
    if (outside) return '<span class="day day--outside" aria-hidden="true">' + date.day + "</span>";
    const selected = dateKey(date) === dateKey(selectedDate);
    const disabled = dateKey(date) < dateKey(TODAY);
    return '<button type="button" class="day' + (selected ? ' is-selected' : '') +
      '" data-day="' + date.day + '" aria-label="' + ariaDateFormat.format(asDate(date)) +
      '" aria-pressed="' + selected + '"' + (disabled ? ' disabled' : '') + '>' + date.day + '</button>';
  }).join("");
}

function renderBooking() {
  const date = displayDate(selectedDate);
  const day = displayDay(selectedDate);
  const time = selectedTime ? visitTime(selectedTime) : null;
  element("#slot-date").textContent = day;
  element("#picked-day").textContent = "Выбрано: " + day;
  element("#summary-date").textContent = date + ", " + day.split(", ").at(-1);
  element("#summary-date").dateTime = dateKey(selectedDate);
  element("#summary-time").textContent = time ? time + " · московское время" : "Время ещё не выбрано";
  element("#visit-note").textContent = time ? "Ваш визит: " + time + "." : "Выберите свободное время для визита.";
  element("#selection-text").textContent = date + " · " + (time ?? "выберите время") + " · 2 200 ₽";
  element(".action--primary").disabled = !time;
  element(".slot-grid").innerHTML = getSlots(selectedDate).map(({time, available}) => {
    const selected = time === selectedTime;
    return '<button type="button" class="slot' + (selected ? ' is-selected' : '') + '" data-time="' + time +
      '" aria-pressed="' + selected + '"' + (available ? '' : ' disabled') + '>' + time +
      (available ? '' : '<small class="slot-note">Занято</small>') + '</button>';
  }).join("");
}

element(".calendar-days").addEventListener("click", event => {
  const button = event.target.closest("[data-day]:not(:disabled)");
  if (!button) return;
  const date = {...month, day: Number(button.dataset.day)};
  if (dateKey(date) === dateKey(selectedDate)) return;
  selectedDate = date;
  selectedTime = null;
  renderCalendar();
  renderBooking();
  element("[data-day='" + date.day + "']").focus();
});

element(".slot-grid").addEventListener("click", event => {
  const button = event.target.closest("[data-time]:not(:disabled)");
  if (!button) return;
  selectedTime = button.dataset.time;
  renderBooking();
  element("[data-time='" + selectedTime + "']").focus();
});

for (const [id, delta] of [["#prev-month", -1], ["#next-month", 1]]) {
  element(id).addEventListener("click", () => {
    month = shiftMonth(month, delta);
    renderCalendar();
  });
}

// Первое отображение страницы.
renderCalendar();
renderBooking();
