import { logger } from './logger';
import {Account, AccountPersistence} from "./persistence/account.persistence";

const DEFAULT_MODEL: Account = {
  negative: false,
  balance: 0,
};

export interface AccountService {

  readonly balance: number;

  /**
   * increase account balance
   * expect amount > 0
   * @param {number} amount
   * @throws NegativeAmountError, ZeroAmountError
   */
  deposit(amount: number);

  /**
   * decrease account balance
   * expect amount to be > 0
   * @param {number} amount
   * @throws NegativeAmountError, ZeroAmountError
   */
  debit(amount: number);

}

export interface AccountService2 {

  create(owner: number): Promise<Account>;

  get(id: number): Promise<Account>;

  store(account: Account): Promise<Account>;

  del(account: Account): Promise<number>;

}

export class AccountServiceImpl implements AccountService{

  private static DB: AccountPersistence;

  static use(persistence: AccountPersistence) {
    AccountServiceImpl.DB = persistence;
  }

  static async create(owner: number): Promise<AccountServiceImpl> {
    let account = await AccountServiceImpl.DB.create(owner);
    return new AccountServiceImpl(account);
  }

  readonly account: Account;

  constructor(account?: Account) {
    this.account = Object.assign({...DEFAULT_MODEL}, account);
    if (!this.account.negative && this.account.balance < 0) throw new NegativeBalanceError('Account does not accept negative balance');
  }

  /**
   * read only balance value
   * @implements AccountService
   * @returns {number}
   */
  public get balance(): number {
    return this.account.balance;
  }

  /**
   * @implements AccountService
   * @param {number} amount
   */
  public deposit(amount: number) {
    if (amount < 0) throw new NegativeAmountError('Account does not accept negative amount on deposit');
    if (amount === 0) throw new ZeroAmountError('Account does not accept zero amount on deposit');
    logger.debug(`increase balance by ${amount}`);
    this.account.balance += amount;
    // TODO create transaction entry
  }

  /**
   * @implements AccountService
   * @param {number} amount
   */
  public debit(amount: number) {
    if (amount < 0) throw new NegativeAmountError('Account does not accept negative amount on debit');
    if (amount === 0) throw new ZeroAmountError('Account does not accept zero amount on debit');
    if (!this.account.negative && this.account.balance - amount < 0) throw new NegativeBalanceError('Account does not accept negative balance');
    logger.debug(`decreased balance by ${amount}`);
    this.account.balance -= amount;
    // TODO create transaction entry
  }

}

export class NegativeAmountError extends Error { }
export class ZeroAmountError extends Error { }
export class NegativeBalanceError extends Error { }
