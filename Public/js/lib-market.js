function TncLibMarket(){

    this.getUrlParam = function(param_name) {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        return urlParams.get(param_name);
    };

    // ETHEREUM RINKEBY
    if(chain_id === "4") {

        this.market = new web3.eth.Contract(marketABI, 'null', {from: this.account});
        this.swap = new web3.eth.Contract(swapABI, 'null', {from: this.account});
        this.wrap = new web3.eth.Contract(marketWrapABI, 'null', {from: this.account});
        this.account = '';

        // xDAI MAINNET
    } else if(chain_id === "64") {

        this.market = new web3.eth.Contract(marketABI, 'null', {from: this.account});
        this.swap = new web3.eth.Contract(swapABI, 'null', {from: this.account});
        this.wrap = new web3.eth.Contract(marketWrapABI, 'null', {from: this.account});
        this.account = '';

        // xDAI / POA (Sokol) TESTNET
    } else if(chain_id === "4d") {

        this.market = new web3.eth.Contract(marketABI, '', {from: this.account});
        this.swap = new web3.eth.Contract(swapABI, '', {from: this.account});
        this.wrap = new web3.eth.Contract(marketWrapABI, '', {from: this.account});
        this.account = '';

        // Matic
    } else if(chain_id === "89") {

        this.market = new web3.eth.Contract(marketABI, 'null', {from: this.account});
        this.swap = new web3.eth.Contract(swapABI, 'null', {from: this.account});
        this.wrap = new web3.eth.Contract(marketWrapABI, 'null', {from: this.account});
        this.account = '';

        // BINANCE TESTNET
    } else if(chain_id === "61") {

        this.market = new web3.eth.Contract(marketABI, '', {from: this.account});
        this.swap = new web3.eth.Contract(swapABI, '', {from: this.account});
        this.wrap = new web3.eth.Contract(marketWrapABI, '', {from: this.account});
        this.account = '';

        // Moonbase Alpha
    } else if(chain_id === "507") {

        this.market = new web3.eth.Contract(marketABI, '', {from: this.account});
        this.swap = new web3.eth.Contract(swapABI, '', {from: this.account});
        this.wrap = new web3.eth.Contract(marketWrapABI, '', {from: this.account});
        this.account = '';

        // CELO
    } else if(chain_id === "a4ec") {

        this.market = new web3.eth.Contract(marketABI, 'null', {from: this.account});
        this.swap = new web3.eth.Contract(swapABI, 'null', {from: this.account});
        this.wrap = new web3.eth.Contract(marketWrapABI, 'null', {from: this.account});
        this.account = '';

        // BSC MAINNET
    } else if(chain_id === "38") {

        // pool 
        // burn 

        this.market = new web3.eth.Contract(marketABI, 'null', {from: this.account});
        this.swap = new web3.eth.Contract(swapABI, 'null', {from: this.account});
        this.wrap = new web3.eth.Contract(marketWrapABI, 'null', {from: this.account});
        this.account = '';

        // AVALANCHE
    } else if(chain_id === "a86a") {

        this.market = new web3.eth.Contract(marketABI, 'null', {from: this.account});
        this.swap = new web3.eth.Contract(swapABI, 'null', {from: this.account});
        this.wrap = new web3.eth.Contract(marketWrapABI, 'null', {from: this.account});
        this.account = '';
       
         // HARMONY
    } else if(chain_id === "1666600000") {

        this.market = new web3.eth.Contract(marketABI, 'null', {from: this.account});
        this.swap = new web3.eth.Contract(swapABI, 'null', {from: this.account});
        this.wrap = new web3.eth.Contract(marketWrapABI, 'null', {from: this.account});
        this.account = '';
        
    } else{

        this.market = new web3.eth.Contract(marketABI, '', {from: this.account});
        this.swap = new web3.eth.Contract(swapABI, '', {from: this.account});
        this.wrap = new web3.eth.Contract(marketWrapABI, '', {from: this.account});
        this.account = '';

    }

    this.setAccount = function(address){
        this.account = address;
    };

    this.saleExists = async function(account, index){

        await sleep(sleep_time);
        return await this.market.methods.saleExists(account, index).call({from:this.account});
    };

    this.getSwapRequestsLength = async function(account){

        await sleep(sleep_time);
        return await this.swap.methods.getSwapRequestsLength(account).call({from:this.account});
    };

    this.getSwapRequestsListLength = async function(account){

        await sleep(sleep_time);
        return await this.swap.methods.getSwapRequestsListLength(account).call({from:this.account});
    };

    this.getSwapRequest = async function(account, index){

        await sleep(sleep_time);
        return await this.swap.methods.getSwapRequest(account, index).call({from:this.account});
    };

    this.getSwapRequestListEntry = async function(account, index){

        await sleep(sleep_time);
        return await this.swap.methods.getSwapRequestListEntry(account, index).call({from:this.account});
    };

    this.getSwapExists = async function(seller0, seller1, index0){

        await sleep(sleep_time);
        let _index0 = parseInt(index0);
        return await this.swap.methods.swapStakers( seller0, seller1, '0x'+web3.utils.padLeft(_index0.toString(16), 64) ).call({from:this.account});
    };

    this.getAsksLengths = async function(account){

        if(account == ''){
            account = '0x0000000000000000000000000000000000000000';
        }

        await sleep(sleep_time);
        return await this.market.methods.getAsksLengths(account).call({from:this.account});
    };

    this.getAsk = async function(index, account){

        await sleep(sleep_time);

        let askIndex = 0;

        if(account != ''){

            askIndex = await this.market.methods.userAsks(account, index).call({from:this.account});
        }
        else
        {
            askIndex = await this.market.methods.publicAsks(index).call({from:this.account});
        }

        if(askIndex != 0) {

            return {ask: await this.getAskBase(askIndex), index: askIndex};
        }

        return null;
    };

    this.getCategoriesLength = async function(category){

        await sleep(sleep_time);

        return await this.wrap.methods.getCategoriesLength(category).call({from: this.account});
    }

    this.getCategory = async function(category, index){

        await sleep(sleep_time);

        let _cat = parseInt(category);
        return await this.wrap.methods.categories( '0x'+web3.utils.padLeft(_cat.toString(16), 64), index ).call({from: this.account});
    }

    this.getAskBase = async function(askIndex){

        await sleep(sleep_time);

        return await this.market.methods.getAsk(askIndex).call({from: this.account});
    }

    this.getFunds = async function(owner, token){

        await sleep(sleep_time);

        return await this.market.methods.funds(owner, token).call({from: this.account});
    }

    this.getRoyalties = async function(erc1155Address, id){

        await sleep(sleep_time);

        let _id = parseInt(id);
        return await this.market.methods.royalties( erc1155Address, '0x'+web3.utils.padLeft(_id.toString(16), 64) ).call({from: this.account});
    }
    this.getRoyalties = async function(hrc1155Address, id){

        await sleep(sleep_time);

        let _id = parseInt(id);
        return await this.market.methods.royalties( hrc1155Address, '0x'+web3.utils.padLeft(_id.toString(16), 64) ).call({from: this.account});
    }

    this.sell = async function(erc1155Address, id, amount, token, collectionPrice, swapMode, category, preCallback, postCallback, errCallback){

        await sleep(sleep_time);

        let gas = 0;

        let setup = [collectionPrice, swapMode, category];

        try{

            gas = await this.wrap.methods.sell(erc1155Address, id, amount, token, setup).estimateGas({
                from:this.account,
            });

        }catch(e){
            console.log(e);
            errCallback("");
            return;
        }

        const price = await web3.eth.getGasPrice();

        this.wrap.methods.sell(erc1155Address, id, amount, token, setup)
            .send({
                from:this.account,
                gas: gas + Math.floor( gas * 0.1 ),
                gasPrice: Number(price) + Math.floor( Number(price) * 0.1 )
            })
            .on('error', async function(e){
                errCallback();
            })
            .on('transactionHash', async function(transactionHash){
                preCallback();
            })
            .on("receipt", function (receipt) {
                console.log("Sell order placed.");
                postCallback(receipt);
            });
    };
    
    this.sell = async function(hrc1155Address, id, amount, token, collectionPrice, swapMode, category, preCallback, postCallback, errCallback){

        await sleep(sleep_time);

        let gas = 0;

        let setup = [collectionPrice, swapMode, category];

        try{

            gas = await this.wrap.methods.sell(hrc1155Address, id, amount, token, setup).estimateGas({
                from:this.account,
            });

        }catch(e){
            console.log(e);
            errCallback("");
            return;
        }

        const price = await web3.eth.getGasPrice();

        this.wrap.methods.sell(hrc1155Address, id, amount, token, setup)
            .send({
                from:this.account,
                gas: gas + Math.floor( gas * 0.1 ),
                gasPrice: Number(price) + Math.floor( Number(price) * 0.1 )
            })
            .on('error', async function(e){
                errCallback();
            })
            .on('transactionHash', async function(transactionHash){
                preCallback();
            })
            .on("receipt", function (receipt) {
                console.log("Sell order placed.");
                postCallback(receipt);
            });
    };

    this.setRoyalties = async function(erc1155Address, id, royaltyPercent, preCallback, postCallback, errCallback){

        await sleep(sleep_time);

        let gas = 0;

        try{

            gas = await this.market.methods.setRoyalty(erc1155Address, id, royaltyPercent).estimateGas({
                from:this.account,
            });

        }catch(e){
            console.log(e);
            errCallback("");
            return;
        }

        const price = await web3.eth.getGasPrice();

        this.market.methods.setRoyalty(erc1155Address, id, royaltyPercent)
            .send({
                from:this.account,
                gas: gas + Math.floor( gas * 0.1 ),
                gasPrice: Number(price) + Math.floor( Number(price) * 0.1 )
            })
            .on('error', async function(e){
                errCallback();
            })
            .on('transactionHash', async function(transactionHash){
                preCallback();
            })
            .on("receipt", function (receipt) {
                postCallback(receipt);
            });
    };

    this.setRoyalties = async function(hrc1155Address, id, royaltyPercent, preCallback, postCallback, errCallback){

        await sleep(sleep_time);

        let gas = 0;

        try{

            gas = await this.market.methods.setRoyalty(hrc1155Address, id, royaltyPercent).estimateGas({
                from:this.account,
            });

        }catch(e){
            console.log(e);
            errCallback("");
            return;
        }

        const price = await web3.eth.getGasPrice();

        this.market.methods.setRoyalty(hrc1155Address, id, royaltyPercent)
            .send({
                from:this.account,
                gas: gas + Math.floor( gas * 0.1 ),
                gasPrice: Number(price) + Math.floor( Number(price) * 0.1 )
            })
            .on('error', async function(e){
                errCallback();
            })
            .on('transactionHash', async function(transactionHash){
                preCallback();
            })
            .on("receipt", function (receipt) {
                postCallback(receipt);
            });
    };

    this.buy = async function(seller, amount, ref, index, preCallback, postCallback, errCallback){

        await sleep(sleep_time);

        let gas = 0;

        try{

            gas = await this.market.methods.buy(seller, ""+amount, ref, ""+index).estimateGas({
                from: this.account
            });

        }catch(e){
            console.log(e);
            errCallback("");
            return;
        }

        const price = await web3.eth.getGasPrice();

        this.market.methods.buy(seller, ""+amount, ref, ""+index)
            .send({
                from: this.account,
                gas: gas + Math.floor( gas * 0.1 ),
                gasPrice: Number(price) + Math.floor( Number(price) * 0.1 )
            })
            .on('error', async function(e){
                errCallback();
            })
            .on('transactionHash', async function(transactionHash){
                preCallback();
            })
            .on("receipt", function (receipt) {
                console.log("Buy order placed.");
                postCallback(receipt);
            });
    };

    this.cancel = async function(index, preCallback, postCallback, errCallback){

        await sleep(sleep_time);

        let gas = 0;

        try{

            gas = await this.wrap.methods.cancelAsk(""+index).estimateGas({
                from: this.account
            });

        }catch(e){
            console.log(e);
            errCallback("");
            return;
        }

        const price = await web3.eth.getGasPrice();

        this.wrap.methods.cancelAsk(""+index)
            .send({
                from: this.account,
                gas: gas + Math.floor( gas * 0.1 ),
                gasPrice: Number(price) + Math.floor( Number(price) * 0.1 )
            })
            .on('error', async function(e){
                errCallback();
            })
            .on('transactionHash', async function(transactionHash){
                preCallback();
            })
            .on("receipt", function (receipt) {
                console.log("Buy order placed.");
                postCallback(receipt);
            });
    };

    this.withdrawFunds = async function(token, preCallback, postCallback, errCallback){

        await sleep(sleep_time);

        let gas = 0;

        try{

            gas = await this.market.methods.withdrawBalance(token).estimateGas({
                from: this.account
            });

        }catch(e){
            console.log(e);
            errCallback("");
            return;
        }

        const price = await web3.eth.getGasPrice();

        this.market.methods.withdrawBalance(token)
            .send({
                from: this.account,
                gas: gas + Math.floor( gas * 0.1 ),
                gasPrice: Number(price) + Math.floor( Number(price) * 0.1 )
            })
            .on('error', async function(e){
                errCallback();
            })
            .on('transactionHash', async function(transactionHash){
                preCallback();
            })
            .on("receipt", function (receipt) {
                console.log("Buy order placed.");
                postCallback(receipt);
            });
    };

    this.requestSwap = async function(index0, index1, nif, preCallback, postCallback, errCallback){

        await sleep(sleep_time);

        let gas = 0;

        try{

            gas = await this.swap.methods.requestSwap(index0, index1, nif).estimateGas({
                from: this.account
            });

        }catch(e){
            console.log(e);
            errCallback("");
            return;
        }

        const price = await web3.eth.getGasPrice();

        this.swap.methods.requestSwap(index0, index1, nif)
            .send({
                from: this.account,
                gas: gas + Math.floor( gas * 0.1 ),
                gasPrice: Number(price) + Math.floor( Number(price) * 0.1 )
            })
            .on('error', async function(e){
                errCallback();
            })
            .on('transactionHash', async function(transactionHash){
                preCallback();
            })
            .on("receipt", function (receipt) {
                console.log("Buy order placed.");
                postCallback(receipt);
            });
    };

    this.acceptSwap = async function(swapIndex, preCallback, postCallback, errCallback){

        await sleep(sleep_time);

        let gas = 0;

        try{

            gas = await this.swap.methods.acceptSwap(swapIndex).estimateGas({
                from: this.account
            });

        }catch(e){
            console.log(e);
            errCallback("");
            return;
        }

        const price = await web3.eth.getGasPrice();

        this.swap.methods.acceptSwap(swapIndex)
            .send({
                from: this.account,
                gas: gas + Math.floor( gas * 0.1 ),
                gasPrice: Number(price) + Math.floor( Number(price) * 0.1 )
            })
            .on('error', async function(e){
                errCallback();
            })
            .on('transactionHash', async function(transactionHash){
                preCallback();
            })
            .on("receipt", function (receipt) {
                console.log("Buy order placed.");
                postCallback(receipt);
            });
    };

    this.cancelSwapRequest = async function(seller, swapIndex, preCallback, postCallback, errCallback){

        await sleep(sleep_time);

        let gas = 0;

        try{

            gas = await this.swap.methods.cancelSwapRequest(seller, swapIndex).estimateGas({
                from: this.account
            });

        }catch(e){
            console.log(e);
            errCallback("");
            return;
        }

        const price = await web3.eth.getGasPrice();

        this.swap.methods.cancelSwapRequest(seller, swapIndex)
            .send({
                from: this.account,
                gas: gas + Math.floor( gas * 0.1 ),
                gasPrice: Number(price) + Math.floor( Number(price) * 0.1 )
            })
            .on('error', async function(e){
                errCallback();
            })
            .on('transactionHash', async function(transactionHash){
                preCallback();
            })
            .on("receipt", function (receipt) {
                console.log("Buy order placed.");
                postCallback(receipt);
            });
    };

}
