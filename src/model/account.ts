export interface Account {

  /**
   * the database id
   */
  readonly id:number;

  /**
   * the current account balance
   */
  readonly balance: number;

  /**
   * the owner of this account
   */
  readonly owner: number;

  /**
   * the creation date
   */
  readonly datetime: Date;

  /**
   * wherever accept negative or not
   */
  negative: boolean;

  /**
   * increase account balance
   * expect amount > 0
   * @param {number} amount
   * @returns {Account}
   */
  deposit(amount: number): Account;

  /**
   * decrease account balance
   * expect amount > 0
   * @param {number} amount
   * @returns {Account}
   */
  debit(amount: number): Account;

}

export class NegativeAmountError extends Error {}
export class ZeroAmountError extends Error { }
export class NegativeBalanceError extends Error { }
