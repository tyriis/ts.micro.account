import { Account } from "../model/account";
import {TransactionType} from "../model/transaction.type";
import {Transaction} from "../model/transaction";

export interface AccountPersistence {

  /**
   * retrieve account by id
   * expect valid account.id
   * @param {number} id
   * @returns {Promise<Account>}
   */
  get(id: number): Promise<Account>;

  /**
   * retrieve own accounts
   * expect owner > 0
   * @param {number} owner
   * @returns {Promise<Array<Account>>}
   */
  getOwn(owner: number): Promise<Array<Account>>;

  /**
   * retrieve all accounts
   * @returns {Promise<Array<Account>>}
   */
  getAll(): Promise<Array<Account>>;

  /**
   * create a new account for owner or reject
   * expect owner > 0
   * @param {number} owner
   * @returns {Promise<Account>}
   */
  create(owner: number): Promise<Account>;

  /**
   * update an existing account or reject
   * expect valid account.id
   * @param {Account} account
   * @returns {Promise<Account>}
   */
  update(account: Account): Promise<Account>;

  /**
   * remove an existing account or reject
   * expect valid account.id
   * @param {Account} account
   * @returns {Promise<number>}
   */
  remove(account: Account): Promise<number>;

  createTransaction(type: TransactionType, account: Account, amount: number): Promise<void>;

  getTransactions(account): Promise<Array<Transaction>>;
}
