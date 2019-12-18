import { Model } from 'sequelize-typescript';
import { AnyObject, PageParams, Pagination } from './interface';

interface CountAll {
  rows: object [];
  count: number;
}

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

function pageDecorator({ count, rows }: CountAll, pn: number, ps: number): Pagination {
  return {
    datas: JSON.parse(JSON.stringify(rows)),
    total: count,
    ps,
    pn
  };
}

function pagination(ps: number, pn: number): PageParams {
  return {
    limit: ps,
    offset: (pn - 1) * ps
  }
}
// 做了两件事，首先是查询参数筛选掉值为空的属性，其次就是查询分页数据并格式化
export function validWithPagination(target: object, prop: string, descriptor: AnyObject) {
  const func = descriptor.value;
  return {
    get() {
      return (obj: AnyObject) => {
        const { ps, pn, ...others } = obj;
        const valid = Object.keys(others).reduce((pre: AnyObject, cur: string) => {
          const value = others[cur] 
          if(value) {
            pre[cur] = value;
          }
          return pre;
        }, {});
        const page = pagination(+ps, +pn);
        return func.call(this, valid, page).then((data: CountAll) => pageDecorator(data, +ps, +pn));
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