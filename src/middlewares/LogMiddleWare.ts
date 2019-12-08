export default async function LogMiddleWare(ctx: any, next: (err?: any) => Promise<any>): Promise<any> {
  const { body, request } = ctx;
  // console.log("LogMiddleWare before execution...", request.query, request.search);
  await next();
  // console.log("LogMiddleWare after execution");
}