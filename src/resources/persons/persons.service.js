const personsRepo = require('./person.memory.repository');

const getAll = () => personsRepo.getAll();

const getById = id => personsRepo.getById(id);

const create = (person) => personsRepo.create(person);

const update = (person, id) => personsRepo.update(person, id);

const deleteById = id => personsRepo.deleteById(id);

module.exports = {
  getAll,
  create,
  getById,
  update,
  deleteById
};
