const path = require('path');
const process = require('process');
const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
fs.createWriteStream(path.join(__dirname, 'text.txt'), 'utf-8');

console.log('Hello, write your text ad press Enter');

rl.on('line', (input) => {
  if (input === 'exit') {
    rl.close();
  } else {
    fs.appendFile(path.join(__dirname, 'text.txt'), input, () => {});
  }
});

process.on('beforeExit', () => {
  console.log('Russian warship, fuck off');
});