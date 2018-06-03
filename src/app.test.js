const Hemera = require('nats-hemera');
const nats = require('nats').connect({
  url: process.env.NATS_URL,
  user: process.env.NATS_USER,
  pass: process.env.NATS_PW
});

const hemera = new Hemera(nats, {
  logLevel: 'info'
});

(async () => {
  let resp;
  await hemera.ready();
  resp = await hemera.act({
    topic: 'CALL.account.create',
    meta$: {
      id: '1234-abcdef-5678-hi-90',
      user: {id: 1, permissions: ['CALL.account.create']}
    }
  });
  console.log(resp.data);
  /*try {
      resp = await hemera.act({
          topic: 'CALL.account.deposit',
          id: 1,
          meta$: {
              id: '1234-abcdef-5678-hi-90',
              user: {id: 1, permissions: ['CALL_OWN_ACCOUNT_DEPOSITE', 'CALL_ACCOUNT_DEPOSITE']}
          },
          amount: 23.32,
      });
      console.log(resp.data);
  } catch (ex) {
      console.log(ex);
  }
  resp = await resp.context.act({
      topic: 'GET.account.balance',
      meta$: {id: '1234-abcdef-5678-hi-90', user: {id: 1, permissions: ['GET_OWN_ACCOUNT_BALANCE', 'GET_ACCOUNT_BALANCE']}},
  });
  console.log(resp.data);
  resp = await resp.context.act({
      topic: 'CALL.account.debit',
      meta$: {id: '1234-abcdef-5678-hi-90', user: {id: 1, permissions: ['CALL_OWN_ACCOUNT_DEBIT', 'CALL_ACCOUNT_DEBIT']}},
      amount: 100,
  });
  console.log(resp.data);
  resp = await resp.context.act({
      topic: 'GET.account.balance',
      meta$: {id: '1234-abcdef-5678-hi-90', user: {id: 1, permissions: ['GET_OWN_ACCOUNT_BALANCE', 'GET_ACCOUNT_BALANCE']}},
  });
  console.log(resp.data);*/
})().catch(console.error);
