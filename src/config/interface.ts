export interface AnyObject {
  [propName: string]: any
}


export interface Pagination {
  datas: object [],
  total: number,
  pn: number,
  ps: number,
}
