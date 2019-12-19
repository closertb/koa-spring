# koa-spring Demo

1. Install all dependencies:

    `npm install`
    
2. Run the project:  
第一步：  
    `npm run watch`  
再开一个命令窗口： 运行  
    `npm run start`  
3. 服务试验  
前提是你有mysql，并启动，然后根据table.md文件生成对应的表  
然后你就可以用curl命令来试验了

### 相关依赖文档

 - 数据库操作：[sequelize](https://sequelize.org/master/manual/models-definition.html);
 - typescript依赖：[sequelize-typescript](https://github.com/RobinBuschmann/sequelize-typescript#table-api)；
 - node 框架：[koa](https://github.com/koajs/koa),
 - node 注解类框架：[routing-controllers](https://github.com/typestack/routing-controllers),
 - 基础校验：[class-validator](https://github.com/typestack/class-validator),
 - 服务请求发起：[request-promise](https://www.npmjs.com/package/request-promise)
 - 参考demon: [routing-controllers-koa-demo](https://github.com/pleerock/routing-controllers-koa-demo)


 ### 相关文章
上篇：[Koa-spring, 大前端，寻找生存的缝隙(上)](https://github.com/closertb/closertb.github.io/issues/40)  
下篇：[Koa-spring, 大前端，寻找生存的缝隙(下)](https://github.com/closertb/closertb.github.io/issues/41)  
通信篇：[Koa-spring, 大前端，寻找生存的缝隙(下)](https://github.com/closertb/closertb.github.io/issues/42)


