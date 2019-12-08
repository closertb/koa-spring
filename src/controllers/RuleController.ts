import { JsonController, Get, Post, Param, Delete, Body, UseAfter } from "routing-controllers";
import { Service } from "typedi";
import PaginationMiddleWare from '../middlewares/PaginationMiddleWare';
import RuleRepository from "../repository/RuleRepository";
import Rule from "../model/Rule";

@Service()
@JsonController('/rule')
export default class RuleController {

    constructor(private ruleRepository: RuleRepository) {
    }

    @Post("/query")
    @UseAfter(PaginationMiddleWare)
    async all() {
      const res = await this.ruleRepository.findAll();
      return res;
    }

    @Get("/query/:id")
    async one(@Param("id") id: number) {
      const res = await this.ruleRepository.findOne(id);
      console.log('res', res);
      return res || {};
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