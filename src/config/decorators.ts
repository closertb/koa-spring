import { Model } from 'sequelize-typescript';
import { AnyObject } from './interface';

export function validBody(target: object, prop: string, descriptor: AnyObject) {
  const func = descriptor.value;
  return {
    get() {
      return (obj: AnyObject) => {
        const { pn, ps, ...others } = obj;
        return func.call(this, others);
      }
    }
  };
}

function getValue(data: AnyObject) {
  return data.dataValues;
}

function pagination(data: object [], pn: number, ps: number) {
  const total = data.length || 0;
  const count = pn * ps;
  let datas = (total > count || total > (pn - 1) * ps) ?
    data.slice((pn - 1)*ps, total > count ? ps : undefined) :
    data.slice(0, ps);
  return {
    datas: JSON.parse(JSON.stringify(datas)),
    total,
    pageNum: (total > count || total > (pn - 1) * ps) ? +pn : 1,
    pageSize: +ps
  };
}
export function validWithPagination(target: object, prop: string, descriptor: AnyObject) {
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

export function formatDetail(target: object, prop: string, descriptor: AnyObject) {
  const func = descriptor.value;
  return {
    get() {
      return (id: number) => {
        return func.call(this, id).then((data: Model) => JSON.parse(JSON.stringify(data)));
      }
    }
  };
}

export function timeStamp(target: object, prop: string, descriptor: AnyObject) {
  const func = descriptor.value;
  return {
    get() {
      return () => {
        return new Date(this.getDataValue(prop)).getTime();
      }
    }
  };
}