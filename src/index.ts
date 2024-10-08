import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from 'koa-cors';
import serve from 'koa-static';
import cookie from 'koa-cookie';
import 'reflect-metadata';
import cron from 'node-cron';
import { createConnection } from 'typeorm';
import errorHandler from './middleware/errorHandler';
import routes from './routes';
import config from './config/baseConfig';
import { scheduleRegularExpenditure } from './service/regularExpenditureService';

// 매일 자정 정기 예금 실행
cron.schedule('0 0 0 * * *', async function () {
    await scheduleRegularExpenditure();
});


createConnection().then(async () => {
    const app = new Koa();
    console.log(config.clientUrl);
    app.use(cors({
        origin: config.clientUrl,
        credentials: true, // 쿠키 공유를 위해 필요
      }));
    app.use((ctx, next) => {
        ctx.cookies.secure = true;
        return next();
    });
    app.use(cookie());
    app.use(bodyParser());
    app.use(errorHandler);
    app.use(serve('./src'));
    app.use(routes.routes()).use(routes.allowedMethods());

    app.listen(4000, () => {
        console.log('Listening to port 4000 and cors domain is ' + config.clientUrl);
    });
});
