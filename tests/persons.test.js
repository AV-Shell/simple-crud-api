const { expect } = require('@jest/globals');
const dotenv = require('dotenv');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const supertest = require('supertest');

dotenv.config({
  path: path.join(__dirname, './../.env'),
});

const host = process.env.PORT ? `localhost:${process.env.PORT}` : 'localhost:5000';
console.log('HOST', host);
const request = supertest(host);

const personsRoutes = {
  getAll: '/person',
  getById: (id) => `/person/${id}`,
  create: '/person',
  update: (id) => `/person/${id}`,
  delete: (id) => `/person/${id}`,
};

const TEST_PERSON_DATA = {
  name: 'Maksim',
  age: 29,
  hobbies: ['Writing tests', 'Update old tasks', 'Have fun with Node JS course'],
};

const TEST_PERSON_DATA2 = {
  name: 'Yura',
  age: 38,
  hobbies: ['Create servers', 'Be serious'],
};

describe('Persons suite 1', () => {
  let personId;
  beforeAll(async () => {
    console.log(`
    "   Mesdames et messieurs,
        nous avons l'honneur ce soir
        de vous présenter la nouvelle collection
        de Rammstein!"`);
    personId = null;
  });

  describe('GET', () => {
    it('should get all persons', async () => {
      const personsResponse = await request
        .get(personsRoutes.getAll)
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/);
      console.log(personsResponse.body);

      expect(personsResponse.status).toEqual(200);
      expect(Array.isArray(personsResponse.body)).toBeTruthy();
    });
  });

  describe('POST', () => {
    it('should create a person successfuly', async () => {
      const personResponse = await request
        .post(personsRoutes.create)
        .set('Accept', 'application/json')
        .send(TEST_PERSON_DATA)
        .expect(201)
        .expect('Content-Type', /json/);

      expect(typeof personResponse.body.id).toBe('string');
      expect(personResponse.body.name).toBe(TEST_PERSON_DATA.name);
      expect(personResponse.body.age).toBe(TEST_PERSON_DATA.age);
      expect(personResponse.body.hobbies).toStrictEqual(TEST_PERSON_DATA.hobbies);
      personId = personResponse.body.id;
    });
  });

  describe('GET/${id}', () => {
    it('should get a created person successfuly', async () => {
      const personResponse = await request
        .get(personsRoutes.getById(personId))
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(personResponse.body).toBeInstanceOf(Object);
      expect(personResponse.body.id).toBe(personId);
      expect(personResponse.body.name).toBe(TEST_PERSON_DATA.name);
      expect(personResponse.body.age).toBe(TEST_PERSON_DATA.age);
      expect(personResponse.body.hobbies).toStrictEqual(TEST_PERSON_DATA.hobbies);
    });
  });

  describe('PUT/${id}', () => {
    it('should update person successfuly', async () => {
      const personResponse = await request
        .put(personsRoutes.update(personId))
        .set('Accept', 'application/json')
        .send(TEST_PERSON_DATA2)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(personResponse.body).toBeInstanceOf(Object);
      expect(personResponse.body.id).toBe(personId);
      expect(personResponse.body.name).toBe(TEST_PERSON_DATA2.name);
      expect(personResponse.body.age).toBe(TEST_PERSON_DATA2.age);
      expect(personResponse.body.hobbies).toStrictEqual(TEST_PERSON_DATA2.hobbies);
    });
  });

  describe('GET/${id}', () => {
    it('should get a created person successfuly', async () => {
      const personResponse = await request
        .get(personsRoutes.getById(personId))
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(personResponse.body).toBeInstanceOf(Object);
      expect(personResponse.body.id).toBe(personId);
      expect(personResponse.body.name).toBe(TEST_PERSON_DATA2.name);
      expect(personResponse.body.age).toBe(TEST_PERSON_DATA2.age);
      expect(personResponse.body.hobbies).toStrictEqual(TEST_PERSON_DATA2.hobbies);
    });
  });

  describe('DELETE/${id}', () => {
    it('should delete an updated person successfuly', async () => {
      await request
        .delete(personsRoutes.delete(personId))
        .set('Accept', 'application/json')
        .expect(204)
        .expect('Content-Type', /json/);
    });
  });

  describe('GET/${id}', () => {
    it('should do not get a deleted person', async () => {
      const personResponse = await request
        .get(personsRoutes.getById(personId))
        .set('Accept', 'application/json')
        .expect(404)
        .expect('Content-Type', /json/);
    });
  });
});

