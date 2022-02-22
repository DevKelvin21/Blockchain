const SHA256 = require('crypto-js/sha256')

let system = {
    blockChain: [],
    difficulty : "000",
    makeGenesis : function (){
        let Genesis = this.makeBlock("Block innitial 'Genesis'", "") 
        Genesis.hash = this.makeHash(Genesis);
        this.blockChain.push(Genesis);
    },
    makeHash(Block){
        return SHA256(Block.index + Block.date + JSON.stringify(Block.data) + Block.previousHash + Block.nonce).toString();
    },
    makeBlock(data,previousHash){
        let Block = {
            index : this.blockChain.length + 1,
            date : new Date(),
            previousHash : previousHash,
            hash : "",
            data : data,
            nonce : 0,
        }
        return Block
    },
    addBlock(data){
        console.log('start to add block');

        let previous = this.blockChain[this.blockChain.length - 1];
        let Block = this.makeBlock(data, previous.hash);
        // mine Block
        Block = this.mineBlock(Block);
        this.blockChain.push(Block);
    },
    mineBlock(Block){
        while(!Block.hash.startsWith(this.difficulty)){
            Block.nonce++;
            Block.hash=this.makeHash(Block);
        }
        return Block;
    },  
    validateBlockChain(){
        for(let i = 1; i<this.blockChain.length; i++){
            let previousBlock = this.blockChain[i-1];
            let currentBlock = this.blockChain[i];

            // first validate

            if(currentBlock.previousHash!=previousBlock.hash){
                console.log('error previous Hash'+ currentBlock.index);
                return false;
            }

            // second validate
            if(this.makeHash(currentBlock)!=currentBlock.hash){
                console.log('error hash has incorrect')
                return false;
            }

            return true;
        }
    },
}

system.makeGenesis();
system.addBlock({"vote": "A"});
system.addBlock({"vote": "B"});
system.addBlock({"vote": "A"});
system.addBlock({"vote": "D"});
system.addBlock({"vote": "A"});
system.addBlock({"vote": "C"});

console.log(system.validateBlockChain());

// simulate hacking

system.blockChain[1].data.vote="K";

console.log("validate after changes : "+ system.validateBlockChain());

console.log(JSON.stringify(system.blockChain,null,2));
