import { Service } from "typedi";
import Model from "./model";
import { formatDetail, validBody, validWithPagination } from '../../config/decorators';
import { AnyObject } from '../../config/interface';

@Service()
export default class Repository {

  private model = Model;

  @validWithPagination
  findAll(body: object = {}) {
    return this.model.findAll({
      where: {
          ...body
      }
    });
  }

  findOne(id: number) {
    return this.model.findOne({
      where: {
        id
      }
    });
  }
  @validBody
  update(body: AnyObject) {
    const { id, ...others } = body;
    return this.model.update({
      ...others,
    }, {
      where: {
        id
      }
    });
  }
  save(body: Model) {
    return body.save();
  }
}
