import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from 'src/app.module';
import cookieParser from 'cookie-parser';
import path from 'path';

describe('시나리오 테스트', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    await app.init();
  });

  const customer = { email: 'customer@gmail.com', password: 'asd1!' };

  const seller = { email: 'seller@gmail.com', password: 'asd1!' };

  describe('유저생성', () => {
    it('테스트 유저 생성 (customer)', () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          ...customer,
          name: '테스트고객',
          zipCode: '18322',
          address: '서울',
          role: 0,
        })
        .expect(201);
    });

    it('테스트 유저 생성 (seller)', () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          ...seller,
          name: '테스트판매자',
          zipCode: '18322',
          address: '서울',
          role: 1,
        })
        .expect(201);
    });
  });

  let sellerAuthCookie = '';
  let sellerRefreshCookie = '';

  describe('판매자 로그인', () => {
    it('로그인', async () => {
      const result = await request(app.getHttpServer())
        .post('/auth/login')
        .send(seller)
        .expect(201);

      const cookies = result.headers['set-cookie'];

      sellerAuthCookie = cookies[0];
      sellerRefreshCookie = cookies[1];
    });
  });

  describe('판매자 토큰 재발급 테스트', () => {
    it('토큰재발급', async () => {
      await request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Cookie', [sellerAuthCookie, sellerRefreshCookie])
        .expect(201);
    });
  });

  let productId = 0;
  describe('상품 등록', () => {
    let coverImageId = 0;
    it('이미지 업로드', async () => {
      const result = await request(app.getHttpServer())
        .post('/book/cover')
        .set('Cookie', [sellerAuthCookie])
        .attach('image', path.join(__dirname, 'test-cover-image.jpeg'), {
          filename: 'test-cover-image.jpeg',
          contentType: 'multipart/form-data',
        })
        .expect(201);

      expect('test-cover-image.jpeg').toEqual(result.body.filename);
      coverImageId = result.body.id;
    });

    it('상품등록', async () => {
      const createBookDto = {
        authorName: '태스트작가',
        bookName: '태스트책',
        bookDescription: '태스트내용',
        coverImageId: coverImageId,
        stock: 100,
        price: 10,
      };
      const result = await request(app.getHttpServer())
        .post('/product')
        .set('Cookie', sellerAuthCookie)
        .send(createBookDto)
        .expect(201);

      productId = result.body.id;
    });

    it('재고 확인', async () => {
      const result = await request(app.getHttpServer())
        .get(`/product/${productId}/inventory`)
        .set('Cookie', sellerAuthCookie)
        .expect(200);

      expect(result.body.stock).toEqual(100);
      console.log('Stock', result.body.selledStock);
    });
  });

  let customerAuthCookie = '';
  let customerRefreshCookie = '';

  describe('구매자 로그인', () => {
    it('로그인', async () => {
      const result = await request(app.getHttpServer())
        .post('/auth/login')
        .send(customer)
        .expect(201);

      const cookies = result.headers['set-cookie'];

      customerAuthCookie = cookies[0];
      customerRefreshCookie = cookies[1];
    });
  });

  let orderId = 0;

  describe('구매자 주문', () => {
    it('주문', async () => {
      const addOrderDto = {
        orderCount: 3,
        productId: productId,
      };
      const result = await request(app.getHttpServer())
        .post('/order')
        .set('Cookie', customerAuthCookie)
        .send(addOrderDto)
        .expect(201);

      orderId = result.body.id;
    });
  });

  describe('주문후 재고 재확인', () => {
    it('재고 확인', async () => {
      const result = await request(app.getHttpServer())
        .get(`/product/${productId}/inventory`)
        .set('Cookie', sellerAuthCookie)
        .expect(200);

      expect(result.body.selledStock).not.toEqual(0);
      console.log('Selled Stock', result.body.selledStock);
    });
  });

  describe('구매자 주문 확인', () => {
    it('주문 목록', async () => {
      const result = await request(app.getHttpServer())
        .get('/order/list')
        .set('Cookie', customerAuthCookie)
        .expect(200);

      expect(result.body[0].id).toEqual(orderId);
      expect(result.body[0].orderState).toEqual(0);
    });
  });

  describe('구매자 주문 취소', () => {
    it('주문 취소', async () => {
      const result = await request(app.getHttpServer())
        .patch(`/order/${orderId}/cancel`)
        .set('Cookie', customerAuthCookie)
        .expect(200);

      expect(result.body.orderState).toEqual(1);
    });
  });

  describe('주문 취소 후 재고 확인', () => {
    it('재고 확인', async () => {
      const result = await request(app.getHttpServer())
        .get(`/product/${productId}/inventory`)
        .set('Cookie', sellerAuthCookie)
        .expect(200);

      expect(result.body.selledStock).toEqual(0);
      console.log('Selled Stock', result.body.selledStock);
    });
  });

  describe('판매자 로그아웃 테스트', () => {
    it('로그아웃', async () => {
      await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Cookie', [sellerAuthCookie])
        .expect(201);
    });
  });

  describe('구매자 로그아웃 테스트', () => {
    it('로그아웃', async () => {
      await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Cookie', [customerAuthCookie])
        .expect(201);
    });
  });
});
