# 설명

북스토어 서버 어플리케이션

스키마 : [ERD_CLOUD_LINK]('https://www.erdcloud.com/d/MFdNykTpcGG3X29ZN')

스웨거 : [http://localhost:3001/doc]('http://localhost:3001/doc')
(서버를 실행해야 볼 수 있습니다.)

# 설치

```bash
$ npm install
```

# 환경변수

프로젝트 루트 경로에 .env 파일 추가

```bash
PORT=3001
DATABASE_HOST=localhost
DATABASE_PORT=5434
DATABASE_USER=postgres
DATABASE_PASSWORD=fanddle
DATABASE_NAME=cmazon
DATABASE_SCHEMA=public
DATABASE_SYNCHRONIZE=true

JWT_SECRET=74YLbq4%c!wU
JWT_EXPIRATION_TIME=86400

JWT_REFRESH_TOKEN_SECRET=7jML9q4-c!s0
JWT_REFRESH_TOKEN_EXPIRATION_TIME=172800

REDIS_HOST=localhost
REDIS_PORT=6380

#DB
POSTGRES_USER=postgres
POSTGRES_PASSWORD=fanddle
POSTGRES_DB=cmazon

#URL PORT에 맞게 바꿔주세요
BASE_URL = http://localhost:3001
```

# 도커 실행

PostgreSQL, Redis Docker 환경

```bash
# 실행
$ docker-compose up -d
# 종료
$ docker-compose down
```

# 서버 실행

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```
