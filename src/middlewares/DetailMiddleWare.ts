export default async function DetailMiddleWare(ctx: any, next: (err?: any) => Promise<any>): Promise<any> {
  const { body = {}, request: { query = {} } } = ctx;
  const params = Object.assign({}, query, body);
  const { pn = 1, ps = 10 } = params;
  // console.log("PaginationMiddleWare before execution...", pn, ps, body);
  const data = JSON.parse(ctx.body) || [];
  const total = data.length || 0;
  const count = pn * ps;
  if (total > count || total > (pn - 1) * ps) {
    ctx.body = {
      datas: data.slice((pn - 1)*ps, total > count ? ps : undefined),
      total,
      pn: +pn,
      ps: +ps
    }
  } else {
    ctx.body = {
      datas: data.slice(0, ps),
      total,
      pn: 1,
      ps: +ps
    }
  }
  await next();
  // console.log("PaginationMiddleWare after execution", ctx.body);
}