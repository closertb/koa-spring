# Koa-spring: Node进程通信的实践

## 关于这篇文章
 - Node多进程
 - 进程通信
 - 闭包与立即执行

> 如果你感兴趣，可以fork项目，自己体验一下  
[Koa-spring](https://github.com/closertb/koa-spring)：https://github.com/closertb/koa-spring  
[related-client](https://github.com/closertb/koa-spring-client): https://github.com/closertb/koa-spring-client  
技术栈：koa + Sequelize + routing-controllers + typescript  

## Node多进程
### 进程与线程  
- 进程：是计算机中的程序关于某数据集合上的一次运行活动，是系统进行资源分配和调度的基本单位，是操作系统结构的基础，进程是线程的容器（来自百科），进程是**资源分配**的最小单位。每个进程都拥有自己的独立空间地址、数据栈，一个进程无法访问另外一个进程里定义的变量、数据结构，只有建立了 IPC 通信，进程之间才可数据共享。
 - 线程：线程是操作系统能够进行**运算调度**的最小单位，首先我们要清楚线程是隶属于进程的，被包含于进程之中。一个线程只能隶属于一个进程，但是一个进程是可以拥有多个线程的。

这里只立个概念，有很多文章是讲Node的进程与线程的，这里推荐（很多文章年代久远，但都是精华）：
 - [Node.js 探秘：初识单线程的 Node.js](https://fed.taobao.org/blog/2015/10/30/deep-into-node-1/)
 - [当我们谈论 cluster 时我们在谈论什么(上)](https://fed.taobao.org/blog/2015/11/04/nodejs-cluster/)
 - [当我们谈论 cluster 时我们在谈论什么（下）](https://fed.taobao.org/blog/2015/11/11/nodejs-cluster-2/)
 - 另外就是推荐朴灵的：深入浅出NodeJs第九章  

 开始前，先前调一个点：
## 进程通信
## 闭包与立即执行

## 系列索引 
上篇：[Koa-spring, 大前端，寻找生存的缝隙(上)](https://github.com/closertb/closertb.github.io/issues/40)  
下篇：[Koa-spring, 大前端，寻找生存的缝隙(下)](https://github.com/closertb/closertb.github.io/issues/41)
