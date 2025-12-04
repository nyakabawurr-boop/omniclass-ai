# Database Setup Instructions

## PostgreSQL Setup Required

The application requires PostgreSQL to be running. Here's how to set it up:

### Option 1: Install PostgreSQL (Recommended)

1. **Download PostgreSQL**:
   - Go to: https://www.postgresql.org/download/windows/
   - Download the installer for Windows
   - Run the installer

2. **During Installation**:
   - Remember the password you set for the `postgres` user
   - Default port is 5432 (keep this)
   - Install all components

3. **Create the Database**:
   - Open **pgAdmin** (comes with PostgreSQL) or use **psql** command line
   - Connect to PostgreSQL server
   - Right-click "Databases" → "Create" → "Database"
   - Name: `omniclass_ai`
   - Click "Save"

   **OR use psql command line:**
   ```sql
   psql -U postgres
   CREATE DATABASE omniclass_ai;
   \q
   ```

4. **Update Backend .env**:
   - Open `backend/.env`
   - Update `DATABASE_URL` with your PostgreSQL password:
   ```
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/omniclass_ai?schema=public"
   ```

5. **Run Migrations**:
   ```powershell
   cd backend
   npm run prisma:migrate
   npm run prisma:seed
   ```

### Option 2: Use Docker (Alternative)

If you have Docker installed:

```powershell
docker run --name omniclass-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=omniclass_ai -p 5432:5432 -d postgres:14
```

Then update `backend/.env`:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/omniclass_ai?schema=public"
```

### Verify Database Connection

After setting up PostgreSQL, verify the connection:

```powershell
cd backend
npm run prisma:migrate
```

You should see:
```
✔ Applied migration
```

### Seed the Database

After migrations succeed, seed initial data:

```powershell
npm run prisma:seed
```

This creates:
- Founder/admin accounts (nyakabawurr@gmail.com, gzinyenya@gmail.com)
- Sample subjects for Ordinary and Advanced levels
- Default AI agent configurations

### Troubleshooting

**"Can't reach database server"**:
- Make sure PostgreSQL service is running
- Check Windows Services: `services.msc` → Look for "postgresql"
- Start the service if it's stopped

**"Authentication failed"**:
- Check the password in `DATABASE_URL` matches your PostgreSQL password
- Try resetting PostgreSQL password if needed

**"Database does not exist"**:
- Create the database: `CREATE DATABASE omniclass_ai;`
- Or let Prisma create it by adding `?schema=public` to DATABASE_URL

### After Database Setup

Once PostgreSQL is set up and migrations are run:

1. **Restart Backend Server**:
   ```powershell
   cd backend
   npm run dev
   ```

2. **Access the Application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

3. **Login as Founder**:
   - Email: `nyakabawurr@gmail.com` or `gzinyenya@gmail.com`
   - Password: `password123` (change in production!)

