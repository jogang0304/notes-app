# notes-app

Это веб приложение, которое использует fastapi на uvicorn для бэкенда и react на astro для фронтенда.

## Установка

0. Установите python, nodejs и nginx.

1. Склонируйте репозиторий

2. Установите зависимости из requirements.txt. (`pip install -r requirements.txt`)

3. Запустите сервер (`python start.py`). Будет открыт сервер бэкенда на порте 8000.

4. Перейдите в папку frontend.

5. Установите зависимости nodejs. (`npm install`)

6. Запустите сервер (`npm start`). Будет открыт сервер на порте 4321.

7. Добавьте в секцию http в nginx.conf сервер

```conf
server {
	listen 8080;
	location /api {
		proxy_pass http://localhost:8000;
	}
	location / {
		proxy_pass http://localhost:4321;
	}
}
```

Пример всего файла /etc/nginx/nginx.conf:

```conf
events{
	worker_connections 1024;
}


http {

server {
	listen 8080;
	location /api {
		proxy_pass http://localhost:8000;
	}
	location / {
		proxy_pass http://localhost:4321;
	}
}

}
```

8. Запустите nginx. (`sudo systemctl start nginx`). Если он уже запущен, то `sudo nginx -s reload`. Будет открыт сервер на порте 8080, на который нужно будет зайти.
