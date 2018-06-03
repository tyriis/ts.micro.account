import {PgDb} from 'pogi';
import * as fs from 'fs';
import {logger} from "../logger";
import { Account } from "../account";

export interface AccountData {
  id?: number;
  balance?: number;
  owner?: number;
  datetime?: Date;
  negative?: boolean;
}

export class AccountPersistence {

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
   * @param {number} id
   * @returns {Promise<Account>}
   */
  async get(id: number): Promise<Account> {
    return await this.db.queryFirst(
      'SELECT id, owner, balance, datetime, negative FROM account WHERE id = :id',
      { id },
    ).then((data:AccountData) => {
      if (!data) throw Error('account does not exist');
      return new Account(data);
    });
  }

  /**
   * retrieve own accounts
   * @param {number} owner
   * @returns {Promise<Array<Account>>}
   */
  async getOwn(owner: number): Promise<Array<Account>> {
    return await this.db.query(
      'SELECT id, owner, balance, datetime, negative FROM account WHERE owner = :owner',
      { owner },
    ).then((data:Array<AccountData>) => {
      return data.map((data:AccountData) => new Account(data));
    });
  }

  /**
   * create a new account for owner or reject
   * @param {number} owner
   * @returns {Promise<Account>}
   */
  async create(owner: number): Promise<Account> {
    if (owner === null || owner === undefined) throw new TypeError('valid owner must be > 0');
    if (owner <= 0) throw new RangeError('valid owner must be > 0');
    return await this.db.queryFirst(
      'INSERT INTO account (owner) VALUES (:owner) RETURNING id, owner, balance, datetime, negative',
      { owner },
    ).then((data:AccountData) => new Account(data));
  }

  /**
   * update an existing account or reject
   * @param {Account} account
   * @returns {Promise<Account>}
   */
  async update(account: Account): Promise<Account> {
    return await this.db.queryFirst(
      'UPDATE account SET balance = :balance, negative = :negative WHERE id = :id RETURNING id, owner, balance, datetime, negative',
      account
    ).then((data:AccountData) => {
      if (!data) throw Error('account does not exist');
      return new Account(data)
    });
  }

  /**
   * remove an existing account or reject
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
}
