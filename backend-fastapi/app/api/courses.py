from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.core.database import get_db
from app.core.security import get_admin_user
from app.models.models import User, Course, Lesson
from app.schemas.schemas import CourseCreate, CourseUpdate, CourseResponse, LessonResponse

router = APIRouter(prefix="/api/courses", tags=["courses"])


@router.get("/")
def list_courses(
    level: Optional[str] = None,
    search: Optional[str] = None,
    category: Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = db.query(Course).options(joinedload(Course.instructor)).filter(Course.is_published == True)

    if level:
        query = query.filter(Course.level == level)
    if search:
        query = query.filter(Course.title.ilike(f"%{search}%"))
    if category:
        query = query.filter(Course.category == category)

    courses = query.all()
    return {"success": True, "data": [CourseResponse.model_validate(c) for c in courses]}


@router.get("/{course_id}")
def get_course(course_id: str, db: Session = Depends(get_db)):
    course = (
        db.query(Course)
        .options(joinedload(Course.instructor), joinedload(Course.lessons))
        .filter(Course.id == course_id)
        .first()
    )
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    course_data = CourseResponse.model_validate(course).model_dump()
    course_data["lessons"] = sorted(
        [LessonResponse.model_validate(l).model_dump() for l in course.lessons],
        key=lambda x: x["order_index"]
    )
    return {"success": True, "data": course_data}


@router.post("/")
def create_course(
    payload: CourseCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
):
    import re
    slug = re.sub(r"[^a-z0-9]+", "-", payload.title.lower()).strip("-")
    course = Course(**payload.model_dump(), slug=slug, is_published=True)
    db.add(course)
    db.commit()
    db.refresh(course)
    return {"success": True, "data": CourseResponse.model_validate(course)}


@router.put("/{course_id}")
def update_course(
    course_id: str,
    payload: CourseUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(course, key, value)

    db.commit()
    db.refresh(course)
    return {"success": True, "data": CourseResponse.model_validate(course)}


@router.delete("/{course_id}")
def delete_course(
    course_id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    db.delete(course)
    db.commit()
    return {"success": True, "message": "Course deleted"}
