import re
from sqlalchemy.orm import Session
from app.core.security import hash_password
from app.models.models import User, Course, Lesson, Achievement


def slugify(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def seed_database(db: Session):
    if db.query(User).count() > 0:
        print("[Seed] Database already seeded, skipping.")
        return

    print("[Seed] Seeding database...")

    admin = User(email="admin@spire.dev", password_hash=hash_password("admin123"),
                 full_name="Spire Admin", role="admin")
    db.add(admin)

    # Student user for testing
    student = User(email="student@spire.dev", password_hash=hash_password("student123"),
                   full_name="Abhishek Student", role="student",
                   bio="A passionate learner exploring new skills on Spire.")
    db.add(student)

    arjun = User(email="arjun@spire.dev", password_hash=hash_password("password123"),
                 full_name="Arjun Mehta", role="instructor",
                 bio="Senior Full-Stack Developer with 10+ years of experience. Ex-Flipkart, ex-Razorpay.")
    priya = User(email="priya@spire.dev", password_hash=hash_password("password123"),
                 full_name="Priya Sharma", role="instructor",
                 bio="Data Scientist and ML engineer. Passionate about making complex topics accessible.")
    rahul = User(email="rahul@spire.dev", password_hash=hash_password("password123"),
                 full_name="Rahul Kapoor", role="instructor",
                 bio="Mobile and cloud architect. Google Developer Expert.")
    db.add_all([arjun, priya, rahul])
    db.flush()

    courses_data = [
        {"title": "Full-Stack Web Development", "short_description": "Build complete web apps from scratch",
         "description": "Master modern web development from frontend to backend.", "level": "Intermediate",
         "price": 0, "is_free": True, "duration_hours": 42.5, "instructor_id": arjun.id,
         "category": "Web Development", "tags": "html,css,javascript,react,nodejs",
         "rating": 4.8, "ratings_count": 3241, "enrolled_count": 12450,
         "lessons": [("Introduction to Web Development", 45, True), ("HTML & CSS Fundamentals", 60, False),
                     ("JavaScript Deep Dive", 90, False), ("React Fundamentals", 75, False),
                     ("Backend with Node.js & Express", 80, False)]},
        {"title": "React Mastery", "short_description": "Advanced React patterns and best practices",
         "description": "Advanced React patterns, hooks, state management, and performance optimization.", "level": "Advanced",
         "price": 499, "is_free": False, "duration_hours": 28, "instructor_id": arjun.id,
         "category": "Frontend", "tags": "react,hooks,redux,nextjs,typescript",
         "rating": 4.9, "ratings_count": 2150, "enrolled_count": 8320,
         "lessons": [("React Architecture Overview", 40, True), ("Advanced Hooks Patterns", 65, False),
                     ("State Management with Zustand & Redux", 70, False), ("Testing React Applications", 55, False),
                     ("Performance Optimization", 60, False)]},
        {"title": "Python for Data Science", "short_description": "Data analysis and ML with Python",
         "description": "Learn Python, NumPy, Pandas, Matplotlib, and scikit-learn.", "level": "Beginner",
         "price": 0, "is_free": True, "duration_hours": 35, "instructor_id": priya.id,
         "category": "Data Science", "tags": "python,numpy,pandas,matplotlib,ml",
         "rating": 4.7, "ratings_count": 4520, "enrolled_count": 15600,
         "lessons": [("Python Basics for Data Science", 50, True), ("NumPy & Array Operations", 60, False),
                     ("Data Wrangling with Pandas", 75, False), ("Data Visualization", 55, False)]},
        {"title": "Cloud Architecture with AWS", "short_description": "Build scalable cloud solutions on AWS",
         "description": "Design and deploy scalable cloud solutions using AWS services.", "level": "Advanced",
         "price": 499, "is_free": False, "duration_hours": 32, "instructor_id": rahul.id,
         "category": "Cloud", "tags": "aws,ec2,s3,lambda,dynamodb",
         "rating": 4.6, "ratings_count": 1890, "enrolled_count": 6780,
         "lessons": [("AWS Fundamentals & IAM", 45, True), ("Compute: EC2, Lambda, ECS", 70, False),
                     ("Storage & Databases", 65, False), ("Networking & Security", 60, False),
                     ("Deploying a Production App", 75, False)]},
        {"title": "UI/UX Design Fundamentals", "short_description": "Design beautiful and usable interfaces",
         "description": "Learn the principles of user interface and user experience design.", "level": "Beginner",
         "price": 499, "is_free": False, "duration_hours": 20, "instructor_id": priya.id,
         "category": "Design", "tags": "figma,ui,ux,wireframing,prototyping",
         "rating": 4.8, "ratings_count": 2680, "enrolled_count": 9200,
         "lessons": [("Introduction to UI/UX", 35, True), ("Design Principles & Color Theory", 50, False),
                     ("Wireframing & Prototyping", 60, False), ("User Research & Testing", 45, False)]},
        {"title": "Mobile App Development with React Native", "short_description": "Cross-platform mobile apps",
         "description": "Build cross-platform mobile applications using React Native.", "level": "Intermediate",
         "price": 499, "is_free": False, "duration_hours": 30, "instructor_id": rahul.id,
         "category": "Mobile", "tags": "react-native,mobile,ios,android",
         "rating": 4.7, "ratings_count": 1960, "enrolled_count": 7450,
         "lessons": [("Getting Started with React Native", 40, True), ("Core Components & Navigation", 65, False),
                     ("State Management & APIs", 70, False), ("Native Modules & Device Features", 55, False),
                     ("Publishing to App Stores", 45, False)]},
    ]

    for cdata in courses_data:
        lessons_list = cdata.pop("lessons")
        cdata["slug"] = slugify(cdata["title"])
        cdata["is_published"] = True
        cdata["lessons_count"] = len(lessons_list)
        course = Course(**cdata)
        db.add(course)
        db.flush()

        for idx, (title, duration, is_free) in enumerate(lessons_list):
            db.add(Lesson(course_id=course.id, title=title, order_index=idx + 1,
                          duration_minutes=duration, is_free=is_free,
                          description=f"Learn about {title}.",
                          video_url=f"/videos/{course.slug}/lesson-{idx+1}.mp4"))

    db.add_all([
        Achievement(user_id=admin.id, badge_name="Platform Pioneer", badge_icon="trophy"),
        Achievement(user_id=admin.id, badge_name="Admin Access", badge_icon="shield"),
    ])

    db.commit()
    print("[Seed] Database seeded successfully!")
