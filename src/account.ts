import { logger } from './logger';

const DEFAULT_OPTIONS: AccountOptions = {
    negative: false,
};

export class Account {

    private _balance: number;
    private options: AccountOptions;
    // private _bookings: Array<any>;

    constructor(options?: AccountOptions) {
        // copy options object or defaultOptions
        this.options = { ...options } || { ...DEFAULT_OPTIONS };
        if (!this.options.negative && this.options.balance < 0) throw new NegativeBalanceError('Account does not accept negative balance');
        this._balance = this.options.balance || 0;
        logger.debug('initialized Account');
    }

    /**
     * read only balance value
     * @returns {number}
     */
    public get balance(): number {
        return this._balance;
    }

    /**
     * increase account balance
     * expect amount > 0
     * @param {number} amount
     * @throws NegativeAmountError, ZeroAmountError
     */
    public deposit(amount: number) {
        if (amount < 0) throw new NegativeAmountError('Account does not accept negative amount on deposit');
        if (amount === 0) throw new ZeroAmountError('Account does not accept zero amount on deposit');
        logger.debug(`increase balance by ${amount}`);
        this._balance += amount;
    }

    /**
     * decrease account balance
     * expect amount to be > 0
     * @param {number} amount
     * @throws NegativeAmountError, ZeroAmountError
     */
    public debit(amount: number) {
        if (amount < 0) throw new NegativeAmountError('Account does not accept negative amount on debit');
        if (amount === 0) throw new ZeroAmountError('Account does not accept zero amount on debit');
        if (!this.options.negative && this._balance - amount < 0) throw new NegativeBalanceError('Account does not accept negative balance');
        logger.debug(`decreased balance by ${amount}`);
        this._balance -= amount;
    }

}

export class NegativeAmountError extends Error { }
export class ZeroAmountError extends Error { }
export class NegativeBalanceError extends Error { }

export interface AccountOptions {
    negative?: boolean;
    balance?: number;
}