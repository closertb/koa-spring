import { Service } from "typedi";
import * as jwt from 'jsonwebtoken';
import User from "./model";
import { Secret } from '../../config/constants';
import Repository from '../Repository';


@Service()
export default class UserRepository extends Repository {
  constructor() {
    super(User);
  }
  async validationInfo(userInfo: object = {}) {
    console.log('model', userInfo);
    const res = await this.model.findOne({
      where: {
          ...userInfo
      },
    });
    if (res) {
      const parseRes = JSON.parse(JSON.stringify(res));
      const token = jwt.sign({
        id: parseRes.id,
        name: parseRes.name
      }, Secret);
      return Object.assign(parseRes, { token });
    }
    return {
      status: 'fail',
      message: '用户名或密码错误',
      code: 401
    };
  }
  async verifyTOken(token: string) {
    const res = await new Promise((resolve, reject) => {
      jwt.verify(token, Secret, (err, payload) => {
        if(err) {
          reject(err);
          return;
        }
        resolve(payload);
      });
    });
    console.log('res', res);
    return res;
  }
}
