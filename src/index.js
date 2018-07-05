const log4js = require("log4js");
const FileImport = require("./fileImport");
const exportJSON = require("./exportJSON");

log4js.configure({
    appenders: {
        file: {type: 'fileSync', filename: 'logs/debug.log'}
    },
    categories: {
        default: {appenders: ['file'], level: 'debug'}
    }
});

const logger = log4js.getLogger("index.js");
const Bank = require("./bank");

let bank = new Bank();

console.log("Type \"Help\" for a list of commands");

process.stdin.on("readable", () => {
    let input = process.stdin.read().toString().slice(0, -1);
    logger.debug("Processing user input: " + input);

    if (input === "Quit") {
        process.exit(0);
    } else if (input === "List All") {
        bank.printAllAccounts();
    } else if (input.startsWith("List ")) {
        bank.printAccountInfo(input.substring("List ".length));
    } else if(input.startsWith("Import File ")) {
        let filename = input.substring("Import File ".length);
        try {
            let loaded = FileImport(filename);
            if (loaded.hasInvalidDate) {
                console.log("Warning: one or more transactions contain an invalid date. They will appear out of order");
            }
            if (loaded.hasInvalidAmount) {
                console.log("Warning: one or more transactions contain an invalid amount. They will be ignored.");
            }

            loaded.transactions.forEach(transaction => bank.processTransaction(transaction));
            console.log("Transactions loaded!");
        } catch (e) {
            logger.debug("Error importing the file: " + e);
            console.log("An error occurred while trying to read the file.");
        }
    } else if(input.startsWith("Export File")) {
        let filename = input.substring("Export File ".length);
        exportJSON(filename, bank.getAllTransactions());
    } else if(input === "Clear") {
        bank = new Bank();
        console.log("Cleared all loaded transactions.");
    } else if (input === "Help") {
        console.log("                  Help - show this page");
        console.log("                  Quit - exit");
        console.log("              List All - list all accounts");
        console.log("           List <name> - list all transactions for a given account");
        console.log("Import File <filename> - import transactions from a file");
        console.log("Export File <filename> - export all loaded transactions to a file in JSON format");
        console.log("                 Clear - clear all loaded transactions");
    } else {
        console.log("Unrecognised command, type \"Help\" for a list of available commands.");
    }
});