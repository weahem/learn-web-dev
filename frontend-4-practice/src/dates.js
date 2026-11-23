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

export {asDate, ariaDateFormat, buildCalendarGrid, dateKey, displayDate, displayDay, displayMonth, shiftMonth, visitTime};
