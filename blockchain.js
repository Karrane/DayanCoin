const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const {DIFFICULTY, MINING_REWARD} = require('./constants');



class Transaction {
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }

    calculateHash(){
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
    }

    // signingKey signera une transaction grâce à la 
    // combinaison de nos deux clés via l'ojbet ec.genKeyPair() stocké dans const key
    signTransaction(signingKey){
        // check si la clé public est bien la meme que fromAddress :
        if (signingKey.getPublic('hex') !== this.fromAddress){
            throw new Error('You cannot sign transactions for other wallets')
        }
         // on cree le hash de la transaction avec SHA256 :
        const hashTx = this.calculateHash();
       
        const sig = signingKey.sign(hashTx, 'base64');
        // console.log(' \n signingKey.sign(hashTx, base64)', sig)
        // format special
        this.signature = sig.toDER('hex'); 
    }

    isValid(){
        if(this.fromAddress === null)
            return true;
        if(!this.signature || this.signature.length === 0){
            throw new Error('No signature in this transaction');
        }
        // si il y a signature extraire la public key de la signature 
        // et verifier que c'est bien la bonne signature
        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature);
    }
    
}

class Block {
    constructor(timestamp, transactions, previousHash =''){
        this.timestamp= timestamp;
        this.transactions = transactions;
        this.previousHash= previousHash;
        this.nonce = 0;
        this.hash= this.calculateHash();
       
        
    }

    calculateHash(){
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
        
    }
    
    mineBlock(difficulty){
        while(this.hash.substring(0,difficulty) !== Array(difficulty+1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();

        }
        console.log("block mined: " + this.hash);
    }

    hasValidTransactions(){
            for (const tx of this.transactions){
            if(!tx.isValid()){
                return false;
            }
        }
        return true;
    }

}


class Blockchain {
    constructor(){
        this.chain= [this.createGenesisblock()];
        this.difficulty= DIFFICULTY;
        this.pendingTransactions= [];
        this.miningReward = MINING_REWARD;
    }

    createGenesisblock(){
        return new Block("11/06/2021", "Genesis block", "0")
    }

    getlatestBlock(){
        return this.chain[this.chain.length-1];
    }

    // addBlock(newBlock){
    //     newBlock.previousHash = this.getlatestBlock().hash;
    //     newBlock.mineBlock(this.difficulty);
    //     this.chain.push(newBlock);
    // }
    
    //  Remplace la methode addBlock 
    minePendingTransactions(miningRewardAddress){
        let block = new Block(Date.now(), this.pendingTransactions);
        block.previousHash = this.getlatestBlock().hash
        block.mineBlock(this.difficulty);
        

        console.log('Block sucessfully mined!');
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }
    // remplace createTransaction()
    addTransaction(transaction){

        if(!transaction.fromAddress || !transaction.toAddress){
            throw new Error('Transaction must include from and to address')
        }

        if(!transaction.isValid()){
            throw new Error('Cannot add invalid transaction to chain')
        }

        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address){
            let balance = 0;

            for(const block of this.chain){
                for(const trans of block.transactions){
                    if(trans.fromAddress === address){
                        balance -= trans.amount;
                    }

                    if(trans.toAddress === address){
                        balance += trans.amount;
                }
            }
            
        }

        return balance
    }

    ischainValid(){
        for(let i=1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];
        
            if(!currentBlock.hasValidTransactions()){
                return false;
            }

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false ;
            }          

            if(currentBlock.previousHash !== previousBlock.calculateHash()){
                return false ;
            }
            
        }

        return true;
    }
}



module.exports.Blockchain = Blockchain
module.exports.Transaction = Transaction