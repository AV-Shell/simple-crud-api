const Router = require('../../OrientExpress/Router');
const personsService = require('./persons.service');
const { Person } = require('./person.model');
const personsRouter = new Router();

personsRouter.get('/person', async (req, res) => {
  // throw new Error();
  const persons = await personsService.getAll();
  res.json(persons, 200);
});

personsRouter.get('/person/:id', async (req, res) => {
  // throw new Error();
  Person.checkID(req.params?.id);
  const persons = await personsService.getById(req.params.id);
  res.json(persons, 200);
});

personsRouter.post('/person', async (req, res) => {
  // throw new Error();
  Person.checkData(req.body);
  const person = await personsService.create(new Person(req.body));
  res.json(person, 201);
});

personsRouter.put('/person/:id', async (req, res) => {
  // throw new Error();
  Person.checkID(req.params?.id);
  Person.checkData(req.body);
  req.body.id = req.params?.id;
  const person = await personsService.update(new Person(req.body), req.params.id);
  res.json(person, 200);
});

personsRouter.delete('/person/:id', async (req, res) => {
  // throw new Error();
  Person.checkID(req.params?.id);
  const person = await personsService.deleteById(req.params.id);
  res.json(person, 204);
});

module.exports = personsRouter;
