# notes-app

Это веб приложение, которое использует fastapi на hypercorn для бэкенда и react на astro для фронтенда. Данные хранятся в postgresql.

Запущено [здесь](http://fupmgovno.servebeer.com:8080/)

## Установка

0. Установите python, nodejs и nginx.

1. Склонируйте репозиторий

2. Создайте файл .env и запишите в него поля `JWT_SECRET` и `DATABASE_URL`.

3. Установите зависимости из requirements.txt. (`pip install -r requirements.txt`)

4. Запустите сервер (`python start.py`). Будет открыт сервер бэкенда на порте 8000.

5. Перейдите в папку frontend.

6. Установите зависимости nodejs. (`npm install`)

7. Запустите сервер (`npm start`). Будет открыт сервер на порте 4321.

8. Добавьте в секцию http в nginx.conf сервер

```conf
server {
        listen 8080;
        location /api {
                proxy_pass http://localhost:8000;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection $connection_upgrade;
        }
        location / {
                proxy_pass http://localhost:4321;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection $connection_upgrade;
        }
}
```

Пример всего файла /etc/nginx/nginx.conf:

```conf
events{
        worker_connections 1024;
}


http {

map $http_upgrade $connection_upgrade {
	default upgrade;
	'' close;
}

upstream websocket {
    server localhost:4321;
}


server {
        listen 8080;
        location /api {
                proxy_pass http://localhost:8000;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection $connection_upgrade;
        }
        location / {
                proxy_pass http://localhost:4321;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection $connection_upgrade;
        }
}

}
```

9. Запустите nginx. (`sudo systemctl start nginx`). Если он уже запущен, то `sudo nginx -s reload`. Будет открыт сервер на порте 8080, на который нужно будет зайти.
