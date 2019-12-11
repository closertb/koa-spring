import "reflect-metadata";
import { createKoaServer, useContainer, Action } from "routing-controllers";
import { Container } from "typedi";
import { ResponseMiddleWare, LogMiddleWare, AuthCheckMiddleWare, ErrorHandleInterceptor } from "./middlewares";
import sequelize from './config/db';
import Rule from './services/rule/model';


/**
 * Setup routing-controllers to use typedi container.
 */
useContainer(Container);

/**
 * We create a new koa server instance.
 * We could have also use useKoaServer here to attach controllers to an existing koa instance.
 */ 
const koaApp = createKoaServer({
    /**
     * We can add options about how routing-controllers should configure itself.
     * Here we specify what controllers should be registered in our express server.
     */
    cors: true,
    controllers: [__dirname+'/services/*/controller.js'],
    validation: true,
    defaultErrorHandler: false, // AuthCheckMiddleWare,
    middlewares: [ResponseMiddleWare, ErrorHandleInterceptor],
    // interceptors: []
});

sequelize.addModels([__dirname+'/services/*/model.js']);
/**  
 * Start the koa app.
 */
// koaApp.use(cors());
koaApp.on('error', (err: any, ctx: any) => {
    // console.log('err', err, ctx);
    const { errors, message } = err;
    ctx.status = 400;
    ctx.body = {
        errors,
        message: '请求错误'
    }
});
koaApp.listen(3000);

console.log("Server is up and running at port 3000");