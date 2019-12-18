import { Service } from "typedi";
import { Op } from 'Sequelize';
// import { Sequelize } from 'sequelize-typescript';
import Rule from "./model";
import Repository from '../Repository';
import { validWithPagination } from '../../config/decorators';
import { AnyObject } from '../../config/interface';

@Service()
export default class RuleRepository extends Repository {
  constructor() {
    super(Rule);
  }
}
