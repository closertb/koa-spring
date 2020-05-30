import * as crypto from 'crypto';

export function calHash(obj: {} = {}) {
  return crypto.createHash('md5').update(JSON.stringify(obj)).digest('hex');
}

/**
 * Date对象转时间戳
 * @param target：model 实例 
 * @param prop：实例上的属性名 
 */
export const toTimeStamp = (target: any, prop: string) => {
  return new Date(target.getDataValue(prop)).getTime();
}