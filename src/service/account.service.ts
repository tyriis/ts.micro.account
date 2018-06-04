import {AccountPersistence} from "../persistence/account.persistence";
import {Account} from '../model/account';
import {Request} from '../model/request'

export interface AccountService {

  /**
   * create a new AccountService instance with an existing AccountPersistence instance
   * @param {AccountPersistence} persistence
   * @param {Request} req
   */
  // new(persistence: AccountPersistence, req:Request);

  /**
   * create a new Account this.req.user
   * expect valid this.req.user
   * expect this.req.user.role = USER
   * @returns {Promise<Account>}
   */
  create(): Promise<Account>

  /**
   * get all accounts owned by this.req.user
   * get all accounts if user has role admin
   * @returns {Promise<Array<Account>>}
   */
  getAll(): Promise<Array<Account>>;

  /**
   * get account by id
   * expect account exist
   * expect account is user owned or user have admin role
   * @param {number} id
   * @returns {Promise<Account>}
   */
  get(id: number): Promise<Account>;

  /**
   * increase account balance by amount
   * expect account exist
   * expect account is user owned or user has admin role
   * expect amount > 0
   * @param {number} id
   * @param {number} amount
   * @returns {Promise<Account>}
   */
  deposit(id: number, amount: number): Promise<Account>;

  /**
   * decrease account balance by amount
   * expect account exist
   * expect account is user owned or user has admin role
   * expect amount > 0
   * @param {number} id
   * @param {number} amount
   * @returns {Promise<Account>}
   */
  debit(id:number, amount:number): Promise<Account>;

  /**
   * close account
   * expect account exist
   * expect account is user owned or user has admin role
   * @param {number} id
   * @returns {Promise<boolean>}
   */
  close(id: number): Promise<boolean>;

  /**
   * close all accounts owned by this.req.user
   * expect account has no admin role
   * @returns {Promise<boolean>}
   */
  closeAll(): Promise<boolean>;

  /**
   * change the negative flag
   * expect account exist
   * expect account is user owned or user has admin role
   * @param {number} id
   * @param {boolean} value
   * @returns {Promise<Account>}
   */
  setNegativeFlag(id: number, value: boolean): Promise<Account>;

}
