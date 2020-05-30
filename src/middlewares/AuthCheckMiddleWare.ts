import { Middleware, KoaMiddlewareInterface } from "routing-controllers";
import { ActionBody } from '../config/interface';

type Callback = (m: ActionBody) => boolean;

function generateUid() {
  const random = Math.floor(26 * Math.random() + 65);
  return `${Date.now()}-${String.fromCharCode(random)}`;
}

// 回调队列
const callbackList: Array<Callback> = [];

process.on('message', (m: ActionBody = { type: 'sendCache' }) => {
  let tempList = callbackList.slice();
  tempList.forEach((callback, i) => {
    callback = tempList[i];
    if (callback && callback(m)) {
      callbackList.splice(i, 1); // 成功处理了响应的或则响应已过期，移除这个回调；
    }
  });
});

function addCallback(callback: Callback) {
  callbackList.push(callback);
}

function readCache(id: string) {
  return new Promise((res, rej) => {
    try {
      const uid = generateUid();
      // console.log('send', _uid, process.pid);
      addCallback(((uid: string) => {
        let status = false;
        let timeout = setTimeout(() => { // 5秒超时读取，防止永久未回调，导致回调一直存在于回调列表中: 可能性很小
          rej({ message: '授权验证超时' });
          status = true;
        }, 5000);
        return (m: ActionBody) => {
        // console.log('get:', uid, '===', m.uid, process.pid);
        // 必须在过期前响应
        if (!status && m.uid === uid) {
          clearTimeout(timeout);  
          res(m.payload);
          return true;
        }
        return status;
      }
      })(uid));
      process.send({ type: 'readCache', payload: { id, uid }});
    } catch (error) {
      rej(error);
    }
  });
}

@Middleware({ type: "before" })
export default class AuthCheckMiddleWare implements KoaMiddlewareInterface {
    async use(ctx: any, next: any): Promise<any> {
      try {
        const { request: { body = {}, query = {}, path } } = ctx;
        const { uid, token } = Object.assign({}, query, body);
        console.log('path', path);
        if(path === '/user/login' || path === '/arcticle/graphql' ) {
          await next();
        } else {
          const user: any = await readCache(uid);
          console.log('ans', uid, user, user.token === token);
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
              message: message || '未授权错误',
              status: 'error',
              code: 120001,
          }
      }
    }
}