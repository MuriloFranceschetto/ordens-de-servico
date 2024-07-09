import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as supertest from 'supertest';

import { AppModule } from './app.module';

describe('AppController (e2e)', () => {

  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  }, 15000);

  it('/ (GET)', () => {
    return supertest(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it(`/api/users (GET)`, async () => {
    return supertest(app.getHttpServer())
      .get('/api/users?name=mur')
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });

});
