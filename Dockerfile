FROM node:20.9.0 AS node-build

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

RUN npm run build


FROM python:3.9-slim

WORKDIR /app

COPY --from=node-build /app/dist ./dist
COPY index.html .
COPY app.py .
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8080

CMD ["python", "app.py"]
