import {AccountPersistence} from "../persistence/account.persistence";
import {Account} from '../model/account';
import {Request} from '../model/request'
import {AccountService} from "./account.service";

const ERRORS = require('../errors.json');

export class AccountServiceImpl implements AccountService {

  constructor(private persistence: AccountPersistence, private req:Request) { }

  async close (id: number): Promise<boolean> {
    let account: Account = await this.retrieve(id);
    return await this.persistence.remove(account).then((id: number) => {
      return id === account.id;
    });
  }

  async closeAll (): Promise<boolean> {
    this.checkUser();
    return await this.persistence.getOwn(this.req.user.id).then(
      async (accounts: Array<Account>) =>  {
        await accounts.map(async (account: Account) => this.persistence.remove(account));
        return true;
    });
  }

  async create (): Promise<Account> {
    this.checkUser();
    return this.persistence.create(this.req.user.id);
  }

  async debit (id: number, amount: number): Promise<Account> {
    let account: Account = await this.retrieve(id);
    account.debit(amount);
    return await this.persistence.update(account);
  }

  async deposit (id: number, amount: number): Promise<Account> {
    let account: Account = await this.retrieve(id);
    account.deposit(amount);
    return await this.persistence.update(account);
  }

  async get (id: number): Promise<Account> {
    return await this.retrieve(id);
  }

  async getAll (): Promise<Array<Account>> {
    this.checkUser();
    if (this.req.user.roles.indexOf('ADMIN') >= 0) {
      return await this.persistence.getAll();
    }
    return await this.persistence.getOwn(this.req.user.id);
  }

  async setNegativeFlag (id: number, value: boolean): Promise<Account> {
    let account = await this.retrieve(id);
    account.negative = value;
    return await this.persistence.update(account);
  }

  private checkUser():void {
    if (!this.isUser()) throw new Error(ERRORS.MISSING_PERMISSION);
  }

  private isUser():boolean {
    return this.req.user && Number(this.req.user.id) >= 1
      && this.req.user.roles && this.req.user.roles.indexOf('USER') >= 0;
  }

  private isAdmin(): boolean {
    return this.isUser() && this.req.user.roles.indexOf('ADMIN') >= 0;
  }

  private async retrieve(id: number): Promise<Account> {
    this.checkUser();
    let account: Account = await this.persistence.get(id);
    if (account.owner === this.req.user.id || this.isAdmin()) {
      return await account;
    }
    throw new Error(ERRORS.MISSING_PERMISSION);
  }

}
