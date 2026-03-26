from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.models import User, Progress
from app.schemas.schemas import UserUpdate, ProgressUpdate, UserResponse

router = APIRouter(prefix="/api/user", tags=["user"])


@router.get("/profile")
def get_profile(current_user: User = Depends(get_current_user)):
    return UserResponse.model_validate(current_user)


@router.put("/profile")
def update_profile(
    payload: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(current_user, key, value)

    db.commit()
    db.refresh(current_user)
    return UserResponse.model_validate(current_user)


@router.get("/progress")
def get_progress(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    records = db.query(Progress).filter(Progress.user_id == current_user.id).all()
    return records


@router.put("/progress")
def upsert_progress(
    payload: ProgressUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    record = (
        db.query(Progress)
        .filter(
            Progress.user_id == current_user.id,
            Progress.lesson_id == payload.lesson_id,
        )
        .first()
    )

    if record:
        record.completed = payload.completed
        if payload.progress_percent is not None:
            record.progress_percent = payload.progress_percent
    else:
        record = Progress(
            user_id=current_user.id,
            lesson_id=payload.lesson_id,
            course_id=payload.course_id,
            completed=payload.completed,
            progress_percent=payload.progress_percent or 0,
        )
        db.add(record)

    db.commit()
    db.refresh(record)
    return record
