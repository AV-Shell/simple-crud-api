const { MyCustomError } = require('../../common/myCustomError');
const DB = require('../../common/inMemoryDB');

const getAll = async () => DB.getAllPersons();

const getById = async (id) => {
  const person = await DB.getPersonById(id);
  if (!person) {
    throw new MyCustomError(`The person with id "${id}" was not found`, 404);
  }
  return person;
};

const create = async (person) => DB.createPerson(person);

const update = async (personData, id) => {
  const person = await DB.updatePerson(personData, id);
  if (!person) {
    throw new MyCustomError(`The person with id "${id}" was not found`);
  }
  return person;
};

const deleteById = async (id) => {
  const person = await DB.deletePersonById(id);
  if (!person) {
    throw new MyCustomError(`The person with id "${id}" was not found`);
  }
  return person;
};

module.exports = {
  getAll,
  create,
  getById,
  update,
  deleteById,
};
