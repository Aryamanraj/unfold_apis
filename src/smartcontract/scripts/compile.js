const fs = require('fs');
const path = require('path');
const solc = require('solc');

// Read the Solidity contract code
const contractPath = path.resolve(__dirname, '../contracts/AVANFT.sol');
const contractCode = fs.readFileSync(contractPath, 'utf8');

// Set the compiler input
const compilerInput = {
  language: 'Solidity',
  sources: {
    'AVANFT.sol': {
      content: contractCode
    }
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*']
      }
    }
  }
};

// Compile the contract
const compiledContract = JSON.parse(solc.compile(JSON.stringify(compilerInput)));

const contractName = 'EnhancedNFT';
console.log(compiledContract)
const bytecode = compiledContract.contracts['AVANFT.sol'][contractName].evm.bytecode.object;
const abi = compiledContract.contracts['AVANFT.sol'][contractName].abi;

// Create an object with the compiled data
const compiledData = {
  contractName: contractName,
  bytecode: bytecode,
  abi: abi
};

// Write the compiled data to a JSON file
const outputPath = path.resolve(__dirname, '../builds/compiledContract.json');
fs.writeFileSync(outputPath, JSON.stringify(compiledData, null, 2));

console.log('Contract compiled and output saved in compiledContract.json');
