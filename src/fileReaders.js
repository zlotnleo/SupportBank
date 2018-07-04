const csv_parse = require("csv-parse/lib/sync");
const xml_parse = require('xml-js').xml2json;
const fs = require("fs");
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
        return output.map(record => new Transaction(record[0], record[1], record[2], record[3], Number(record[4])));
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

        return output.map(record =>
            new Transaction(record.Date, record.FromAccount, record.ToAccount, record.Narrative, Number(record.Amount))
        );
    },

    readXML: filename => {
        logger.debug("Reading the XML " + filename);
        let file_contents = readText(filename);
        try {
            return JSON.parse(xml_parse(file_contents, {compact: false}))
                .elements[0].elements
                .map(elt => new Transaction(elt.attributes.Date,
                    elt.elements.find(e => e.name === "Parties").elements.find(e => e.name === "From").elements[0].text,
                    elt.elements.find(e => e.name === "Parties").elements.find(e => e.name === "To").elements[0].text,
                    elt.elements.find(e => e.name === "Description").elements[0].text,
                    Number(elt.elements.find(e => e.name === "Value").elements[0].text)
                    )
                )
        } catch (e) {
            logger.error("Error parsing the XML file: " + e);
            throw e;
        }
    }
};