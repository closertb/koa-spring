import { Service } from "typedi";
// import { Op } from 'Sequelize';
import { Sequelize } from 'sequelize-typescript';
import Rule from "./model";
import Repository from '../Repository';
import { validWithPagination } from '../../config/decorators';
import Enums from '../enums/model';
import { PageParams } from '../../config/interface';

@Service()
export default class RuleRepository extends Repository {
  constructor() {
    super(Rule);
  }
  @validWithPagination
  findAll(model: object = {}, pagination: PageParams) {
    return this.model.findAndCountAll({
      where: {
          ...model
      },
      ...pagination,
      include: [{
        model: Enums,
        as: 'scene_name',
        where: { tag: Sequelize.col('Rule.related_enums') },
        // required: false
      }]
    });
  }

}