describe('Persons suite 2', () => {
  let personIds;
  let startPersonIds;
  let personsLength;
  let uuid;

  beforeAll(() => {
    console.log(`
    "   Mesdames et messieurs,
        nous avons l'honneur ce soir
        de vous présenter la nouvelle collection
        de Rammstein!"`);

    personIds = null;
    startPersonIds = null;
    personsLength = null;
    uuid = null;
  });

  describe('GET', () => {
    it('should get all persons', async () => {
      const personsResponse = await request
        .get(personsRoutes.getAll)
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/);
      console.log(personsResponse.body);

      expect(personsResponse.status).toEqual(200);
      expect(Array.isArray(personsResponse.body)).toBeTruthy();
      personsLength = personsResponse.body.length;
      startPersonIds = personsResponse.body.reduce((acc, person) => {
        acc[person.id] = true;
        return acc;
      }, {});
    });
  });

  describe('POST', () => {
    it('should create 10 persons successfuly', async () => {
      for (let i = 0; i < 10; i++) {
        const personResponse = await request
          .post(personsRoutes.create)
          .set('Accept', 'application/json')
          .send(TEST_PERSON_DATA)
          .expect(201)
          .expect('Content-Type', /json/);

        expect(typeof personResponse.body.id).toBe('string');
        expect(personResponse.body.name).toBe(TEST_PERSON_DATA.name);
        expect(personResponse.body.age).toBe(TEST_PERSON_DATA.age);
        expect(personResponse.body.hobbies).toStrictEqual(TEST_PERSON_DATA.hobbies);
      }
    });
  });

  describe('GET', () => {
    it('should get all persons + 10', async () => {
      const personsResponse = await request
        .get(personsRoutes.getAll)
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/);
      console.log(personsResponse.body);

      expect(personsResponse.status).toEqual(200);
      expect(Array.isArray(personsResponse.body)).toBeTruthy();
      expect(personsResponse.body.length).toBe(personsLength + 10);
      personsLength = personsResponse.body.length;
      personIds = personsResponse.body.reduce((acc, person) => {
        acc[person.id] = true;
        return acc;
      }, {});
    });
  });

  describe('GET/${id}', () => {
    it('should do not get a random UUID person ', async () => {
      expect(startPersonIds).toBeInstanceOf(Object);
      expect(personIds).toBeInstanceOf(Object);
      do {
        uuid = uuidv4();
      } while (startPersonIds[uuid] !== undefined || personIds[uuid] !== undefined);
      await request
        .get(personsRoutes.getById(uuid))
        .set('Accept', 'application/json')
        .expect(404)
        .expect('Content-Type', /json/);
    });
  });

  describe('PUT/${id}', () => {
    it('should do not update a random UUID person', async () => {
      await request
        .put(personsRoutes.update(uuid))
        .set('Accept', 'application/json')
        .send(TEST_PERSON_DATA2)
        .expect(404)
        .expect('Content-Type', /json/);
    });
  });

  describe('GET/${id}', () => {
    it('should do not get a random UUID person ', async () => {
      await request
        .get(personsRoutes.getById(uuid))
        .set('Accept', 'application/json')
        .expect(404)
        .expect('Content-Type', /json/);
    });
  });

  describe('DELETE/${id}', () => {
    it('should do not delete aa random UUID person ', async () => {
      await request
        .delete(personsRoutes.delete(uuid))
        .set('Accept', 'application/json')
        .expect(404)
        .expect('Content-Type', /json/);
    });
  });

  describe('DELETE/${id}', () => {
    it('should delete 10 created persons', async () => {
      let delArray = Object.keys(personIds).filter((el) => startPersonIds?.[el] === undefined);

      for (let i = 0; i < delArray.length; i++) {
        await request
          .delete(personsRoutes.delete(delArray[i]))
          .set('Accept', 'application/json')
          .expect(204)
          .expect('Content-Type', /json/);
      }
    });
  });
});

describe('Persons suite 3', () => {
  const invalidUUid = uuidv4().slice(1);
  const invalidUrl = '/persons/tratata/agusik/pokakunkal/';

  describe('GET', () => {
    it('should do not get persons from invalid url', async () => {
      await request.get(invalidUrl).set('Accept', 'application/json').expect(404);
    });
  });

  describe('POST', () => {
    it('should do not create person from invalid url', async () => {
      await request
        .post(invalidUrl)
        .set('Accept', 'application/json')
        .send(TEST_PERSON_DATA)
        .expect(404);
    });
  });

  describe('PUT/${id}', () => {
    it('should do not update person from invalid url', async () => {
      await request.put(invalidUrl).set('Accept', 'application/json').send(TEST_PERSON_DATA2).expect(404);
    });
  });

  describe('DELETE/${id}', () => {
    it('should do not delete person from invalid url', async () => {
      await request.delete(invalidUrl).set('Accept', 'application/json').expect(404);
    });
  });


  describe('GET/${id}', () => {
    it('should do not get person from invalid UUID', async () => {
      await request
        .get(personsRoutes.getById(invalidUUid))
        .set('Accept', 'application/json')
        .expect(400)
        .expect('Content-Type', /json/);
    });
  });


  describe('PUT/${id}', () => {
    it('should do not update person from invalid UUID', async () => {
      await request
        .put(personsRoutes.update(invalidUUid))
        .set('Accept', 'application/json')
        .send(TEST_PERSON_DATA2)
        .expect(400)
        .expect('Content-Type', /json/);
    });
  });

  describe('DELETE/${id}', () => {
    it('should do not delete person from invalid UUID ', async () => {
      await request
        .delete(personsRoutes.delete(invalidUUid))
        .set('Accept', 'application/json')
        .expect(400)
        .expect('Content-Type', /json/);
    });
  });
});
