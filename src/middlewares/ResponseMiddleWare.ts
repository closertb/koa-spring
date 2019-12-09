import { Middleware, KoaMiddlewareInterface } from "routing-controllers";

@Middleware({ type: "after" })
export default class ResponseMiddleWare implements KoaMiddlewareInterface {
    async use(ctx: any, next: any): Promise<any> {
      // console.log("ResponseMiddleWare before execution...");
      try {
        const { body, reqeust } = ctx;
        ctx.body = body.status ? body : {
          content: body,
          code: 200,
          status: 'ok',
          messge: 'success'
        }
        await next();
      } catch (error) {
          const { errors, message } = error;
          // console.log('error', errors, message);
          ctx.status = 400;
          ctx.body = {
              errors,
              message,
              status: 'fail',
              code: 1001
          }
          // throw error;
      }
      // console.log("ResponseMiddleWare after execution");
    }
}