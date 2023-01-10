import { v4 as uuidv4, validate as uuidCheck } from 'uuid';
import { MyCustomError } from '../../common/myCustomError';
import { myAny } from '../../common/types.d';

export interface IUser {
  id: string;
  age: number;
  name: string;
  hobbies: Array<string>;
}

export class User {
  public id: string;
  public age: number;
  public name: string;
  public hobbies: Array<string>;

  constructor({ name = 'USER', age = 0, hobbies = [] }: myAny = {}) {
    this.id = uuidv4();
    this.name = name;
    this.age = age;
    this.hobbies = hobbies;
  }

  static checkData(data: myAny): Partial<IUser> {
    const { name, age, hobbies } = data ?? {};
    if (!name) {
      throw new MyCustomError('"name" is required field', 400);
    }
    if (!name || typeof name !== 'string') {
      throw new MyCustomError('"name" is not valid data. Must be a string', 400);
    }
    if (!age) {
      throw new MyCustomError('"age" is required field', 400);
    }
    if (!age || typeof age !== 'number') {
      throw new MyCustomError('"age" is not valid data. Must be a number', 400);
    }

    if (!hobbies) {
      throw new MyCustomError('"hobbies" is required field', 400);
    }
    if (!hobbies || !Array.isArray(hobbies)) {
      throw new MyCustomError('"hobbies" is not valid data. Must be an array', 400);
    }

    return { name, age, hobbies };
  }

  static checkID(id: string) {
    if (!uuidCheck(id)) {
      throw new MyCustomError(`id: "${id}" is not a valid UUID`, 400);
    }
  }
}
