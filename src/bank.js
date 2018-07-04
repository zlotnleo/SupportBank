const Account = require("./account");
const log4js = require("log4js");
const logger = log4js.getLogger("bank.js");

class Bank {
    constructor() {
        this.accounts = {}
    }

    processTransaction(transaction) {
        logger.debug("Started processing a transaction: " + JSON.stringify(transaction));
        if(isNaN(transaction.amount)) {
            logger.error("Transaction amount is NaN. Transaction is ignored.");
            return;
        }
        if (!this.accounts.hasOwnProperty(transaction.from)) {
            logger.debug("Sender account not found. Creating new account for " + transaction.from);
            this.accounts[transaction.from] = new Account(transaction.from)
        }
        if (!this.accounts.hasOwnProperty(transaction.to)) {
            logger.debug("Recipient account not found. Creating new account for " + transaction.to);
            this.accounts[transaction.to] = new Account(transaction.to)
        }
        this.accounts[transaction.from].addTransaction(transaction);
        this.accounts[transaction.to].addTransaction(transaction);
    }

    printAccountInfo(name) {
        if (!this.accounts.hasOwnProperty(name)) {
            logger.error("Unable to print account info: user not found");
            console.log("User not found");
            return;
        }
        logger.debug("Printing information for " + this.name + "'s account");
        let account = this.accounts[name];
        console.log("Account info for " + account.name);
        console.log("Total balance: " + account.balance);
        console.log("Transaction list:");
        for (let transaction of account.transactions) {
            console.log(
                transaction.date
                + (transaction.type === "SEND" ? " - " : " + ")
                + transaction.amount
                + (transaction.type === "SEND" ? " to " : " from ")
                + transaction.otherParty
                + " for \"" + transaction.reason + "\""
            );
        }
    }

    printAllAccounts() {
        logger.debug("Printing a list of all accounts");
        if(Object.keys(this.accounts).length === 0) {
            console.log("No accounts exist.");
            return;
        }

        console.log("List of all accounts:");
        for (let name in this.accounts) {
            console.log(this.accounts[name].name + ": " + this.accounts[name].balance.toFixed(2));
        }
    }
}

module.exports = Bank;