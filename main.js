const {Blockchain,Transaction} = require('./Blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const {PRIVATE_KEY} = require('./constants');

const myKey = ec.keyFromPrivate(PRIVATE_KEY)
const myWalletAddress = myKey.getPublic('hex')

let dayanCoin = new Blockchain();


// FIRST TRANSACTION
const tx1 = new Transaction(myWalletAddress,'public key address of someone', 10)
tx1.signTransaction(myKey)
dayanCoin.addTransaction(tx1)


console.log('\n Starting the miner FIRST TIME...')
dayanCoin.minePendingTransactions(myWalletAddress)

console.log('\n Balance of my-address is', dayanCoin.getBalanceOfAddress(myWalletAddress));

// SECOND TRANSACTION
const tx2 = new Transaction(myWalletAddress,'public key address of someone', 20)
tx2.signTransaction(myKey)
dayanCoin.addTransaction(tx2)


console.log('\n Starting the miner SECOND TIME...')
dayanCoin.minePendingTransactions(myWalletAddress)

console.log('\n Balance of my-address is', dayanCoin.getBalanceOfAddress(myWalletAddress));

// tenter de changer la premiere transaction manuellement
// La signature devient fausse :
// dayanCoin.chain[1].transactions[0].amount = 1;

// TEST
console.log("\n Instance de ma Blockchain : " + "\n" + JSON.stringify(dayanCoin, null, 2))

console.log("\nIs my Blockchain valid ? " + "\n" + dayanCoin.ischainValid());

