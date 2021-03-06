const log4js = require("log4js");
const logger = log4js.getLogger("account.js");

class Account {
    constructor(name, init) {
        if (typeof name !== "string" || name === "") {
            logger.error("Invalid account name: " + name);
            return;
        }
        this.name = name;
        this.balance = typeof init === "number" ? init : 0;
        this.transactionsFrom = [];
        this.transactionsTo = [];
    }

    addTransaction(transaction) {
        if(transaction.from === this.name) {
            logger.debug("Attempting to transfer " + transaction.amount + " FROM " + this.name + "'s account");
            let old_balance = this.balance;
            this.balance -= transaction.amount;
            logger.debug("Changed " + this.name + "'s account balance from " + old_balance + " to " + this.balance);
            this.transactionsFrom.push(transaction);
        } else if (transaction.to === this.name) {
            logger.debug("Attempting to transfer " + transaction.amount + " INTO " + this.name + "'s account");
            let old_balance = this.balance;
            this.balance += transaction.amount;
            logger.debug("Changed " + this.name + "'s account balance from " + old_balance + " to " + this.balance);
            this.transactionsTo.push(transaction);
        } else {
            logger.debug("The transaction is neither from nor to this account. Account name: " + this.name);
            logger.debug("Transaction: " + JSON.stringify(transaction));
        }
    }
}

module.exports = Account;