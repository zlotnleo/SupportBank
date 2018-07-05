const csv_parse = require("csv-parse/lib/sync");
const xml_parse = require('xml-js').xml2json;
const fs = require("fs");
const moment = require("moment");
const Transaction = require("./transaction");
const log4js = require("log4js");
const logger = log4js.getLogger("fileReaders.js");

function readText(filename) {
    let file_contents;
    try {
        file_contents = fs.readFileSync(filename, "utf-8");
    } catch (e) {
        logger.error("Error reading the file: " + e);
        throw e;
    }
    return file_contents;
}

module.exports = {
    readCSV: filename => {
        logger.debug("Reading the CSV " + filename);
        let file_contents = readText(filename);
        let output;
        try {
            output = csv_parse(file_contents);
        } catch (e) {
            logger.error("Error parsing the CSV file: " + e);
            throw e;
        }

        output.splice(0, 1);
        let transactions = [];
        let hasInvalidDate = false;
        let hasInvalidAmount = false;
        for (let record of output) {
            let date = moment(record[0], "DD/MM/YYYY");
            hasInvalidDate = hasInvalidDate || !date.isValid();
            let amount = Number(record[4]);
            hasInvalidAmount = hasInvalidAmount || isNaN(amount);
            transactions.push(new Transaction(date, record[1], record[2], record[3], amount));
        }

        return {
            transactions: transactions,
            hasInvalidAmount: hasInvalidAmount,
            hasInvalidDate: hasInvalidDate
        };
    },

    readJSON: filename => {
        logger.debug("Reading the JSON " + filename);
        let file_contents = readText(filename);
        let output;
        try {
            output = JSON.parse(file_contents);
        } catch (e) {
            logger.error("Error parsing the JSON file: " + e);
            throw e;
        }

        let transactions = [];
        let hasInvalidAmount = false;
        let hasInvalidDate = false;

        for (let record of output) {
            let date = moment(record.Date);
            hasInvalidDate = hasInvalidDate || !date.isValid();
            let amount = Number(record.Amount);
            hasInvalidAmount = hasInvalidAmount || isNaN(amount);
            transactions.push(new Transaction(date, record.FromAccount, record.ToAccount, record.Narrative, amount));
        }

        return {
            transactions: transactions,
            hasInvalidDate: hasInvalidDate,
            hasInvalidAmount: hasInvalidAmount
        }
    },

    readXML: filename => {
        logger.debug("Reading the XML " + filename);
        let file_contents = readText(filename);
        let output;
        try {
            output = JSON.parse(xml_parse(file_contents, {compact: false}))
        } catch (e) {
            logger.error("Error parsing the XML file: " + e);
            throw e;
        }

        let transactions = [];
        let hasInvalidDate = false;
        let hasInvalidAmount = false;

        for (let elt of output.elements[0].elements) {
            let date = moment();
            hasInvalidDate = hasInvalidDate || !date.isValid();
            let amount = Number(elt.elements.find(e => e.name === "Value").elements[0].text);
            hasInvalidAmount = hasInvalidAmount || isNaN(amount);
            transactions.push(new Transaction(
                date,
                elt.elements.find(e => e.name === "Parties").elements.find(e => e.name === "From").elements[0].text,
                elt.elements.find(e => e.name === "Parties").elements.find(e => e.name === "To").elements[0].text,
                elt.elements.find(e => e.name === "Description").elements[0].text,
                amount
            ));
        }

        return {
            transactions: transactions,
            hasInvalidDate: hasInvalidDate,
            hasInvalidAmount: hasInvalidAmount
        }
    }
};