import { JsonController, Get, Post, Body, Ctx, QueryParams } from "routing-controllers";
// import * as request from 'request-promise';
import { Service } from "typedi";
import Repository from './repository';
import User from "./model";
import { Secret } from '../../config/constants';
import { AnyObject } from '../../config/interface';
import servers from '../../config/servers';

const ssoUrl = servers['dev'].sso;

@Service()
@JsonController('/user')
export default class UserController {
  public repository: Repository
  constructor() {
    this.repository = new Repository();
  }
  @Post("/login")
  async login(@Body({ validate: true }) user: AnyObject) {
    const res = await this.repository.validationInfo(user);
    if (res.token) { // 只有token存在的时候，采取通信存储；
      process.send({ type: 'saveCache', payload: res });
    }
    return res;
/*       try {
      res = await request({
        uri: `${ssoUrl}/api/user/login`,
        method: 'POST',
        form: {
          ...user
        }
      });

      res = typeof res === 'string' ? JSON.parse(res) : res;
      // console.log('res status', res, res.status);
      if (res.status === "ok") {
        res = res.content;
        process.send({ type: 'saveCache', payload: res });
      } else {
        const { errorMsg, errorCode } = res;
        res = {
          status: 'fail',
          message: errorMsg,
          code: errorCode
        }
      }
    } catch (error) {
      res = {
        error,
        message: '网络错误',
        code: '10013'
      }
    } finally {
      return res;
    } */
  }
  @Post("/logout")
  async update(@Body({ validate: true }) user: User) {
    console.log(user)
    return { token: 'drgfsdfgfegfgfgevfdd', id: 12345, name: 'denzel' };
  }

  @Post("/query")
  async all(@Body() body: object) {
    const res = await this.repository.findAll(body);
    return res;
  }
  
  @Post("/verify")
  async verify(@QueryParams() query: AnyObject) {
    console.log('query', query);
    // return query;
    return this.repository.verifyTOken(query.token);
  }
}