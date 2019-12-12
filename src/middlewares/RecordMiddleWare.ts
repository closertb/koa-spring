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
  // console.log("LogMiddleWare before execution...", request.query, request.search);
  await next();

  const repository = new Model({
    update_id: id,
    update_type,
    userId: user.appUserId || 'SYS', // 获取userId
    after: JSON.stringify(nw),
    before: JSON.stringify(old)
  });
  repository.save()
}