import {logger} from "../logger";
import {AccountData} from "./account.data";
import {Account, NegativeAmountError, NegativeBalanceError, ZeroAmountError} from "./account";
const ERRORS = require('../errors.json');

export class AccountImpl implements Account {

  static DEFAULT_DATA: AccountData = {
    negative: false,
    balance: 0,
  };

  private data: AccountData;

  constructor(data?:AccountData) {
    this.data = Object.assign({...AccountImpl.DEFAULT_DATA}, data);
    if (!this.data.negative && this.data.balance < 0) {
      throw new NegativeBalanceError(ERRORS.NEGATIVE_BALANCE);
    }
    this.data.balance = Number(this.data.balance);
  }

  /**
   * @readonly
   * @implements Account
   * @returns {number}
   */
  get id(): number {
    return this.data.id;
  }

  /**
   * @readonly
   * @implements Account
   * @returns {number}
   */
  get balance(): number {
    return this.data.balance;
  }

  /**
   * @readonly
   * @implements Account
   * @returns {number}
   */
  get owner(): number {
    return this.data.owner;
  }

  /**
   * @readonly
   * @implements Account
   * @returns {Date}
   */
  get datetime(): Date {
    return this.data.datetime;
  }

  /**
   * @implements Account
   * @returns {boolean}
   */
  get negative(): boolean {
    return this.data.negative;
  }

  /**
   * @implements Account
   * @param {boolean} value
   */
  set negative(value: boolean) {
    this.data.negative = value;
  }

  /**
   * increase account balance
   * expect amount > 0
   * @implements Account
   * @param {number} amount
   * @throws NegativeAmountError, ZeroAmountError
   */
  public deposit(amount: number): Account {
    if (amount < 0) throw new NegativeAmountError(ERRORS.NEGATIVE_DEPOSIT);
    if (amount === 0) throw new ZeroAmountError(ERRORS.ZERO_DEPOSIT);
    logger.debug(`increase balance by ${amount}`);
    this.data.balance += amount;
    // TODO create transaction entry
    return this;
  }

  /**
   * decrease account balance
   * expect amount > 0
   * @implements Account
   * @param {number} amount
   * @throws NegativeAmountError, ZeroAmountError
   */
  public debit(amount: number): Account {
    if (amount < 0) throw new NegativeAmountError(ERRORS.NEGATIVE_DEBIT);
    if (amount === 0) throw new ZeroAmountError(ERRORS.ZERO_DEBIT);
    if (!this.data.negative && this.data.balance - amount < 0) throw new NegativeBalanceError(ERRORS.NEGATIVE_BALANCE);
    logger.debug(`decreased balance by ${amount}`);
    this.data.balance -= amount;
    // TODO create transaction entry
    return this
  }

}

