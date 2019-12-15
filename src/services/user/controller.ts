import { JsonController, Get, Post, Body, UseAfter } from "routing-controllers";
import * as request from 'request-promise';
import * as cache from 'memory-cache';
import User from "./selfModel";
import servers from '../../config/servers';
import { ExpiredTime } from '../../config/constants';

const ssoUrl = servers['dev'].sso;

@JsonController('/user')
export default class UserController {

    @Post("/login")
    async login(@Body({ validate: true }) user: User) {
      let res;
      try {
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
          const { id } = res;
          cache.put(id, res, ExpiredTime);
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
      }
    }
    @Post("/logout")
    async update(@Body({ validate: true }) user: User) {
      console.log(user)
      return { token: 'drgfsdfgfegfgfgevfdd', id: 12345, name: 'denzel' };
    }
}