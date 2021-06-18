import './HRC1155.sol';
import './HRC1155Metadata.sol';
import './HRC1155MintBurn.sol';
import './HRC1155Tradable.sol';
import './IHRC1155.sol';
import './IHRC1155TokenReceiver.sol';
import './IHRC165.sol';
import './Roles.sol';
import './Strings.sol';
import './HRC20.sol';
import './hmy.js';
import './init.js';

let sleep_time = 25;
let min_block = 0;

function TncLib(){

    this.getUrlParam = function(param_name) {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        return urlParams.get(param_name);
    };

    // ETHEREUM RINKEBY
    if(chain_id === "4") {

        this.nif = new web3.eth.Contract(nifABI, '', {from: this.account});
        this.erc1155 = new web3.eth.Contract(erc1155ABI, '', {from: this.account});
        this.genesis = new web3.eth.Contract(genesisABI, '', {from: this.account});
        this.farm = new web3.eth.Contract(farmABI, '', {from: this.account});
        this.farmShop = new web3.eth.Contract(farmShopABI, '', {from: this.account});
        this.multiBatch = new web3.eth.Contract(multiBatchABI, '', {from: this.account});
        this.account = '';
        this.defaultProxyRegistryAddress = '0x0000000000000000000000000000000000000000'; // opensea

    // xDAI MAINNET
    } else if(chain_id === "64") {

        this.nif = new web3.eth.Contract(nifABI, '', {from: this.account});
        this.erc1155 = new web3.eth.Contract(erc1155ABI, '', {from: this.account});
        this.genesis = new web3.eth.Contract(genesisABI, '', {from: this.account});
        this.farm = new web3.eth.Contract(farmABI, '', {from: this.account});
        this.farmShop = new web3.eth.Contract(farmShopABI, '', {from: this.account});
        this.multiBatch = new web3.eth.Contract(multiBatchABI, '', {from: this.account});
        this.account = '';
        this.defaultProxyRegistryAddress = '0x0000000000000000000000000000000000000000'; // opensea
       
        // CELO (testnet: aef3)
    }else if(chain_id === "a4ec") {

        this.nif = new web3.eth.Contract(nifABI, '', {from: this.account});
        this.erc1155 = new web3.eth.Contract(erc1155ABI, '', {from: this.account});
        this.genesis = new web3.eth.Contract(genesisABI, '', {from: this.account});
        this.farm = new web3.eth.Contract(farmABI, '', {from: this.account});
        this.farmShop = new web3.eth.Contract(farmShopABI, '', {from: this.account});
        this.multiBatch = new web3.eth.Contract(multiBatchABI, '', {from: this.account});
        this.account = '';
        this.defaultProxyRegistryAddress = '0x0000000000000000000000000000000000000000'; // opensea

    // xDAI / POA (Sokol) TESTNET
    } else if(chain_id === "4d") {

        this.nif = new web3.eth.Contract(nifABI, '', {from: this.account});
        this.erc1155 = new web3.eth.Contract(erc1155ABI, '', {from: this.account});
        this.genesis = new web3.eth.Contract(genesisABI, '', {from: this.account});
        this.farm = new web3.eth.Contract(farmABI, '', {from: this.account});
        this.farmShop = new web3.eth.Contract(farmShopABI, '', {from: this.account});
        this.multiBatch = new web3.eth.Contract(multiBatchABI, '', {from: this.account});
        this.account = '';
        this.defaultProxyRegistryAddress = '0x0000000000000000000000000000000000000000'; // opensea
        
    // Matic
    } else if(chain_id === "89") {

        min_block = 6000000;

        this.nif = new web3.eth.Contract(nifABI, '', {from: this.account});
        this.erc1155 = new web3.eth.Contract(erc1155ABI, '', {from: this.account});
        this.genesis = new web3.eth.Contract(genesisABI, '', {from: this.account});
        this.farm = new web3.eth.Contract(farmABI, '', {from: this.account});
        this.farmShop = new web3.eth.Contract(farmShopABI, '', {from: this.account});
        this.multiBatch = new web3.eth.Contract(multiBatchABI, '', {from: this.account});
        this.account = '';
        this.defaultProxyRegistryAddress = '0x0000000000000000000000000000000000000000'; // opensea
        
        
        // BINANCE TESTNET
    } else if(chain_id === "61") {

        this.nif = new web3.eth.Contract(nifABI, '', {from: this.account});
        this.erc1155 = new web3.eth.Contract(erc1155ABI, '', {from: this.account});
        this.genesis = new web3.eth.Contract(genesisABI, '', {from: this.account});
        this.farm = new web3.eth.Contract(farmABI, '', {from: this.account});
        this.farmShop = new web3.eth.Contract(farmShopABI, '', {from: this.account});
        this.multiBatch = new web3.eth.Contract(multiBatchABI, '', {from: this.account});
        this.account = '';
        this.defaultProxyRegistryAddress = '0x0000000000000000000000000000000000000000'; // opensea
        
        
    // BINANCE MAINNET
    } else if(chain_id === "38") {

        this.nif = new web3.eth.Contract(nifABI, '', {from: this.account});
        this.erc1155 = new web3.eth.Contract(erc1155ABI, '', {from: this.account});
        this.genesis = new web3.eth.Contract(genesisABI, '', {from: this.account});
        this.farm = new web3.eth.Contract(farmABI, '', {from: this.account});
        this.farmShop = new web3.eth.Contract(farmShopABI, '', {from: this.account});
        this.multiBatch = new web3.eth.Contract(multiBatchABI, '', {from: this.account});
        this.account = '';
        this.defaultProxyRegistryAddress = '0x0000000000000000000000000000000000000000'; // opensea
        // assuming ethereum mainnet if nothing else specified

    // MOONBASE ALPHA
    } else if(chain_id === "507") {

        this.nif = new web3.eth.Contract(nifABI, '', {from: this.account});
        this.erc1155 = new web3.eth.Contract(erc1155ABI, '', {from: this.account});
        this.genesis = new web3.eth.Contract(genesisABI, '', {from: this.account});
        this.farm = new web3.eth.Contract(farmABI, '', {from: this.account});
        this.farmShop = new web3.eth.Contract(farmShopABI, '', {from: this.account});
        this.multiBatch = new web3.eth.Contract(multiBatchABI, '', {from: this.account});
        this.account = '';
        this.defaultProxyRegistryAddress = '0x0000000000000000000000000000000000000000'; // opensea

        // assuming ethereum mainnet if nothing else specified

        // AVALANCHE
    } else if(chain_id === "a86a") {

        this.nif = new web3.eth.Contract(nifABI, '', {from: this.account});
        this.erc1155 = new web3.eth.Contract(erc1155ABI, '', {from: this.account});
        this.genesis = new web3.eth.Contract(genesisABI, '', {from: this.account});
        this.farm = new web3.eth.Contract(farmABI, '', {from: this.account});
        this.farmShop = new web3.eth.Contract(farmShopABI, '', {from: this.account});
        this.multiBatch = new web3.eth.Contract(multiBatchABI, '', {from: this.account});
        this.account = '';
        this.defaultProxyRegistryAddress = '0x0000000000000000000000000000000000000000'; // opensea

        // assuming ethereum mainnet if nothing else specified
        
        // HARMONY 
    } else if(chain_id === "1666600000") {

        this.HRC721 = new web3.eth.Contract(HRC721ABI, '', {from: this.account});
        this.hrc1155 = new web3.eth.Contract(hrc1155ABI, '', {from: this.account});
        this.genesis = new web3.eth.Contract(genesisABI, '', {from: this.account});
        this.farm = new web3.eth.Contract(farmABI, '', {from: this.account});
        this.farmShop = new web3.eth.Contract(farmShopABI, '', {from: this.account});
        this.multiBatch = new web3.eth.Contract(multiBatchABI, '', {from: this.account});
        this.account = '';
        this.defaultProxyRegistryAddress = ''; // DaVinci

        // assuming ethereum mainnet if nothing else specified
        
        // ethereum
    } else{

        this.nif = new web3.eth.Contract( nifABI, 'null', {from:this.account} );
        this.erc1155 = new web3.eth.Contract( erc1155ABI, 'null', {from:this.account} );
        this.hrc1155 = new web3.eth.Contract( hrc1155ABI, 'null', {from:this.account} );
        this.genesis = new web3.eth.Contract( genesisABI, 'null', {from:this.account} );

        this.farm = null;

        // Dixon Fix
        if(this.getUrlParam('address') == 'null'){
            this.farm = new web3.eth.Contract( farmABI, 'null', {from:this.account} );
            console.log("Dixon fix");

            this.farm = new web3.eth.Contract( farmABI, 'null', {from:this.account} );
        }else{
            this.farm = new web3.eth.Contract( farmABI, 'null', {from:this.account} );
        }
        this.farmShop = new web3.eth.Contract(farmShopABI, 'null', {from: this.account});
        this.multiBatch = new web3.eth.Contract(multiBatchABI, 'null', {from: this.account});
        this.account = '';
        this.defaultProxyRegistryAddress = 'null'; // opensea

    }

    this.setAccount = function(address){
        this.account = address;
    };

    /**
     *
     * Farm Creation & Management
     *
     */
    this.farmNftCount = async function (farmAddress){
        await sleep(sleep_time);

        let added = await fetchUrl(api_url + '1.0/'+chain_id+'/farms/events/CardAdded/'+farmAddress, 5000);

        if(added === false || added === 'unsupported-chainid'){

            let farm = new web3.eth.Contract( farmABI, farmAddress, {from:this.account} );
            added = await farm.getPastEvents('CardAdded', {
                fromBlock: min_block,
                toBlock: 'latest'
            });
        }
        else{

            added = JSON.parse(added);
        }

        let check_entries = [];
        for(let i = 0; i < added.length; i++) {

            if (check_entries.includes(added[i].returnValues.erc1155 + added[i].returnValues.card)) {
                continue;
            }

            check_entries.push(added[i].returnValues.erc1155 + added[i].returnValues.card);
        }
        return check_entries.length;
    };

    this.farmIsWhitelistAdmin = async function(address, farmAddress){
        await sleep(sleep_time);
        let farm = new web3.eth.Contract( farmABI, farmAddress, {from:this.account} );
        return await farm.methods.isWhitelistAdmin(address).call({from:this.account});
    };

    this.farmPendingWithdrawals = async function(address, farmAddress){
        await sleep(sleep_time);
        let farm = new web3.eth.Contract( farmABI, farmAddress, {from:this.account} );
        return await farm.methods.pendingWithdrawals(address).call({from:this.account});
    };

    this.farmTotalFeesCollected = async function(farmAddress){
        await sleep(sleep_time);
        let farm = new web3.eth.Contract( farmABI, farmAddress, {from:this.account} );
        return await farm.methods.totalFeesCollected().call({from:this.account});
    };

    this.farmIHaveAnyWildcard = async function(){
        await sleep(sleep_time);
        return await this.farm.methods.iHaveAnyWildcard().call({from:this.account});
    };

    this.farmIsCloned = async function(farmAddress){
        await sleep(sleep_time);
        let farm = new web3.eth.Contract( farmABI, farmAddress, {from:this.account} );
        return await farm.methods.isCloned().call({from:this.account});
    };

    this.farmRewardRate = async function(farmAddress){
        await sleep(sleep_time);
        let farm = new web3.eth.Contract( farmABI, farmAddress, {from:this.account} );
        return await farm.methods.rewardRate().call({from:this.account});
    };

    this.farmController = async function(farmAddress){
        await sleep(sleep_time);
        let farm = new web3.eth.Contract( farmABI, farmAddress, {from:this.account} );
        return await farm.methods.controller().call({from:this.account});
    };

    this.getFarmFee = async function(){
        await sleep(sleep_time);
        return await this.farm.methods.farmFee().call({from:this.account});
    };

    this.getFarmMinimumNif = async function(){
        await sleep(sleep_time);
        return await this.farm.methods.farmFeeMinimumNif().call({from:this.account});
    };

    this.getMyFarmsLength = async function(){
        await sleep(sleep_time);
        return await this.farm.methods.getFarmsLength(this.account).call({from:this.account});
    };

    this.getFarmUri = async function(farmAddress){

        await sleep(sleep_time);

        let uris = await fetchUrl(api_url + '1.0/'+chain_id+'/farms/events/FarmUri/'+farmAddress, 5000);

        if(uris === false || uris === 'unsupported-chainid'){

            let farm = new web3.eth.Contract( farmABI, farmAddress, {from:this.account} );
            uris = await farm.getPastEvents('FarmUri', {
                fromBlock: min_block,
                toBlock: 'latest'
            });
        }
        else{

            uris = JSON.parse(uris);
        }

        uris = uris.reverse();
        let uri = '';
        if(uris.length > 0){
            return uris[0].returnValues.uri;
        }

        return '';
    };

    this.getMyFarm = async function(index){

        await sleep(sleep_time);
        let farmAddress = await this.farm.methods.farms(this.account, index).call({from:this.account});
        await sleep(sleep_time);
        let farm = new web3.eth.Contract( farmABI, farmAddress, {from:this.account} );
        await sleep(sleep_time);
        let periodStart = await farm.methods.periodStart().call({from:this.account});
        await sleep(sleep_time);
        let minStake = await farm.methods.minStake().call({from:this.account});
        await sleep(sleep_time);
        let maxStake = await farm.methods.maxStake().call({from:this.account});
        await sleep(sleep_time);
        let controller = await farm.methods.controller().call({from:this.account});
        await sleep(sleep_time);
        let token = await farm.methods.token().call({from:this.account});
        await sleep(sleep_time);

        let uris = await fetchUrl(api_url + '1.0/'+chain_id+'/farms/events/FarmUri/'+farmAddress, 5000);

        console.log("URIS: ", uris, farmAddress);

        if(uris === false || uris === 'unsupported-chainid'){

            uris = await farm.getPastEvents('FarmUri', {
                filter: {
                    farm: farmAddress
                },
                fromBlock: min_block,
                toBlock: 'latest'
            });
        }
        else{

            uris = JSON.parse(uris);
        }

        uris = uris.reverse();
        let uri = '';
        if(uris.length > 0){
            uri = uris[0].returnValues.uri;
        }

        return {
            farm: farmAddress,
            uri: uri,
            periodStart: periodStart,
            minStake : minStake,
            maxStake : maxStake,
            controller : controller,
            token : token
        };
    };

    this.farmFeeEth = async function(){
        await sleep(sleep_time);
        return await this.farm.methods.farmFee().call({from:this.account});
    };

    this.newFarm = async function(periodStart, minStake, maxStake, controller, token, uri, preCallback, postCallback, errCallback){

        let fee = 0;

        let haveWildcard = await this.farmIHaveAnyWildcard();
        await sleep(sleep_time);
        let nifBalance = web3.utils.toBN(await this.nif.methods.balanceOf(this.account).call({from:this.account}));
        let feeMinNif = web3.utils.toBN(await this.getFarmMinimumNif());

        console.log('Wilcard: ', haveWildcard, ' enough nif: ', nifBalance.lt( feeMinNif ) );

        if(!haveWildcard && nifBalance.lt( feeMinNif )){
            fee = await this.farmFeeEth();
        }

        let gas = 0;

        try {
            await sleep(sleep_time);
            gas = await this.farm.methods.newFarm(periodStart, ""+minStake, ""+maxStake, controller, token, uri).estimateGas({
                from:this.account,
                value: ""+fee
            });
        }catch(e){
            console.log('Error at gas estimation: ', e, 'fee: ', fee, 'minStake: ', minStake, 'maxStake: ', maxStake);
            errCallback("");
            return;
        }

        const price = await web3.eth.getGasPrice();

        this.farm.methods.newFarm(periodStart, ""+minStake, ""+maxStake, controller, token, uri)
            .send({
                from:this.account,
                gas: gas + Math.floor( gas * 0.1 ),
                gasPrice: Number(price) + Math.floor( Number(price) * 0.1 ),
                value: ""+fee
            })
            .on('error', async function(e){
                console.log(e);
                errCallback('');
            })
            .on('transactionHash', async function(transactionHash){
                preCallback();
            })
            .on("receipt", function (receipt) {
                postCallback(receipt);
            });
    };

    this.farmWithdrawFees = async function(farmAddress, preCallback, postCallback, errCallback){

        let farm = new web3.eth.Contract( farmABI, farmAddress, {from:this.account} );

        let gas = 0;

        try {
            await sleep(sleep_time);
            gas = await farm.methods.withdrawFee().estimateGas({
                from:this.account
            });
        }catch(e){
            console.log('Error at gas estimation: ', e, 'fee: ', fee, 'minStake: ', minStake, 'maxStake: ', maxStake);
            errCallback("");
            return;
        }

        const price = await web3.eth.getGasPrice();

        farm.methods.withdrawFee()
            .send({
                from:this.account,
                gas: gas + Math.floor( gas * 0.1 ),
                gasPrice: Number(price) + Math.floor( Number(price) * 0.1 )
            })
            .on('error', async function(e){
                console.log(e);
                errCallback('');
            })
            .on('transactionHash', async function(transactionHash){
                preCallback();
            })
            .on("receipt", function (receipt) {
                postCallback(receipt);
            });
    };

    this.farmSetRewardRate = async function(rate, farmAddress, preCallback, postCallback, errCallback){

        let farm = new web3.eth.Contract( farmABI, farmAddress, {from:this.account} );

        let gas = 0;

        try {
            await sleep(sleep_time);
            gas = await farm.methods.setRewardRate(rate).estimateGas({
                from:this.account
            });
        }catch(e){
            console.log('Error at gas estimation: ', e, 'fee: ', fee, 'minStake: ', minStake, 'maxStake: ', maxStake);
            errCallback("");
            return;
        }

        const price = await web3.eth.getGasPrice();

        farm.methods.setRewardRate(rate)
            .send({
                from:this.account,
                gas: gas + Math.floor( gas * 0.1 ),
                gasPrice: Number(price) + Math.floor( Number(price) * 0.1 )
            })
            .on('error', async function(e){
                console.log(e);
                errCallback('');
            })
            .on('transactionHash', async function(transactionHash){
                preCallback();
            })
            .on("receipt", function (receipt) {
                postCallback(receipt);
            });
    };

    this.farmSetController = async function(controller, farmAddress, preCallback, postCallback, errCallback){

        let farm = new web3.eth.Contract( farmABI, farmAddress, {from:this.account} );

        let gas = 0;

        try {
            await sleep(sleep_time);
            gas = await farm.methods.setController(controller).estimateGas({
                from:this.account
            });
        }catch(e){
            console.log('Error at gas estimation: ', e, 'fee: ', fee, 'minStake: ', minStake, 'maxStake: ', maxStake);
            errCallback("");
            return;
        }

        const price = await web3.eth.getGasPrice();

        farm.methods.setController(controller)
            .send({
                from:this.account,
                gas: gas + Math.floor( gas * 0.1 ),
                gasPrice: Number(price) + Math.floor( Number(price) * 0.1 )
            })
            .on('error', async function(e){
                console.log(e);
                errCallback('');
            })
            .on('transactionHash', async function(transactionHash){
                preCallback();
            })
            .on("receipt", function (receipt) {
                postCallback(receipt);
            });
    };

    this.farmSetMinMaxStake = async function(minStake, maxStake, farmAddress, preCallback, postCallback, errCallback){

        let farm = new web3.eth.Contract( farmABI, farmAddress, {from:this.account} );

        let gas = 0;

        try {
            await sleep(sleep_time);
            gas = await farm.methods.setMinMaxStake(minStake, maxStake).estimateGas({
                from:this.account
            });
        }catch(e){
            console.log('Error at gas estimation: ', e, 'fee: ', fee, 'minStake: ', minStake, 'maxStake: ', maxStake);
            errCallback("");
            return;
        }

        const price = await web3.eth.getGasPrice();

        farm.methods.setMinMaxStake(minStake, maxStake)
            .send({
                from:this.account,
                gas: gas + Math.floor( gas * 0.1 ),
                gasPrice: Number(price) + Math.floor( Number(price) * 0.1 )
            })
            .on('error', async function(e){
                console.log(e);
                errCallback('');
            })
            .on('transactionHash', async function(transactionHash){
                preCallback();
            })
            .on("receipt", function (receipt) {
                postCallback(receipt);
            });
    };

    this.emitFarmUri = async function(farmAddress, uri, preCallback, postCallback, errCallback){

        let farm = new web3.eth.Contract( farmABI, farmAddress, {from:this.account} );

        let gas = 0;

        try {
            await sleep(sleep_time);
            gas = await farm.methods.emitFarmUri(uri).estimateGas({
                from:this.account
            });
        }catch(e){
            console.log('Error at gas estimation: ', e, 'fee: ', fee, 'minStake: ', minStake, 'maxStake: ', maxStake);
            errCallback("");
            return;
        }

        const price = await web3.eth.getGasPrice();

        farm.methods.emitFarmUri(uri)
            .send({
                from:this.account,
                gas: gas + Math.floor( gas * 0.1 ),
                gasPrice: Number(price) + Math.floor( Number(price) * 0.1 )
            })
            .on('error', async function(e){
                console.log(e);
                errCallback('');
            })
            .on('transactionHash', async function(transactionHash){
                preCallback();
            })
            .on("receipt", function (receipt) {
                postCallback(receipt);
            });
    };

    this.farmMaxStake = async function(farmAddress){
        await sleep(sleep_time);
        let farm = new web3.eth.Contract( farmABI, farmAddress, {from:this.account} );
        let max = await farm.methods.maxStake().call({from:this.account});
        let decimals = await this.farmTokenDecimals(farmAddress);
        return max / Math.pow(10, decimals >= 0 ? decimals : 0);
    };

    this.farmMinStake = async function(farmAddress){
        await sleep(sleep_time);
        let farm = new web3.eth.Contract( farmABI, farmAddress, {from:this.account} );
        let max = await farm.methods.minStake().call({from:this.account});
        let decimals = await this.farmTokenDecimals(farmAddress);
        return max / Math.pow(10, decimals >= 0 ? decimals : 0);
    };

    this.farmMaxStakeRaw = async function(farmAddress){
        await sleep(sleep_time);
        let farm = new web3.eth.Contract( farmABI, farmAddress, {from:this.account} );
        let max = await farm.methods.maxStake().call({from:this.account});
        return max;
    };

    this.farmMinStakeRaw = async function(farmAddress){
        await sleep(sleep_time);
        let farm = new web3.eth.Contract( farmABI, farmAddress, {from:this.account} );
        let max = await farm.methods.minStake().call({from:this.account});
        return max;
    };

    this.farmPointsEarned = async function(farmAddress, account){
        await sleep(sleep_time);
        let farm = new web3.eth.Contract( farmABI, farmAddress, {from:this.account} );
        let earned = await farm.methods.earned(account).call({from:this.account});
        let decimals = await this.farmTokenDecimals(farmAddress);
        return earned / Math.pow(10, decimals >= 0 ? decimals : 0);
    };

    this.farmBalanceOf = async function(farmAddress, account){
        await sleep(sleep_time);
        let farm = new web3.eth.Contract( farmABI, farmAddress, {from:this.account} );
        let balance = await farm.methods.balanceOf(account).call({from:this.account});
        let decimals = await this.farmTokenDecimals(farmAddress);
        console.log("Received balance", balance);
        return balance / Math.pow(10, decimals >= 0 ? decimals : 0);
    };

    this.farmBalanceOfRaw = async function(farmAddress, account){
        await sleep(sleep_time);
        let farm = new web3.eth.Contract( farmABI, farmAddress, {from:this.account} );
        let balance = await farm.methods.balanceOf(account).call({from:this.account});
        return balance;
    };

    this.balanceOfErc20 = async function(erc20Address, owner){
        await sleep(sleep_time);
        let erc20 = new web3.eth.Contract( erc20ABI, erc20Address, {from:this.account} );
        let decimals = await erc20.methods.decimals().call({from:this.account});
        let balance = await erc20.methods.balanceOf(owner).call({from:this.account});
        return balance / Math.pow(10, decimals >= 0 ? decimals : 0);
    };

    this.balanceOfErc20Raw = async function(erc20Address, owner){
        await sleep(sleep_time);
        let erc20 = new web3.eth.Contract( erc20ABI, erc20Address, {from:this.account} );
        let balance = await erc20.methods.balanceOf(owner).call({from:this.account});
        return balance;
    };

    this.balanceOfHrc20 = async function(hrc20Address, owner){
        await sleep(sleep_time);
        let hrc20 = new web3.eth.Contract( hrc20ABI, hrc20Address, {from:this.account} );
        let decimals = await hrc20.methods.decimals().call({from:this.account});
        let balance = await hrc20.methods.balanceOf(owner).call({from:this.account});
        return balance / Math.pow(10, decimals >= 0 ? decimals : 0);
    };

    this.balanceOfHrc20Raw = async function(hrc20Address, owner){
        await sleep(sleep_time);
        let hrc20 = new web3.eth.Contract( hrc20ABI, hrc20Address, {from:this.account} );
        let balance = await hrc20.methods.balanceOf(owner).call({from:this.account});
        return balance;
    };

    this.farmHasShop = async function(farmAddress){
        await sleep(sleep_time);
        let ret = await this.farmShop.methods.hasAddon(farmAddress).call({from:this.account});
        return ret;
    };

    this.farmShopGetPrice = async function(shopAddress, erc1155Address, id){
        await sleep(sleep_time);
        let shop = new web3.eth.Contract( farmShopABI, shopAddress, {from:this.account} );
        let ret = await shop.methods.getPrice(erc1155Address, id).call({from:this.account});
        return ret;
    };

    this.farmShopRunMode = async function(shopAddress){
        await sleep(sleep_time);
        let shop = new web3.eth.Contract( farmShopABI, shopAddress, {from:this.account} );
        let ret = await shop.methods.runMode().call({from:this.account});
        return ret;
    };

    this.farmAddonAddress = async function(farmAddress){
        await sleep(sleep_time);
        let ret = await this.farmShop.methods.addon(farmAddress).call({from:this.account});
        return ret;
    };

    this.farmShopAddonPrice = async function(){
        await sleep(sleep_time);
        let ret = await this.farmShop.methods.addonFee().call({from:this.account});
        return ret;
    };

    this.farmIsWhiteListAdmin = async function(farmAddress, adminAddress){
        await sleep(sleep_time);
        let farm = new web3.eth.Contract( farmABI, farmAddress, {from:this.account} );
        let ret = await farm.methods.isWhitelistAdmin(adminAddress).call({from:this.account});
        return ret;
    };

    this.farmIsPauser = async function(farmAddress, adminAddress){
        await sleep(sleep_time);
        let farm = new web3.eth.Contract( farmABI, farmAddress, {from:this.account} );
        let ret = await farm.methods.isPauser(adminAddress).call({from:this.account});
        return ret;
    };

    this.farmBuyShopAddon = async function(farmAddress, preCallback, postCallback, errCallback){

        let gas = 0;

        try {
            await sleep(sleep_time);
            gas = await this.farmShop.methods.newAddon(farmAddress).estimateGas({
                from:this.account,
                value: ""+ ( !await this.farmIHaveAnyWildcard() ? await this.farmShopAddonPrice() : "0" )
            });
        }catch(e){
            console.log(e.message);
            errCallback("");
            return;
        }

        const price = await web3.eth.getGasPrice();

        this.farmShop.methods.newAddon(farmAddress)
            .send({
                from:this.account,
                gas: gas + Math.floor( gas * 0.1 ),
                gasPrice: Number(price) + Math.floor( Number(price) * 0.1 ),
                value: ""+ ( !await this.farmIHaveAnyWildcard() ? await this.farmShopAddonPrice() : "0" )
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
    };

    this.farmStep2ShopAddon = async function(farmAddress, shopAddress, preCallback, postCallback, errCallback){

        let farm = new web3.eth.Contract( farmABI, farmAddress, {from:this.account} );

        let gas = 0;

        try {
            await sleep(sleep_time);
            gas = await farm.methods.addWhitelistAdmin(shopAddress).estimateGas({
                from:this.account
            });
        }catch(e){
            console.log(e.message);
            errCallback("");
            return;
        }

        const price = await web3.eth.getGasPrice();

        farm.methods.addWhitelistAdmin(shopAddress)
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
    };

    this.farmStep3ShopAddon = async function(farmAddress, shopAddress, preCallback, postCallback, errCallback){

        let farm = new web3.eth.Contract( farmABI, farmAddress, {from:this.account} );

        let gas = 0;

        try {
            await sleep(sleep_time);
            gas = await farm.methods.addPauser(shopAddress).estimateGas({
                from:this.account
            });
        }catch(e){
            console.log(e.message);
            errCallback("");
            return;
        }

        const price = await web3.eth.getGasPrice();

        farm.methods.addPauser(shopAddress)
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
    };

    this.shopSetRunMode = async function(shopAddress, runMode, preCallback, postCallback, errCallback){

        let shop = new web3.eth.Contract( farmShopABI, shopAddress, {from:this.account} );

        let gas = 0;

        try {
            await sleep(sleep_time);
            gas = await shop.methods.setRunMode(runMode).estimateGas({
                from:this.account
            });
        }catch(e){
            console.log(e.message);
            errCallback("");
            return;
        }

        const price = await web3.eth.getGasPrice();

        shop.methods.setRunMode(runMode)
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
    };

    this.farmShopUpdatePrice = async function(erc1155Address, id, artistPrice, controllerPrice, shopAddress, preCallback, postCallback, errCallback){

        let shop = new web3.eth.Contract( farmShopABI, shopAddress, {from:this.account} );

        let gas = 0;

        try {
            await sleep(sleep_time);
            gas = await shop.methods.setPrice(erc1155Address, id, controllerPrice, artistPrice).estimateGas({
                from:this.account
            });
        }catch(e){
            console.log(e.message);
            errCallback("");
            return;
        }

        const price = await web3.eth.getGasPrice();

        shop.methods.setPrice(erc1155Address, id, controllerPrice, artistPrice)
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
    };

    this.farmShopUpdatePrice = async function(hrc1155Address, id, artistPrice, controllerPrice, shopAddress, preCallback, postCallback, errCallback){

        let shop = new web3.eth.Contract( farmShopABI, shopAddress, {from:this.account} );

        let gas = 0;

        try {
            await sleep(sleep_time);
            gas = await shop.methods.setPrice(hrc1155Address, id, controllerPrice, artistPrice).estimateGas({
                from:this.account
            });
        }catch(e){
            console.log(e.message);
            errCallback("");
            return;
        }

        const price = await web3.eth.getGasPrice();

        shop.methods.setPrice(hrc1155Address, id, controllerPrice, artistPrice)
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
    };

    this.farmShopBuy = async function(erc1155Address, id, amount, value, shopAddress, preCallback, postCallback, errCallback){

        let shop = new web3.eth.Contract( farmShopABI, shopAddress, {from:this.account} );

        let gas = 0;

        try {
            await sleep(sleep_time);
            gas = await shop.methods.obtain(erc1155Address, id, amount).estimateGas({
                from: this.account,
                value: value
            });
        }catch(e){
            console.log(e.message);
            errCallback("");
            return;
        }

        const price = await web3.eth.getGasPrice();

        shop.methods.obtain(erc1155Address, id, amount)
            .send({
                from:this.account,
                gas: gas + Math.floor( gas * 0.1 ),
                gasPrice: Number(price) + Math.floor( Number(price) * 0.1 ),
                value: value
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
    };

    this.farmShopBuy = async function(hrc1155Address, id, amount, value, shopAddress, preCallback, postCallback, errCallback){

        let shop = new web3.eth.Contract( farmShopABI, shopAddress, {from:this.account} );

        let gas = 0;

        try {
            await sleep(sleep_time);
            gas = await shop.methods.obtain(hrc1155Address, id, amount).estimateGas({
                from: this.account,
                value: value
            });
        }catch(e){
            console.log(e.message);
            errCallback("");
            return;
        }

        const price = await web3.eth.getGasPrice();

        shop.methods.obtain(hrc1155Address, id, amount)
            .send({
                from:this.account,
                gas: gas + Math.floor( gas * 0.1 ),
                gasPrice: Number(price) + Math.floor( Number(price) * 0.1 ),
                value: value
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
    };

    this.allowanceErc20 = async function(erc20Address, owner, spender){
        await sleep(sleep_time);
        let erc20 = new web3.eth.Contract( erc20ABI, erc20Address, {from:this.account} );
        let decimals = await erc20.methods.decimals().call({from:this.account});
        await sleep(sleep_time);
        let allowance = await erc20.methods.allowance(owner, spender).call({from:this.account});
        return allowance / Math.pow(10, decimals >= 0 ? decimals : 0);
    };

    this.allowanceErc20Raw = async function(erc20Address, owner, spender){
        await sleep(sleep_time);
        let erc20 = new web3.eth.Contract( erc20ABI, erc20Address, {from:this.account} );
        let allowance = await erc20.methods.allowance(owner, spender).call({from:this.account});
        return allowance;
    };

    this.allowanceHrc20 = async function(hrc20Address, owner, spender){
        await sleep(sleep_time);
        let hrc20 = new web3.eth.Contract( hrc20ABI, hrc20Address, {from:this.account} );
        let decimals = await hrc20.methods.decimals().call({from:this.account});
        await sleep(sleep_time);
        let allowance = await hrc20.methods.allowance(owner, spender).call({from:this.account});
        return allowance / Math.pow(10, decimals >= 0 ? decimals : 0);
    };

    this.allowanceHrc20Raw = async function(hrc20Address, owner, spender){
        await sleep(sleep_time);
        let hrc20 = new web3.eth.Contract( hrc20ABI, hrc20Address, {from:this.account} );
        let allowance = await hrc20.methods.allowance(owner, spender).call({from:this.account});
        return allowance;
    };

    this.approveErc20 = async function(erc20Address, amount, spender, preCallback, postCallback, errCallback){

        console.log("Approve amount", amount);

        let erc20 = new web3.eth.Contract( erc20ABI, erc20Address, {from:this.account} );

        await sleep(sleep_time);
        const gas = await erc20.methods.approve(spender, ""+amount).estimateGas({
            from:this.account,
        });
        const price = await web3.eth.getGasPrice();

        erc20.methods.approve(spender, ""+amount)
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
    this.approveHrc20 = async function(hrc20Address, amount, spender, preCallback, postCallback, errCallback){

        console.log("Approve amount", amount);

        let hrc20 = new web3.eth.Contract( hrc20ABI, hrc20Address, {from:this.account} );

        await sleep(sleep_time);
        const gas = await hrc20.methods.approve(spender, ""+amount).estimateGas({
            from:this.account,
        });
        const price = await web3.eth.getGasPrice();

        hrc20.methods.approve(spender, ""+amount)
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

    this.tokenDecimalsErc20 = async function(tokenAddress){
        await sleep(sleep_time);
        let erc20 = new web3.eth.Contract( erc20ABI, tokenAddress, {from:this.account} );
        return await erc20.methods.decimals().call({from:this.account});
    };

    this.tokenDecimalsHrc20 = async function(tokenAddress){
        await sleep(sleep_time);
        let hrc20 = new web3.eth.Contract( hrc20ABI, tokenAddress, {from:this.account} );
        return await hrc20.methods.decimals().call({from:this.account});
    };


    this.tokenSymbolErc20 = async function(tokenAddress){
        await sleep(sleep_time);
        let erc20 = new web3.eth.Contract( erc20ABI, tokenAddress, {from:this.account} );
        let symbol = await erc20.methods.symbol().call({from:this.account});
        if(symbol == 'UNI-V2' && (chain_id == '1' || chain_id == '4') ){
            let uniInstance = new web3.eth.Contract( univ2ABI, tokenAddress, {from:this.account} );
            await sleep(sleep_time);
            let token0 = await uniInstance.methods.token0().call({from:this.account});
            let token0Instance = new web3.eth.Contract( erc20ABI, token0, {from:this.account} );
            await sleep(sleep_time);
            symbol = await token0Instance.methods.symbol().call({from:this.account}) + "-LP";
        }
        return symbol;
    };
    this.tokenSymbolHrc20 = async function(tokenAddress){
        await sleep(sleep_time);
        let hrc20 = new web3.eth.Contract( hrc20ABI, tokenAddress, {from:this.account} );
        let symbol = await hrc20.methods.symbol().call({from:this.account});
        if(symbol == 'UNI-V2' && (chain_id == '1' || chain_id == '4') ){
            let uniInstance = new web3.eth.Contract( univ2ABI, tokenAddress, {from:this.account} );
            await sleep(sleep_time);
            let token0 = await uniInstance.methods.token0().call({from:this.account});
            let token0Instance = new web3.eth.Contract( erc20ABI, token0, {from:this.account} );
            await sleep(sleep_time);
            symbol = await token0Instance.methods.symbol().call({from:this.account}) + "-LP";
        }
        return symbol;
    };

    this.farmToken = async function(farmAddress){
        await sleep(sleep_time);
        let farm = new web3.eth.Contract( farmABI, farmAddress, {from:this.account} );
        return await farm.methods.token().call({from:this.account});
    };

    this.farmNftData = async function(farmAddress, erc1155Address, id){
        await sleep(sleep_time);
        let farm = new web3.eth.Contract( farmABI, farmAddress, {from:this.account} );
        return await farm.methods.cards(erc1155Address, id).call({from:this.account});
    };

    this.farmRemoveNfts = async function(erc1155Address, id, amount, recipient, farmAddress, preCallback, postCallback, errCallback){

        let farm = new web3.eth.Contract( farmABI, farmAddress, {from:this.account} );
        let gas = 0;

        try {
            await sleep(sleep_time);
            gas = await farm.methods.removeNfts(erc1155Address, id, amount, recipient).estimateGas({
                from:this.account
            });
        }catch(e){
            console.log(e.message);
            errCallback("");
            return;
        }

        const price = await web3.eth.getGasPrice();

        farm.methods.removeNfts(erc1155Address, id, amount, recipient)
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
    };

    this.farmUpdateNftData = async function(erc1155Address, id, points, mintFee, controllerFee, artist, farmAddress, preCallback, postCallback, errCallback){

        let farm = new web3.eth.Contract( farmABI, farmAddress, {from:this.account} );
        let gas = 0;

        try {
            await sleep(sleep_time);
            gas = await farm.methods.updateNftData(erc1155Address, id, points, mintFee, controllerFee, artist, 1, false, false, "").estimateGas({
                from:this.account
            });
        }catch(e){
            console.log(e.message);
            errCallback("");
            return;
        }

        const price = await web3.eth.getGasPrice();

        farm.methods.updateNftData(erc1155Address, id, points, mintFee, controllerFee, artist, 1, false, false, "")
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
    };

    this.farmTokenSymbol = async function(farmAddress){
        await sleep(sleep_time);
        let farm_token = await this.farmToken(farmAddress);
        let erc20 = new web3.eth.Contract( erc20ABI, farm_token, {from:this.account} );
        let symbol = await erc20.methods.symbol().call({from:this.account});
        if(symbol == 'UNI-V2' && (chain_id == '1' || chain_id == '4') ){
            let uniInstance = new web3.eth.Contract( univ2ABI, farm_token, {from:this.account} );
            await sleep(sleep_time);
            let token0 = await uniInstance.methods.token0().call({from:this.account});
            let token0Instance = new web3.eth.Contract( erc20ABI, token0, {from:this.account} );
            await sleep(sleep_time);
            symbol = await token0Instance.methods.symbol().call({from:this.account}) + "-LP";
        }
        return symbol;
    };

    this.farmTokenDecimals = async function(farmAddress){
        let farm_token = await this.farmToken(farmAddress);
        let erc20 = new web3.eth.Contract( erc20ABI, farm_token, {from:this.account} );
        await sleep(sleep_time);
        return await erc20.methods.decimals().call({from:this.account});
    };

    this.farmJsonUrl = async function(farmAddress){

        await sleep(sleep_time);

        let events = await fetchUrl(api_url + '1.0/'+chain_id+'/farms/events/FarmUri/'+farmAddress, 5000);

        if(events === false || events === 'unsupported-chainid'){

            let farm = new web3.eth.Contract( farmABI, farmAddress, {from:this.account} );
            events = await farm.getPastEvents('FarmUri', {
                filter: {
                    farm: farmAddress
                },
                fromBlock: min_block,
                toBlock: 'latest'
            });
        }
        else{

            events = JSON.parse(events);
        }

        console.log(events);

        return events.length > 0 ? events[ events.length - 1 ].returnValues.uri : '';
    };

    this.farmRedeem = async function(farmAddress, erc1155Address, id, fee, preCallback, postCallback, errCallback){

        let farm = new web3.eth.Contract( farmABI, farmAddress, {from:this.account} );
        let gas = 0;

        try {
            await sleep(sleep_time);
            gas = await farm.methods.redeem(erc1155Address, id).estimateGas({
                from:this.account,
                value: ""+fee
            });
        }catch(e){
            errCallback("");
            return;
        }

        const price = await web3.eth.getGasPrice();

        farm.methods.redeem(erc1155Address, id)
            .send({
                from:this.account,
                gas: gas + Math.floor( gas * 0.1 ),
                gasPrice: Number(price) + Math.floor( Number(price) * 0.1 ),
                value: ""+fee
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
    };

    this.farmStake = async function(farmAddress, amount, preCallback, postCallback, errCallback){

        let farm = new web3.eth.Contract( farmABI, farmAddress, {from:this.account} );

        console.log("stake amount", amount);

        let gas = 0;
        try {
            await sleep(sleep_time);
            gas = await farm.methods.stake(""+amount).estimateGas({
                from: this.account,
            });
        }catch(e){
            errCallback("gas");
            return;
        }

        const price = await web3.eth.getGasPrice();

        farm.methods.stake(""+amount)
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
    };

    this.farmUnstake = async function(farmAddress, amount, preCallback, postCallback, errCallback){

        let farm = new web3.eth.Contract( farmABI, farmAddress, {from:this.account} );

        let gas = 0;

        try {
            await sleep(sleep_time);
            gas = await farm.methods.withdraw(""+amount).estimateGas({
                from: this.account,
            });
        }catch(e){
            errCallback("gas");
            return;
        }

        const price = await web3.eth.getGasPrice();

        farm.methods.withdraw(""+amount)
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
    };

    this.getFarmNfts = async function(farmAddress){

        await sleep(sleep_time);

        let cards = await fetchUrl(api_url + '1.0/'+chain_id+'/farms/events/CardAdded/'+farmAddress, 5000);

        if(cards === false || cards === 'unsupported-chainid'){

            let farm = new web3.eth.Contract( farmABI, farmAddress, {from:this.account} );
            cards = await farm.getPastEvents('CardAdded', {
                fromBlock: min_block,
                toBlock: 'latest'
            });
        }
        else{

            cards = JSON.parse(cards);
        }

        console.log("Amount cards: ", cards.length);

        let check_entries = [];
        cards = cards.reverse();
        let card_data = [];

        let decimals = await this.farmTokenDecimals(farmAddress);

        for(let i = 0; i < cards.length; i++){

            if(check_entries.includes(cards[i].returnValues.erc1155+cards[i].returnValues.card)){
               continue;
            }

            let data = await this.farmNftData(farmAddress, cards[i].returnValues.erc1155, cards[i].returnValues.card);

            card_data.push(
                {
                    erc1155: cards[i].returnValues.erc1155,
                    id: cards[i].returnValues.card,
                    points: Number(data.points / Math.pow(10, decimals >= 0 ? decimals : 0)).toFixed(8),
                    pointsRaw : data.points / Math.pow(10, decimals >= 0 ? decimals : 0),
                    mintFee: web3.utils.toBN(data.controllerFee).add( web3.utils.toBN( data.mintFee ) ),
                    artist: data.artist,
                    releaseTime: data.releaseTime,
                    nsfw: data.nsfw,
                    shadowed: data.shadowed
                }
            );

            check_entries.push(cards[i].returnValues.erc1155+cards[i].returnValues.card);
        }

        return card_data;
    };

    this.getFarmCreatedEventsByUser = async function(userAddress){

        await sleep(sleep_time);

        let events = await fetchUrl(api_url + '1.0/'+chain_id+'/farms/events/FarmCreated/user/'+userAddress, 5000);

        if(events === false || events === 'unsupported-chainid'){

            events = await this.farm.getPastEvents('FarmCreated', {
                filter: {
                    user: userAddress
                },
                fromBlock: min_block,
                toBlock: 'latest'
            });
        }
        else{

            events = JSON.parse(events);
        }

        return events;
    };

    this.isFarm = async function(farmAddress){

        await sleep(sleep_time);

        let events = await fetchUrl(api_url + '1.0/'+chain_id+'/farms/events/FarmCreated/farm/'+farmAddress, 5000);

        if(events === false || events === 'unsupported-chainid'){

            events = await this.farm.getPastEvents('FarmCreated', {
                filter: {
                    farm: farmAddress
                },
                fromBlock: min_block,
                toBlock: 'latest'
            });
        }
        else{

            events = JSON.parse(events);
        }

        return events.length > 0;
    };


    /**
     *
     * ERC1155 && HRC1155 Contract Creation & Management
     *
     */

    this.burn = async function(erc1155Address, nftId, amount, preCallback, postCallback, errCallback){

        let erc1155 = new web3.eth.Contract( erc1155ABI, erc1155Address, {from:this.account} );

        await sleep(sleep_time);
        const gas = await erc1155.methods.burn(this.account, nftId, amount).estimateGas({
            from:this.account,
        });
        const price = await web3.eth.getGasPrice();

        erc1155.methods.burn(this.account, nftId, amount)
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
    this.burn = async function(hrc1155Address, nftId, amount, preCallback, postCallback, errCallback){

        let hrc1155 = new web3.eth.Contract( hrc1155ABI, hrc1155Address, {from:this.account} );

        await sleep(sleep_time);
        const gas = await hrc1155.methods.burn(this.account, nftId, amount).estimateGas({
            from:this.account,
        });
        const price = await web3.eth.getGasPrice();

        hrc1155.methods.burn(this.account, nftId, amount)
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

    this.mint = async function(erc1155Address, nftId, amount, preCallback, postCallback, errCallback){

        let erc1155 = new web3.eth.Contract( erc1155ABI, erc1155Address, {from:this.account} );

        await sleep(sleep_time);
        const gas = await erc1155.methods.mint(nftId, amount, web3.utils.fromAscii('')).estimateGas({
            from:this.account,
        });
        const price = await web3.eth.getGasPrice();

        erc1155.methods.mint(nftId, amount, web3.utils.fromAscii(''))
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

    this.transfer = async function(erc1155Address, nftId, amount, to, preCallback, postCallback, errCallback){

        let erc1155 = new web3.eth.Contract( erc1155ABI, erc1155Address, {from:this.account} );

        await sleep(sleep_time);
        const gas = await erc1155.methods.safeTransferFrom(this.account, to, nftId, amount, web3.utils.fromAscii('')).estimateGas({
            from:this.account,
        });
        const price = await web3.eth.getGasPrice();

        erc1155.methods.safeTransferFrom(this.account, to, nftId, amount, web3.utils.fromAscii(''))
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
    this.mint = async function(erc1155Address, nftId, amount, preCallback, postCallback, errCallback){

        let erc1155 = new web3.eth.Contract( erc1155ABI, erc1155Address, {from:this.account} );

        await sleep(sleep_time);
        const gas = await erc1155.methods.mint(nftId, amount, web3.utils.fromAscii('')).estimateGas({
            from:this.account,
        });
        const price = await web3.eth.getGasPrice();

        erc1155.methods.mint(nftId, amount, web3.utils.fromAscii(''))
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

    this.transfer = async function(hrc1155Address, nftId, amount, to, preCallback, postCallback, errCallback){

        let hrc1155 = new web3.eth.Contract( hrc1155ABI, hrc1155Address, {from:this.account} );

        await sleep(sleep_time);
        const gas = await hrc1155.methods.safeTransferFrom(this.account, to, nftId, amount, web3.utils.fromAscii('')).estimateGas({
            from:this.account,
        });
        const price = await web3.eth.getGasPrice();

        erc1155.methods.safeTransferFrom(this.account, to, nftId, amount, web3.utils.fromAscii(''))
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

    this.transferMultiBatch = async function(hrc1155Address, recipients, ids, amounts, preCallback, postCallback, errCallback){

        console.log(recipients);

        await sleep(sleep_time);

        const gas = await this.multiBatch.methods.transferMultiBatch(hrc1155Address, recipients, ids, amounts).estimateGas({
            from: this.account,
        });

        const price = await web3.eth.getGasPrice();

        this.multiBatch.methods.transferMultiBatch(hrc1155Address, recipients, ids, amounts)
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
            postCallback(receipt);
        });
    };

    this.getNft = async function(erc1155Address, nftId){

        let supply = 0;
        let maxSupply = 0;

        let erc1155 = new web3.eth.Contract( erc1155ABI, erc1155Address, {from:this.account} );
        try {
            await sleep(sleep_time);
            supply = await erc1155.methods.totalSupply(nftId).call({from: this.account});
            await sleep(sleep_time);
            maxSupply = await erc1155.methods.maxSupply(nftId).call({from: this.account});
        }catch(e){}
        await sleep(sleep_time);
        let balance = await erc1155.methods.balanceOf(this.account, nftId).call({from:this.account});
        let uri = await this.getNftMeta(erc1155Address, nftId);

        return {uri: uri, supply: supply, maxSupply: maxSupply, balance: balance};
    };
    this.getNft = async function(hrc1155Address, nftId){

        let supply = 0;
        let maxSupply = 0;

        let erc1155 = new web3.eth.Contract( hrc1155ABI, hrc1155Address, {from:this.account} );
        try {
            await sleep(sleep_time);
            supply = await hrc1155.methods.totalSupply(nftId).call({from: this.account});
            await sleep(sleep_time);
            maxSupply = await hrc1155.methods.maxSupply(nftId).call({from: this.account});
        }catch(e){}
        await sleep(sleep_time);
        let balance = await hrc1155.methods.balanceOf(this.account, nftId).call({from:this.account});
        let uri = await this.getNftMeta(hrc1155Address, nftId);

        return {uri: uri, supply: supply, maxSupply: maxSupply, balance: balance};
    };
    this.getForeignNft = async function(erc1155Address, address, nftId){

        let supply = 0;
        let maxSupply = 0;

        let erc1155 = new web3.eth.Contract( erc1155ABI, erc1155Address, {from:this.account} );
        try {
            await sleep(sleep_time);
            supply = await erc1155.methods.totalSupply(nftId).call({from: this.account});
            await sleep(sleep_time);
            maxSupply = await erc1155.methods.maxSupply(nftId).call({from: this.account});
        }catch(e){}
        await sleep(sleep_time);
        let balance = await erc1155.methods.balanceOf(address, nftId).call({from:this.account});
        let uri = await this.getNftMeta(erc1155Address, nftId);

        return {uri: uri, supply: supply, maxSupply: maxSupply, balance: balance};
    };
    this.getForeignNft = async function(hrc1155Address, address, nftId){

        let supply = 0;
        let maxSupply = 0;

        let hrc1155 = new web3.eth.Contract( hrc1155ABI, hrc1155Address, {from:this.account} );
        try {
            await sleep(sleep_time);
            supply = await hrc1155.methods.totalSupply(nftId).call({from: this.account});
            await sleep(sleep_time);
            maxSupply = await hrc1155.methods.maxSupply(nftId).call({from: this.account});
        }catch(e){}
        await sleep(sleep_time);
        let balance = await hrc1155.methods.balanceOf(address, nftId).call({from:this.account});
        let uri = await this.getNftMeta(hrc1155Address, nftId);

        return {uri: uri, supply: supply, maxSupply: maxSupply, balance: balance};
    };
    this.balanceof = async function(erc1155Address, account, nftId){

        await sleep(sleep_time);
        let erc1155 = new web3.eth.Contract( erc1155ABI, erc1155Address, {from:this.account} );
        return await erc1155.methods.balanceOf(account, nftId).call({from:this.account});
    };
    this.balanceof = async function(hrc1155Address, account, nftId){

        await sleep(sleep_time);
        let hrc1155 = new web3.eth.Contract( hrc1155ABI, hrc1155Address, {from:this.account} );
        return await hrc1155.methods.balanceOf(account, nftId).call({from:this.account});
    };
    this.getPoolCreatedEvents = async function(){

        await sleep(sleep_time);

        return await this.genesis.getPastEvents('PoolCreated', {
            fromBlock: min_block,
            toBlock: 'latest'
        });
    };

    this.getMyNfts = async function(erc1155Address){

        await sleep(sleep_time);

        let erc1155 = new web3.eth.Contract( erc1155ABI, erc1155Address, {from:this.account} );

        let events = await fetchUrl(api_url + '1.0/'+chain_id+'/collections/events/TransferSingle/erc1155Address/'+erc1155Address+'/to/'+this.account, 5000);

        if(events === 'not-indexed'){
            events = '[]';
        }

        if(events === false || events === 'unsupported-chainid'){

             events = await erc1155.getPastEvents('TransferSingle', {
                filter: {
                    _to: this.account
                },
                fromBlock: 0,
                toBlock: 'latest'
            });
        }
        else
        {

            events = JSON.parse(events);
        }

        let nfts = [];

        if(Array.isArray(events)){

            events = events.reverse();

            for(let i = 0; i < events.length; i++){

                if(typeof events[i] == 'object') {
                    if(!nfts.includes(events[i].returnValues._id)) {
                        nfts.push(events[i].returnValues._id);
                    }
                }
            }
        }

        events = await fetchUrl(api_url + '1.0/'+chain_id+'/collections/events/TransferBatch/erc1155Address/'+erc1155Address+'/to/'+this.account, 5000);

        if(events === 'not-indexed'){
            events = '[]';
        }

        if(events === false || events === 'unsupported-chainid'){

            events = await erc1155.getPastEvents('TransferBatch', {
                filter: {
                    _to: this.account
                },
                fromBlock: min_block,
                toBlock: 'latest'
            });
        }
        else
        {

            events = JSON.parse(events);
        }

        if(Array.isArray(events)){

            events = events.reverse();

            for(let i = 0; i < events.length; i++){

                if(typeof events[i] == 'object') {

                    for(let j = 0; j < events[i].returnValues[3].length; j++){

                        if(!nfts.includes(events[i].returnValues[3][j])) {
                            nfts.push(events[i].returnValues[3][j]);
                        }
                    }
                }
            }
        }

        return nfts;
    };

    this.getMyNfts = async function(hrc1155Address){

        await sleep(sleep_time);

        let hrc1155 = new web3.eth.Contract( hrc1155ABI, hrc1155Address, {from:this.account} );

        let events = await fetchUrl(api_url + '1.0/'+chain_id+'/collections/events/TransferSingle/hrc1155Address/'+hrc1155Address+'/to/'+this.account, 5000);

        if(events === 'not-indexed'){
            events = '[]';
        }

        if(events === false || events === 'unsupported-chainid'){

             events = await hrc1155.getPastEvents('TransferSingle', {
                filter: {
                    _to: this.account
                },
                fromBlock: 0,
                toBlock: 'latest'
            });
        }
        else
        {

            events = JSON.parse(events);
        }

        let nfts = [];

        if(Array.isArray(events)){

            events = events.reverse();

            for(let i = 0; i < events.length; i++){

                if(typeof events[i] == 'object') {
                    if(!nfts.includes(events[i].returnValues._id)) {
                        nfts.push(events[i].returnValues._id);
                    }
                }
            }
        }

        events = await fetchUrl(api_url + '1.0/'+chain_id+'/collections/events/TransferBatch/hrc1155Address/'+hrc1155Address+'/to/'+this.account, 5000);

        if(events === 'not-indexed'){
            events = '[]';
        }

        if(events === false || events === 'unsupported-chainid'){

            events = await hrc1155.getPastEvents('TransferBatch', {
                filter: {
                    _to: this.account
                },
                fromBlock: min_block,
                toBlock: 'latest'
            });
        }
        else
        {

            events = JSON.parse(events);
        }

        if(Array.isArray(events)){

            events = events.reverse();

            for(let i = 0; i < events.length; i++){

                if(typeof events[i] == 'object') {

                    for(let j = 0; j < events[i].returnValues[3].length; j++){

                        if(!nfts.includes(events[i].returnValues[3][j])) {
                            nfts.push(events[i].returnValues[3][j]);
                        }
                    }
                }
            }
        }

        return nfts;
    };

    this.getMyNftsByUri = async function(erc1155Address){

        await sleep(sleep_time);

        let erc1155 = new web3.eth.Contract( erc1155ABI, erc1155Address, {from:this.account} );

        let events = await fetchUrl(api_url + '1.0/'+chain_id+'/collections/events/URI/erc1155Address/'+erc1155Address+'/id/0', 5000);

        if(events === 'not-indexed'){
            events = '[]';
        }

        if(events === false || events === 'unsupported-chainid'){

            events = await erc1155.getPastEvents('URI', {
                filter: {
                },
                fromBlock: 0,
                toBlock: 'latest'
            });
        }
        else
        {

            events = JSON.parse(events);
        }

        let nfts = [];

        if(Array.isArray(events)){

            events = events.reverse();

            for(let i = 0; i < events.length; i++){

                if(typeof events[i] == 'object') {
                    if(!nfts.includes(events[i].returnValues._id)) {
                        nfts.push(events[i].returnValues._id);
                    }
                }
            }
        }

        return nfts;
    };

    this.getMyNftsByUri = async function(hrc1155Address){

        await sleep(sleep_time);

        let hrc1155 = new web3.eth.Contract( hrc1155ABI, hrc1155Address, {from:this.account} );

        let events = await fetchUrl(api_url + '1.0/'+chain_id+'/collections/events/URI/hrc1155Address/'+hrc1155Address+'/id/0', 5000);

        if(events === 'not-indexed'){
            events = '[]';
        }

        if(events === false || events === 'unsupported-chainid'){

            events = await hrc1155.getPastEvents('URI', {
                filter: {
                },
                fromBlock: 0,
                toBlock: 'latest'
            });
        }
        else
        {

            events = JSON.parse(events);
        }

        let nfts = [];

        if(Array.isArray(events)){

            events = events.reverse();

            for(let i = 0; i < events.length; i++){

                if(typeof events[i] == 'object') {
                    if(!nfts.includes(events[i].returnValues._id)) {
                        nfts.push(events[i].returnValues._id);
                    }
                }
            }
        }

        return nfts;
    };

    this.getNftsByAddress = async function(address, erc1155Address){

        await sleep(sleep_time);

        let erc1155 = new web3.eth.Contract( erc1155ABI, erc1155Address, {from:this.account} );
        let events = await fetchUrl(api_url + '1.0/'+chain_id+'/collections/events/TransferSingle/erc1155Address/'+erc1155Address+'/to/'+this.account, 5000);

        if(events == 'not-indexed'){
            events = '[]';
        }

        if(events === false || events === 'unsupported-chainid'){

            events = await erc1155.getPastEvents('TransferSingle', {
                filter: {
                    _to: address
                },
                fromBlock: 0,
                toBlock: 'latest'
            });
        }
        else
        {

            events = JSON.parse(events);
        }

        let nfts = [];

        if(Array.isArray(events)){

            events = events.reverse();

            for(let i = 0; i < events.length; i++){

                if(typeof events[i] == 'object') {
                    if(!nfts.includes(events[i].returnValues._id)) {
                        nfts.push(events[i].returnValues._id);
                    }
                }
            }
        }

        events = await fetchUrl(api_url + '1.0/'+chain_id+'/collections/events/TransferBatch/erc1155Address/'+erc1155Address+'/to/'+this.account, 5000);

        if(events === 'not-indexed'){
            events = '[]';
        }

        if(events === false || events === 'unsupported-chainid'){

            events = await erc1155.getPastEvents('TransferBatch', {
                filter: {
                    _to: address
                },
                fromBlock: min_block,
                toBlock: 'latest'
            });
        }
        else
        {

            events = JSON.parse(events);
        }

        if(Array.isArray(events)){

            events = events.reverse();

            for(let i = 0; i < events.length; i++){

                if(typeof events[i] == 'object') {

                    for(let j = 0; j < events[i].returnValues[3].length; j++){

                        if(!nfts.includes(events[i].returnValues[3][j])) {
                            nfts.push(events[i].returnValues[3][j]);
                        }
                    }
                }
            }
        }

        return nfts;
    };

    this.getNftsByAddress = async function(address, hrc1155Address){

        await sleep(sleep_time);

        let hrc1155 = new web3.eth.Contract( hrc1155ABI, hrc1155Address, {from:this.account} );
        let events = await fetchUrl(api_url + '1.0/'+chain_id+'/collections/events/TransferSingle/hrc1155Address/'+hrc1155Address+'/to/'+this.account, 5000);

        if(events == 'not-indexed'){
            events = '[]';
        }

        if(events === false || events === 'unsupported-chainid'){

            events = await hrc1155.getPastEvents('TransferSingle', {
                filter: {
                    _to: address
                },
                fromBlock: 0,
                toBlock: 'latest'
            });
        }
        else
        {

            events = JSON.parse(events);
        }

        let nfts = [];

        if(Array.isArray(events)){

            events = events.reverse();

            for(let i = 0; i < events.length; i++){

                if(typeof events[i] == 'object') {
                    if(!nfts.includes(events[i].returnValues._id)) {
                        nfts.push(events[i].returnValues._id);
                    }
                }
            }
        }

        events = await fetchUrl(api_url + '1.0/'+chain_id+'/collections/events/TransferBatch/erc1155Address/'+erc1155Address+'/to/'+this.account, 5000);

        if(events === 'not-indexed'){
            events = '[]';
        }

        if(events === false || events === 'unsupported-chainid'){

            events = await erc1155.getPastEvents('TransferBatch', {
                filter: {
                    _to: address
                },
                fromBlock: min_block,
                toBlock: 'latest'
            });
        }
        else
        {

            events = JSON.parse(events);
        }

        if(Array.isArray(events)){

            events = events.reverse();

            for(let i = 0; i < events.length; i++){

                if(typeof events[i] == 'object') {

                    for(let j = 0; j < events[i].returnValues[3].length; j++){

                        if(!nfts.includes(events[i].returnValues[3][j])) {
                            nfts.push(events[i].returnValues[3][j]);
                        }
                    }
                }
            }
        }

        return nfts;
    };

    this.getNfts = async function(erc1155Address){

        await sleep(sleep_time);

        let erc1155 = new web3.eth.Contract( erc1155ABI, erc1155Address, {from:this.account} );
        let events = await fetchUrl(api_url + '1.0/'+chain_id+'/collections/events/TransferSingle/erc1155Address/'+erc1155Address+'/from/'+this.account, 5000);

        if(events === 'not-indexed'){
            events = '[]';
        }

        if(events === false || events === 'unsupported-chainid'){

            events = await erc1155.getPastEvents('TransferSingle', {
                filter: {
                    _from: '0x0000000000000000000000000000000000000000'
                },
                fromBlock: min_block,
                toBlock: 'latest'
            });
        }
        else
        {

            events = JSON.parse(events);
        }

        let nfts = [];

        if(Array.isArray(events)){

            events = events.reverse();

            for(let i = 0; i < events.length; i++){

                if(typeof events[i] == 'object') {
                    if(!nfts.includes(events[i].returnValues._id)) {
                        nfts.push(events[i].returnValues._id);
                    }
                }
            }
        }

        events = await fetchUrl(api_url + '1.0/'+chain_id+'/collections/events/TransferBatch/erc1155Address/'+erc1155Address+'/from/'+this.account, 5000);

        if(events === 'not-indexed'){
            events = '[]';
        }

        if(events === false || events === 'unsupported-chainid'){

            events = await erc1155.getPastEvents('TransferBatch', {
                filter: {
                    _from: '0x0000000000000000000000000000000000000000'
                },
                fromBlock: min_block,
                toBlock: 'latest'
            });
        }
        else
        {

            events = JSON.parse(events);
        }

        if(Array.isArray(events)){

            events = events.reverse();

            for(let i = 0; i < events.length; i++){

                if(typeof events[i] == 'object') {

                    for(let j = 0; j < events[i].returnValues[3].length; j++){

                        if(!nfts.includes(events[i].returnValues[3][j])) {
                            nfts.push(events[i].returnValues[3][j]);
                        }
                    }
                }
            }
        }

        return nfts;
    };

    this.getNfts = async function(hrc1155Address){

        await sleep(sleep_time);

        let hrc1155 = new web3.eth.Contract( hrc1155ABI, hrc1155Address, {from:this.account} );
        let events = await fetchUrl(api_url + '1.0/'+chain_id+'/collections/events/TransferSingle/hrc1155Address/'+hrc1155Address+'/from/'+this.account, 5000);

        if(events === 'not-indexed'){
            events = '[]';
        }

        if(events === false || events === 'unsupported-chainid'){

            events = await hrc1155.getPastEvents('TransferSingle', {
                filter: {
                    _from: ''
                },
                fromBlock: min_block,
                toBlock: 'latest'
            });
        }
        else
        {

            events = JSON.parse(events);
        }

        let nfts = [];

        if(Array.isArray(events)){

            events = events.reverse();

            for(let i = 0; i < events.length; i++){

                if(typeof events[i] == 'object') {
                    if(!nfts.includes(events[i].returnValues._id)) {
                        nfts.push(events[i].returnValues._id);
                    }
                }
            }
        }

        events = await fetchUrl(api_url + '1.0/'+chain_id+'/collections/events/TransferBatch/hrc1155Address/'+hrc1155Address+'/from/'+this.account, 5000);

        if(events === 'not-indexed'){
            events = '[]';
        }

        if(events === false || events === 'unsupported-chainid'){

            events = await hrc1155.getPastEvents('TransferBatch', {
                filter: {
                    _from: ''
                },
                fromBlock: min_block,
                toBlock: 'latest'
            });
        }
        else
        {

            events = JSON.parse(events);
        }

        if(Array.isArray(events)){

            events = events.reverse();

            for(let i = 0; i < events.length; i++){

                if(typeof events[i] == 'object') {

                    for(let j = 0; j < events[i].returnValues[3].length; j++){

                        if(!nfts.includes(events[i].returnValues[3][j])) {
                            nfts.push(events[i].returnValues[3][j]);
                        }
                    }
                }
            }
        }

        return nfts;
    };

    this.getNftsByUri = async function(erc1155Address){

        await sleep(sleep_time);

        let erc1155 = new web3.eth.Contract( erc1155ABI, erc1155Address, {from:this.account} );

        let events = await fetchUrl(api_url + '1.0/'+chain_id+'/collections/events/URI/erc1155Address/'+erc1155Address+'/id/0', 5000);

        if(events === 'not-indexed'){
            events = '[]';
        }

        if(events === false || events === 'unsupported-chainid'){

            events = await erc1155.getPastEvents('URI', {
                filter: {
                },
                fromBlock: min_block,
                toBlock: 'latest'
            });
        }
        else
        {

            events = JSON.parse(events);
        }

        let nfts = [];

        if(Array.isArray(events)){

            events = events.reverse();

            for(let i = 0; i < events.length; i++){

                if(typeof events[i] == 'object') {
                    if(!nfts.includes(events[i].returnValues._id)) {
                        nfts.push(events[i].returnValues._id);
                    }
                }
            }
        }

        return nfts;
    };

    this.getNftsByUri = async function(hrc1155Address){

        await sleep(sleep_time);

        let hrc1155 = new web3.eth.Contract( hrc1155ABI, hrc1155Address, {from:this.account} );

        let events = await fetchUrl(api_url + '1.0/'+chain_id+'/collections/events/URI/hrc1155Address/'+hrc1155Address+'/id/0', 5000);

        if(events === 'not-indexed'){
            events = '[]';
        }

        if(events === false || events === 'unsupported-chainid'){

            events = await hrc1155.getPastEvents('URI', {
                filter: {
                },
                fromBlock: min_block,
                toBlock: 'latest'
            });
        }
        else
        {

            events = JSON.parse(events);
        }

        let nfts = [];

        if(Array.isArray(events)){

            events = events.reverse();

            for(let i = 0; i < events.length; i++){

                if(typeof events[i] == 'object') {
                    if(!nfts.includes(events[i].returnValues._id)) {
                        nfts.push(events[i].returnValues._id);
                    }
                }
            }
        }

        return nfts;
    };

    this.farmAddNfts = async function(points, mintFee, controllerFee, artist, releaseTime, erc1155, hrc1155, id, cardType, amount, farmAddress, preCallback, postCallback, errCallback){

        let farm = new web3.eth.Contract( farmABI, farmAddress, {from:this.account} );
        let gas = 0;

        try {
            await sleep(sleep_time);
            gas = await farm.methods.addNfts(points, mintFee, controllerFee, artist, releaseTime, erc1155, hrc1155, id, cardType, amount).estimateGas({
                from:this.account
            });
        }catch(e){
            console.log(e);
            errCallback("");
            return;
        }

        const price = await web3.eth.getGasPrice();

        farm.methods.addNfts(points, mintFee, controllerFee, artist, releaseTime, erc1155, hrc1155, id, cardType, amount)
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
    };

    this.erc1155SetApprovalForAll = async function(operator, approved, erc1155Address, preCallback, postCallback, errCallback){

        let erc1155 = new web3.eth.Contract( erc1155ABI, erc1155Address, {from:this.account} );
        let gas = 0;

        try {
            await sleep(sleep_time);
            gas = await erc1155.methods.setApprovalForAll(operator, approved).estimateGas({
                from:this.account
            });
        }catch(e){
            console.log(e);
            errCallback("");
            return;
        }

        const price = await web3.eth.getGasPrice();

        erc1155.methods.setApprovalForAll(operator, approved)
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
    };
    
    this.hrc1155SetApprovalForAll = async function(operator, approved, hrc1155Address, preCallback, postCallback, errCallback){

        let hrc1155 = new web3.eth.Contract( hrc1155ABI, hrc1155Address, {from:this.account} );
        let gas = 0;

        try {
            await sleep(sleep_time);
            gas = await hrc1155.methods.setApprovalForAll(operator, approved).estimateGas({
                from:this.account
            });
        }catch(e){
            console.log(e);
            errCallback("");
            return;
        }

        const price = await web3.eth.getGasPrice();

        hrc1155.methods.setApprovalForAll(operator, approved)
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
    };

    this.erc1155IsApprovedForAll = async function(owner, operator, erc1155Address){

        let erc1155 = new web3.eth.Contract( erc1155ABI, erc1155Address, {from:this.account} );
        let approved = await erc1155.methods.isApprovedForAll(owner, operator).call({from:this.account});

        return approved;
    };

    this.hrc1155IsApprovedForAll = async function(owner, operator, erc1155Address){

        let erc1155 = new web3.eth.Contract( hrc1155ABI, hrc1155Address, {from:this.account} );
        let approved = await hrc1155.methods.isApprovedForAll(owner, operator).call({from:this.account});

        return approved;
    };

    this.erc1155Owner = async function(erc1155Address){

        let erc1155 = new web3.eth.Contract( erc1155ABI, erc1155Address, {from:this.account} );
        let owner = false;
        try{
            owner = await erc1155.methods.owner().call({from:this.account});
            owner = owner.toLowerCase() == this.account.toLowerCase();
        }catch(e){
            owner = false;
        }
        return owner;
    };

    this.hrc1155Owner = async function(hrc1155Address){

        let hrc1155 = new web3.eth.Contract( hrc1155ABI, hrc1155Address, {from:this.account} );
        let owner = false;
        try{
            owner = await hrc1155.methods.owner().call({from:this.account});
            owner = owner.toLowerCase() == this.account.toLowerCase();
        }catch(e){
            owner = false;
        }
        return owner;
    };

    this.getNftMeta = async function(erc1155ContractAddress, nftId){

        let erc1155 = new web3.eth.Contract( erc1155ABI, erc1155ContractAddress, {from:this.account} );

        let nftUri = '';
        try {
            await sleep(sleep_time);
            nftUri = await erc1155.methods.uri(nftId).call({from: this.account});
        }catch(e){
            try {
                nftUri = await this.getNftMetaByEvent(erc1155ContractAddress, nftId);
            }catch(e){}
        }

        // new opensea json uri pattern
        if(nftUri.includes("api.opensea.io")){

            nftUri = decodeURI(nftUri).replace("{id}", nftId);
            nftUri = nftUri.split("/");
            if(nftUri.length > 0 && nftUri[ nftUri.length - 1 ].startsWith("0x")){
                nftUri[ nftUri.length - 1 ] = nftUri[ nftUri.length - 1 ].replace("0x", "");
                nftUri = nftUri.join("/");
            }
        }

        nftUri  = decodeURI(nftUri).replace("{id}", nftId);

        return nftUri;
    };

    this.getNftMeta = async function(hrc1155ContractAddress, nftId){

        let hrc1155 = new web3.eth.Contract( hrc1155ABI, hrc1155ContractAddress, {from:this.account} );

        let nftUri = '';
        try {
            await sleep(sleep_time);
            nftUri = await hrc1155.methods.uri(nftId).call({from: this.account});
        }catch(e){
            try {
                nftUri = await this.getNftMetaByEvent(hrc1155ContractAddress, nftId);
            }catch(e){}
        }

        // new DaVinci json uri pattern
        if(nftUri.includes("api.davinci.gallery")){

            nftUri = decodeURI(nftUri).replace("{id}", nftId);
            nftUri = nftUri.split("/");
            if(nftUri.length > 0 && nftUri[ nftUri.length - 1 ].startsWith("0x")){
                nftUri[ nftUri.length - 1 ] = nftUri[ nftUri.length - 1 ].replace("0x", "");
                nftUri = nftUri.join("/");
            }
        }

        nftUri  = decodeURI(nftUri).replace("{id}", nftId);

        return nftUri;
    };

    this.isErc1155Supported = async function(erc1155ContractAddress){

        let supported = false;

        let erc1155 = new web3.eth.Contract( erc1155ABI, erc1155ContractAddress, {from:this.account} );
        try {
            supported = await erc1155.methods.supportsInterface("0xd9b67a26").call({from: this.account});
        }catch(e){
            console.log(e);
        }

        return supported;
    };
    
    this.isHrc1155Supported = async function(hrc1155ContractAddress){

        let supported = false;

        let hrc1155 = new web3.eth.Contract( hrc1155ABI, hrc1155ContractAddress, {from:this.account} );
        try {
            supported = await hrc1155.methods.supportsInterface("0x6ccb2df4")/("0x80ac58cd").call({from: this.account});
        }catch(e){
            console.log(e);
        }

        return supported;
    };

    this.getNftMetaByEvent = async function(erc1155ContractAddress, nftId){

        sleep(sleep_time);

        let erc1155 = new web3.eth.Contract( erc1155ABI, erc1155ContractAddress, {from:this.account} );
        let uris = await fetchUrl(api_url + '1.0/'+chain_id+'/collections/events/URI/erc1155Address/'+erc1155ContractAddress+'/id/'+nftId, 5000);

        if(uris === 'not-indexed'){
            uris = '[]';
        }

        if(uris === false || uris === 'unsupported-chainid'){

            uris = await erc1155.getPastEvents('URI', {
                filter : {
                    _id : nftId
                },
                fromBlock: 0,
                toBlock: 'latest'
            });
        }
        else
        {

            uris = JSON.parse(uris);
        }

        uris = uris.reverse();
        if(uris.length > 0){
            return uris[0].returnValues[0];
        }

        return '';
    };

    this.getNftMetaByEvent = async function(hrc1155ContractAddress, nftId){

        sleep(sleep_time);

        let hrc1155 = new web3.eth.Contract( hrc1155ABI, hrc1155ContractAddress, {from:this.account} );
        let uris = await fetchUrl(api_url + '1.0/'+chain_id+'/collections/events/URI/hrc1155Address/'+hrc1155ContractAddress+'/id/'+nftId, 5000);

        if(uris === 'not-indexed'){
            uris = '[]';
        }

        if(uris === false || uris === 'unsupported-chainid'){

            uris = await hrc1155.getPastEvents('URI', {
                filter : {
                    _id : nftId
                },
                fromBlock: 0,
                toBlock: 'latest'
            });
        }
        else
        {

            uris = JSON.parse(uris);
        }

        uris = uris.reverse();
        if(uris.length > 0){
            return uris[0].returnValues[0];
        }

        return '';
    };

    this.getErc1155Meta = async function(erc1155ContractAddress){

        let erc1155 = new web3.eth.Contract( erc1155ABI, erc1155ContractAddress, {from:this.account} );
        let contractURI = '';

        try {
            await sleep(sleep_time);
            contractURI = await erc1155.methods.contractURI().call({from: this.account});
        }catch (e){
            console.log('error retrieving contract URI: ', e);
        }

        let name = 'n/a';
        let symbol = 'n/a';

        try {
            await sleep(sleep_time);
            name = await erc1155.methods.name().call({from: this.account});
            await sleep(sleep_time);
            symbol = await erc1155.methods.symbol().call({from: this.account});
        }catch(e){
            console.log('error retrieving name and symbol: ', e);
        }

        return {contractURI: contractURI, name: name, symbol: symbol};
    };
    
    this.getHrc1155Meta = async function(hrc1155ContractAddress){

        let hrc1155 = new web3.eth.Contract( hrc1155ABI, hrc1155ContractAddress, {from:this.account} );
        let contractURI = '';

        try {
            await sleep(sleep_time);
            contractURI = await hrc1155.methods.contractURI().call({from: this.account});
        }catch (e){
            console.log('error retrieving contract URI: ', e);
        }

        let name = 'n/a';
        let symbol = 'n/a';

        try {
            await sleep(sleep_time);
            name = await hrc1155.methods.name().call({from: this.account});
            await sleep(sleep_time);
            symbol = await hrc1155.methods.symbol().call({from: this.account});
        }catch(e){
            console.log('error retrieving name and symbol: ', e);
        }

        return {contractURI: contractURI, name: name, symbol: symbol};
    };

    this.getMyErc1155Length = async function(){
        await sleep(sleep_time);
        console.log("account: ", this.account);
        return await this.genesis.methods.getPoolsLength(this.account).call({from:this.account});
    };

    this.getMyHrc1155Length = async function(){
        await sleep(sleep_time);
        console.log("account: ", this.account);
        return await this.genesis.methods.getPoolsLength(this.account).call({from:this.account});
    };

    this.getErc1155Length = async function(address){
        await sleep(sleep_time);
        return await this.genesis.methods.getPoolsLength(address).call({from:this.account});
    };

    this.getHrc1155Length = async function(address){
        await sleep(sleep_time);
        return await this.genesis.methods.getPoolsLength(address).call({from:this.account});
    };

    this.iHaveAnyWildcard = async function(){
        await sleep(sleep_time);
        return await this.genesis.methods.iHaveAnyWildcard().call({from:this.account});
    };

    this.getMyErc1155 = async function(index){
        await sleep(sleep_time);
        let erc1155 = await this.genesis.methods.getPool(this.account, index).call({from:this.account});
        let meta = await this.getErc1155Meta(erc1155);
        let _pool = {erc1155: erc1155, contractURI: meta.contractURI, name: meta.name, symbol: meta.symbol};
        return _pool;
    };
    
    this.getMyHrc1155 = async function(index){
        await sleep(sleep_time);
        let hrc1155 = await this.genesis.methods.getPool(this.account, index).call({from:this.account});
        let meta = await this.getHrc1155Meta(hrc1155);
        let _pool = {hrc1155: hrc1155, contractURI: meta.contractURI, name: meta.name, symbol: meta.symbol};
        return _pool;
    };

    this.getErc1155 = async function(address, index){
        await sleep(sleep_time);
        let erc1155 = await this.genesis.methods.getPool(address, index).call({from:this.account});
        let meta = await this.getErc1155Meta(erc1155);
        let _pool = {erc1155: erc1155, contractURI: meta.contractURI, name: meta.name, symbol: meta.symbol};
        return _pool;
    };

    this.getHrc1155 = async function(address, index){
        await sleep(sleep_time);
        let hrc1155 = await this.genesis.methods.getPool(address, index).call({from:this.account});
        let meta = await this.getHrc1155Meta(hrc1155);
        let _pool = {hrc1155: hrc1155, contractURI: meta.contractURI, name: meta.name, symbol: meta.symbol};
        return _pool;
    };

    this.newNft = async function(supply, maxSupply, jsonUrl, erc1155Address, preCallback, postCallback, errCallback){

        console.log('address: ', erc1155Address);

        let erc1155 = new web3.eth.Contract( erc1155ABI, erc1155Address, {from:this.account} );

        await sleep(sleep_time);
        const gas = await erc1155.methods.create(parseInt(maxSupply), parseInt(supply), jsonUrl, web3.utils.fromAscii('')).estimateGas({
            from:this.account,
        });
        const price = await web3.eth.getGasPrice();

        erc1155.methods.create(parseInt(maxSupply), parseInt(supply), jsonUrl, web3.utils.fromAscii(''))
            .send({
                from:this.account,
                gas: gas + Math.floor( gas * 0.1 ),
                gasPrice: Number(price) + Math.floor( Number(price) * 0.1 )
            })
            .on('error', async function(e){
                console.log(e);
                errCallback();
            })
            .on('transactionHash', async function(transactionHash){
                console.log('hash', transactionHash);
                preCallback();
            })
            .on("receipt", function (receipt) {
                postCallback(receipt);
            });
    };
    
    this.newNft = async function(supply, maxSupply, jsonUrl, hrc1155Address, preCallback, postCallback, errCallback){

        console.log('address: ', hrc1155Address);

        let hrc1155 = new web3.eth.Contract( hrc1155ABI, hrc1155Address, {from:this.account} );

        await sleep(sleep_time);
        const gas = await hrc1155.methods.create(parseInt(maxSupply), parseInt(supply), jsonUrl, web3.utils.fromAscii('')).estimateGas({
            from:this.account,
        });
        const price = await web3.eth.getGasPrice();

        hrc1155.methods.create(parseInt(maxSupply), parseInt(supply), jsonUrl, web3.utils.fromAscii(''))
            .send({
                from:this.account,
                gas: gas + Math.floor( gas * 0.1 ),
                gasPrice: Number(price) + Math.floor( Number(price) * 0.1 )
            })
            .on('error', async function(e){
                console.log(e);
                errCallback();
            })
            .on('transactionHash', async function(transactionHash){
                console.log('hash', transactionHash);
                preCallback();
            })
            .on("receipt", function (receipt) {
                postCallback(receipt);
            });
    };

    this.updateUri = async function(nftId, jsonUrl, erc1155Address, preCallback, postCallback, errCallback){

        let erc1155 = new web3.eth.Contract( erc1155ABI, erc1155Address, {from:this.account} );

        await sleep(sleep_time);
        const gas = await erc1155.methods.updateUri(parseInt(nftId), jsonUrl).estimateGas({
            from:this.account,
        });
        const price = await web3.eth.getGasPrice();

        erc1155.methods.updateUri(parseInt(nftId), jsonUrl)
            .send({
                from:this.account,
                gas: gas + Math.floor( gas * 0.1 ),
                gasPrice: Number(price) + Math.floor( Number(price) * 0.1 )
            })
            .on('error', async function(e){
                console.log(e);
                errCallback();
            })
            .on('transactionHash', async function(transactionHash){
                console.log('hash', transactionHash);
                preCallback();
            })
            .on("receipt", function (receipt) {
                postCallback(receipt);
            });
    };

    this.updateUri = async function(nftId, jsonUrl, hrc1155Address, preCallback, postCallback, errCallback){

        let hrc1155 = new web3.eth.Contract( hrc1155ABI, hrc1155Address, {from:this.account} );

        await sleep(sleep_time);
        const gas = await hrc1155.methods.updateUri(parseInt(nftId), jsonUrl).estimateGas({
            from:this.account,
        });
        const price = await web3.eth.getGasPrice();

        hrc1155.methods.updateUri(parseInt(nftId), jsonUrl)
            .send({
                from:this.account,
                gas: gas + Math.floor( gas * 0.1 ),
                gasPrice: Number(price) + Math.floor( Number(price) * 0.1 )
            })
            .on('error', async function(e){
                console.log(e);
                errCallback();
            })
            .on('transactionHash', async function(transactionHash){
                console.log('hash', transactionHash);
                preCallback();
            })
            .on("receipt", function (receipt) {
                postCallback(receipt);
            });
    };

    this.getPoolFee = async function(){
        await sleep(sleep_time);
       return await this.genesis.methods.poolFee().call({from:this.account});
    };

    this.getPoolMinimumNif = async function(){
        await sleep(sleep_time);
        return await this.genesis.methods.poolFeeMinimumNif().call({from:this.account});
    };

    this.newErc1155 = async function(name, ticker, contractJsonUri, proxyRegistryAddress, preCallback, postCallback, errCallback){

        await sleep(sleep_time);
        let nif = web3.utils.toBN(await this.nif.methods.balanceOf(this.account).call({from:this.account}));
        let minNif = web3.utils.toBN(await this.getPoolMinimumNif());

        let gas = 0;

        try {
            await sleep(sleep_time);
            gas = await this.genesis.methods.newPool(name, ticker, contractJsonUri, '', proxyRegistryAddress).estimateGas({
                from: this.account,
                value:
                    await this.iHaveAnyWildcard() || nif.gte(minNif) ? 0 : await this.getPoolFee()
            });
        }catch(e){
            errCallback();
            return;
        }

        const price = await web3.eth.getGasPrice();

        await this.genesis.methods.newPool(name, ticker, contractJsonUri, '', proxyRegistryAddress)
        .send(
            {
                from:this.account,
                value:
                    await this.iHaveAnyWildcard() || nft.gte(minNFT) ? 0 : await this.getPoolFee(),
                gas: gas + Math.floor( gas * 0.1 ),
                gasPrice: Number(price) + Math.floor( Number(price) * 0.1 )
        })
        .on('error', async function(e){
            console.log(e);
            errCallback();
        })
        .on('transactionHash', async function(transactionHash){
            preCallback();
        })
        .on("receipt", function (receipt) {
            postCallback(receipt);
        });
    };

    this.setContractURI = async function(erc1155Address, uri, preCallback, postCallback, errCallback){

        let erc1155 = new web3.eth.Contract( erc1155ABI, erc1155Address, {from:this.account} );

        await sleep(sleep_time);
        let balanceOf = await this.nif.methods.balanceOf(this.account).call({from:this.account});

        await sleep(sleep_time);
        const gas = await erc1155.methods.setContractURI(uri).estimateGas({
            from:this.account
        });
        const price = await web3.eth.getGasPrice();

        await erc1155.methods.setContractURI(uri)
            .send({
                from:this.account,
                gas: gas + Math.floor( gas * 0.1 ),
                gasPrice: Number(price) + Math.floor( Number(price) * 0.1 )
            })
            .on('error', async function(e){
                console.log(e);
                errCallback();
            })
            .on('transactionHash', async function(transactionHash){
                console.log('hash', transactionHash);
                preCallback();
            })
            .on("receipt", function (receipt) {
                postCallback(receipt);
            });
    };

    this.setContractURI = async function(hrc1155Address, uri, preCallback, postCallback, errCallback){

        let hrc1155 = new web3.eth.Contract( hrc1155ABI, hrc1155Address, {from:this.account} );

        await sleep(sleep_time);
        let balanceOf = await this.nif.methods.balanceOf(this.account).call({from:this.account});

        await sleep(sleep_time);
        const gas = await hrc1155.methods.setContractURI(uri).estimateGas({
            from:this.account
        });
        const price = await web3.eth.getGasPrice();

        await hrc1155.methods.setContractURI(uri)
            .send({
                from:this.account,
                gas: gas + Math.floor( gas * 0.1 ),
                gasPrice: Number(price) + Math.floor( Number(price) * 0.1 )
            })
            .on('error', async function(e){
                console.log(e);
                errCallback();
            })
            .on('transactionHash', async function(transactionHash){
                console.log('hash', transactionHash);
                preCallback();
            })
            .on("receipt", function (receipt) {
                postCallback(receipt);
            });
    };

    this.getBlock = async function(){

        try{

            await sleep(sleep_time);
            const block = await this.genesis.methods.getCurrentBlockNumber().call({from:this.account});

            return block;

        }catch(error){

            console.log(error);
        }

        return 0;
    };
}
