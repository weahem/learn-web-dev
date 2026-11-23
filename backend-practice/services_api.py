"""Backend 4. Валидация и сохранение новой услуги."""
from typing import Annotated

from fastapi import HTTPException
from pydantic import BaseModel, Field, StringConstraints
from sqlalchemy import ForeignKey, String
from sqlalchemy.dialects.sqlite import insert
from sqlalchemy.orm import Mapped, Session, mapped_column

from categories_api import CATEGORIES
from masters_api import Base, DatabaseSession, create_app


class Category(Base):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))


class Service(Base):
    __tablename__ = "services"

    id: Mapped[int] = mapped_column(primary_key=True)
    category_id: Mapped[int] = mapped_column(ForeignKey("categories.id"), index=True)
    title: Mapped[str] = mapped_column(String(100))
    desc: Mapped[str] = mapped_column(String(100))
    duration: Mapped[int]
    price: Mapped[float]


ServiceText = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=100)]


class ServiceCreate(BaseModel):
    categoryId: Annotated[int, Field(strict=True, gt=0)]
    title: ServiceText
    desc: ServiceText
    duration: Annotated[int, Field(strict=True, ge=30, le=180)]
    price: Annotated[float, Field(strict=True, gt=0, allow_inf_nan=False)]


class ServiceResponse(ServiceCreate):
    id: int


def seed_categories(session: Session):
    categories = [{"id": item["id"], "name": item["name"]} for item in CATEGORIES]
    session.execute(insert(Category).values(categories).on_conflict_do_nothing(index_elements=[Category.id]))


app = create_app(seed_categories)


@app.post("/services", status_code=201, response_model=ServiceResponse)
def create_service(data: ServiceCreate, session: DatabaseSession):
    if session.get(Category, data.categoryId) is None:
        raise HTTPException(status_code=404, detail="Category not found")

    service = Service(
        category_id=data.categoryId, title=data.title, desc=data.desc, duration=data.duration, price=data.price
    )
    session.add(service)
    session.commit()
    session.refresh(service)
    return ServiceResponse(id=service.id, **data.model_dump())
