# Koa-spring, 大前端，寻找生存的缝隙(下)

## 关于这篇文章
 - 自定义装饰器
 - 继承的应用
 - 进程的通信  
 - 踩过的坑

> 如果你感兴趣，可以fork项目，自己体验一下  
[Koa-spring](https://github.com/closertb/koa-spring)：https://github.com/closertb/koa-spring  
[related-client](https://github.com/closertb/koa-spring-client): https://github.com/closertb/koa-spring-client
## 自定义装饰器
在上一篇文章写到利用中间件来处理那些重复的逻辑，但遗憾的是，不是所有的重复逻辑都适合用中间件来处理。比如上一章讲过Sequelize的查询结果是一个包装过的结构，在赋值成响应体时，需要调用toJson方法或则使用JSON.stringify格式化。开始在查询时设置了{ query: { raw: true }}, 数据库查询的结果没有被包装，所以开始直接是使用中间件来处理：

```ts
async function PaginationMiddleWare(ctx: any, next: (err?: any) => Promise<any>): Promise<any> {
  const { request: { body = {}, query = {} } } = ctx;
  const params = Object.assign({}, query, body);
  const { pn = 1, ps = 10 } = params;
  const data = ctx.body || [];
  const total = data.length || 0;
  const count = pn * ps;
  const isEnough = total > count || total > (pn - 1) * ps;
  ctx.body = {
    datas: isEnough ? data.slice((pn - 1)*ps, total > count ? ps : undefined) : data.slice(0, ps),
    total,
    pn: isEnough ? +pn : 1,
    ps: +ps
  }
  await next();
}
```

但由于后面对getter的需求，不得不放弃{ raw：true }这个设置，但同时带来的麻烦就是，面对成千上百条数据时，调用JSON.parse(JSON.stringify(datas))来获取getter执行后的数据，这无疑是一个巨大的性能损耗。后面又考虑到搜索请求参数的处理，所以考虑用装饰器来处理，即先从查询数据获取请求的目标数据，再对目标数据进行格式化，这样就提供了性能，下面来看看具体实现：
```ts
// 分页，逻辑与中间件的实现一致
function pagination(data: object [], pn: number, ps: number): Pagination {
  const total = data.length || 0;
  const count = pn * ps;
  const isEnough = total > count || total > (pn - 1) * ps;
  let datas = isEnough ?
    data.slice((pn - 1)*ps, total > count ? ps : undefined) :
    data.slice(0, ps);
  return {
    datas: JSON.parse(JSON.stringify(datas)),
    total,
    pn: isEnough ? +pn : 1,
    ps: +ps
  };
}

// 做了两件事，首先是筛选出值为空的属性，其次就是获取分页数据并格式化
function validWithPagination(target: object, prop: string, descriptor: AnyObject) {
  const func = descriptor.value;
  return {
    get() {
      return (obj: AnyObject) => {
        const { pn, ps, ...others } = obj;
        const valid = Object.keys(others).reduce((pre: AnyObject, cur: string) => {
          const value = others[cur] 
          if(value) {
            pre[cur] = value;
          }
          return pre;
        }, {});
        return func.call(this, valid).then((data: object []) => pagination(data, pn, ps));
      }
    }
  };
}
```
有了这个装饰器，只需要在查询接口套用就行了，还是看代码：
```ts
import { Service } from "typedi";
import Model from "./model";
import { validWithPagination } from '../../config/decorators';
import { AnyObject } from '../../config/interface';

@Service()
export default class Repository {
  private model = Model;

  @validWithPagination
  findAll(body: object = {}) {
    return this.model.findAll({
      where: {
          ...body
      }
    });
  }
}  
```  
利用装饰器，我们轻松解决了请求体的有效性筛选，和响应体的分页格式化。从代码来看，这一块逻辑使用装饰器很好的提炼了重复的逻辑，使用装饰器，对接口方法很好的扩展，却又不失美观。这样的装饰器在我的代码中多次出现，如果你有兴趣，可以去查看我的项目。
## 继承的应用


## 进程的通信 

## 踩过的坑 