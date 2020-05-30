import { JsonController, Get, Post, Body, Ctx, QueryParams } from "routing-controllers";
import * as request from 'request-promise';
import { Service } from "typedi";
import { setAsyncValue, getAsyncValue } from '../../config/datasource';
import * as Stream from 'stream';
import { AnyObject } from '../../config/interface';
import servers from '../../config/servers';
import { calHash } from '../../config/common';

@Service()
@JsonController('/arcticle')
export default class UserController {
  @Post("/manage")
  async login(@Body({ validate: true }) user: AnyObject) {

  }

  @Post("/graphql")
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

    return {
      stream: res,
      nobody: true
    };;
  }
}