import { Middleware, KoaMiddlewareInterface } from "routing-controllers";

@Middleware({ type: "after" })
export default class ResponseMiddleWare implements KoaMiddlewareInterface {
    async use(ctx: any, next: any): Promise<any> {
      // console.log("ResponseMiddleWare before execution...");
      const { body, reqeust } = ctx;
      ctx.body = {
        content: body,
        code: 200,
        status: 'ok',
        messge: 'success'
      }
      await next();
      // console.log("ResponseMiddleWare after execution");
    }
}