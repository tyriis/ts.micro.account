import {TransactionType} from "./transaction.type";

export interface Transaction {

  /**
   * the database id
   */
  readonly id:number;

  /**
   * the account id
   */
  readonly account: number;

  /**
   * the creation date
   */
  readonly datetime: Date;

  /**
   * the type of the transaction
   */
  readonly type: TransactionType;

}
