import { expect } from 'chai';
import 'mocha';
import * as NATS from 'nats';
import * as Hemera from 'nats-hemera';
import {RequestGenerator} from "./test/request.generator";

const natsOpts = {
  url: process.env.NATS_URL,
  user: process.env.NATS_USER,
  pass: process.env.NATS_PW,
};
let requestGenerator: RequestGenerator;
let hemera: Hemera;

describe('App', () => {

  beforeEach(async () => {
    requestGenerator = new RequestGenerator('app-test');
    hemera = new Hemera(NATS.connect(natsOpts), {});
    return await hemera.ready();
  });

  describe('Account create', () => {
    it('Should reject if meta$ is not set', (done) => {
      hemera.act({
        topic: 'CREATE.account',
      }, (err, resp) => {
        expect(err).to.be.not.null;
        expect(err.message === 'missing permission').to.be.true;
        expect(resp).to.be.undefined;
        hemera.close(done);
      });
    });
    it('Should reject if user.roles is not set in meta$', (done) => {
      hemera.act({
        topic: 'CREATE.account',
        meta$: {
          id: requestGenerator.id,
          user: {id: 1},
        }
      }, (err, resp) => {
        expect(err).to.be.not.null;
        expect(err.message === 'missing permission').to.be.true;
        expect(resp).to.be.undefined;
        hemera.close(done);
      });
    });
    it('Should reject if role USER is missing', (done) => {
      hemera.act({
          topic: 'CREATE.account',
          meta$: {
            id: requestGenerator.id,
            user: {id: 1, roles: ['FOO', 'BAR']},
          }
        }, (err, resp) => {
          expect(err).to.be.not.null;
          expect(err.message === 'missing permission').to.be.true;
          expect(resp).to.be.undefined;
          hemera.close(done);
        }
      )
    });
    it('Should return a new account if role USER is set', (done) => {
      hemera.act({
        topic: 'CREATE.account',
        meta$: requestGenerator.getValid(),
      }, (err, resp) => {
        expect(err).to.be.null;
        expect(resp).to.be.not.undefined;
        expect(resp.data.owner).to.be.equal(1);
        hemera.close(done);
      });
    });
  });

  describe('GET.account', () => {
    it('Should reject if meta$ is not set', (done) => {
      hemera.act({
        topic: 'GET.account',
        id: 1,
      }, (err, resp) => {
        expect(err).to.be.not.null;
        expect(err.message === 'missing permission').to.be.true;
        expect(resp).to.be.undefined;
        hemera.close(done);
      });
    });
    it('Should reject if user.roles is not set in meta$.user', (done) => {
      hemera.act({
        topic: 'GET.account',
        id: 1,
        meta$: {
          id: requestGenerator.id,
          user: {id: 1},
        }
      }, (err, resp) => {
        expect(err).to.be.not.null;
        expect(err.message === 'missing permission').to.be.true;
        expect(resp).to.be.undefined;
        hemera.close(done);
      });
    });
    it('Should reject if role USER is missing', (done) => {
      hemera.act({
        topic: 'GET.account',
        id: 1,
        meta$: {
          id: requestGenerator.id,
          user: {id: 1, roles: ['FOO', 'BAR']},
        }
      }, (err, resp) => {
        expect(err).to.be.not.null;
        expect(err.message === 'missing permission').to.be.true;
        expect(resp).to.be.undefined;
        hemera.close(done);
      });
    });
    it('Should return a new account if role USER is set', (done) => {
      hemera.act({
        topic: 'GET.account',
        id: 1,
        meta$: requestGenerator.getValid(),
      }, (err, resp) => {
        expect(err).to.be.null;
        expect(resp).to.be.not.undefined;
        expect(resp.data.owner).to.be.equal(1);
        hemera.close(done);
      });
    });
  });

  describe('GET.account.all', () => {
    it('Should reject if meta$ is not set', (done) => {
      hemera.act({
        topic: 'GET.account.all',
        id: 1,
        amount: 100,
      }, (err, resp) => {
        expect(err).to.be.not.null;
        expect(err.message === 'missing permission').to.be.true;
        expect(resp).to.be.undefined;
        hemera.close(done);
      });
    });
    it('Should reject if user.roles is not set in meta$.user', (done) => {
      hemera.act({
        topic: 'GET.account.all',
        meta$: {
          id: requestGenerator.id,
          user: {id: 1},
        }
      }, (err, resp) => {
        expect(err).to.be.not.null;
        expect(err.message === 'missing permission').to.be.true;
        expect(resp).to.be.undefined;
        hemera.close(done);
      });
    });
    it('Should reject if role USER is missing', (done) => {
      hemera.act({
        topic: 'GET.account.all',
        meta$: {
          id: requestGenerator.id,
          user: {id: 1, roles: ['FOO', 'BAR']},
        }
      }, (err, resp) => {
        expect(err).to.be.not.null;
        expect(err.message === 'missing permission').to.be.true;
        expect(resp).to.be.undefined;
        hemera.close(done);
      });
    });
    it('Should accept if role USER is set', (done) => {
      hemera.act({
        topic: 'GET.account.all',
        meta$: requestGenerator.getValid(),
      }, (err, resp) => {
        let owner = new Set(resp.map(acc => acc.data.owner));
        expect(err).to.be.null;
        expect(resp).to.be.not.undefined;
        expect(owner.size).to.be.equal(1);
        hemera.close(done);
      });
    });
  });

  describe('CALL.account.debit', () => {
    it('Should reject if meta$ is not set', (done) => {
      hemera.act({
        topic: 'CALL.account.debit',
        id: 1,
        amount: 100,
      }, (err, resp) => {
        expect(err).to.be.not.null;
        expect(err.message === 'missing permission').to.be.true;
        expect(resp).to.be.undefined;
        hemera.close(done);
      });
    });
    it('Should reject if user.roles is not set in meta$.user', (done) => {
      hemera.act({
        topic: 'CALL.account.debit',
        id: 1,
        amount: 100,
        meta$: {
          id: requestGenerator.id,
          user: {id: 1}
        }
      }, (err, resp) => {
        expect(err).to.be.not.null;
        expect(err.message === 'missing permission').to.be.true;
        expect(resp).to.be.undefined;
        hemera.close(done);
      });
    });
    it('Should reject if role USER is missing', (done) => {
      hemera.act({
        topic: 'CALL.account.debit',
        id: 1,
        amount: 100,
        meta$: {
          id: requestGenerator.id,
          user: {id: 1, roles: ['FOO', 'BAR']},
        }
      }, (err, resp) => {
        expect(err).to.be.not.null;
        expect(err.message === 'missing permission').to.be.true;
        expect(resp).to.be.undefined;
        hemera.close(done);
      });
    });
    it('Should accept if role USER is set', (done) => {
      hemera.act({
        topic: 'CALL.account.debit',
        id: 1,
        amount: 100,
        meta$: requestGenerator.getValid(),
      }, (err, resp) => {
        expect(err).to.be.null;
        expect(resp).to.be.not.undefined;
        expect(resp.data.owner).to.be.equal(1);
        hemera.close(done);
      });
    });
  });

  describe('CALL.account.deposit', () => {
    it('Should reject if meta$ is not set', (done) => {
      hemera.act({
        topic: 'CALL.account.deposit',
        id: 1,
        amount: 100,
      }, (err, resp) => {
        expect(err).to.be.not.null;
        expect(err.message === 'missing permission').to.be.true;
        expect(resp).to.be.undefined;
        hemera.close(done);
      });
    });
    it('Should reject if user.roles is not set in meta$.user', (done) => {
      hemera.act({
        topic: 'CALL.account.deposit',
        id: 1,
        amount: 100,
        meta$: {
          id: requestGenerator.id,
          user: {id: 1},
        }
      }, (err, resp) => {
        expect(err).to.be.not.null;
        expect(err.message === 'missing permission').to.be.true;
        expect(resp).to.be.undefined;
        hemera.close(done);
      });
    });
    it('Should reject if role USER is missing', (done) => {
      hemera.act({
        topic: 'CALL.account.deposit',
        id: 1,
        amount: 100,
        meta$: {
          id: requestGenerator.id,
          user: {id: 1, roles: ['FOO', 'BAR']},
        }
      }, (err, resp) => {
        expect(err).to.be.not.null;
        expect(err.message === 'missing permission').to.be.true;
        expect(resp).to.be.undefined;
        hemera.close(done);
      });
    });
    it('Should accept if role USER is set', (done) => {
      hemera.act({
        topic: 'CALL.account.deposit',
        id: 1,
        amount: 100,
        meta$: requestGenerator.getValid(),
      }, (err, resp) => {
        expect(err).to.be.null;
        expect(resp).to.be.not.undefined;
        expect(resp.data.owner).to.be.equal(1);
        hemera.close(done);
      });
    });
  });

  describe('CLOSE.account', () => {
    it('Should reject if meta$ is not set', (done) => {
      hemera.act({
        topic: 'CLOSE.account',
        id: 1,
      }, (err, resp) => {
        expect(err).to.be.not.null;
        expect(err.message === 'missing permission').to.be.true;
        expect(resp).to.be.undefined;
        hemera.close(done);
      });
    });
    it('Should reject if user.roles is not set in meta$.user', (done) => {
      hemera.act({
        topic: 'CLOSE.account',
        id: 1,
        meta$: {
          id: requestGenerator.id,
          user: {id: 1},
        }
      }, (err, resp) => {
        expect(err).to.be.not.null;
        expect(err.message === 'missing permission').to.be.true;
        expect(resp).to.be.undefined;
        hemera.close(done);
      });
    });
    it('Should reject if role USER is missing', (done) => {
      hemera.act({
        topic: 'CLOSE.account',
        id: 1,
        meta$: {
          id: requestGenerator.id,
          user: {id: 1, roles: ['FOO', 'BAR']},
        }
      }, (err, resp) => {
        expect(err).to.be.not.null;
        expect(err.message === 'missing permission').to.be.true;
        expect(resp).to.be.undefined;
        hemera.close(done);
      });
    });
    it('Should accept if role USER is set', (done) => {
      hemera.act({
        topic: 'CREATE.account',
        meta$: {
          id: requestGenerator.id,
          user: {id: 22, roles: ['USER']},
        },
      }, (err, resp) => {
        let id = resp.data.id;
        hemera.act({
          topic: 'CLOSE.account',
          id: id,
          meta$: {
            id: requestGenerator.id,
            user: {id: 22, roles: ['USER']},
          }
        }, (err, resp) => {
          expect(err).to.be.null;
          expect(resp).to.be.not.undefined;
          expect(resp).to.be.true;
          hemera.close(done);
        });
      });
    });
    it('Should reject if different user', (done) => {
      hemera.act({
        topic: 'CREATE.account',
        meta$: {
          id: requestGenerator.id,
          user: {id: 22, roles: ['USER']},
        },
      }, (err, resp) => {
        let id = resp.data.id;
        hemera.act({
          topic: 'CLOSE.account',
          id: id,
          meta$: requestGenerator.getValid(),
        }, (err, resp) => {
          expect(err).to.be.not.null;
          expect(err.message === 'missing permission').to.be.true;
          expect(resp).to.be.undefined;
          hemera.close(done);
        });
      });
    });
    it('Should accept if different user has role ADMIN', (done) => {
      hemera.act({
        topic: 'CREATE.account',
        meta$: {
          id: requestGenerator.id,
          user: {id: 22, roles: ['USER']},
        },
      }, (err, resp) => {
        let id = resp.data.id;
        hemera.act({
          topic: 'CLOSE.account',
          id: id,
          meta$: {
            id: requestGenerator.id,
            user: {id: 23, roles: ['USER', 'ADMIN']},
          },
        }, (err, resp) => {
          expect(err).to.be.null;
          expect(resp).to.be.not.undefined;
          expect(resp).to.be.true;
          hemera.close(done);
        });
      });
    });
  });

  describe('CLOSE.account.all', () => {
    it('Should reject if meta$ is not set', (done) => {
      hemera.act({
        topic: 'CLOSE.account.all',
      }, (err, resp) => {
        expect(err).to.be.not.null;
        expect(err.message === 'missing permission').to.be.true;
        expect(resp).to.be.undefined;
        hemera.close(done);
      });
    });
    it('Should reject if user.roles is not set in meta$.user', (done) => {
      hemera.act({
        topic: 'CLOSE.account.all',
        id: 1,
        meta$: {
          id: requestGenerator.id,
          user: {id: 1},
        }
      }, (err, resp) => {
        expect(err).to.be.not.null;
        expect(err.message === 'missing permission').to.be.true;
        expect(resp).to.be.undefined;
        hemera.close(done);
      });
    });
    it('Should reject if role USER is missing', (done) => {
      hemera.act({
        topic: 'CLOSE.account.all',
        id: 1,
        meta$: {
          id: requestGenerator.id,
          user: {id: 1, roles: ['FOO', 'BAR']},
        }
      }, (err, resp) => {
        expect(err).to.be.not.null;
        expect(err.message === 'missing permission').to.be.true;
        expect(resp).to.be.undefined;
        hemera.close(done);
      });
    });
    it('Should accept if role USER is set', (done) => {
      hemera.act({
        topic: 'CREATE.account',
        meta$: {
          id: requestGenerator.id,
          user: {id: 22, roles: ['USER']},
        },
      }, (err, resp) => {
        let id = resp.data.id;
        hemera.act({
          topic: 'CLOSE.account.all',
          meta$: {
            id: requestGenerator.id,
            user: {id: 22, roles: ['USER']},
          }
        }, (err, resp) => {
          expect(err).to.be.null;
          expect(resp).to.be.not.undefined;
          expect(resp).to.be.true;
          hemera.close(done);
        });
      });
    });
  });

  describe('SET.account.negative', () => {
    it('Should reject if meta$ is not set', (done) => {
      hemera.act({
        topic: 'SET.account.negative',
        id: 1,
        value: true,
      }, (err, resp) => {
        expect(err).to.be.not.null;
        expect(err.message === 'missing permission').to.be.true;
        expect(resp).to.be.undefined;
        hemera.close(done);
      });
    });
    it('Should reject if user.roles is not set in meta$.user', (done) => {
      hemera.act({
        topic: 'SET.account.negative',
        id: 1,
        value: true,
        meta$: {
          id: requestGenerator.id,
          user: {id: 1},
        }
      }, (err, resp) => {
        expect(err).to.be.not.null;
        expect(err.message === 'missing permission').to.be.true;
        expect(resp).to.be.undefined;
        hemera.close(done);
      });
    });
    it('Should reject if role USER is missing', (done) => {
      hemera.act({
        topic: 'SET.account.negative',
        id: 1,
        value: true,
        meta$: {
          id: requestGenerator.id,
          user: {id: 1, roles: ['FOO', 'BAR']},
        }
      }, (err, resp) => {
        expect(err).to.be.not.null;
        expect(err.message === 'missing permission').to.be.true;
        expect(resp).to.be.undefined;
        hemera.close(done);
      });
    });
    it('Should accept if role USER is set', (done) => {
      hemera.act({
        topic: 'CREATE.account',
        meta$: {
          id: requestGenerator.id,
          user: {id: 22, roles: ['USER']},
        },
      }, (err, resp) => {
        let id = resp.data.id;
        hemera.act({
          topic: 'SET.account.negative',
          id: id,
          value: true,
          meta$: {
            id: requestGenerator.id,
            user: {id: 22, roles: ['USER']},
          }
        }, (err, resp) => {
          expect(err).to.be.null;
          expect(resp).to.be.not.undefined;
          expect(resp.data.negative).to.be.true;
          hemera.close(done);
        });
      });
    });
    it('Should reject if different user', (done) => {
      hemera.act({
        topic: 'CREATE.account',
        meta$: {
          id: requestGenerator.id,
          user: {id: 22, roles: ['USER']},
        },
      }, (err, resp) => {
        let id = resp.data.id;
        hemera.act({
          topic: 'SET.account.negative',
          id: id,
          value: true,
          meta$: requestGenerator.getValid(),
        }, (err, resp) => {
          expect(err).to.be.not.null;
          expect(err.message === 'missing permission').to.be.true;
          expect(resp).to.be.undefined;
          hemera.close(done);
        });
      });
    });
    it('Should accept if different user has role ADMIN', (done) => {
      hemera.act({
        topic: 'CREATE.account',
        meta$: {
          id: requestGenerator.id,
          user: {id: 22, roles: ['USER']},
        },
      }, (err, resp) => {
        let id = resp.data.id;
        hemera.act({
          topic: 'SET.account.negative',
          id: id,
          value: true,
          meta$: {
            id: requestGenerator.id,
            user: {id: 23, roles: ['USER', 'ADMIN']},
          },
        }, (err, resp) => {
          expect(err).to.be.null;
          expect(resp).to.be.not.undefined;
          expect(resp.data.negative).to.be.true;
          hemera.close(done);
        });
      });
    });
  });
});
