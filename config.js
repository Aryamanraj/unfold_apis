const fs = require('fs');
const path = require('path');
require('dotenv').config();

const configPath = path.resolve(__dirname, './config.json');
let configData;

// Check if config.json exists
if (fs.existsSync(configPath)) {
    configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
} else {
    configData = {};
}

// Function to get config value
const getConfig = (key) => {
    if (configData[key]) {
        return configData[key];
    } else if (process.env[key]) {
        return process.env[key];
    } else {
        return null; // or provide a default value
    }
};

module.exports = {
    getConfig
};
