import { expect } from 'chai';
import 'mocha';

import { AccountService, AccountServiceImpl, NegativeAmountError, NegativeBalanceError, ZeroAmountError } from './account';

describe('Account', () => {
    describe('When create', () => {
        it('Should have a deposit of 0', () => {
            const account: AccountService = new AccountServiceImpl();
            expect(account.balance).to.be.equal(0);
        });
        it('Can also be initialized with options object passed', () => {
            const options: object = {};
            expect(() => new AccountServiceImpl()).to.not.throw();
            expect(() => new AccountServiceImpl(options)).to.not.throw();
        });
        it('Should accept the balance option value', () => {
            const amount: number = 123;
            let account: AccountService = new AccountServiceImpl({balance: amount});
            expect(account.balance).to.equal(amount);
        });
        it('Should not accept negative balance if options flag negative is false', () => {
            const amount: number = -123;
            let account: AccountService;
            expect(() => account = new AccountServiceImpl({ balance: amount })).to.throw(NegativeBalanceError);
            expect(() => account = new AccountServiceImpl({ balance: amount, negative: false })).to.throw(NegativeBalanceError);
            expect(() => account = new AccountServiceImpl({ balance: amount, negative: true })).to.not.throw();
            expect(account.balance).to.be.equal(amount);
        });
    });
    describe('When deposit money', () => {
        it('Should increase the account balance by the deposit value', () => {
            const account: AccountService = new AccountServiceImpl();
            const initialBalance: number = account.balance;
            const amount: number = 5;
            account.deposit(amount);
            expect(account.balance).to.be.equal(initialBalance + amount);
        });

        it('Should not accept negative values as deposit value', () => {
            const account: AccountService = new AccountServiceImpl();
            const initialBalance: number = account.balance;
            const amount: number = -5;
            expect(() => account.deposit(amount)).to.throw(NegativeAmountError);
            expect(account.balance).to.be.equal(initialBalance);
        });
        it('Should not accept 0 as deposit value', () => {
            const account: AccountService = new AccountServiceImpl();
            const amount: number = 0;
            expect(() => account.deposit(amount)).to.throw(ZeroAmountError);
        });
    });
    describe('When debit money', () => {
        it('Should decrease the account balance by the debit value', () => {
            const account: AccountService = new AccountServiceImpl();
            const initialBalance: number = account.balance;
            const amount: number = 5;
            account.deposit(amount);
            account.debit(amount);
            expect(account.balance).to.be.equal(initialBalance);
        });
        it('Should not accept negative values as debit value', () => {
            const account: AccountService = new AccountServiceImpl();
            const initialBalance: number = account.balance;
            const amount: number = -5;
            expect(() => account.debit(amount)).to.throw(NegativeAmountError);
            expect(account.balance).to.be.equal(initialBalance);
        });
        it('Should not accept 0 as debit value', () => {
            const account: AccountService = new AccountServiceImpl();
            const amount: number = 0;
            expect(() => account.debit(amount)).to.throw(ZeroAmountError);
        });
        it('Should obey the negative option flag', () => {
            let account: AccountService = new AccountServiceImpl({negative: true});
            const amount: number = 5;
            expect(() => account.debit(amount)).to.not.throw();
            expect(account.balance).to.be.equal(-5);
            account = new AccountServiceImpl({negative: false});
            expect(() => account.debit(amount)).to.throw(NegativeBalanceError);
        });
    });
});