# Koa-spring, 大前端，寻找生存的缝隙

## 关于这篇文章
 - Node在我的工作实际应用中，具体的业务界限；
 - Koa-spring到底是个什么概念；
 - 中间件机制；
 - 守护进程的实现及意义；
 - 多进程造成的资源共享问题；  
> 如果你感兴趣，可以fork项目，自己体验一下  
[Koa-spring](https://github.com/closertb/koa-spring)：https://github.com/closertb/koa-spring  
[related-client](https://github.com/closertb/koa-spring): --
## 万事开头难
成为一个前端前，我是一个Java练习生（Servlet，SSH，SpringMvc都只会照着写），嗯，真的是练习生。虽然这不是自己第一次用Node写接口服务，但在工作中，这仍然是黄花闺女上花轿：头一回。虽然看过，听过很多大佬将Node运用（BFF，SSR）到业务，延伸大前端的业务覆盖范围，但自己还是对界限，Node承担的角色有很多疑惑，为此，还去脉脉上发了个动态，期望大佬指点迷津。但自己的路，真的只有自己知道那个路口是出口。  
![image](https://user-images.githubusercontent.com/22979584/70850795-3d10ea80-1ec9-11ea-88ff-c701b4b98d12.png)  
最后鉴于这是一个测试用的内部系统，就确定前端页面接口全部直接对接数据库；登录，权限，日志作为中间层对接公司的公共服务。确定完边界后，开始纠结框架选型。虽然自己私下都是用Koa，但感觉离实际运用到业务，还是缺少一定的便捷性。后面又接触到EggJs，Nest，routing-controllers。[EggJS](https://docs.nestjs.cn/)是阿里内部的专用Node框架，成熟自然不言而喻，但对我来说，框架太重，但里面很多思想是值得借鉴的。[NestJs](https://docs.nestjs.cn/)和自己期望的很近，风格和SpringMvc非常相似，官方文档看似也比较全，但也同时制造了很多概念，和Egg一样，太重，也许还和只支持Express有关吧。[routing-controllers](https://github.com/typestack/routing-controllers#example-of-usage)给人的感觉就刚刚好，SpringMvc的开发风格、Koa的中间件机制，一见钟情的感觉。

## 工程搭建
### 主框架：routing-controllers + Koa
```ts
import {Controller, Param, Body, Get, Post, Put, Delete} from "routing-controllers";

// 路由相较于示例，有点小改动
@Controller('/user')
export class UserController {

    @Get("/query")
    getAll() {
       return "This action returns all users";
    }

    @Get("/query/:id")
    getOne(@Param("id") id: number) {
       return "This action returns user #" + id;
    }

    @Post("/save")
    post(@Body() user: any) {
       return "Saving user...";
    }

    @Put("/update/:id")
    put(@Param("id") id: number, @Body() user: any) {
       return "Updating a user...";
    }

    @Delete("/delete/:id")
    remove(@Param("id") id: number) {
       return "Removing user...";
    }

}
```
[routing-controllers](https://github.com/typestack/routing-controllers#example-of-usage)是一个相对于Egg和Nest较小众的库。  

![image](https://user-images.githubusercontent.com/22979584/70858465-7125f300-1f3d-11ea-8ded-18daa15a878d.png)  

迭代较慢，三年时间才到0.8.0的版本，没有官网，只有Readme。但这些丝毫不掩盖其易扩展的品质，routing-controllers的引入，未改变Koa的洋葱模型中间件机制和错误捕获机制，下图是自己使用后整理的routing-controllers中间件机制。结合Typedi，也能做到Nest框架的效果。

![image](https://user-images.githubusercontent.com/22979584/70857761-8b58d480-1f2f-11ea-971e-12607bd08d17.png)  
全局中间件和路由私有中间件，我觉得设计是十分巧妙的，这对解决通用问题，是及其有效的，在后面的中间件一节会具体分析。[官方提供的Demo](https://github.com/pleerock/routing-controllers-koa-demo)，也可以下载运行一下试试。  
### Model：数据库操作：Sequelize
页面接口直接对接数据库，所以希望选择一个类似JPA，Hibernate这样的ORM框架，简化Sql操作，可选项不多，也没做多少对比，最后选择了Sequelize，结合[sequelize-typescript](https://github.com/RobinBuschmann/sequelize-typescript#table-api)，也收获了一个不错的开发体验，下面的代码就是一个日志模型的声明：
```ts
import { Table, Column, Model } from 'sequelize-typescript';
import { toTimeStamp } from '../../config/common';

@Table({ tableName: 'change_logs' })
export default class ChangeLog extends Model<ChangeLog> {
  @Column
  userId: string; // 用户Id

  @Column
  update_type: string; // 更新表

  @Column
  update_id: number; // 表Id

  @Column
  before!: string; // 字段更新前

  @Column
  after!: string; // 字段更新后

  @Column
  get update_time(): number  { // 更新时间，转时间戳
    return toTimeStamp(this, 'update_time');
  }
}
```  
下面一段代码就是Sequelize的基本CUR操作，看起也是十分便捷的，这里出现了几个自定义的装饰器，在后面会专门讲到：
```ts
export default class Repository {
  private model = Model;

  @validWithPagination
  findAll(body: object = {}) { // 列表查询
    return this.model.findAll({
      where: body
    });
  }

  findOne(id: number) { // 详情查询
    return this.model.findOne({
      where: {
        id
      }
    });
  }
  @validBody
  update(body: AnyObject) { // 更新
    const { id, ...others } = body;
    return this.model.update({
      ...others,
    }, {
      where: {
        id
      }
    });
  }
  save(body: Model) { // 新增
    return body.save();
  }
}
```
Sequelize带给我唯一的困惑就是，其默认返回的响应体，是一个被他的Model类封装过的数据集，说起来有点抽象，看下面的响应实例：
**期望响应体**
```js
 { 
  create_time: 1575642055000,
  update_time: 1576380905000,
  id: 5,
  scene_code: 'special',
  param_code: 'bit',
  param_name: '任何',
  param_type: 'string',
  operator_add: 'SYS',
  is_delete: 0
}
```  

**实际响应体：太长，截取部分**
```js
// Rule
{
  dataValues:
   { id: 5,
     scene_code: 'special',
     param_code: 'bit',
     param_name: '任何',
     param_type: 'string',
     operator_add: 'SYS',
     is_delete: 0,
     create_time: 2019-12-06T14:20:55.000Z,
     update_time: 2019-12-15T03:35:05.000Z
  },
  _modelOptions:
  { 
    timestamps: false,
    validate: {},
    freezeTableName: true,
    underscored: false,
    ...
  }
  ...
}
```  
看起只需要拿响应体的dataValues就是我们期望的响应体，但这个响应体是属性的getter方法并没有执行。官方也提供了{ query: { raw: true }}这个设置去获得简单的响应体，但也有同样的问题，属性的getter未执行。看了一下官方实现，getter方法是在调用toJson方法时，才会执行。
### 中间层服务的处理：
在实现登录，权限，日志，存储作为中间层对接公司的公共服务时，Node需要发起请求，并响应包装转发出去，这里选择了比较成熟的request和request-promise库。
### 数据校验：
虽然这是一个内部系统，除了前端提交做校验外，业务方还是希望接口层要有一些必要的校验。如果全部用If-else写，想想这还是一个比较大的工作量的，不过还好，有class-validator这个库的存在，加上装饰器的写法，还是比较简洁。比如下面这个登录表单的校验示例：
```ts
import { MinLength, Length } from "class-validator";

export default class User {
  @Length(6, 12)
  name: string;

  @MinLength(6)
  pwd: string;
}
```
### 语言：Typescript
看上面那么多，你应该猜到了，这个项目选择了Typescript。

## 实现的细节
路由的控制，在使用routing-controllers库后，以注解的形式，显得非常清晰。下面主要讲中间件和装饰器的实现细节。
### 中间件
在我的项目中涉及到多个中间件，既有全局中间件，比如鉴权，响应体包装，错误处理；又有局部路由中间件，比如操作日志，分页。
#### 全局中间件：鉴权：AuthCheckMiddleWare
全局中间件都继承于KoaMiddlewareInterface，需要区分是路由响应前，还是响应后。鉴权中间件的目的是验证每一个请求，是否有操作权限，验证token的有效性。这里的实现是一种简易的形式，只检查了本地缓存信息，未到用户中心继续验证，供参考：
```ts
import { Middleware, KoaMiddlewareInterface } from "routing-controllers";
import * as cache from 'memory-cache';

@Middleware({ type: "before" }) // before 表示在请求路由响应前
export default class AuthCheckMiddleWare implements KoaMiddlewareInterface {
    async use(ctx: any, next: any): Promise<any> {
      const { request: { body = {}, query = {}, path } } = ctx;
      const { uid, token } = Object.assign({}, query, body);
      // 在用户登录时，会以Uid存储当前用户的信息，有效期20分钟
      const user = cache.get(uid);

      // 如果是非登录，检查携带的token是否和缓存的token一致
      if(path === '/user/login' || (user && user.token === token)) {
        if (path !== '/user/login') {
          ctx.user = user; // 将user信息挂载到当前请求体
        }
        await next();
      } else {
        ctx.body = {
          code: '120001',
          message: uid ? 'Session过期，请重新登录' : '请先登录',
          status: 'fail'
        };
      }
    }
}
```  

全局中间件需要在生成koa实例时，进行注册：  

```ts
    const koaApp = createKoaServer({
        cors: true, // 这里开启了Cors跨域
        controllers: [__dirname + '/services/*/controller.js'],
        middlewares: [AuthCheckMiddleWare],
    });
```  
#### 局部路由中间件：操作记录：RecordMiddleWare
操作日志中间件，其目的是记录某些表的数据新增，修改操作。需要记录下字段修改前和修改的值，操作类型及操作人。如果按常规思维，在每一个需要记录操作的路由Controller去加入日志记录代码。代码冗余，且日志记录需求变动时，是一件非常被动的事情，所以局部路由中间件是最好的实现方式，在需要记录的路由加入这个中间件即可。
```ts
import Model from '../services/changeLog/model';
import { AnyObject } from '../config/interface';

/**
 * 新增修改操作日志记录，入库。
 * @param ctx 
 * @param next 
 */
export default async function RecordMiddleWare(ctx: any, next: (err?: any) => Promise<any>): Promise<any> {
  const { user = {}, body: { before, after, update_type, id } } = ctx;
  const old: AnyObject = {};
  const nw: AnyObject = {}; // 最新数据
  if (!before) {
    Object.assign(nw, after);
  } else {
    // 记录比较，只保存改变过的值的修改记录
    Object.keys(after).forEach((prop) => {
      // 数字比较时，由于请求体，数字会被转化成字符串，所以这里用了==，来自动转换数据类型
      if (before[prop] == after[prop]) {
        return;
      }
      old[prop] = before[prop];
      nw[prop] = after[prop];
    });
  }
  // 重写body
  ctx.body = { msg: 'success', id };
  await next();
  const repository = new Model({
    update_id: id,
    update_type,
    userId: user.id || 'SYS', // 获取userId
    after: JSON.stringify(nw),
    before: JSON.stringify(old)
  });
  repository.save()
}
```  

在规则数据更新时，加入操作日志记录中间件

```ts
import { JsonController, Post, Body, UseAfter } from "routing-controllers";
import { Service } from "typedi";
import RecordMiddleWare from '../../middlewares/RecordMiddleWare';
import RuleRepository from "./repository";
import { AnyObject } from '../../config/interface';

@Service()
@JsonController('/rule')
export default class RuleController {
  @Post("/update")
  @UseAfter(RecordMiddleWare)
  async update(@Body() body: AnyObject) {
    const { id } = body;
    const before = await this.ruleRepository.findOne(id);
    await this.ruleRepository.update(body);
    return { before, after: body, id, update_type: 'rule' };
  }
}
```
### 装饰器

