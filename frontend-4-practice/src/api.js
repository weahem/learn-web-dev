async function request(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("HTTP " + response.status);
  return response.json();
}

export function fetchToday() {
  return request("/api/booking/today");
}

export function fetchSlots({day, month, year}) {
  const query = new URLSearchParams({day, month, year});
  return request("/api/slots?" + query);
}
