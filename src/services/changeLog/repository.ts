import { Service } from "typedi";
import Model from "./model";
import { validWithPagination } from '../../config/decorators';

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
    // here, for example you can load category id using mongoose
    // you can also return a promise here
    return this.model.findOne({
      where: {
        id
      }
    });
  }

  save(body: Model) {
    
    return body.save();
  }
}
