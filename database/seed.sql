-- ============================================================
-- Spire Infotech — MySQL Seed Data
-- Run AFTER schema.sql
-- ============================================================

USE spire;

-- ============================================================
-- USERS (passwords are BCrypt hashed)
-- admin123    → $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
-- password123 → $2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG
-- student123  → $2a$10$EqKcp1WFKAr4GKZQ8lKhBOBbxPD8/JCdomxCzBq8WEYe3VGKmMJWe
-- ============================================================

INSERT INTO users (email, password_hash, full_name, role_id) VALUES
('admin@spire.dev', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Spire Admin', 3);

INSERT INTO users (email, password_hash, full_name, bio, role_id) VALUES
('student@spire.dev', '$2a$10$EqKcp1WFKAr4GKZQ8lKhBOBbxPD8/JCdomxCzBq8WEYe3VGKmMJWe', 'Abhishek Student', 'A passionate learner exploring new skills on Spire.', 1);

INSERT INTO users (email, password_hash, full_name, bio, role_id) VALUES
('arjun@spire.dev', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Arjun Mehta', 'Senior Full-Stack Developer with 10+ years experience.', 2),
('priya@spire.dev', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Priya Sharma', 'Data Scientist and ML engineer.', 2),
('rahul@spire.dev', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Rahul Kapoor', 'Mobile and cloud architect. Google Developer Expert.', 2);

-- ============================================================
-- COURSES (instructor_id: 3=Arjun, 4=Priya, 5=Rahul)
-- ============================================================

INSERT INTO courses (title, slug, description, short_description, instructor_id, category, level, price, is_free, duration_hours, lessons_count, enrolled_count, rating, ratings_count, tags, is_published) VALUES
('Full-Stack Web Development', 'full-stack-web-development', 'Master modern web development from frontend to backend.', 'Build complete web apps from scratch', 3, 'Web Development', 'INTERMEDIATE', 0.00, TRUE, 42.5, 5, 12450, 4.80, 3241, 'html,css,javascript,react,nodejs', TRUE),
('React Mastery', 'react-mastery', 'Advanced React patterns, hooks, state management, and performance optimization.', 'Advanced React patterns and best practices', 3, 'Frontend', 'ADVANCED', 499.00, FALSE, 28.0, 5, 8320, 4.90, 2150, 'react,hooks,redux,nextjs,typescript', TRUE),
('Python for Data Science', 'python-for-data-science', 'Learn Python, NumPy, Pandas, Matplotlib, and scikit-learn.', 'Data analysis and ML with Python', 4, 'Data Science', 'BEGINNER', 0.00, TRUE, 35.0, 4, 15600, 4.70, 4520, 'python,numpy,pandas,matplotlib,ml', TRUE),
('Cloud Architecture with AWS', 'cloud-architecture-with-aws', 'Design and deploy scalable cloud solutions using AWS.', 'Build scalable cloud solutions on AWS', 5, 'Cloud', 'ADVANCED', 499.00, FALSE, 32.0, 5, 6780, 4.60, 1890, 'aws,ec2,s3,lambda,dynamodb', TRUE),
('UI/UX Design Fundamentals', 'ui-ux-design-fundamentals', 'Learn the principles of UI and UX design.', 'Design beautiful and usable interfaces', 4, 'Design', 'BEGINNER', 499.00, FALSE, 20.0, 4, 9200, 4.80, 2680, 'figma,ui,ux,wireframing,prototyping', TRUE),
('Mobile App Development with React Native', 'mobile-app-development-with-react-native', 'Build cross-platform mobile apps with React Native.', 'Cross-platform mobile apps', 5, 'Mobile', 'INTERMEDIATE', 499.00, FALSE, 30.0, 5, 7450, 4.70, 1960, 'react-native,mobile,ios,android', TRUE);

-- ============================================================
-- LESSONS (5 per course, first lesson is free)
-- ============================================================

INSERT INTO lessons (course_id, title, description, order_index, duration_minutes, is_free) VALUES
(1, 'Introduction to Web Development', 'Overview of modern web development.', 1, 45, TRUE),
(1, 'HTML & CSS Fundamentals', 'Building blocks of the web.', 2, 60, FALSE),
(1, 'JavaScript Deep Dive', 'Core JavaScript concepts.', 3, 90, FALSE),
(1, 'React Fundamentals', 'Building UIs with React.', 4, 75, FALSE),
(1, 'Backend with Node.js & Express', 'Server-side development.', 5, 80, FALSE),
(2, 'React Architecture Overview', 'Project structure and patterns.', 1, 40, TRUE),
(2, 'Advanced Hooks Patterns', 'Custom hooks and composition.', 2, 65, FALSE),
(2, 'State Management with Zustand & Redux', 'When and how to manage state.', 3, 70, FALSE),
(2, 'Testing React Applications', 'Unit and integration testing.', 4, 55, FALSE),
(2, 'Performance Optimization', 'Profiling and optimizing React.', 5, 60, FALSE),
(3, 'Python Basics for Data Science', 'Python fundamentals for data work.', 1, 50, TRUE),
(3, 'NumPy & Array Operations', 'Numerical computing with NumPy.', 2, 60, FALSE),
(3, 'Data Wrangling with Pandas', 'Data manipulation and cleaning.', 3, 75, FALSE),
(3, 'Data Visualization', 'Charts and plots with Matplotlib.', 4, 55, FALSE),
(4, 'AWS Fundamentals & IAM', 'Getting started with AWS.', 1, 45, TRUE),
(4, 'Compute: EC2, Lambda, ECS', 'Running workloads on AWS.', 2, 70, FALSE),
(4, 'Storage & Databases', 'S3, RDS, and DynamoDB.', 3, 65, FALSE),
(4, 'Networking & Security', 'VPC, security groups, and more.', 4, 60, FALSE),
(4, 'Deploying a Production App', 'End-to-end deployment.', 5, 75, FALSE),
(5, 'Introduction to UI/UX', 'What is UI/UX design?', 1, 35, TRUE),
(5, 'Design Principles & Color Theory', 'Foundations of good design.', 2, 50, FALSE),
(5, 'Wireframing & Prototyping', 'From idea to prototype.', 3, 60, FALSE),
(5, 'User Research & Testing', 'Validating your designs.', 4, 45, FALSE),
(6, 'Getting Started with React Native', 'Setup and first app.', 1, 40, TRUE),
(6, 'Core Components & Navigation', 'Building mobile UIs.', 2, 65, FALSE),
(6, 'State Management & APIs', 'Connecting to backends.', 3, 70, FALSE),
(6, 'Native Modules & Device Features', 'Camera, GPS, storage.', 4, 55, FALSE),
(6, 'Publishing to App Stores', 'iOS and Android deployment.', 5, 45, FALSE);

-- ============================================================
-- ACHIEVEMENTS
-- ============================================================

INSERT INTO achievements (user_id, badge_name, badge_icon) VALUES
(1, 'Platform Pioneer', 'trophy'),
(1, 'Admin Access', 'shield');
