import { Service } from "typedi";
import { Op } from 'Sequelize';
import Rule from "./model";
import { formatDetail, validBody, validWithPagination } from '../../config/decorators';
import { AnyObject } from '../../config/interface';

@Service()
export default class RuleRepository {

  private rule = Rule;

  @validWithPagination
  findAll(rule: AnyObject) {
      // here, for example you can load categories using mongoose
      // you can also return a promise here
      // simulate async with creating an empty promise
      const { scene_code, ...others } = rule;
      return this.rule.findAll({
        where: {
          is_delete: 0,
          scene_code: {
            [Op.like]: `%${scene_code}%`
          },
          ...others
        },
        // transaction: (data) => data.map(({ dataValues }) => dataValues)
      });
  }

  @formatDetail
  findOne(id: number) {
      // here, for example you can load category id using mongoose
      // you can also return a promise here
      return this.rule.findOne({
        where: {
          id
        }
      });
  }

  save(rule: Rule) {
      // here, for example you can save a category to mongodb using mongoose
      return rule.save();
  }

  @validBody
  update(body: AnyObject) {
    const { id, ...others } = body;
    // here, for example you can save a category to mongodb using mongoose
    return this.rule.update({
      ...others,
    }, {
      where: {
        id
      }
    });
  }
}
