FROM python:3.9-slim

WORKDIR /app

COPY index.html .
COPY app.py .
COPY requirements.txt .

RUN test -d ./dist && cp -r ./dist . || echo "Dist folder not found, skipping copy."

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8080

CMD ["python", "app.py"]
