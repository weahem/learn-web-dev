"""Backend 1. Запись клиента в салон."""
from dataclasses import dataclass
from datetime import time as clock_time
import re


@dataclass(frozen=True)
class Appointment:
    id: int
    client_name: str
    master_id: int
    service_id: int
    time: str


# Учебные идентификаторы мастеров и услуг.
MASTER_IDS = {1, 2}
SERVICE_IDS = {1, 2, 3, 4}
OPENING = clock_time(8)
CLOSING = clock_time(20)
appointments: list[Appointment] = []


def create_appointment(
    client_name: str, master_id: int, service_id: int, time: str
) -> Appointment | None:
    if not isinstance(client_name, str) or not client_name.strip():
        return None
    if type(master_id) is not int or master_id not in MASTER_IDS:
        return None
    if type(service_id) is not int or service_id not in SERVICE_IDS:
        return None
    if not isinstance(time, str) or not re.fullmatch(r"(?:[01]\d|2[0-3]):[0-5]\d", time):
        return None
    if not OPENING <= clock_time.fromisoformat(time) < CLOSING:
        return None
    if any(item.master_id == master_id and item.time == time for item in appointments):
        return None

    appointment = Appointment(len(appointments) + 1, client_name.strip(), master_id, service_id, time)
    appointments.append(appointment)
    return appointment


if __name__ == "__main__":
    create_appointment("Иванова А.А.", 1, 1, "10:00")
    create_appointment("Петрова А.А.", 1, 1, "11:00")
    print("Список записей:")
    for appointment in appointments:
        print(appointment.client_name, appointment.time)
    print("Пустое имя:", create_appointment("", 1, 1, "12:00"))
    print("До открытия:", create_appointment("Сидорова А.А.", 1, 1, "00:00"))
