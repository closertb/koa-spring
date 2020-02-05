import { JsonController, Get, Post, Param, Ctx, Body, UseAfter } from "routing-controllers";
import { Service } from "typedi";
import Controller from '../Controller';
import RecordMiddleWare from '../../middlewares/RecordMiddleWare';
import Repository from "./repository";
import Rule from "./model";
import { AnyObject } from '../../config/interface';

@Service()
@JsonController('/rule')
export default class Ruletroller extends Controller {
  constructor(public repository: Repository) {
    super(repository)
  }

  @Post("/query")
  async all(@Body() body: object) {
    return super.all(body);
  }

  @Post("/detail")
  async one(@Body() body: AnyObject) {
    return super.one(body);
  }

  @Get("/query/:id")
  async extendOne(@Param("id") id: number) {
    return super.findById(id);
  }

  @Post("/save")
  async save(@Body() rule: Rule) {
    return super.save(rule);
  }

  @Post("/update")
  @UseAfter(RecordMiddleWare)
  async updateWithRecord(@Body() body: AnyObject) { // 新方法
    const { id } = body;
    const before = await this.repository.findOne(id);
    await this.repository.update(body);
    return { before, after: body, id, update_type: 'rule' };
  }
}