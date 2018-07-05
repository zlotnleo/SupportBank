const Account = require("./account");
const log4js = require("log4js");
const logger = log4js.getLogger("bank.js");

class Bank {
    constructor() {
        this.accounts = {}
    }

    processTransaction(transaction) {
        logger.debug("Started processing a transaction: " + JSON.stringify(transaction));
        if (isNaN(transaction.amount)) {
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
        let account = this.accounts[name];
        logger.debug("Printing information for " + account.name + "'s account");
        console.log("Account info for " + account.name);
        console.log("Total balance: " + account.balance);
        console.log("Transaction list:");


        let allTransactions = account.transactionsFrom.concat(account.transactionsTo);
        let validDateTransactions = [];
        let invalidDateTransactions = [];
        allTransactions.forEach(transaction => {
            if (transaction.date.isValid())
                validDateTransactions.push(transaction);
            else
                invalidDateTransactions.push(transaction);
        });
        validDateTransactions.sort((t1, t2) => t1.date - t2.date);

        validDateTransactions.forEach(transaction => console.log(
            transaction.date.format("DD/MM/YYYY")
            + (transaction.from === account.name
                ? " - " + transaction.amount + " to " + transaction.to
                : " + " + transaction.amount + " from " + transaction.from
            ) + " for \"" + transaction.reason + "\""
        ));
        invalidDateTransactions.forEach(transaction => console.log(
            "[No Date]"
            + (transaction.from === account.name
                ? " - " + transaction.amount + " to " + transaction.to
                : " + " + transaction.amount + " from " + transaction.from
            ) + " for \"" + transaction.reason + "\""
        ));
    }

    printAllAccounts() {
        logger.debug("Printing a list of all accounts");
        if (Object.keys(this.accounts).length === 0) {
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