import "reflect-metadata";
import { createKoaServer, useContainer, Action } from "routing-controllers";
import { Container } from "typedi";
import { ResponseMiddleWare, LogMiddleWare, AuthCheckMiddleWare, ErrorHandleInterceptor } from "./middlewares";
import sequelize from './config/db';


/**
 * Setup routing-controllers to use typedi container.
 */
useContainer(Container);

export default function() {
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
        controllers: [__dirname + '/services/*/controller.js'],
        validation: true,  
        defaultErrorHandler: false,
        middlewares: [ResponseMiddleWare, AuthCheckMiddleWare, ErrorHandleInterceptor],
        // interceptors: []
    });

    // [Models]
    sequelize.addModels([__dirname + '/services/*/model.js']);
    koaApp.listen(4001, () => {
        console.log(`当前服务器已经启动,请访问`,`http://127.0.0.1:4001`);
    });
    return koaApp;
}