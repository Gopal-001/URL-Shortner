# URL Shortener

A modern, full-stack URL shortener application.

## Tech Stack

- **Backend:** Python (FastAPI)
- **Frontend:** React (Vite) + Chakra UI + TanStack Query
- **Storage:** Elasticsearch

---

## Features

- Shorten long URLs to compact, shareable links
- Redirect from short URL to original URL
- Analytics for URL visits (optional)
- Modern, responsive UI
- Scalable and fast search using Elasticsearch

---

## Project Structure

```
URL-Shortner/
├── backend/         # FastAPI app (Python)
├── frontend/        # React app (Vite + Chakra UI)
├── README.md
└── ...
```

---

## Getting Started

### Prerequisites
- Python 3.9+
- Node.js 18+
- Elasticsearch 8.x (local or remote)

### 1. Backend Setup (FastAPI)

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### 2. Frontend Setup (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

### 3. Elasticsearch
- Make sure Elasticsearch is running and accessible by the backend.
- Default URL: `http://localhost:9200`

---

## API Endpoints (Sample)

- `POST /shorten` - Shorten a long URL
- `GET /{short_code}` - Redirect to original URL
- `GET /analytics/{short_code}` - (Optional) Get analytics for a short URL

---

## Configuration

- Backend config: `backend/config.py` or `.env`
- Frontend config: `frontend/.env`

---

## Screenshots

_Add screenshots of the UI here._

---

## Credits
- [FastAPI](https://fastapi.tiangolo.com/)
- [Chakra UI](https://chakra-ui.com/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Elasticsearch](https://www.elastic.co/elasticsearch/)

---

## TODO
- [ ] Add authentication
- [ ] Add analytics dashboard
- [ ] Dockerize backend & frontend
- [ ] Deployment guide