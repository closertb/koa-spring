import { JsonController, Post, Body } from "routing-controllers";
import { Service } from "typedi";
import { AnyObject } from '../../config/interface';
import Repository from "./repository";
import Model from "./model";


@Service()
@JsonController('/request')
export default class Controller {

    constructor(private repository: Repository) {
    }

    @Post("/query")
    async all(@Body() body: object) {
      const res = await this.repository.findAll(body);
      return res;
    }

    @Post("/save")
    async save(@Body() body: Model) {
      await this.repository.save(body);
      return { message: 'success' };
    }
}