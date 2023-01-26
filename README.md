# 설명

북스토어 서버 어플리케이션

스키마 : [ERD_CLOUD_LINK](https://www.erdcloud.com/d/MFdNykTpcGG3X29ZN)

스웨거 : [http://localhost:3001/doc](http://localhost:3001/doc)
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

# test 시나리오 테스트
$ npm run test:e2e
```

# 시나리오 테스트

- 시나리오 테스트만 만들어 봤습니다. 성공하는 테스트만 작성했습니다.(Green)
- 테스트를 한번 실행한 후에 다시 실행하게되면 유저 정보가 DB에 남기 때문에 유저생성 부분이 실패합니다.

1. 유저생성
   - 구매자 유저 생성
   - 판매자 유저 생성
2. 판매자 로그인
3. 판매자 토큰 재발급 테스트
4. 판매자 상품등록
   - 이미지 업로드
   - 상품등록
   - 재고 확인 (재고 : 100, 판매재고: 0)
5. 구매자 로그인
6. 구매자 주문(주문양 : 3)
7. 주문후 재고 재확인 (재고 : 100, 판매재고: 3)
8. 구매자 주문 확인
9. 구매자 주문 취소
10. 주문 취소 후 재고 확인 (재고 : 100, 판매재고: 0)
11. 판매자 로그아웃
12. 구매자 로그아웃
