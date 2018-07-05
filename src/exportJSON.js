const fs = require("fs");
const log4js = require("log4js");
const logger = log4js.getLogger("exportJSON.js");

module.exports = (filename, transactions) => {
    logger.debug("Attempting to export all transactions");
    fs.writeFile(filename, JSON.stringify(transactions), (err) => {
        if(err) {
            console.log("Unable to export transactions.");
            logger.debug("Export failed: " + err);
            return;
        }
        console.log("Export successful!");
        logger.debug("Transactions exported successfully");
    })
}