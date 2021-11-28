const { v4: uuidv4, validate: uuidCheck } = require('uuid');
const { MyCustomError } = require('../../common/myCustomError');

class Person {
  constructor({ id = uuidv4(), name = 'USER', age = 0, hobbies = [] } = {}) {
    this.id = id;
    this.name = name;
    this.age = age;
    this.hobbies = hobbies;
  }

  static checkData(data) {
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
  }

  static checkID(id) {
    if (!uuidCheck(id)) {
      throw new MyCustomError(`id: "${id}" is not a valid UUID`, 400);
    }
  }
}

module.exports = { Person };
