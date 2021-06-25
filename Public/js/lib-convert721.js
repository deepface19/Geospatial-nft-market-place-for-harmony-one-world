function TncLibConvert721() {

    this.getUrlParam = function (param_name) {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        return urlParams.get(param_name);
    };

    // ETHEREUM RINKEBY
    if (chain_id === "4") {

        this.conv721 = new web3.eth.Contract(converter721To1155ABI, '', {from: this.account});
        this.nftverse721 = "";

        // xDAI MAINNET
    } else if (chain_id === "64") {

        this.conv721 = new web3.eth.Contract(converter721To1155ABI, '', {from: this.account});
        this.nftverse721 = "";

        // CELO (testnet: aef3)
    } else if (chain_id === "a4ec") {

        this.conv721 = new web3.eth.Contract(converter721To1155ABI, '', {from: this.account});
        this.nftverse721 = "";

        // xDAI / POA (Sokol) TESTNET
    } else if (chain_id === "4d") {

        this.conv721 = new web3.eth.Contract(converter721To1155ABI, '', {from: this.account});
        this.uniftyverse721 = "";

        // Matic
    } else if (chain_id === "89") {

        this.conv721 = new web3.eth.Contract(converter721To1155ABI, '', {from: this.account});
        this.nftverse721 = "";

        // HARMONY 
    } else if (chain_id === "1666600000") {

        this.conv721 = new web3.one.Contract(converter721To1155ABI, '', {from: this.account});
        this.nftverse721 = "";


        // BINANCE TESTNET
    } else if (chain_id === "61") {

        this.conv721 = new web3.eth.Contract(converter721To1155ABI, '', {from: this.account});
        this.nftverse721 = "";

        // BINANCE MAINNET
    } else if (chain_id === "38") {

        this.conv721 = new web3.eth.Contract(converter721To1155ABI, '', {from: this.account});
        this.nftverse721 = "";

        // assuming ethereum mainnet if nothing else specified

        // MOONBASE ALPHA
    } else if (chain_id === "507") {

        this.conv721 = new web3.eth.Contract(converter721To1155ABI, '', {from: this.account});
        this.nftverse721 = "";

        // assuming ethereum mainnet if nothing else specified

        // AVALANCHE
    } else if (chain_id === "a86a") {

        this.conv721 = new web3.eth.Contract(converter721To1155ABI, '', {from: this.account});
        this.nftverse721 = "";

        // assuming ethereum mainnet if nothing else specified

        // ethereum
    } else {

        this.conv721 = new web3.eth.Contract(converter721To1155ABI, '', {from: this.account});
        this.nftverse721 = "";

    }

    this.setAccount = function (address) {
        this.account = address;
    };

    this.convert = async function(eip721Address, tokenId, fractions, preCallback, postCallback, errCallback){

        await sleep(sleep_time);

        let gas = 0;

        try{

            gas = await this.conv721.methods.convert(eip721Address, tokenId, fractions).estimateGas({
                from:this.account,
            });

        }catch(e){
            console.log(e);
            errCallback(e);
            return;
        }

        const price = await web3.eth.getGasPrice();

        this.conv721.methods.convert(eip721Address, tokenId, fractions)
            .send({
                from:this.account,
                gas: gas + Math.floor( gas * 0.1 ),
                gasPrice: Number(price) + Math.floor( Number(price) * 0.1 )
            })
            .on('error', async function(e){
                errCallback(e);
            })
            .on('transactionHash', async function(transactionHash){
                preCallback();
            })
            .on("receipt", function (receipt) {
                postCallback(receipt);
            });
    };

    this.undo = async function(tokenId, preCallback, postCallback, errCallback){

        await sleep(sleep_time);

        let gas = 0;

        try{

            gas = await this.conv721.methods.undo(tokenId).estimateGas({
                from:this.account,
            });

        }catch(e){
            console.log(e);
            errCallback(e);
            return;
        }

        const price = await web3.eth.getGasPrice();

        this.conv721.methods.undo(tokenId)
            .send({
                from:this.account,
                gas: gas + Math.floor( gas * 0.1 ),
                gasPrice: Number(price) + Math.floor( Number(price) * 0.1 )
            })
            .on('error', async function(e){
                errCallback(e);
            })
            .on('transactionHash', async function(transactionHash){
                preCallback();
            })
            .on("receipt", function (receipt) {
                postCallback(receipt);
            });
    };

    this.erc721SetApprovalForAll = async function(operator, approved, erc721Address, preCallback, postCallback, errCallback){

        let erc721 = new web3.eth.Contract( erc721ABI, erc721Address, {from:this.account} );
        let gas = 0;

        try {
            await sleep(sleep_time);
            gas = await erc721.methods.setApprovalForAll(operator, approved).estimateGas({
                from:this.account
            });
        }catch(e){
            console.log(e);
            errCallback(e);
            return;
        }

        const price = await web3.eth.getGasPrice();

        erc721.methods.setApprovalForAll(operator, approved)
            .send({
                from:this.account,
                gas: gas + Math.floor( gas * 0.1 ),
                gasPrice: Number(price) + Math.floor( Number(price) * 0.1 )
            })
            .on('error', async function(e){
                errCallback(e);
            })
            .on('transactionHash', async function(transactionHash){
                preCallback();
            })
            .on("receipt", function (receipt) {
                postCallback(receipt);
            });
    };

    this.erc721IsApprovedForAll = async function(owner, operator, erc721Address){

        let erc721 = new web3.eth.Contract( erc721ABI, erc721Address, {from:this.account} );
        let approved = await erc721.methods.isApprovedForAll(owner, operator).call({from:this.account});

        return approved;
    };

};