"""Backend 2. Список категорий и получение категории по ID."""
from fastapi import APIRouter, FastAPI, HTTPException


CATEGORIES = (
    {"id": 1, "name": "Стрижки и укладки", "servicesCount": 5},
    {"id": 2, "name": "Маникюр и педикюр", "servicesCount": 5},
    {"id": 3, "name": "Брови и ресницы", "servicesCount": 4},
    {"id": 4, "name": "Спа-процедуры", "servicesCount": 4},
)
router = APIRouter()


@router.get("/categories")
def list_categories():
    return CATEGORIES


@router.get("/categories/{category_id}")
def get_category(category_id: int):
    for category in CATEGORIES:
        if category["id"] == category_id:
            return category
    raise HTTPException(status_code=404, detail="Category not found")


app = FastAPI(title="Категории услуг")
app.include_router(router)
