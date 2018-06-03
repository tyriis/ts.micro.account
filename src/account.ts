import { logger } from './logger';
import {AccountData} from "./persistence/account.persistence";

export interface IAccount {

  readonly id:number;
  readonly balance: number;
  readonly owner: number;
  readonly datetime: Date;
  readonly negative: boolean;

  deposit(amount: number): IAccount;
  debit(amount: number): IAccount;

}

export class Account implements IAccount{

  static DEFAULT_DATA: AccountData = {
    negative: false,
    balance: 0,
  };

  private data: AccountData;

  constructor(data?:AccountData) {
    this.data = Object.assign({...Account.DEFAULT_DATA}, data);
    // explicit type
    this.data.balance = Number(this.data.balance);
  }

  get id(): number {
    return this.data.id;
  }

  get balance(): number {
    return this.data.balance;
  }

  get owner(): number {
    return this.data.owner;
  }

  get datetime(): Date {
    return this.data.datetime;
  }

  get negative(): boolean {
    return this.data.negative;
  }

  /**
   * increase account balance
   * expect amount > 0
   * @param {number} amount
   * @throws NegativeAmountError, ZeroAmountError
   */
  public deposit(amount: number): Account {
    if (amount < 0) throw new NegativeAmountError('Account does not accept negative amount on deposit');
    if (amount === 0) throw new ZeroAmountError('Account does not accept zero amount on deposit');
    logger.debug(`increase balance by ${amount}`);
    this.data.balance += amount;
    // TODO create transaction entry
    return this;
  }

  /**
   * @param {number} amount
   */
  public debit(amount: number): Account {
    if (amount < 0) throw new NegativeAmountError('Account does not accept negative amount on debit');
    if (amount === 0) throw new ZeroAmountError('Account does not accept zero amount on debit');
    if (!this.data.negative && this.data.balance - amount < 0) throw new NegativeBalanceError('Account does not accept negative balance');
    logger.debug(`decreased balance by ${amount}`);
    this.data.balance -= amount;
    // TODO create transaction entry
    return this
  }

}


export class NegativeAmountError extends Error { }
export class ZeroAmountError extends Error { }
export class NegativeBalanceError extends Error { }
