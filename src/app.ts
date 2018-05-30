import * as NATS from 'nats';
import * as Hemera from 'nats-hemera';
import * as HemeraJoi from 'hemera-joi'
import {Account} from "./account";

const topic = 'nats';
const subject = 'account';
const nats = NATS.connect({
    url: process.env.NATS_URL,
    user: process.env.NATS_USER,
    pass: process.env.NATS_PW
});
const account = new Account();

const hemera = new Hemera(nats, {
    logLevel: 'debug',
    childLogger: true,
    tag: 'hemera-account',
});

async function start() {
    hemera.use(HemeraJoi);
    await hemera.ready();

    const Joi = hemera['joi'];

    hemera.add({
        topic: `${topic}.${subject}`,
        cmd: 'balance',
    }, async (req) => {
        // log request?
        return await account.balance
    });

    hemera.add({
        topic: `${topic}.${subject}`,
        cmd: 'deposit',
        amount: Joi.number().required(),
    }, async (req) => {
        // log request?
        return await account.deposit(req.amount);
    });

    hemera.add({
        topic: `${topic}.${subject}`,
        cmd: 'debit',
        amount: Joi.number().required(),
    }, async (req) => {
        // log request?
        return await account.debit(req.amount);
    });


}

start();