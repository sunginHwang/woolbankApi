import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from 'koa-cors';
import serve from 'koa-static';
import 'reflect-metadata';
import cron from 'node-cron';
import { createConnection } from 'typeorm';
import errorHandler from './middleware/errorHandler';
import routes from './routes';
import { scheduleRegularExpenditure } from './service/regularExpenditureService';


// 매일 자정 정기 예금 실행
cron.schedule('0 0 0 * *', async function () {
    await scheduleRegularExpenditure();
});

createConnection().then(async (connection) => {
    const app = new Koa();

    app.use(cors());
    app.use(bodyParser());
    app.use(errorHandler);
    app.use(serve('./src'));
    app.use(routes.routes()).use(routes.allowedMethods());

    app.listen(4000, () => {
        console.log('Listening to port 4000');
    });
});
