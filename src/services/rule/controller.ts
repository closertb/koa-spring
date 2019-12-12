import { JsonController, Get, Post, Param, Authorized, Body, UseAfter } from "routing-controllers";
import { Service } from "typedi";
import RecordMiddleWare from '../../middlewares/RecordMiddleWare';
import RuleRepository from "./repository";
import Rule from "./model";
import { AnyObject } from '../../config/interface';

@Service()
@JsonController('/rule')
export default class RuleController {

    constructor(private ruleRepository: RuleRepository) {
    }

    @Post("/query")
    async all(@Body() body: AnyObject) {
      const res = await this.ruleRepository.findAll(body);
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
    @UseAfter(RecordMiddleWare)
    async update(@Body() body: AnyObject) {
      const { id } = body;
      const before = await this.ruleRepository.findOne(id);
      await this.ruleRepository.update(body);
      return { before, after: body, id, update_type: 'rule' };
    }
}