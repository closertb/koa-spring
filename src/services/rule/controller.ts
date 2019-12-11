import { JsonController, Get, Post, Param, Authorized, Body, UseAfter } from "routing-controllers";
import { Service } from "typedi";
import PaginationMiddleWare from '../../middlewares/PaginationMiddleWare';
import RuleRepository from "./repository";
import Rule from "./model";
import { AnyObject } from '../../config/interface';

@Service()
@JsonController('/rule')
export default class RuleController {

    constructor(private ruleRepository: RuleRepository) {
    }

    @Post("/query")
    @UseAfter(PaginationMiddleWare)
    async all(@Body() body: AnyObject) {
      const { pn, ps, ...others } = body;
      const params = Object.keys(others).reduce((pre: AnyObject, cur) => {
        if (others[cur]) {
          pre[cur] = others[cur];
        }
        return pre;
      }, {})
      const res = await this.ruleRepository.findAll(params);
      return res;
    }

    @Get("/query/:id")
    async one(@Param("id") id: number) {
      const res = await this.ruleRepository.findOne(id);
      console.log('res', res);
      return JSON.parse(JSON.stringify(res));
    }

    @Post("/save")
    async save(@Body() rule: Rule) {
      await this.ruleRepository.save(rule);
      return { msg: 'success' };
    }

    @Post("/update/:id")
    async update(@Param("id") id: number) {
      await this.ruleRepository.update(id);
      return { msg: 'success' };
    }
}