import { expect } from 'chai';
import 'mocha';
import {AccountService} from "./account.service";
import {AccountServiceImpl} from "./account.service.impl";
import {RequestGenerator} from "../test/request.generator";
import {AccountPersistenceDummy} from "../test/account.persistence.dummy";

const ERRORS = require('../errors.json');

describe('AccountService', () => {
  let persistence;
  let requestGenerator: RequestGenerator;
  before(() => {
    persistence = new AccountPersistenceDummy();
    requestGenerator = new RequestGenerator('service-test');
  });

  describe('create', () => {
    it('Should reject if role USER is missing', async() => {
      const service: AccountService = new AccountServiceImpl(persistence, requestGenerator.getInvalid());
      await service.create().then(account => {
        expect(false).to.be.true;
      }).catch(err => {
        expect(err.message === ERRORS.MISSING_PERMISSION).to.be.true;
        expect(err.name === 'Error').to.be.true;
      })
    });
    it('Should accept if role USER is set', async() => {
      const service: AccountService = new AccountServiceImpl(persistence, requestGenerator.getValid());
      await service.create().then(account => {
        expect(account).to.be.not.undefined;
      }).catch(err => {
        expect(false).to.be.true;
      });
      return await true;
    });
  });

  describe('getAll', () => {
    it('Should reject if role USER is missing', async () => {
      const service: AccountService = new AccountServiceImpl(persistence, requestGenerator.getInvalid());
      await service.getAll().then(accounts => {
        expect(false).to.be.true;
      }).catch(err => {
        expect(err.message === ERRORS.MISSING_PERMISSION).to.be.true;
        expect(err.name === 'Error').to.be.true;
      });
      return await true;
    });

    it('Should accept if role USER is set', async () => {
      const service = new AccountServiceImpl(persistence, requestGenerator.getValid());
      await service.getAll().then(accounts => {
        expect(accounts).to.be.not.undefined;
        expect(accounts.length === 1).to.be.true;
      }).catch(err => {
        expect(false).to.be.true;
      });
      return await true;
    });
  });

  describe('get', () => {
    it('Should reject if role USER is missing', async () => {
      const service = new AccountServiceImpl(persistence, requestGenerator.getInvalid());
      await service.get(1).then(account => {
        expect(false).to.be.true;
      }).catch(err => {
        expect(err.message === ERRORS.MISSING_PERMISSION).to.be.true;
        expect(err.name === 'Error').to.be.true;
      });
      return await true;
    });
    it('Should accept if role USER is set', async () => {
      const service = new AccountServiceImpl(persistence, requestGenerator.getValid());
      await service.get(1).then(account => {
        expect(account).not.to.be.undefined;
      }).catch(err => {
        expect(err.message === ERRORS.MISSING_PERMISSION).to.be.true;
        expect(err.name === 'Error').to.be.true;
      });
      return await true;
    });
  });

  describe('deposit', () => {
    it('Should reject if role USER is missing', async () => {
      const service = new AccountServiceImpl(persistence, requestGenerator.getInvalid());
      await service.deposit(1, 100).then(account => {
        expect(false).to.be.true;
      }).catch(err => {
        expect(err.message === ERRORS.MISSING_PERMISSION).to.be.true;
        expect(err.name === 'Error').to.be.true;
      });
      return await true;
    });
    it('Should accept if role USER is set', async () => {
      const service = new AccountServiceImpl(persistence, requestGenerator.getValid());
      await service.deposit(1, 100).then(account => {
        expect(account).not.to.be.undefined;
      }).catch(err => {
        expect(err.message === ERRORS.MISSING_PERMISSION).to.be.true;
        expect(err.name === 'Error').to.be.true;
      });
      return await true;
    });
  });

  describe('debit', () => {
    it('Should reject if role USER is missing', async () => {
      const service = new AccountServiceImpl(persistence, requestGenerator.getInvalid());
      await service.debit(1, 100).then(account => {
        expect(false).to.be.true;
      }).catch(err => {
        expect(err.message === ERRORS.MISSING_PERMISSION).to.be.true;
        expect(err.name === 'Error').to.be.true;
      });
      return await true;
    });
    it('Should accept if role USER is set', async () => {
      const service = new AccountServiceImpl(persistence, requestGenerator.getValid());
      await service.debit(1, 100).then(account => {
        expect(account).not.to.be.undefined;
      }).catch(err => {
        expect(err.message === ERRORS.MISSING_PERMISSION).to.be.true;
        expect(err.name === 'Error').to.be.true;
      });
      return await true;
    });
  });

  describe('close', () => {
    it('Should reject if role USER is missing', async () => {
      const service = new AccountServiceImpl(persistence, requestGenerator.getInvalid());
      await service.close(1).then(result => {
        expect(false).to.be.true;
      }).catch(err => {
        expect(err.message === ERRORS.MISSING_PERMISSION).to.be.true;
        expect(err.name === 'Error').to.be.true;
      });
      return await true;
    });
    it('Should accept if role USER is set', async () => {
      const service = new AccountServiceImpl(persistence, requestGenerator.getValid());
      await service.close(1).then(result => {
        expect(result).not.to.be.undefined;
        expect(result).to.be.true;
      }).catch(err => {
        expect(err.message === ERRORS.MISSING_PERMISSION).to.be.true;
        expect(err.name === 'Error').to.be.true;
      });
      return await true;
    });
  });

  describe('closeAll', () => {
    it('Should reject if role USER is missing', async () => {
      const service = new AccountServiceImpl(persistence, requestGenerator.getInvalid());
      await service.closeAll().then(result => {
        expect(false).to.be.true;
      }).catch(err => {
        expect(err.message === ERRORS.MISSING_PERMISSION).to.be.true;
        expect(err.name === 'Error').to.be.true;
      });
      return await true;
    });
    it('Should accept if role USER is set', async () => {
      const service = new AccountServiceImpl(persistence, requestGenerator.getValid());
      await service.closeAll().then(result => {
        expect(result).not.to.be.undefined;
        expect(result).to.be.true;
      }).catch(err => {
        expect(err.message === ERRORS.MISSING_PERMISSION).to.be.true;
        expect(err.name === 'Error').to.be.true;
      });
      return await true;
    });
  });
});

