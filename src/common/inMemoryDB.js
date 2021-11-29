const { Person } = require('../resources/persons/person.model');

const PersonDB = [new Person(), new Person(), new Person()];

const getAllPersons = () => PersonDB.map((el) => ({ ...el }));

const getPersonById = (id) => {
  const person = PersonDB.filter((el) => el.id === id);
  if (person.length === 1) {
    return { ...person[0] };
  }
  return null;
};

const createPerson = (person) => {
  PersonDB.push({ ...person });
  return getPersonById(person.id);
};

const updatePerson = (person, id) => {
  let pos = null;
  for (let i = 0; i < PersonDB.length; i += 1) {
    if (PersonDB[i].id === id) {
      pos = i;
      break;
    }
  }
  if (pos !== null) {
    PersonDB[pos] = { ...PersonDB[pos], ...person, id };
    return { ...PersonDB[pos] };
  }
  return null;
};

const deletePersonById = (id) => {
  let pos = null;
  for (let i = 0; i < PersonDB.length; i += 1) {
    if (PersonDB[i].id === id) {
      pos = i;
      break;
    }
  }
  if (pos !== null) {
    return PersonDB.splice(pos, 1);
  }
  return null;
};

module.exports = {
  getAllPersons,
  getPersonById,
  createPerson,
  updatePerson,
  deletePersonById,
};
