import { Middleware, KoaMiddlewareInterface, BadRequestError } from "routing-controllers";

class BadError extends BadRequestError {
    public operationName: string;
    public args: any[];

    constructor(operationName: string, errors: any[] = []) {
        super();
        Object.setPrototypeOf(this, BadError.prototype);
        this.operationName = operationName;
        this.args = errors; // can be used for internal logging
    }

    toJSON() {
        return {
            status: this.httpCode,
            failedOperation: this.operationName,
            errors: this.args
        }
    }
}


@Middleware({ type: "before" })
export default class ErrorHandleInterceptor implements KoaMiddlewareInterface {
    async use(ctx: any, next: any): Promise<any> {
      try {
        await next();
      } catch (error) {
          const { errors, message } = error;
          // console.log('error', errors, message);
          ctx.status = 200;
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