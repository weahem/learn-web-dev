import {useState} from "react";
import {ariaDateFormat, asDate, buildCalendarGrid, dateKey, displayDate, displayDay, displayMonth, shiftMonth, visitTime} from "./dates.js";
import {SiteHeader, Progress, SiteFooter} from "./SiteChrome.jsx";

import portrait from "./images/dmitry-volkov.jpg";

const TODAY = {year: 2026, month: 10, day: 6};
const TIMES = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
const OCCUPIED = {even: ["11:00", "13:00"], odd: ["10:00", "14:00", "17:00"]};

function getSlots(date) {
  const blocked = date.day % 2 === 0 ? OCCUPIED.even : OCCUPIED.odd;
  return TIMES.map(time => ({time, available: !blocked.includes(time)}));
}

const weekdays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const price = "2 200 ₽";

function Calendar({month, today, date, moveMonth, selectDate}) {
  return <section className="panel calendar" aria-labelledby="month">
    <div className="calendar-heading">
      <h2 className="panel-title" id="month">{displayMonth(month)}</h2>
      <div className="month-nav">
        <button className="month-button" type="button" aria-label="Предыдущий месяц" onClick={() => moveMonth(-1)}>‹</button>
        <button className="month-button" type="button" aria-label="Следующий месяц" onClick={() => moveMonth(1)}>›</button>
      </div>
    </div>
    <div className="calendar-week" aria-hidden="true">
      {weekdays.map(day => <span key={day}>{day}</span>)}
    </div>
    <div className="calendar-days">
      {buildCalendarGrid(month).map(cell => {
        const key = dateKey(cell);
        if (cell.month !== month.month) {
          return <span className="day day--outside" aria-hidden="true" key={key}>{cell.day}</span>;
        }
        const selected = key === dateKey(date);
        return <button className={selected ? "day is-selected" : "day"} type="button" key={key}
          aria-label={ariaDateFormat.format(asDate(cell))} aria-pressed={selected}
          disabled={key < dateKey(today)} onClick={() => selectDate(cell)}>{cell.day}</button>;
      })}
    </div>
    <p className="panel-note">Выбрано: {displayDay(date)}<br />Все часы указаны по Москве.</p>
  </section>;
}

function Availability({date, time, slots, selectTime, loading, error, retry}) {
  return <section className="panel availability" aria-labelledby="slot-date" aria-busy={loading || undefined}>
    <h2 className="panel-title" id="slot-date">{displayDay(date)}</h2>
    <p className="slot-intro">Начало визита · 60 минут</p>
    {loading && <p role="status">Загрузка слотов…</p>}
    {error && <><p role="alert">{error}</p><button type="button" className="action action--secondary" onClick={retry}>Повторить</button></>}
    {!loading && !error && <><div className="slot-grid">
      {slots.map(slot => <button className={slot.time === time ? "slot is-selected" : "slot"} type="button"
        key={slot.time} disabled={!slot.available} aria-pressed={slot.time === time}
        onClick={() => selectTime(slot.time)}>{slot.time}{!slot.available && <small className="slot-note">Занято</small>}</button>)}
    </div>
    <p className="panel-note" aria-live="polite">
      {time ? "Ваш визит: " + visitTime(time) + "." :
        slots.some(slot => slot.available) ? "Выберите свободное время для визита." : "На этот день нет свободных слотов."}
    </p></>}
  </section>;
}

function Summary({date, time}) {
  return <aside className="panel summary" aria-labelledby="summary">
    <h2 className="eyebrow" id="summary">Ваша смена</h2>
    <div className="barber" id="barber">
      <img className="barber-photo" src={portrait} alt="" width="56" height="56" />
      <div><strong>Дмитрий Волков</strong><p className="summary-note" id="rating">Топ-барбер · ★ 4,9</p></div>
    </div>
    <div className="summary-row" id="service"><strong>Стрижка + борода</strong><p className="summary-note">60 минут · всё включено</p></div>
    <div className="summary-row">
      <strong><time dateTime={dateKey(date)}>{displayDate(date)}, {displayDay(date).split(", ").at(-1)}</time></strong>
      <p className="summary-note">{time ? visitTime(time) + " · московское время" : "Время ещё не выбрано"}</p>
    </div>
    <div className="price-row"><span>К оплате в барбершопе</span><strong>{price}</strong></div>
    <address className="panel-note">Москва, ул. Садовая, 15<br /><a href="tel:+74951234567">+7 (495) 123-45-67</a></address>
  </aside>;
}

function BookingActions({date, time}) {
  return <div className="booking-actions">
    <div className="selection">
      <strong aria-live="polite">{displayDate(date)} · {time ? visitTime(time) : "выберите время"} · {price}</strong>
      <p className="summary-note">Без предоплаты. Оплата после визита.</p>
    </div>
    <div className="action-buttons">
      <button className="action action--secondary" type="button">Назад</button>
      <button className="action action--primary" type="button" disabled={!time}>Далее <span aria-hidden="true">→</span></button>
    </div>
  </div>;
}

function Booking({today}) {
  const [month, setMonth] = useState(today);
  const [date, setDate] = useState(today);
  const [time, setTime] = useState(null);
  const slots = getSlots(date);

  function selectDate(next) {
    if (dateKey(next) === dateKey(date) || dateKey(next) < dateKey(today)) return;
    setDate(next);
    setTime(null);
  }

  return <main className="container booking">
    <div className="booking-meta">
      <button className="back-link" type="button">← Назад</button>
      <span className="eyebrow">Онлайн-запись / 3 из 5</span>
    </div>
    <h1 className="booking-title">Найдём время для себя</h1>
    <p className="booking-intro">Выберите день и время начала. Для комплекса нужен один свободный час.</p>
    <div className="booking-grid">
      <Calendar month={month} today={today} date={date} moveMonth={delta => setMonth(current => shiftMonth(current, delta))} selectDate={selectDate} />
      <Availability date={date} time={time} slots={slots} selectTime={setTime} />
      <Summary date={date} time={time} />
    </div>
    <BookingActions date={date} time={time} />
  </main>;
}

export default function App() {
  return <><SiteHeader /><Progress /><Booking today={TODAY} /><SiteFooter /></>;
}
