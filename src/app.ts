import * as NATS from 'nats';
import * as Hemera from 'nats-hemera';
import * as HemeraJoi from 'hemera-joi'
import {PgDb} from 'pogi';
import {AccountPersistence} from "./persistence/account.persistence";
import {AccountService} from "./service/account.service";
import {AccountServiceImpl} from "./service/account.service.impl";
import {AccountPersistenceImpl} from "./persistence/account.persistence.impl";
import {Client} from "nats";
import {logger, pogiLogger} from "./logger";

const nats: Client = NATS.connect({
  url: process.env.NATS_URL,
  user: process.env.NATS_USER,
  pass: process.env.NATS_PW,
});
const hemera: Hemera = new Hemera(nats, {
  logLevel: 'info',
  childLogger: true,
  tag: 'hemera-account',
  logger,
});

let persistence: AccountPersistence;
let service: AccountService;

(async()=> {
  const pgdb: PgDb = await PgDb.connect({
    connectionString: process.env.PG_URL,
    logger: pogiLogger,
  });
  persistence = new AccountPersistenceImpl(pgdb);

  hemera.use(HemeraJoi);

  await hemera.ready();

  const Joi = hemera['joi'];

  hemera.add({
    topic: 'GET.account',
    id: Joi.number().required(),
  }, async function(req) {
    service = new AccountServiceImpl(persistence, this.meta$);
    return await service.get(req.id);
  });

  hemera.add({
    topic: 'CREATE.account',
  }, async function(req) {
    service = new AccountServiceImpl(persistence, this.meta$);
    return await service.create();
  });

  hemera.add({
    topic: 'CALL.account.debit',
    id: Joi.number().required(),
    amount: Joi.number().required(),
  }, async function(req) {
    service = new AccountServiceImpl(persistence, this.meta$);
    return await service.debit(req.id, req.amount);
  });

  hemera.add({
    topic: 'CALL.account.deposit',
    id: Joi.number().required(),
    amount: Joi.number().required(),
  }, async function(req) {
    service = new AccountServiceImpl(persistence, this.meta$);
    return await service.deposit(req.id, req.amount);
  });

  hemera.add({
    topic: 'CLOSE.account',
    id: Joi.number().required(),
  }, async function(req) {
    service = new AccountServiceImpl(persistence, this.meta$);
    return await service.close(req.id);
  });

  hemera.add({
    topic: 'CLOSE.account.all',
  }, async function(req) {
    service = new AccountServiceImpl(persistence, this.meta$);
    return await service.closeAll();
  });

  hemera.add({
    topic: 'GET.account.all',
  }, async function(req) {
    service = new AccountServiceImpl(persistence, this.meta$);
    return await service.getAll();
  });

  hemera.add({
    topic: 'SET.account.negative',
    id: Joi.number().required(),
    value: Joi.boolean().required(),
  }, async function(req) {
    service = new AccountServiceImpl(persistence, this.meta$);
    return await service.setNegativeFlag(req.id, req.value);
  })

})().catch(logger.error);
