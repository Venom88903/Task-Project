📌 Task Project

A full-stack application built with:

Backend: Python (FastAPI/Flask) with Alembic & database integration

Frontend: React Native (Android + iOS)

DevOps: Docker & Docker Compose for easy deployment

Project Structure

TASK-PROJECT/
│── Backend/             
│   ├── app/             # Backend application
│   ├── alembic/         # DB migrations
│   ├── venv/            # Virtual environment (ignored in git)
│   ├── requirements.txt # Python dependencies
│   ├── Dockerfile       # Backend Dockerfile
│   └── wait-for-db.sh   # DB wait script
│
│── Frontend/            
│   ├── android/         # Android native
│   ├── ios/             # iOS native
│   ├── src/             # React Native source
│   ├── package.json     # Node dependencies
│   ├── tailwind.config.js
│   ├── metro.config.js
│   └── app.json
│
│── docker-compose.yml   # Compose config
│── APIJSONDOC.json      # API Documentation
│── README.md            # Project docs


⚙️ Setup Instructions

🔹 1. Backend Setup (without Docker)
cd Backend

# Create & activate virtual env
python3 -m venv venv
source venv/bin/activate   # Linux/macOS
venv\Scripts\activate      # Windows

# Install dependencies
pip install -r requirements.txt

# Run backend
uvicorn app.main:app --reload

🔹 2. Frontend Setup (without Docker)

cd Frontend

# Install dependencies
npm install
# or
yarn install

# Run on Android
npx react-native run-android

# Run on iOS
npx react-native run-ios


🔹 3. Run with Docker (Not required)
# From project root
docker-compose up --build

🛠️ Environment Variables

Backend/.env
DATABASE_URL=postgresql://user:password@db:5432/app
REDIS_URL=redis://redis:6379/0
SECRET_KEY=your_secret

use this value
## PostgreSQL connection URL — use 'db' as hostname (service name from docker-compose)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/taskproject

# JWT Secret Key — keep this secure #For use secret key get your device openssl rand -hex 32
SECRET_KEY=a7b0aa3c251efaa3c4bc6d9ee654bfe69bc31b94b94d20b332e58b0f18a5c8c7

# Algorithm used to sign the JWT tokens
ALGORITHM=HS256

# Token expiry time (in minutes)
ACCESS_TOKEN_EXPIRE_MINUTES=1440


Frontend/.env
API_URL=http://localhost:5000

📖 API Documentation

Swagger UI → http://localhost:5000/docs

JSON Spec → APIJSONDOC.json
