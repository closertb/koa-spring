export interface AnyObject {
  [propName: string]: any
};

export interface Pagination {
  datas: object [],
  total: number,
  pn: number,
  ps: number,
};

export interface ActionBody {
  type: string,
  payload?: AnyObject
  uid?: string
};

export interface PageParams {
  limit: number,
  offset: number,
}
