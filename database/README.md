# Spire Database Setup (Supabase)

## Prerequisites

- A [Supabase](https://supabase.com) account

## Setup Steps

### 1. Create a Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com) and sign in.
2. Click **New Project**, choose an organization, and fill in:
   - **Name:** `spire`
   - **Database Password:** choose a strong password (save it)
   - **Region:** pick the one closest to your users
3. Wait for the project to finish provisioning.

### 2. Run the Schema

1. In your Supabase dashboard, go to **SQL Editor**.
2. Click **New Query**.
3. Paste the contents of `backend/src/main/resources/schema.sql` and click **Run**.
4. Verify the tables appear under **Table Editor**.

### 3. Load Seed Data

1. Open another **New Query** in the SQL Editor.
2. Paste the contents of `backend/src/main/resources/seed.sql` and click **Run**.
3. Verify data exists by browsing the `users` and `courses` tables.

### 4. Connect the Backend

1. In Supabase, go to **Settings > Database** and copy the **Connection string** (URI format).
2. Update `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://<host>:5432/postgres
spring.datasource.username=postgres
spring.datasource.password=<your-database-password>
```

Alternatively, use the pooled connection string for production workloads.

### 5. Enable Row Level Security (Recommended)

Run the following in the SQL Editor to enable RLS on all tables:

```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
```

Then create policies based on your access requirements. Example policies:

```sql
-- Anyone can read published courses
CREATE POLICY "Public can view published courses"
  ON courses FOR SELECT
  USING (is_published = true);

-- Users can read their own enrollments
CREATE POLICY "Users can view own enrollments"
  ON enrollments FOR SELECT
  USING (auth.uid() = user_id);

-- Users can read their own progress
CREATE POLICY "Users can view own progress"
  ON progress FOR SELECT
  USING (auth.uid() = user_id);
```

## Demo Accounts

| Role       | Email             | Password    |
|------------|-------------------|-------------|
| Admin      | admin@spire.dev   | admin123    |
| Instructor | arjun@spire.dev   | password123 |
| Instructor | priya@spire.dev   | password123 |
| Instructor | rahul@spire.dev   | password123 |
