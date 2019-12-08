import { Service } from "typedi";
import Rule from "../model/Rule";

@Service()
export default class RuleRepository {

  private rule = Rule;

  findAll() {
      // here, for example you can load categories using mongoose
      // you can also return a promise here
      // simulate async with creating an empty promise
      return this.rule.findAll({
        where: {
          is_delete: 0
        }
      });
  }

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

  update(id: number) {
    // here, for example you can save a category to mongodb using mongoose
    return this.rule.update({
      "is_delete": 1,
    }, {
      where: {
        id
      }
    });
  }
}
