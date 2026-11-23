"""Backend 3. Хранение мастеров в SQLite и чтение через SQLAlchemy."""
import os
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy import String, create_engine, event, select
from sqlalchemy.dialects.sqlite import insert
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column

from categories_api import router as categories_router


class Base(DeclarativeBase):
    pass


class Master(Base):
    __tablename__ = "masters"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    specialization: Mapped[str] = mapped_column(String(100), index=True)


database_path = Path(os.environ.get("SALON_DATABASE", Path(__file__).with_name("salon.sqlite3")))
engine = create_engine(f"sqlite:///{database_path}")


@event.listens_for(engine, "connect")
def enable_foreign_keys(connection, _):
    connection.execute("PRAGMA foreign_keys = ON")


def get_session():
    with Session(engine) as session:
        yield session


DatabaseSession = Annotated[Session, Depends(get_session)]


def master_response(master: Master):
    return {"id": master.id, "name": master.name, "specialization": master.specialization}


def create_app(seed_extra=None):
    @asynccontextmanager
    async def lifespan(_):
        Base.metadata.create_all(engine)
        with Session(engine) as session:
            session.execute(insert(Master).values([
                {"id": 1, "name": "Анна", "specialization": "Парикмахер"},
                {"id": 2, "name": "Мария", "specialization": "Визажист"},
            ]).on_conflict_do_nothing(index_elements=[Master.id]))
            if seed_extra is not None:
                seed_extra(session)
            session.commit()
        yield

    application = FastAPI(title="API салона", lifespan=lifespan)
    application.include_router(categories_router)

    @application.get("/masters")
    def list_masters(session: DatabaseSession, specialization: str | None = None):
        query = select(Master).order_by(Master.id)
        if specialization is not None:
            query = query.where(Master.specialization == specialization)
        return [master_response(master) for master in session.scalars(query)]

    @application.get("/masters/{master_id}")
    def get_master(master_id: int, session: DatabaseSession):
        master = session.get(Master, master_id)
        if master is None:
            raise HTTPException(status_code=404, detail="Master not found")
        return master_response(master)

    return application


app = create_app()
