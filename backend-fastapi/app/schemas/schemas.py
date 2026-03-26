from datetime import datetime
from typing import Any

from pydantic import BaseModel, EmailStr


# ── Auth ──────────────────────────────────────────────

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    avatar_url: str | None = None
    bio: str | None = None

    model_config = {"from_attributes": True}


class UserUpdate(BaseModel):
    full_name: str | None = None
    bio: str | None = None
    avatar_url: str | None = None


class AuthResponse(BaseModel):
    access_token: str
    refresh_token: str
    user: UserResponse


# ── Course ────────────────────────────────────────────

class CourseCreate(BaseModel):
    title: str
    description: str
    short_description: str
    level: str
    price: float = 0
    is_free: bool = True
    duration_hours: float = 0
    category: str = ""
    tags: str = ""


class CourseUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    short_description: str | None = None
    level: str | None = None
    price: float | None = None
    is_free: bool | None = None
    duration_hours: float | None = None
    category: str | None = None
    tags: str | None = None
    is_published: bool | None = None


class CourseResponse(BaseModel):
    id: str
    title: str
    slug: str
    description: str | None = None
    short_description: str | None = None
    level: str | None = None
    price: float
    is_free: bool
    duration_hours: float | None = None
    thumbnail_url: str | None = None
    instructor_id: str | None = None
    category: str | None = None
    tags: str | None = None
    lessons_count: int
    enrolled_count: int
    rating: float
    ratings_count: int
    is_published: bool
    created_at: datetime | None = None
    updated_at: datetime | None = None
    instructor: UserResponse | None = None

    model_config = {"from_attributes": True}


# ── Lesson ────────────────────────────────────────────

class LessonResponse(BaseModel):
    id: str
    course_id: str
    title: str
    description: str | None = None
    order_index: int
    duration_minutes: int | None = None
    is_free: bool
    video_url: str | None = None

    model_config = {"from_attributes": True}


# ── Progress ──────────────────────────────────────────

class ProgressUpdate(BaseModel):
    lesson_id: str
    completion_percent: int
    completed: bool


class ProgressResponse(BaseModel):
    id: str
    user_id: str
    course_id: str
    lesson_id: str
    completion_percent: int
    completed: bool
    streak_days: int
    last_accessed: datetime | None = None

    model_config = {"from_attributes": True}


# ── Subscription ──────────────────────────────────────

class SubscriptionCreate(BaseModel):
    plan: str


class SubscriptionResponse(BaseModel):
    id: str
    user_id: str
    plan: str
    status: str
    payment_id: str | None = None
    expires_at: datetime | None = None
    created_at: datetime | None = None

    model_config = {"from_attributes": True}


# ── Payment ───────────────────────────────────────────

class PaymentVerify(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


# ── Generic ───────────────────────────────────────────

class ApiResponse(BaseModel):
    success: bool
    message: str = ""
    data: Any = None
