# backend/Dockerfile
FROM python:3.11-slim-bullseye
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
WORKDIR /usr/src/app
COPY requirements.txt /usr/src/app/
RUN pip install --timeout=100 -r requirements.txt
COPY . /usr/src/app/

CMD ["sh", "start.sh"]
