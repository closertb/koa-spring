import { JsonController, Get, Post, Param, Delete, Body } from "routing-controllers";
import { Service } from "typedi";
import RuleRepository from "../repository/RuleRepository";
import Rule from "../model/Rule";

@Service()
@JsonController('/rule')
export class RuleController {

    constructor(private ruleRepository: RuleRepository) {
    }

    @Get("/query")
    async all() {
      const res = await this.ruleRepository.findAll();
      return JSON.stringify(res, null, 2);
    }

    @Get("/query/:id")
    async one(@Param("id") id: number) {
      const res = await this.ruleRepository.findOne(id);
      console.log('res', res.length);
      return res.length ? JSON.stringify(res[0], null, 2) : {};
    }

    @Get("/save")
    async save(@Body() rule: Rule) {
      let temp: Rule = {
        scene_code: "CREDIT_CASH",
        param_code: "school",
        param_name: '学校',
        param_type: "String",
        is_delete: 0,
        operator_add: "denzel"
      }
      console.log('rule:', rule);
      await this.ruleRepository.save(rule);
      return { msg: 'success' };
    }

    @Get("/update/:id")
    async update(@Param("id") id: number) {
      await this.ruleRepository.update(id);
      return { msg: 'success' };
    }
}