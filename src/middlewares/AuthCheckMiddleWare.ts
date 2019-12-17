import { Middleware, KoaMiddlewareInterface } from "routing-controllers";
import { ActionBody } from '../config/interface';

type Callback = (m: ActionBody) => boolean;

const callbackList: Array<Callback> = [];
process.on('message', (m: ActionBody = { type: 'sendCache' }) => {
  const length = callbackList.length;
  let callback;
  for(let i = length - 1; i > -1; i--)
    callback = callbackList[i];
    if (callback) {
      let res = callback(m);
      res && callbackList.pop(); // 成功处理了响应的，才移除这个回调；
    }
});

function addCallback(callback: Callback) {
  callbackList.push(callback);
}
function readCache(id: string) {
  return new Promise((res, rej) => {
    try {
      let status = false;
       // 5秒超时读取，防止永久未回调，回调一直存在于回调列表中
      let timeout = setTimeout(() => {
        rej({ token: 'time out' });
        status = true;
      }, 1000);
      addCallback((m: ActionBody) => {
        console.log('get:', m.type, process.pid);
        if (m.id === id) {
          clearTimeout(timeout);
          res(m.payload);
          return true;
        }
        return status;
      });
      process.send({ type: 'readCache', payload: { id }});
    } catch (error) {
      rej(error);
    }
  })
}

@Middleware({ type: "before" })
export default class AuthCheckMiddleWare implements KoaMiddlewareInterface {
    async use(ctx: any, next: any): Promise<any> {
      try {
        const { request: { body = {}, query = {}, path } } = ctx;
        const { uid, token } = Object.assign({}, query, body);

        if(path === '/user/login') {
          await next();
        } else {
          const user: any = await readCache(uid);
          if(user && user.token === token) {
              ctx.user = user;
              await next();
          } else {
            ctx.body = {
              code: 120001,
              message: uid ? '登录超时，请重新登录' : '请先登录',
              status: 'error'
            };
          }
        }
      } catch (error) {
          const { errors, message } = error;
          // console.log('error', errors, message);
          ctx.status = 401;
          ctx.body = {
              errors,
              message: message || '未知错误',
              status: 'fail',
              code: '120001',
          }
      }
    }
}