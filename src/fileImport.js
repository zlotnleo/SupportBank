const FileReaders = require("./fileReaders");
const log4js = require("log4js");
const logger = log4js.getLogger("fileImport.js");

module.exports = (filename) => {
    let extension = filename.substring(filename.lastIndexOf(".") + 1);
    let reader;
    logger.debug("Attempting to import file " + filename + " with extension " + extension);
    switch (extension) {
        case "csv":
            reader = FileReaders.readCSV;
            break;
        case "json":
            reader = FileReaders.readJSON;
            break;
        case "xml":
            reader = FileReaders.readXML;
            break;
    }
    if (!reader) {
        throw "Unsupported file extension";
    }
    return reader(filename);
};