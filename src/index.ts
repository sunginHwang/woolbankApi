import Koa, { Context } from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from 'koa-cors';
import routes from "./routes";
import "reflect-metadata";
import {createConnection} from "typeorm";

createConnection().then(async connection => {
    const app = new Koa();

    app.use(bodyParser());
    app.use(cors());
    app.use(routes.routes()).use(routes.allowedMethods());

    app.use((ctx: Context) => {
        ctx.body = 'hello, Jacob!';
    });
    app.listen(4000, () => {
        console.log('Listening to port 4000');
    });

})
