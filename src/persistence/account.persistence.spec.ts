import { expect } from 'chai';
import 'mocha';

import { PgDb } from "pogi";
import {AccountPersistenceImpl} from "./account.persistence.impl";
import {AccountImpl} from "../model/account.impl";

describe('Account persistence', () => {
  let pgdb;
  let persistence;
  before(async () => {
    pgdb = await PgDb.connect({
      connectionString: process.env.PG_URL
    });
    persistence =new AccountPersistenceImpl(pgdb);
    return await true;
  });

  describe('When create account', () => {
    it('Should return an empty Account with owner passed', async () => {
      const owner = 1;
      const account = await persistence.create(owner);
      expect(Number(account.balance)).to.be.equal(0);
      expect(account.owner).to.be.equal(owner);
      return await true;
    });
    it('Should reject with TypeError if owner is null', async () => {
      await persistence.create(null).then(account => {
        expect(typeof account === 'undefined').to.be.true;
      }).catch(err => {
        expect(err.message === 'valid owner must be > 0').to.be.true;
        expect(err.name === 'TypeError').to.be.true;
      });
      return await true;
    });
    it('Should reject with TypeError if owner is undefined', async () => {
      await persistence.create(undefined).then(account => {
        expect(typeof account === 'undefined').to.be.true;
      }).catch(err => {
        expect(err.message === 'valid owner must be > 0').to.be.true;
        expect(err.name === 'TypeError').to.be.true;
      });
      return await true;
    });
    it('Should throw an error if owner id is 0', async () => {
      const account = await persistence.create(0).then(account => {
        expect(typeof account === 'undefined').to.be.true;
      }).catch(err => {
        expect(err.message === 'valid owner must be > 0').to.be.true;
        expect(err.name === 'RangeError').to.be.true;
      });
      return await true;
    });
    it('Should reject if owner id is < 0', async () => {
      await persistence.create(-1).then(account => {
        expect(typeof account === 'undefined').to.be.true;
      }).catch(err => {
        expect(err.message === 'valid owner must be > 0').to.be.true;
        expect(err.name === 'RangeError').to.be.true;
      });
      return await true;
    });
  });

  describe('When deleting account', () => {
    it('Should return the id of the account deleted', async () => {
      const account = await persistence.create(1);
      let id = account.id;
      let result = await persistence.remove(account);
      expect(id).to.be.equal(result);
      return await true;
    });
    it('Should reject if account id does not exist', async () => {
      const account = await persistence.create(1);
      await persistence.remove(account);
      await persistence.remove(account).then(res => {
        expect(typeof account === 'undefined').to.be.true;
      }).catch(err => {
        expect(err.name === 'Error').to.be.true;
        expect(err.message === 'account does not exist').to.be.true;
      });
      return await true;
    });
    it('Should delete account from database', async () => {
      const account = await persistence.create(1);
      const id = account.id;
      await persistence.remove(account);
      await pgdb.queryFirst(
        'SELECT * FROM account WHERE id = :id',
        { id },
      ).then(account => {
        expect(typeof account === 'undefined').to.be.true;
      }).catch(err => {
        expect(typeof err === 'undefined').to.be.true;
      });
      return await true;
    });
  });

  describe('When retrieving account', () => {
    it('Should retrieve an existing account', async() => {
      let owner = 1;
      let account = await persistence.create(owner);
      const id = account.id;
      account = await persistence.get(id);
      expect(account.id).to.be.equal(id);
      expect(account.owner).to.be.equal(owner);
      return await true;
    });
    it('Should not retrieve an not existing account', async() => {
      const id = await persistence.create(1).then(account => account.id);
      await persistence.get(id + 1).then(account => {
        expect(typeof account === 'undefined').to.be.true;
      }).catch(err => {
        expect(err.name === 'Error').to.be.true;
        expect(err.message === 'account does not exist');
      });
      await persistence.get(null).then(account => {
        expect(typeof account === 'undefined').to.be.true;
      }).catch(err => {
        expect(err.name === 'Error').to.be.true;
        expect(err.message === 'account does not exist');
      });
      await persistence.get(undefined).then(account => {
        expect(typeof account === 'undefined').to.be.true;
      }).catch(err => {
        expect(err.name === 'Error').to.be.true;
        expect(err.message === 'account does not exist');
      });
      await persistence.get(0).then(account => {
        expect(typeof account === 'undefined').to.be.true;
      }).catch(err => {
        expect(err.name === 'Error').to.be.true;
        expect(err.message === 'account does not exist');
      });
      await persistence.get(-1).then(account => {
        expect(typeof account === 'undefined').to.be.true;
      }).catch(err => {
        expect(err.name === 'Error').to.be.true;
        expect(err.message === 'account does not exist');
      });
      return await true;
    });
  });

  describe('When updating account', () => {
    it('Should store balance in database', async () => {
      const id = await persistence.create(1).then(acc => acc.id);
      const balance = 1000;
      let account =new AccountImpl({
        id, balance
      });
      await persistence.update(account);
      await pgdb.queryFirst(
        'SELECT * FROM account WHERE id = :id',
        { id }).then(account => {
          expect(account.id).to.be.equal(id);
          expect(Number(account.balance)).to.be.equal(balance);
      });
      const negativeBalance = balance * -1;
      account =new AccountImpl({
        id, balance: negativeBalance
      });
      await  persistence.update(account);
      await pgdb.queryFirst(
        'SELECT * FROM account WHERE id = :id',
        { id }).then(account => {
        expect(account.id).to.be.equal(id);
        expect(Number(account.balance)).to.be.equal(negativeBalance);
      });
      return await true;
    });
    it('Should not store new id in database', async () => {
      const id = await persistence.create(1).then(acc => acc.id);
      const balance = 1000;
      let account =new AccountImpl({
        id: id + 1, balance
      });
      await persistence.update(account).then(account => {
        expect(typeof account === 'undefined').to.be.true;
      }).catch(err => {
        expect(err.name === 'Error').to.be.true;
        expect(err.message === 'account does not exist').to.be.true;
      });
      return await true;
    });
    it('Should not store other then negative or balance', async () => {
      const owner = 1;
      const account= await persistence.create(owner);
      const id = account.id;
      const datetime = account.datetime;
      const negative = account.negative;
      const balance = 1000;
      await persistence.update(new AccountImpl({
        id, balance, owner: 2, datetime: new Date(), negative: !negative
      })).then(account => {
        expect(account.owner).to.be.equal(owner);
        expect(account.datetime.getTime()).to.be.equal(datetime.getTime());
        expect(account.negative).to.be.equal(!negative);
        expect(Number(account.balance)).to.be.equal(balance);
      });
      return await true;
    });
  });

  describe('When retrieving own accounts', () => {
    it('Should return an array of accounts or empty array', async () => {
      let accounts = await persistence.getOwn(Number.MAX_SAFE_INTEGER);
      expect(accounts).to.be.empty;
      await persistence.create(1);
      accounts = await persistence.getOwn(1);
      expect(accounts.length).to.be.greaterThan(0);
      return await true;
    });
  });

  describe('When retrieving all accounts', () => {
    it('Should return an array of all accounts', async () => {
      await persistence.create(1);
      await persistence.create(2);
      await persistence.create(3);
      let accounts = await persistence.getAll();
      let ids = new Set(accounts.map(account => account.id));
      expect(ids.size).to.be.greaterThan(2);
      return await true;
    });
  });
});
