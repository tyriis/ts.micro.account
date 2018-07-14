import {AccountPersistence} from "../persistence/account.persistence";
import {Account} from '../model/account';
import {Request} from '../model/request'
import {AccountService} from "./account.service";
import {logger} from "../logger";
import {TransactionType} from "../model/transaction.type";

const ERRORS = require('../errors.json');

export class AccountServiceImpl implements AccountService {

  /**
   * create a new AccountService instance with an existing AccountPersistence instance
   * @param {AccountPersistence} persistence
   * @param {Request} req
   */
  constructor(private persistence: AccountPersistence, private req:Request) { }

  /**
   * close account
   * expect account exist
   * expect account is user owned or user has admin role
   * @param {number} id
   * @returns {Promise<boolean>}
   */
  async close (id: number): Promise<boolean> {
    logger.debug(`[account.service.close] {"id": ${id}} > ${JSON.stringify(this.req)}`);
    let account: Account = await this.retrieve(id);
    return await this.persistence.remove(account).then((id: number) => {
      return id === account.id;
    });
  }

  /**
   * close all accounts owned by this.req.user
   * expect account has no admin role
   * @returns {Promise<boolean>}
   */
  async closeAll (): Promise<boolean> {
    logger.debug(`[account.service.close.all] > ${JSON.stringify(this.req)}`);
    this.checkUser();
    return await this.persistence.getOwn(this.req.user.id).then(
      async (accounts: Array<Account>) =>  {
        await accounts.map(async (account: Account) => this.persistence.remove(account));
        return true;
    });
  }

  /**
   * create a new Account this.req.user
   * expect valid this.req.user
   * expect this.req.user.role = USER
   * @returns {Promise<Account>}
   */
  async create (): Promise<Account> {
    logger.debug(`[account.service.create] > ${JSON.stringify(this.req)}`);
    this.checkUser();
    return this.persistence.create(this.req.user.id);
  }

  /**
   * decrease account balance by amount
   * expect account exist
   * expect account is user owned or user has admin role
   * expect amount > 0
   * @param {number} id
   * @param {number} amount
   * @returns {Promise<Account>}
   */
  async debit (id: number, amount: number): Promise<Account> {
    logger.debug(`[account.service.debit] {"id": ${id}, "amount": ${amount}} > ${JSON.stringify(this.req)}`);
    let account: Account = await this.retrieve(id);
    await this.persistence.createTransaction(TransactionType.DEBIT, account, amount);
    account.debit(amount);
    return await this.persistence.update(account);
  }

  /**
   * increase account balance by amount
   * expect account exist
   * expect account is user owned or user has admin role
   * expect amount > 0
   * @param {number} id
   * @param {number} amount
   * @returns {Promise<Account>}
   */
  async deposit (id: number, amount: number): Promise<Account> {
    logger.debug(`[account.service.deposit] {"id": ${id}, "amount": ${amount}} > ${JSON.stringify(this.req)}`);
    let account: Account = await this.retrieve(id);
    await this.persistence.createTransaction(TransactionType.DEPOSIT, account, amount);
    account.deposit(amount);
    account = await this.persistence.update(account);
    return account;
  }

  /**
   * get account by id
   * expect account exist
   * expect account is user owned or user have admin role
   * @param {number} id
   * @returns {Promise<Account>}
   */
  async get (id: number): Promise<Account> {
    logger.debug(`[account.service.get] {"id": ${id}} > ${JSON.stringify(this.req)}`);
    return await this.retrieve(id);
  }

  /**
   * get all accounts owned by this.req.user
   * get all accounts if user has role admin
   * @returns {Promise<Array<Account>>}
   */
  async getAll (): Promise<Array<Account>> {
    logger.debug(`[account.service.get.all] > ${JSON.stringify(this.req)}`);
    this.checkUser();
    if (this.req.user.roles.indexOf('ADMIN') >= 0) {
      return await this.persistence.getAll();
    }
    return await this.persistence.getOwn(this.req.user.id);
  }

  /**
   * change the negative flag
   * expect account exist
   * expect account is user owned or user has admin role
   * @param {number} id
   * @param {boolean} value
   * @returns {Promise<Account>}
   */
  async setNegativeFlag (id: number, value: boolean): Promise<Account> {
    logger.debug(`[account.service.get] {"id": ${id}, "value": ${value}} > ${JSON.stringify(this.req)}`);
    let account = await this.retrieve(id);
    account.negative = value;
    return await this.persistence.update(account);
  }

  /**
   * check if user is a valid user
   * @throws Error
   */
  private checkUser():void {
    if (!this.isUser()) {
      logger.error(`[${ERRORS.MISSING_PERMISSION}] > ${JSON.stringify(this.req)}`);
      throw new Error(ERRORS.MISSING_PERMISSION);
    }
  }

  /**
   * true if user is a valid user else false
   * @returns {boolean}
   */
  private isUser():boolean {
    return this.req.user && Number(this.req.user.id) >= 1
      && this.req.user.roles && this.req.user.roles.indexOf('USER') >= 0;
  }

  /**
   * true if user is a valid admin else false
   * @returns {boolean}
   */
  private isAdmin(): boolean {
    return this.isUser() && this.req.user.roles.indexOf('ADMIN') >= 0;
  }

  /**
   * retrueve account by id if allowed
   * @param {number} id
   * @returns {Promise<Account>}
   * @throws Error
   */
  private async retrieve(id: number): Promise<Account> {
    this.checkUser();
    let account: Account = await this.persistence.get(id);
    if (account.owner === this.req.user.id || this.isAdmin()) {
      return await account;
    }
    logger.error(`[${ERRORS.MISSING_PERMISSION}] > ${JSON.stringify(this.req)}`);
    throw new Error(ERRORS.MISSING_PERMISSION);
  }

}
