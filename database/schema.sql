-- ============================================================
-- Spire — MySQL Database Schema
-- Run this on your MySQL instance before starting Spring Boot
-- ============================================================

CREATE DATABASE IF NOT EXISTS spire CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE spire;

-- ============================================================
-- 1. ROLES (lookup table)
-- ============================================================

CREATE TABLE roles (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(20) NOT NULL UNIQUE,        -- STUDENT, INSTRUCTOR, ADMIN
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO roles (name) VALUES ('STUDENT'), ('INSTRUCTOR'), ('ADMIN');

-- ============================================================
-- 2. USERS
-- ============================================================

CREATE TABLE users (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    full_name       VARCHAR(100) NOT NULL,
    avatar_url      VARCHAR(500)  DEFAULT NULL,
    bio             TEXT          DEFAULT NULL,
    role_id         BIGINT        NOT NULL DEFAULT 1,   -- FK → roles (1=STUDENT)
    is_active       BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(id)
) ENGINE=InnoDB;

CREATE INDEX idx_users_email   ON users(email);
CREATE INDEX idx_users_role_id ON users(role_id);

-- ============================================================
-- 3. COURSES
-- ============================================================

CREATE TABLE courses (
    id                BIGINT AUTO_INCREMENT PRIMARY KEY,
    title             VARCHAR(200)  NOT NULL,
    slug              VARCHAR(250)  NOT NULL UNIQUE,
    description       TEXT,
    short_description VARCHAR(500),
    thumbnail_url     VARCHAR(500)  DEFAULT NULL,
    instructor_id     BIGINT        NOT NULL,             -- FK → users
    category          VARCHAR(100),
    level             ENUM('BEGINNER','INTERMEDIATE','ADVANCED') NOT NULL DEFAULT 'BEGINNER',
    price             DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    is_free           BOOLEAN       NOT NULL DEFAULT TRUE,
    duration_hours    DECIMAL(5,1)  DEFAULT 0.0,
    lessons_count     INT           DEFAULT 0,
    enrolled_count    INT           DEFAULT 0,
    rating            DECIMAL(3,2)  DEFAULT 0.00,
    ratings_count     INT           DEFAULT 0,
    tags              VARCHAR(500)  DEFAULT NULL,          -- comma-separated
    is_published      BOOLEAN       NOT NULL DEFAULT FALSE,
    created_at        TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_courses_instructor FOREIGN KEY (instructor_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE INDEX idx_courses_slug          ON courses(slug);
CREATE INDEX idx_courses_instructor_id ON courses(instructor_id);
CREATE INDEX idx_courses_category      ON courses(category);
CREATE INDEX idx_courses_level         ON courses(level);
CREATE INDEX idx_courses_is_published  ON courses(is_published);

-- ============================================================
-- 4. LESSONS
-- ============================================================

CREATE TABLE lessons (
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    course_id        BIGINT        NOT NULL,
    title            VARCHAR(200)  NOT NULL,
    description      TEXT,
    video_url        VARCHAR(500)  DEFAULT NULL,
    order_index      INT           NOT NULL DEFAULT 0,
    duration_minutes INT           DEFAULT 0,
    is_free          BOOLEAN       NOT NULL DEFAULT FALSE,
    created_at       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_lessons_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_lessons_course_id ON lessons(course_id);

-- ============================================================
-- 5. ENROLLMENTS (user enrolls in course)
-- ============================================================

CREATE TABLE enrollments (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT    NOT NULL,
    course_id   BIGINT    NOT NULL,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_enrollments_user   FOREIGN KEY (user_id)   REFERENCES users(id)   ON DELETE CASCADE,
    CONSTRAINT fk_enrollments_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    CONSTRAINT uq_enrollment         UNIQUE (user_id, course_id)
) ENGINE=InnoDB;

CREATE INDEX idx_enrollments_user_id   ON enrollments(user_id);
CREATE INDEX idx_enrollments_course_id ON enrollments(course_id);

-- ============================================================
-- 7. PAYMENTS (Razorpay transactions)
-- ============================================================

CREATE TABLE payments (
    id                   BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id              BIGINT        NOT NULL,
    amount               DECIMAL(10,2) NOT NULL,
    currency             VARCHAR(3)    NOT NULL DEFAULT 'INR',
    status               ENUM('PENDING','COMPLETED','FAILED','REFUNDED') NOT NULL DEFAULT 'PENDING',
    razorpay_order_id    VARCHAR(100)  DEFAULT NULL,
    razorpay_payment_id  VARCHAR(100)  DEFAULT NULL,
    razorpay_signature   VARCHAR(255)  DEFAULT NULL,
    description          VARCHAR(255)  DEFAULT NULL,
    created_at           TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_payments_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_payments_user_id          ON payments(user_id);
CREATE INDEX idx_payments_status           ON payments(status);
CREATE INDEX idx_payments_razorpay_order   ON payments(razorpay_order_id);

-- ============================================================
-- 8. PROGRESS (per-lesson tracking)
-- ============================================================

CREATE TABLE progress (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id             BIGINT    NOT NULL,
    course_id           BIGINT    NOT NULL,
    lesson_id           BIGINT    NOT NULL,
    completion_percent  INT       NOT NULL DEFAULT 0,
    completed           BOOLEAN   NOT NULL DEFAULT FALSE,
    video_position_sec  INT       DEFAULT 0,              -- resume-where-left-off
    last_accessed       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_progress_user   FOREIGN KEY (user_id)   REFERENCES users(id)   ON DELETE CASCADE,
    CONSTRAINT fk_progress_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    CONSTRAINT fk_progress_lesson FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
    CONSTRAINT uq_progress        UNIQUE (user_id, lesson_id)
) ENGINE=InnoDB;

CREATE INDEX idx_progress_user_id   ON progress(user_id);
CREATE INDEX idx_progress_course_id ON progress(course_id);

-- ============================================================
-- 9. ACHIEVEMENTS (gamification badges)
-- ============================================================

CREATE TABLE achievements (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id    BIGINT       NOT NULL,
    badge_name VARCHAR(100) NOT NULL,
    badge_icon VARCHAR(50)  DEFAULT NULL,
    earned_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_achievements_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_achievements_user_id ON achievements(user_id);
