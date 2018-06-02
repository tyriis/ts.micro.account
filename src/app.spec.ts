import { expect } from 'chai';
import 'mocha';
import * as NATS from 'nats';
import * as Hemera from 'nats-hemera';

describe('App', () => {
  describe('Account create', () => {

    it('Should return an error if no user is set in meta', (done) => {
      const nats = NATS.connect({
        url: process.env.NATS_URL,
        user: process.env.NATS_USER,
        pass: process.env.NATS_PW,
      });
      const hemera = new Hemera(nats, {});
      hemera.ready(() => {
        hemera.act(
          {
            topic: 'CALL.account.create',
          },
          (err, resp) => {
            expect(err === null).to.be.false;
            expect(err.message === 'user is required').to.be.true;
            expect(typeof resp === 'undefined').to.be.true;
            hemera.close(done)
          }
        )
      });
    });

    it('Should return an error if permission (CALL.account.create) is not set in mata.user.persmissions', (done) => {
      const nats = NATS.connect({
        url: process.env.NATS_URL,
        user: process.env.NATS_USER,
        pass: process.env.NATS_PW,
      });
      const hemera = new Hemera(nats, {});
      hemera.ready(() => {
        hemera.act(
          {
            topic: 'CALL.account.create',
            meta$: {
              id: '1234-abcdef-5678-hi-90',
              user: {id: 1, permissions: []}
            }
          },
          (err, resp) => {
            expect(err === null).to.be.false;
            expect(err.message === 'missing permission CALL.account.create').to.be.true;
            expect(typeof resp === 'undefined').to.be.true;
            hemera.close(done)
          }
        )
      });
    });

    it('Should return an error if permissions is not set in meta$.user.persmissions', (done) => {
      const nats = NATS.connect({
        url: process.env.NATS_URL,
        user: process.env.NATS_USER,
        pass: process.env.NATS_PW,
      });
      const hemera = new Hemera(nats, {});
      hemera.ready(() => {
        hemera.act(
          {
            topic: 'CALL.account.create',
            meta$: {
              id: '1234-abcdef-5678-hi-90',
              user: {id: 1}
            }
          },
          (err, resp) => {
            expect(err === null).to.be.false;
            expect(err.message === 'missing permission CALL.account.create').to.be.true;
            expect(typeof resp === 'undefined').to.be.true;
            hemera.close(done)
          }
        )
      });
    });

    it('Should return a new account', (done) => {
      const nats = NATS.connect({
        url: process.env.NATS_URL,
        user: process.env.NATS_USER,
        pass: process.env.NATS_PW,
      });
      const hemera = new Hemera(nats, {});
      hemera.ready(() => {
        hemera.act(
          {
            topic: 'CALL.account.create',
            meta$: {
              id: '1234-abcdef-5678-hi-90',
              user: {id: 1, permissions: ['CALL.account.create']}
            }
          },
          (err, resp) => {
            expect(err === null).to.be.true;
            expect(typeof resp === 'undefined').to.be.false;
            expect(resp.account.owner).to.be.equal(1);
            hemera.close(done)
          }
        )
      });
    });
  });
});
