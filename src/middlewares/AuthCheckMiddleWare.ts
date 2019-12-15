import { Middleware, KoaMiddlewareInterface } from "routing-controllers";
import * as cache from 'memory-cache';

@Middleware({ type: "before" })
export default class AuthCheckMiddleWare implements KoaMiddlewareInterface {
    async use(ctx: any, next: any): Promise<any> {
      try {
        const { request: { body = {}, query = {}, path } } = ctx;
        const { uid, token } = Object.assign({}, query, body);
        const user = cache.get(uid);

        console.log('uid', uid, '---',token, user);
        if(path === '/user/login' || (user && user.token === token)) {
          if (path !== '/user/login') {
            ctx.user = user; // 赋值到全局User
          }
          await next();
        } else {
          ctx.body = {
            code: '120001',
            message: uid ? 'Session过期，请重新登录' : '请先登录',
            status: 'fail'
          };
        }
      } catch (error) {
          const { errors, message } = error;
          // console.log('error', errors, message);
          ctx.status = 200;
          ctx.body = {
              errors,
              message: message || '未知错误',
              status: 'fail',
              code: '120001',
          }
      }
      // console.log("ResponseMiddleWare after execution");
    }
}