// const EC = require('elliptic').ec;
import { ec as EC } from "elliptic"
const ec = new EC('secp256k1');

// object contenant getPublic et getPrivate key :
const key = ec.genKeyPair();

// generation des clés via des methodes de ec.genKeyPair:
const publicKey = key.getPublic('hex');
const privateKey = key.getPrivate('hex');


console.log()
console.log('private Key : ' + privateKey)

console.log( '\n public Key : ' + publicKey)

