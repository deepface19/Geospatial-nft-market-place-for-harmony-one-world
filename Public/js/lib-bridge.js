
function TncLibBridge(){

    this.getUrlParam = function(param_name) {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        return urlParams.get(param_name);
    };

    // will be adding more based on chain
    if(chain_id == '64'){
        this.chainIn = new web3.eth.Contract(bridgeInABI, 'string', {from: this.account});
    }

    //  MAINNET
    if(chain_id === "1") {

        this.ethOut = new web3.eth.Contract(bridgeOutABI, 'string', {from: this.account});

        this.marketplaceNFTsverseAddress = 'string';
        this.marketplaceNFTsverse = new web3.eth.Contract(marketplaceNFTverseABI, this.marketplaceNFTsverseAddress, {from: this.account});

        this.account = '';

        //  MAINNET
    } else{

        this.ethOut = new web3.eth.Contract(bridgeOutABI, '', {from: this.account});
        this.account = '';

    }

    this.setAccount = function(address){
        this.account = address;
    };

    this.getJobsLength = async function(){

        await sleep(sleep_time);
        return await this.ethOut.methods.getJobsLength(this.account).call({from:this.account});
    }

    this.getJob = async function(index){

        await sleep(sleep_time);
        return await this.ethOut.methods.jobs(this.account, index).call({from:this.account});
    }

    this.getBridgedId = async function(chainId, srcErc1155Address, srcId){

        await sleep(sleep_time);
        return await this.uniftyverse.methods.getBridgedId(chainId, srcErc1155Address, srcId).call({from:this.account});

    }

    this.getGasFunds = async function(address){

        await sleep(sleep_time);
        return await this.ethOut.methods.userFunds(address).call({from:this.account});

    }

    this.getNifFee = async function(){

        await sleep(sleep_time);
        let nifFee = await this.ethOut.methods.nifFee().call({from:this.account});
        let nifFeeBurn = await this.ethOut.methods.nifFeeBurn().call({from:this.account});

        nifFee = web3.utils.toBN(""+nifFee);
        nifFeeBurn = web3.utils.toBN(""+nifFeeBurn);

        return nifFee.add(nifFeeBurn);
    }

    this.in_getSourceInfo = async function(nftId){

        await sleep(sleep_time);
        return await this.uniftyverse.methods.getBridgedSrc(nftId).call({from:this.account});

    }

    this.in_getMinCurrency = async function(){

        await sleep(sleep_time);
        return await this.chainIn.methods.minCurrency().call({from:this.account});

    }

    this.in_performBridging = async function(address, id, amount, preCallback, postCallback, errCallback){

        await sleep(sleep_time);

        let minCurrency = await this.in_getMinCurrency();

        let gas = 0;

        try {
            await sleep(sleep_time);
            gas = await this.chainIn.methods._in(address, id, amount).estimateGas({
                from:this.account,
                value: minCurrency
            });
        }catch(e){
            console.log(e);
            errCallback("");
            return;
        }

        const price = await web3.eth.getGasPrice();

        this.chainIn.methods._in(address, id, amount)
            .send({
                from:this.account,
                gas: gas + Math.floor( gas * 0.1 ),
                gasPrice: Number(price) + Math.floor( Number(price) * 0.1 ),
                value: minCurrency
            })
            .on('error', async function(e){
                errCallback('');
            })
            .on('transactionHash', async function(transactionHash){
                preCallback();
            })
            .on("receipt", function (receipt) {
                postCallback(receipt);
            });
    }

    this.in_cancelJob = async function(jobId, preCallback, postCallback, errCallback){

        await sleep(sleep_time);

        let gas = 0;

        try {
            await sleep(sleep_time);
            gas = await this.chainIn.methods.cancel(jobId).estimateGas({
                from:this.account
            });
        }catch(e){
            console.log(e);
            errCallback("");
            return;
        }

        const price = await web3.eth.getGasPrice();

        this.chainIn.methods.cancel(jobId)
            .send({
                from:this.account,
                gas: gas + Math.floor( gas * 0.1 ),
                gasPrice: Number(price) + Math.floor( Number(price) * 0.1 )
            })
            .on('error', async function(e){
                errCallback('');
            })
            .on('transactionHash', async function(transactionHash){
                preCallback();
            })
            .on("receipt", function (receipt) {
                postCallback(receipt);
            });
    }

    this.performBackBridging = async function(id, amount, preCallback, postCallback, errCallback){

        await sleep(sleep_time);

        let gas = 0;

        try {
            await sleep(sleep_time);
            gas = await this.ethOut.methods.restore(id, amount).estimateGas({
                from:this.account
            });
        }catch(e){
            console.log(e);
            errCallback("");
            return;
        }

        const price = await web3.eth.getGasPrice();

        this.ethOut.methods.restore(id, amount)
            .send({
                from:this.account,
                gas: gas + Math.floor( gas * 0.1 ),
                gasPrice: Number(price) + Math.floor( Number(price) * 0.1 )
            })
            .on('error', async function(e){
                errCallback('');
            })
            .on('transactionHash', async function(transactionHash){
                preCallback();
            })
            .on("receipt", function (receipt) {
                postCallback(receipt);
            });
    }

    this.redeem = async function(index, preCallback, postCallback, errCallback){

        console.log('redeem index: ', index);

        await sleep(sleep_time);

        let gas = 0;

        try {
            await sleep(sleep_time);
            gas = await this.ethOut.methods.performBridging(index).estimateGas({
                from:this.account
            });
        }catch(e){
            console.log(e);
            errCallback("");
            return;
        }

        const price = await web3.eth.getGasPrice();

        this.ethOut.methods.performBridging(index)
            .send({
                from:this.account,
                gas: gas + Math.floor( gas * 0.1 ),
                gasPrice: Number(price) + Math.floor( Number(price) * 0.1 )
            })
            .on('error', async function(e){
                errCallback('');
            })
            .on('transactionHash', async function(transactionHash){
                preCallback();
            })
            .on("receipt", function (receipt) {
                postCallback(receipt);
            });

    }

    this.cancelRestore = async function(jobId, preCallback, postCallback, errCallback){

        await sleep(sleep_time);

        let gas = 0;

        try {
            await sleep(sleep_time);
            gas = await this.ethOut.methods.cancelRestore(jobId).estimateGas({
                from:this.account
            });
        }catch(e){
            console.log(e);
            errCallback("");
            return;
        }

        const price = await web3.eth.getGasPrice();

        this.ethOut.methods.cancelRestore(jobId)
            .send({
                from:this.account,
                gas: gas + Math.floor( gas * 0.1 ),
                gasPrice: Number(price) + Math.floor( Number(price) * 0.1 )
            })
            .on('error', async function(e){
                errCallback('');
            })
            .on('transactionHash', async function(transactionHash){
                preCallback();
            })
            .on("receipt", function (receipt) {
                postCallback(receipt);
            });
    }

    this.depositFunds = async function(funds, preCallback, postCallback, errCallback){

        await sleep(sleep_time);

        let wei = web3.utils.toWei(""+funds, 'ether');

        let gas = 0;

        try {
            await sleep(sleep_time);
            gas = await this.ethOut.methods.addFunds().estimateGas({
                from:this.account,
                value:wei
            });
        }catch(e){
            console.log(e);
            errCallback("");
            return;
        }

        const price = await web3.eth.getGasPrice();

        this.ethOut.methods.addFunds()
            .send({
                from:this.account,
                gas: gas + Math.floor( gas * 0.1 ),
                gasPrice: Number(price) + Math.floor( Number(price) * 0.1 ),
                value: wei
            })
            .on('error', async function(e){
                errCallback('');
            })
            .on('transactionHash', async function(transactionHash){
                preCallback();
            })
            .on("receipt", function (receipt) {
                postCallback(receipt);
            });
    }

    this.withdrawFunds = async function(preCallback, postCallback, errCallback){

        await sleep(sleep_time);

        let gas = 0;

        try {
            await sleep(sleep_time);
            gas = await this.ethOut.methods.withdrawFunds().estimateGas({
                from:this.account
            });
        }catch(e){
            console.log(e);
            errCallback("");
            return;
        }

        const price = await web3.eth.getGasPrice();

        this.ethOut.methods.withdrawFunds()
            .send({
                from:this.account,
                gas: gas + Math.floor( gas * 0.1 ),
                gasPrice: Number(price) + Math.floor( Number(price) * 0.1 )
            })
            .on('error', async function(e){
                errCallback('');
            })
            .on('transactionHash', async function(transactionHash){
                preCallback();
            })
            .on("receipt", function (receipt) {
                postCallback(receipt);
            });
    }

}
