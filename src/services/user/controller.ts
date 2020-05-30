import { JsonController, Get, Post, Body, Ctx, QueryParams } from "routing-controllers";
import * as request from 'request-promise';
import { Service } from "typedi";
import Repository from './repository';
import { setAsyncValue, getAsyncValue } from '../../config/datasource';
import User from "./model";
import * as Stream from 'stream';
import { Secret } from '../../config/constants';
import { AnyObject } from '../../config/interface';
import servers from '../../config/servers';
import { calHash } from '../../config/common';
const ssoUrl = servers['dev'].sso;

const { Readable } = Stream;
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

  @Get("/download")
  async download(@Ctx() ctx: any, @QueryParams() query: AnyObject) {
    console.log('start');
    let file = await request({
      uri:'https://www.bestsign.info/openpage/contractDownload.page?mid=ac3219a6e9664206a39894bd31b7762f&fsdid=1578907034421F6CL2&status=3&sign=nhCGriY4FF%2FxAX1BamOctSmx%2FMh41f4sKRH%2B5KCWqaxD9olNt6wwu3KJjOlSGjPm7lABNrRvvOn9pN9QdACRAt7W28r7dp0vAjHWIW0ywYtzWor1TYmi8XN0zwAnaHdqD6zwfLQJPMtCoFzZYrAZmhvP8qfLBkPz3KFiS3xcy9I%3D',
    });
    let s = new Readable();
    s.push(file);
    s.push(null);
    console.log('s:', s);
    let docx = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    let doc = 'application/msword';
    ctx.set('content-type',docx);
    ctx.set('content-disposition',`attachment;filename*=UTF-8''${encodeURIComponent('12345')}.docx`);
    return {
      stream: s,
      nobody: true
    };
  }

  @Post("/arcticle")
  async getArcticles(@Ctx() ctx: any, @Body() body: object) {
    const key = calHash(body);
    const content = await getAsyncValue(key);
    console.log('key:', key);

    if (content) {
      console.log('con');
      return {
        stream: JSON.parse(content),
        nobody: true
      };
    }
    let res = await request({
      uri:'https://api.github.com/graphql',
      method: 'POST',
      body,
      headers: { 
        Authorization: `bearer 8ecda162cb4ca973548f2d0bed806349147af154`,
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36',
       'content-type': 'application/json'
      },
      json: true
    });
    
    await setAsyncValue(key, JSON.stringify(res));
    console.log('res', res);

    return {
      stream: res,
      nobody: true
    };;
  }
}