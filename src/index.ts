import * as cluster from 'cluster';
import * as cache from 'memory-cache';
import { cpus } from 'os'; 
import { ExpiredTime } from './config/constants';
import { ActionBody } from './config/interface';
import Server from './app';

const cpusNum = cpus().length;

// master.js
//创建服务进程  
function creatServer() {
  const worker = cluster.fork();
  //监听message事件，监听自杀信号，如果有子进程发送自杀信号，则立即重启进程。
  //平滑重启 重启在前，自杀在后。
  worker.on('message', (msg: ActionBody) => {
    const { type, payload } = msg;
    // console.log('type',type,'-----','payload', payload);
    //msg为自杀信号，则重启进程
    if(type == 'suicide') {
      creatServer();
    }
    if(type == 'readCache') {
      const res = cache.get(payload.id) || {};
      // console.log('get res', res);
      worker.send({ type: 'sendCache', id: payload.id, payload: res })
    }
    if(type == 'saveCache') {
      cache.put(payload.id, payload, ExpiredTime);
    }
  });

  //清理定时器。
  worker.on('disconnect', () => {
    clearTimeout(timeout);
  });
}

/**
 * 执行过程: node index.js
 * 首次cluster.isMaster为true, 然后fork了n个进程， 并开启监听；
 * 接着每个启动，又重头执行，但这时cluster.isMaster为false了
 * 所以就实例化了四个服务AngelServer
 */

//超时
let timeout: any;

function workBeforeExit(server: any, error: Error) {
  console.log('error', error);
  //发送一个自杀信号
  process.send({ type: 'suicide' });
  cluster.worker.disconnect();
  server.close(() => {
    //所有已有连接断开后，退出进程
    process.exit(1);
  });
  //5秒后强制退出进程
  timeout = setTimeout(() => {
    process.exit(1);
  },5000);
}
// console.log('start', cluster.isWorker, cluster.isMaster ? 'master' : 'fork');
//master进程
if(cluster.isMaster) {
  //fork多个工作进程
  for(let i = 0; i < 1; i++) {
    creatServer();
  }
} else {
  //worker进程
  const angelServer = Server();

  //服务器优雅退出
  angelServer.on('error', (err: Error) => {
    workBeforeExit(angelServer, err);
  });
  //服务器优雅退出
  angelServer.on('uncaugtException', (err: Error) => {
    workBeforeExit(angelServer, err);
  });
}