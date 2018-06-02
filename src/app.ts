import * as NATS from 'nats';
import * as Hemera from 'nats-hemera';
import * as HemeraJoi from 'hemera-joi'
import {AccountService, AccountServiceImpl} from './account';
import {PgDb} from 'pogi';

import {AccountPersistence} from "./persistence/account.persistence";

const nats = NATS.connect({
  url: process.env.NATS_URL,
  user: process.env.NATS_USER,
  pass: process.env.NATS_PW,
});
const account:AccountService = new AccountServiceImpl();

const hemera = new Hemera(nats, {
  logLevel: 'info',
  childLogger: true,
  tag: 'hemera-account',
});

(async()=> {
  const pgdb = await PgDb.connect({
    connectionString: process.env.PG_URL,
    logger: console,
  });
  AccountServiceImpl.use(new AccountPersistence(pgdb));

  hemera.use(HemeraJoi);

  await hemera.ready();

  const Joi = hemera['joi'];

  hemera.add({
    topic: 'GET.account.balance',
    id: Joi.number().required(),
  }, async function(req) {
    console.log(this.meta$);
    // log request?
    return await account.balance;
  });

  hemera.add({
    topic: 'CALL.account.deposit',
    // id: Joi.number().required(),
    amount: Joi.number().required(),
  }, async function(req) {
    console.log(this.meta$);
    // log request?
    return await account.deposit(req.amount);
  });

  hemera.add({
    topic: 'CALL.account.debit',
    // id: Joi.number().required(),
    amount: Joi.number().required(),
  }, async function(req) {
    console.log(this.meta$);
    // log request?
    return await account.debit(req.amount);
  });

  hemera.add({
    topic: 'CALL.account.create',
  }, async function(req) {
    if (!this.meta$.user || !this.meta$.user.id) throw new PermissionError('user is required');
    const user = this.meta$.user;
    if (!user.permissions || !user.permissions.includes('CALL.account.create'))
      throw new PermissionError('missing permission CALL.account.create');
    return await AccountServiceImpl.create(user.id);
  });

})().catch(console.error);

class PermissionError extends Error { }
