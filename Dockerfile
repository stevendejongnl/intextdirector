FROM node:20.9.0 AS node-build

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

ARG INTERNAL_CHECK_URL
ENV INTERNAL_CHECK_URL=${INTERNAL_CHECK_URL}

COPY . .

RUN sed '/const INTERNAL_CHECK_URL/d' /app/src/main.ts > /app/src/main.tmp && \
    mv /app/src/main.tmp /app/src/main.ts && \
    echo "const INTERNAL_CHECK_URL = '${INTERNAL_CHECK_URL}';" > /app/src/env.ts && \
    cat /app/src/main.ts >> /app/src/env.ts && \
    mv /app/src/env.ts /app/src/main.ts

RUN npm run build


FROM python:3.12-slim

WORKDIR /app

COPY --from=node-build /app/dist ./dist
COPY index.html .
COPY app.py .
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8080

CMD ["python", "app.py"]
