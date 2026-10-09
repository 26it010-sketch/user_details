
# Stage 1: Build React frontend
FROM node:22 AS frontend-build

WORKDIR /frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build


# Stage 2: Prepare FastAPI backend
FROM python:3.11-slim

WORKDIR /app

COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy Python backend files
COPY backend/ ./

# Copy React build into the backend container
COPY --from=frontend-build /frontend/dist ./dist

EXPOSE 9000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "9000"]