const TODAY = {year: 2026, month: 10, day: 6};
const TIMES = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
const OCCUPIED = {even: ["11:00", "13:00"], odd: ["10:00", "14:00", "17:00"]};

function getSlots(date) {
  const blocked = date.day % 2 === 0 ? OCCUPIED.even : OCCUPIED.odd;
  return TIMES.map(time => ({time, available: !blocked.includes(time)}));
}

export const database = {today: TODAY, slotsEvenDay: getSlots({day: 6}), slotsOddDay: getSlots({day: 7})};
