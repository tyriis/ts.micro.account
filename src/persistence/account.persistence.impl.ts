import {PgDb} from "pogi";
import {Account} from "../model/account";
import {AccountData} from "../model/account.data";
import {AccountPersistence} from "./account.persistence";
// import {logger} from "../logger";
import * as fs from "fs";
import {AccountImpl} from "../model/account.impl";

export class AccountPersistenceImpl implements AccountPersistence {

  private db: PgDb;

  constructor(pgdb: PgDb) {
    this.db = pgdb;
    this.init();
  }

  private async init() {
    const sql = fs.readFileSync(`${__dirname}/../db/create.sql`, 'utf-8');
    return await this.db.query(sql);
  }

  /**
   * retrieve account by id
   * @implements AccountPersistence
   * @param {number} id
   * @returns {Promise<Account>}
   */
  async get(id: number): Promise<Account> {
    return await this.db.queryFirst(
      'SELECT id, owner, balance, datetime, negative FROM account WHERE id = :id',
      { id },
    ).then((data:AccountData) => {
      if (!data) throw Error('account does not exist');
      return new AccountImpl(data);
    });
  }

  /**
   * retrieve own accounts
   * @implements AccountPersistence
   * @param {number} owner
   * @returns {Promise<Array<Account>>}
   */
  async getOwn(owner: number): Promise<Array<Account>> {
    return await this.db.query(
      'SELECT id, owner, balance, datetime, negative FROM account WHERE owner = :owner',
      { owner },
    ).then((data:Array<AccountData>) => {
      return data.map((data:AccountData) => new AccountImpl(data));
    });
  }

  /**
   * create a new account for owner or reject
   * expect owner > 0
   * @implements AccountPersistence
   * @param {number} owner
   * @returns {Promise<Account>}
   */
  async create(owner: number): Promise<Account> {
    if (owner === null || owner === undefined) throw new TypeError('valid owner must be > 0');
    if (owner <= 0) throw new RangeError('valid owner must be > 0');
    return await this.db.queryFirst(
      'INSERT INTO account (owner) VALUES (:owner) RETURNING id, owner, balance, datetime, negative',
      { owner },
    ).then((data:AccountData) => new AccountImpl(data));
  }

  /**
   * update an existing account or reject
   * expect valid account.id
   * @implements AccountPersistence
   * @param {Account} account
   * @returns {Promise<Account>}
   */
  async update(account: Account): Promise<Account> {
    return await this.db.queryFirst(
      'UPDATE account SET balance = :balance, negative = :negative WHERE id = :id RETURNING id, owner, balance, datetime, negative',
      account
    ).then((data:AccountData) => {
      if (!data) throw Error('account does not exist');
      return new AccountImpl(data)
    });
  }

  /**
   * remove an existing account or reject
   * expect valid account.id
   * @implements AccountPersistence
   * @param {Account} account
   * @returns {Promise<number>}
   */
  async remove(account: Account): Promise<number> {
    return await this.db.queryOneField(
      'DELETE FROM account WHERE id = :id RETURNING id', account
    ).catch(err => {
      if (err.name === 'TypeError') throw new Error('account does not exist');
      throw err;
    });
  }

  async getAll (): Promise<Array<Account>> {
    return await this.db.query(
      'SELECT id, owner, balance, datetime, negative FROM account'
    ).then((results: Array<AccountData>) => {
      return results.map(data => new AccountImpl(data));
    })
  }
}
