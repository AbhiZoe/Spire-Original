import uuid
from datetime import datetime, timezone

from sqlalchemy import (
    Boolean, Column, DateTime, Float, ForeignKey, Integer, String, Text
)
from sqlalchemy.orm import relationship

from app.core.database import Base


def generate_uuid():
    return str(uuid.uuid4())


def utcnow():
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(String, default="student")
    avatar_url = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utcnow)
    updated_at = Column(DateTime, default=utcnow, onupdate=utcnow)


class Course(Base):
    __tablename__ = "courses"

    id = Column(String, primary_key=True, default=generate_uuid)
    title = Column(String, nullable=False)
    slug = Column(String, unique=True, nullable=False)
    description = Column(Text)
    short_description = Column(String)
    level = Column(String)
    price = Column(Float, default=0)
    is_free = Column(Boolean, default=True)
    duration_hours = Column(Float)
    thumbnail_url = Column(String, nullable=True)
    instructor_id = Column(String, ForeignKey("users.id"))
    category = Column(String)
    tags = Column(String)
    lessons_count = Column(Integer, default=0)
    enrolled_count = Column(Integer, default=0)
    rating = Column(Float, default=0)
    ratings_count = Column(Integer, default=0)
    is_published = Column(Boolean, default=False)
    created_at = Column(DateTime, default=utcnow)
    updated_at = Column(DateTime, default=utcnow, onupdate=utcnow)

    instructor = relationship("User", backref="courses")
    lessons = relationship("Lesson", back_populates="course", order_by="Lesson.order_index")


class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(String, primary_key=True, default=generate_uuid)
    course_id = Column(String, ForeignKey("courses.id"))
    title = Column(String, nullable=False)
    description = Column(Text)
    video_url = Column(String, nullable=True)
    order_index = Column(Integer)
    duration_minutes = Column(Integer)
    is_free = Column(Boolean, default=False)
    created_at = Column(DateTime, default=utcnow)
    updated_at = Column(DateTime, default=utcnow, onupdate=utcnow)

    course = relationship("Course", back_populates="lessons")


class Enrollment(Base):
    __tablename__ = "enrollments"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"))
    course_id = Column(String, ForeignKey("courses.id"))
    enrolled_at = Column(DateTime, default=utcnow)

    user = relationship("User", backref="enrollments")
    course = relationship("Course", backref="enrollments")


class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"))
    plan = Column(String, nullable=False)
    status = Column(String, default="active")
    payment_id = Column(String, nullable=True)
    expires_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=utcnow)


class Progress(Base):
    __tablename__ = "progress"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"))
    course_id = Column(String, ForeignKey("courses.id"))
    lesson_id = Column(String, ForeignKey("lessons.id"))
    completion_percent = Column(Integer, default=0)
    completed = Column(Boolean, default=False)
    streak_days = Column(Integer, default=0)
    last_accessed = Column(DateTime)


class Payment(Base):
    __tablename__ = "payments"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"))
    amount = Column(Float)
    status = Column(String, default="pending")
    razorpay_order_id = Column(String, nullable=True)
    razorpay_payment_id = Column(String, nullable=True)
    razorpay_signature = Column(String, nullable=True)
    created_at = Column(DateTime, default=utcnow)


class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"))
    badge_name = Column(String, nullable=False)
    badge_icon = Column(String)
    earned_at = Column(DateTime, default=utcnow)
