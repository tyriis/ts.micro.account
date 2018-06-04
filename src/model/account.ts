export interface Account {

  readonly id:number;
  readonly balance: number;
  readonly owner: number;
  readonly datetime: Date;
  negative: boolean;

  deposit(amount: number): Account;
  debit(amount: number): Account;
}

export class NegativeAmountError extends Error {}
export class ZeroAmountError extends Error { }
export class NegativeBalanceError extends Error { }
