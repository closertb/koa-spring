# Koa-spring, 大前端，寻找生存的缝隙(下)

## 关于这篇文章
 - 自定义装饰器
 - 继承的应用
 - 踩过的坑

> 如果你感兴趣，可以fork项目，自己体验一下  
[Koa-spring](https://github.com/closertb/koa-spring)：https://github.com/closertb/koa-spring  
[related-client](https://github.com/closertb/koa-spring-client): https://github.com/closertb/koa-spring-client  
技术栈：koa + Sequelize + routing-controllers + typescript  
上一篇：[Koa-spring, 大前端，寻找生存的缝隙(上)](https://github.com/closertb/closertb.github.io/issues/40)
## 自定义装饰器
去年我特别看好装饰器在前端的发展前景，直到React开始推崇Hooks，并持续大热，这严重压缩了Javascript中类的应用（没记错的话：上一次是函数式编程）。而现阶段的装饰器是依赖于类的，在未来可能这种局面可能会被改变，一种全新的装饰器语法会诞生。还未了解过装饰器的，可以看一下[阮一峰：ES6入门之装饰器](http://es6.ruanyifeng.com/#docs/decorator)  
在上一篇文章写到利用中间件来处理那些重复的逻辑，但遗憾的是，不是所有的重复逻辑都适合用中间件来处理。比如上一章讲过Sequelize的查询结果是一个包装过的结构，在赋值成响应体时，需要调用toJson方法或则使用JSON.stringify格式化。开始在查询时设置了{ query: { raw: true }}, 查询的结果没有被包装,比较干净，所以开始是直接使用中间件来处理分页：

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

但由于后面意识到这种暴力查询，面对成千上万条数据时，慢的会让人觉得这是个bug；加上对属性getter方法的需求，不得不放弃{ raw：true }这个设置；另外的考虑就是：搜索请求参数的处理。为了不重复写上面的逻辑，所以考虑用装饰器来处理，即先从查询数据获取请求的目标数据（一般分页就10条或20条数据），再对目标数据进行格式化，这样即提高了性能，查询逻辑优化，也不会多次复制粘贴，下面来看看具体实现：
```ts
function pageDecorator({ count, rows }: CountAll, pageSize: number, pageNum: number): Pagination {
  return {
    datas: JSON.parse(JSON.stringify(rows)),
    total: count,
    pageSize,
    pageNum
  };
}

function pagination(ps: number, pn: number): PageParams {
  return {
    limit: ps,
    offset: (pn - 1) * ps
  }
}
// 做了两件事，首先是查询参数筛选掉值为空的属性，其次就是查询分页数据并格式化
function validWithPagination(target: object, prop: string, descriptor: AnyObject) {
  const func = descriptor.value;
  return {
    get() {
      return (obj: AnyObject) => {
        const { pageSize, pageNum, ...others } = obj;
        const valid = Object.keys(others).reduce((pre: AnyObject, cur: string) => {
          const value = others[cur] 
          if(value) {
            pre[cur] = value;
          }
          return pre;
        }, {});
        const page = pagination(+pageSize, +pageNum);
        return func.call(this, valid, page).then((data: CountAll) => pageDecorator(data, +pageSize, +pageNum));
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
  async findAll(body: object = {}, pagination: object = {}) {
    return this.model.findAndCountAll({
      where: {
        ...body
      },
      ...pagination
    });
  }
}  
```  
利用装饰器，我们轻松解决了请求体的有效性筛选，和响应数据的分页查询及格式化。从代码来看，这一块使用装饰器很好的提炼了重复的逻辑，对接口方法很好的扩展，不需要对业务代码做太多调整。这样的装饰器在我的代码中多次出现，如果你有兴趣，可以去查看我的Demo。

## 继承的应用
你以为装饰器和中间件解决了所有的重复逻辑，错了，这只是冰山一角。在项目中，每个服务（对于前面来说就是每个页面）都由Controller + Repository + Model三个部分组成：
 - Controller：路由控制，业务逻辑主要放在这一层；
 - Repository：我理解是接口层，主要负责数据库的操作（CURD）；
 - Model：数据映层，负责和数据库表键进行映射
每一个服务都由对应的CURD操作，每个页面的三者都及其相似，这时我脑中闪现了一张图：

![talk](https://user-images.githubusercontent.com/22979584/66932182-ca6ec480-f069-11e9-8a7e-24a4088419ad.png)  

先看看一个普通Repository的代码：
```ts
import { Service } from "typedi";
import { Op } from 'Sequelize';
import Rule from "./model";
import { formatDetail, validBody, validWithPagination } from '../../config/decorators';
import { AnyObject } from '../../config/interface';

@Service()
export default class RuleRepository {

  private rule = Rule;

  @validWithPagination
  async findAll(body: object = {}, pagination: object = {}) {
    return this.model.findAndCountAll({
      where: {
            ...body
      },
      ...pagination
    });
  }
  // ...此处省略了两个方法
  save(rule: Rule) {
      return rule.save();
  }
}
```
当你写完第一个页面的查询服务，功能OK, 简直Perfect，然后复制粘贴，第二个，第三个，.......第N个，下班。然后你突然发现实现逻辑有缺陷，比如，有人告诉你，findAndCountAll不如findAll + count两条查询速度快（我也不知道谁更快，别喷我），然后又屁颠屁颠的一个一个去改成下面这样：
```
  @validWithPagination
  async findAll(body: object = {}, pagination: object = {}) {
    // 获取分页目标数据
    const rows = await this.model.findAll({
      where: {
          ...body
      },
      ...pagination
    });
    // 获取总数
    const count = await this.model.count({
      where: {
        ...body
      }
    });
    return { rows, count }
  }
```  
改完了，发现复制粘贴真好用。拜托，9102年都快过去了，还在复制粘贴，明年还想不想涨薪。这时就该考虑好好设计一下了，其实也不用怎么设计，继承，就是继承。首先，先写一个基类：
```ts
import { ModelCtor } from 'sequelize-typescript';
import { AnyObject } from '../config/global';
import { validBody, formatDetail, validWithPagination } from '../config/decorators';

export default class Repository {
  public model: ModelCtor;
  constructor(model: ModelCtor) {
    this.model = model;
  }

  @validWithPagination
  async findAll(body: object = {}, pagination: object = {}) {
    const rows = await this.model.findAll({
      where: {
          ...body
      },
      ...pagination
    });
    const count = await this.model.count({
      where: {
        ...body
      }
    });
    return { rows, count }
  }
  // ...此处省略了两个方法
  save(model: AnyObject) {
    return model.save();
  }
}
```
然后就可以继承了，重写最上面那个数据库接口：RuleRepository，直接看代码：
```ts
import { Service } from "typedi";
import Rule from "./model";
import Repository from '../Repository';

@Service()
export default class RuleRepository extends Repository {
  constructor() {
    super(Rule);
  }
}
```
What？？？我还没叫开始，你就结束了。嗯，就是这么简单，下班。  
对于Controller,也可以有同样的方式去优化，只是没法像Repository这样直接，而必须去重写方法，并调用super方法，至于为什么不能直接继承，在[routing-controllers](https://github.com/typestack/routing-controllers/pull/301)有一个被拒绝的Pull Request[Controller inheritance](https://github.com/typestack/routing-controllers/pull/301),作者也给出了回复，觉得这样没必要，而采用继承加重写调用super是一种安全的做法，如果你对这块实现有兴趣，可以看我的Demo。  
但不得不说，页面接口开发效率提升不止50%！
## 进程的通信 
上面提测前，发现鉴权中用到的通信有一个非常大的bug，这一块准备专门做个总结。
## 踩过的坑 
坑其实踩的不多，主要是自己太无知，由于项目用到了typeScript和对数据库的直接操作，所以确实涨了不少知识。这里做一下记录：
### typescript  
#### 类型断言
当时想做一个关联表查询，所以写下了这样一段代码：
```ts
  @BelongsTo(() => Enums)
  set callback_template_name(val: Enums | string)  { // Enums: 一个Sequelize Model类型
    this.setDataValue('callback_template_name', val && val.getDataValue('name'));
  }
```
无论我用typeof或则instance去判断类型，再赋值，仍然会报下面这样一个错误：
>Property 'getDataValue' does not exist on type 'string | Enums'.
  Property 'getDataValue' does not exist on type 'string'  

然后去翻Typescript的Handbook，幸运的翻到了，[类型断言](https://ts.xcatliu.com/basics/type-assertion),然后做了这样一个修正：

```ts
  set callback_template_name(val: Enums | string)  {
    // 加入了类型断言，val有Null的状态
    if(val && (<Enums>val).getDataValue) {
      this.setDataValue('callback_template_name', val && (<Enums>val).getDataValue('name'));
    } else {
      this.setDataValue('callback_template_name','');
    }
  }
```  

#### 访问修饰符
实现类的继承并不像前面写的一样那么顺利，虽然三年前我还是个Java练习生，但时间真的带走了我太多东西，我又搞错了public private 和 protected的区别，而且遇到了下面这个错误。
> 这里写错误
好吧，这里在一遍，加深记忆：
- public 修饰的属性或方法是公有的，可以在任何地方被访问到，默认所有的属性和方法都是 public 的
- private 修饰的属性或方法是私有的，不能在声明它的类的外部访问  
- protected 修饰的属性或方法是受保护的，它和 private 类似，区别是它在子类中也是允许被访问的