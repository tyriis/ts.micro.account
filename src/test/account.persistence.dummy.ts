import {AccountPersistence} from "../persistence/account.persistence";
import {Account} from "../model/account";
import {AccountImpl} from "../model/account.impl";
import {TransactionType} from "../model/transaction.type";
import {Transaction} from "../model/transaction";

const dummyAccount = {
  id: 1,
  owner: 1,
  balance: 100,
  datetime: new Date(),
  negative: false,
};

export class AccountPersistenceDummy implements AccountPersistence {

  async create (owner: number): Promise<Account> {
    return await new AccountImpl(dummyAccount);
  }

  async get (id: number): Promise<Account> {
    return await new AccountImpl(dummyAccount);
  }

  async getOwn (owner: number): Promise<Array<Account>> {
    return await [new AccountImpl(dummyAccount)];
  }

  async remove (account: Account): Promise<number> {
    let id: number = account.id;
    return await id;
  }

  async update (account: Account): Promise<Account> {
    return await new AccountImpl(account);
  }

  async getAll (): Promise<Array<Account>> {
    return await [new AccountImpl(dummyAccount)];
  }

  createTransaction (type: TransactionType, account: Account, amount: number): Promise<void> {
    return undefined;
  }

  getTransactions (account): Promise<Array<Transaction>> {
    return undefined;
  }
}
