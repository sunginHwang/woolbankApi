import Koa, { Context } from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from 'koa-cors';
import routes from "./routes";
import "reflect-metadata";
import {createConnection} from "typeorm";
import errorHandler from "./ middleware/errorHandler";

createConnection().then(async connection => {
    const app = new Koa();

    app.use(cors());
    app.use(bodyParser());
    app.use(errorHandler);
    app.use(routes.routes()).use(routes.allowedMethods());

    app.listen(4000, () => {
        console.log('Listening to port 4000');
    });

})
