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
import { scheduleRegularExpenditure } from './service/regularExpenditureService';


// 매일 자정 정기 예금 실행
cron.schedule('0 0 0 * * *', async function () {
    await scheduleRegularExpenditure();
});


createConnection().then(async () => {
    const app = new Koa();

    app.use(async (ctx, next) => {
        const allowedOrigins = ['https://bank.woolta.com', 'http://localhost:4200', 'http://localhost:4100'];
        const origin = ctx.request.get('Origin');
        console.log('origin', origin);
        if (allowedOrigins.includes(origin)) {
            ctx.set('Access-Control-Allow-Origin', origin);
        }
        ctx.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        ctx.set('Access-Control-Allow-Headers', 'Content-Type');
        ctx.set('Access-Control-Allow-Credentials', 'true');
        await next();
    });


    app.use((ctx, next) => {
        ctx.cookies.secure = true;
        return next();
    });
      //app.use(cors());
     app.use(cookie());

    app.use(bodyParser());
    app.use(errorHandler);
    app.use(serve('./src'));
    app.use(routes.routes()).use(routes.allowedMethods());

    app.listen(4000, () => {
        console.log('Listening to port 4000');
    });
});
