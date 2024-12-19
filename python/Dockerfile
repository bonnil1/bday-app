FROM python:3.13-slim

RUN apt-get update && apt-get install -y netcat-openbsd

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 4000

CMD ["sh", "-c", "while ! nc -z mysql 3306; do sleep 1; done; uvicorn main:app --host 0.0.0.0 --port 4000"]
