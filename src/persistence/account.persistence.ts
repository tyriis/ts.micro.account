import {PgDb} from 'pogi';
import * as fs from 'fs';

export interface Account {
  id?: number,
  balance?: number,
  owner?: number,
  datetime?: Date,
  negative?: boolean
}

export class AccountPersistence {

  private db: PgDb;

  constructor(pgdb: PgDb) {
    this.db = pgdb;
    this.init();
  }

  private init() {
    const sql = fs.readFileSync(`${__dirname}/../db/create.sql`, 'utf-8');
    this.db.query(sql);
  }

  async create(owner: number): Promise<Account> {
    return await this.db.queryFirst('INSERT INTO account (owner) VALUES (:owner) RETURNING id, owner, balance, datetime, negative', { owner });
  }

  async store(account: Account): Promise<Account> {
    return await this.db.queryFirst(
      'UPDATE account SET VALUES (:balance, :negative) WHERE id = :id RETURNING id, owner, balance, datetime, negative',
      account
    );
  }

  async delete(account: Account): Promise<number> {
    return await this.db.queryOneField(
      'DELETE FROM account WHERE id = :id RETURNING id', account
    );
  }
}
