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

function TncLib(){

    this.hrc1155 = new web3.eth.Contract( HRC1155ABI, 'null', {from:this.account} );
    this.erc1155 = new web3.eth.Contract( erc1155ABI, 'null', {from:this.account} );
    this.account = '';
    this.defaultProxyRegistryAddress = 'string'; // opensea

    this.setAccount = function(address){
        this.account = address;
    };

    /**
     *
     * Farm Creation & Management
     *
     */

    this.farmMaxStake = async function(farmAddress){
        let farm = new web3.eth.Contract( farmABI, farmAddress, {from:this.account} );
        let max = await farm.methods.maxStake().call({from:this.account});
        let decimals = await this.farmTokenDecimals(farmAddress);
        return max / Math.pow(10, decimals >= 0 ? decimals : 0);
    };

    this.farmMaxStakeRaw = async function(farmAddress){
        let farm = new web3.eth.Contract( farmABI, farmAddress, {from:this.account} );
        let max = await farm.methods.maxStake().call({from:this.account});
        return max;
    };

    this.farmPointsEarned = async function(farmAddress, account){
        let farm = new web3.eth.Contract( farmABI, farmAddress, {from:this.account} );
        let earned = await farm.methods.earned(account).call({from:this.account});
        let decimals = await this.farmTokenDecimals(farmAddress);
        return earned / Math.pow(10, decimals >= 0 ? decimals : 0);
    };

    this.farmBalanceOf = async function(farmAddress, account){
        let farm = new web3.eth.Contract( farmABI, farmAddress, {from:this.account} );
        let balance = await farm.methods.balanceOf(account).call({from:this.account});
        let decimals = await this.farmTokenDecimals(farmAddress);
        console.log("Received balance", balance);
        return balance / Math.pow(10, decimals >= 0 ? decimals : 0);
    };

    this.farmBalanceOfRaw = async function(farmAddress, account){
        let farm = new web3.eth.Contract( farmABI, farmAddress, {from:this.account} );
        let balance = await farm.methods.balanceOf(account).call({from:this.account});
        return balance;
    };

    this.balanceOfErc20 = async function(erc20Address, owner){

        let erc20 = new web3.eth.Contract( erc20ABI, erc20Address, {from:this.account} );
        let decimals = await erc20.methods.decimals().call({from:this.account});
        let balance = await erc20.methods.balanceOf(owner).call({from:this.account});
        return balance / Math.pow(10, decimals >= 0 ? decimals : 0);
    };

    this.balanceOfHrc20 = async function(hrc20Address, owner){

        let hrc20 = new web3.eth.Contract( hrc20ABI, hrc20Address, {from:this.account} );
        let decimals = await hrc20.methods.decimals().call({from:this.account});
        let balance = await hrc20.methods.balanceOf(owner).call({from:this.account});
        return balance / Math.pow(10, decimals >= 0 ? decimals : 0);
    };

    this.balanceOfErc20Raw = async function(erc20Address, owner){

        let erc20 = new web3.eth.Contract( erc20ABI, erc20Address, {from:this.account} );
        let balance = await erc20.methods.balanceOf(owner).call({from:this.account});
        return balance;
    };

    this.balanceOfHrc20Raw = async function(hrc20Address, owner){

        let hrc20 = new web3.eth.Contract( hrc20ABI, hrc20Address, {from:this.account} );
        let balance = await hrc20.methods.balanceOf(owner).call({from:this.account});
        return balance;
    };

    this.allowanceErc20 = async function(erc20Address, owner, spender){

        let erc20 = new web3.eth.Contract( erc20ABI, erc20Address, {from:this.account} );
        let decimals = await erc20.methods.decimals().call({from:this.account})
        let allowance = await erc20.methods.allowance(owner, spender).call({from:this.account});
        return allowance / Math.pow(10, decimals >= 0 ? decimals : 0);
    };

    this.allowanceHrc20 = async function(hrc20Address, owner, spender){

        let hrc20 = new web3.eth.Contract( hrc20ABI, hrc20Address, {from:this.account} );
        let decimals = await hrc20.methods.decimals().call({from:this.account})
        let allowance = await hrc20.methods.allowance(owner, spender).call({from:this.account});
        return allowance / Math.pow(10, decimals >= 0 ? decimals : 0);
    };

    this.allowanceErc20Raw = async function(erc20Address, owner, spender){

        let erc20 = new web3.eth.Contract( erc20ABI, erc20Address, {from:this.account} );
        let allowance = await erc20.methods.allowance(owner, spender).call({from:this.account});
        return allowance;
    };

    this.allowanceHrc20Raw = async function(hrc20Address, owner, spender){

        let hrc20 = new web3.eth.Contract( hrc20ABI, hrc20Address, {from:this.account} );
        let allowance = await hrc20.methods.allowance(owner, spender).call({from:this.account});
        return allowance;
    };

    this.approveErc20 = async function(erc20Address, amount, spender, preCallback, postCallback, errCallback){

        console.log("Approve amount", amount);

        let erc20 = new web3.eth.Contract( erc20ABI, erc20Address, {from:this.account} );

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

    this.farmToken = async function(farmAddress){
        let farm = new web3.eth.Contract( farmABI, farmAddress, {from:this.account} );
        return await farm.methods.token().call({from:this.account});
    };

    this.farmNftData = async function(farmAddress, erc1155Address, id){
        let farm = new web3.eth.Contract( farmABI, farmAddress, {from:this.account} );
        return await farm.methods.cards(erc1155Address, id).call({from:this.account});
    };

    this.farmTokenSymbol = async function(farmAddress){
        let farm_token = await this.farmToken(farmAddress);
        let erc20 = new web3.eth.Contract( erc20ABI, farm_token, {from:this.account} );
        let symbol = await erc20.methods.symbol().call({from:this.account});
        if(symbol == 'UNI-V2'){
            let uniInstance = new web3.eth.Contract( univ2ABI, farm_token, {from:this.account} );
            let token0 = await uniInstance.methods.token0().call({from:this.account});
            let token0Instance = new web3.eth.Contract( erc20ABI, token0, {from:this.account} );
            symbol = await token0Instance.methods.symbol().call({from:this.account}) + "-LP";
        }
        return symbol;
    };

    this.farmTokenDecimals = async function(farmAddress){
        let farm_token = await this.farmToken(farmAddress);
        let erc20 = new web3.eth.Contract( erc20ABI, farm_token, {from:this.account} );
        return await erc20.methods.decimals().call({from:this.account});
    };

    this.farmJsonUrl = async function(farmAddress){

        let events = await this.farm.getPastEvents('FarmUri', {
            filter: {
                farm: farmAddress
            },
            fromBlock: 0,
            toBlock: 'latest'
        });

        console.log(events);

        return events.length > 0 ? events[ events.length - 1 ].returnValues.uri : '';
    };

    this.farmRedeem = async function(farmAddress, erc1155Address, id, fee, preCallback, postCallback, errCallback){

        let farm = new web3.eth.Contract( farmABI, farmAddress, {from:this.account} );
        let gas = 0;

        try {
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

        let farm = new web3.eth.Contract( farmABI, farmAddress, {from:this.account} );

        let cards = await farm.getPastEvents('CardAdded', {
            fromBlock: 0,
            toBlock: 'latest'
        });

        cards = cards.reverse();
        let card_data = [];

        let decimals = await this.farmTokenDecimals(farmAddress);

        for(let i = 0; i < cards.length; i++){

            let data = await this.farmNftData(farmAddress, cards[i].returnValues.erc1155, cards[i].returnValues.card);

            card_data.push(
                {
                    erc1155: cards[i].returnValues.erc1155,
                    id: cards[i].returnValues.card,
                    points: Number(data.points / Math.pow(10, decimals >= 0 ? decimals : 0)).toFixed(8),
                    pointsRaw : data.points / Math.pow(10, decimals >= 0 ? decimals : 0),
                    mintFee: parseInt(data.controllerFee) + parseInt(data.mintFee),
                    artist: data.artist,
                    releaseTime: data.releaseTime,
                    nsfw: data.nsfw,
                    shadowed: data.shadowed
                }
            );
        }

        return card_data;
    };

    this.getFarmCreatedEventsByUser = async function(userAddress){

        return await this.farm.getPastEvents('FarmCreated', {
            filter: {
                user: userAddress
            },
            fromBlock: 0,
            toBlock: 'latest'
        });
    };

    this.isFarm = async function(farmAddress){

        let res = await this.farm.getPastEvents('FarmCreated', {
            filter: {
                farm: farmAddress
            },
            fromBlock: 0,
            toBlock: 'latest'
        });

        return res.length > 0;
    };


    /**
     *
     * ERC1155 && HRC1155 Contract Creation & Management
     *
     */

    this.burn = async function(erc1155Address, hrc1155Address, nftId, amount, preCallback, postCallback, errCallback){

        let erc1155 = new web3.eth.Contract( erc1155ABI, erc1155Address, {from:this.account} );

        const gas = await erc1155.methods.burn(this.account, nftId, amount).estimateGas({
            from:this.account,
        });

        let hrc1155 = new web3.eth.Contract( hrc1155ABI, hrc1155Address, {from:this.account} );

        const gas = await hrc1155.methods.burn(this.account, nftId, amount).estimateGas({
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

    this.mint = async function(hrc1155Address, nftId, amount, preCallback, postCallback, errCallback){

        let hrc1155 = new web3.eth.Contract( hrc1155ABI, hrc1155Address, {from:this.account} );

        const gas = await hrc1155.methods.mint(nftId, amount, web3.utils.fromAscii('')).estimateGas({
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
    
    this.transfer = async function(hrc1155Address, nftId, amount, to, preCallback, postCallback, errCallback){

        let hrc1155 = new web3.eth.Contract( hrc1155ABI, hrc1155Address, {from:this.account} );

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

    this.getNft = async function(erc1155Address, nftId){

        let erc1155 = new web3.eth.Contract( erc1155ABI, erc1155Address, {from:this.account} );
        let supply = await erc1155.methods.totalSupply(nftId).call({from:this.account});
        let maxSupply = await erc1155.methods.maxSupply(nftId).call({from:this.account});
        let balance = await erc1155.methods.balanceOf(this.account, nftId).call({from:this.account});
        let uri = await this.getNftMeta(erc1155Address, nftId);

        return {uri: uri, supply: supply, maxSupply: maxSupply, balance: balance};
    };

    this.getNft = async function(hrc1155Address, nftId){

        let hrc1155 = new web3.eth.Contract( hrc1155ABI, hrc1155Address, {from:this.account} );
        let supply = await hrc1155.methods.totalSupply(nftId).call({from:this.account});
        let maxSupply = await hrc1155.methods.maxSupply(nftId).call({from:this.account});
        let balance = await hrc1155.methods.balanceOf(this.account, nftId).call({from:this.account});
        let uri = await this.getNftMeta(hrc1155Address, nftId);

        return {uri: uri, supply: supply, maxSupply: maxSupply, balance: balance};
    };

    this.balanceof = async function(erc1155Address, account, nftId){

        let erc1155 = new web3.eth.Contract( erc1155ABI, erc1155Address, {from:this.account} );
        return await erc1155.methods.balanceOf(account, nftId).call({from:this.account});
    };
    
    this.balanceof = async function(hrc1155Address, account, nftId){

        let hrc1155 = new web3.eth.Contract( hrc1155ABI, hrc1155Address, {from:this.account} );
        return await hrc1155.methods.balanceOf(account, nftId).call({from:this.account});
    };

    this.getPoolCreatedEvents = async function(){

        return await this.genesis.getPastEvents('PoolCreated', {
            fromBlock: 0,
            toBlock: 'latest'
        });
    };

    this.getNfts = async function(erc1155Address){

        let erc1155 = new web3.eth.Contract( erc1155ABI, erc1155Address, {from:this.account} );

        let events = await erc1155.getPastEvents('TransferSingle', {
            filter: {
                _from: '0x0000000000000000000000000000000000000000'
            },
            fromBlock: 0,
            toBlock: 'latest'
        });

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

    this.getNfts = async function(hrc1155Address){

        let erc1155 = new web3.eth.Contract( hrc1155ABI, hrc1155Address, {from:this.account} );

        let events = await hrc1155.getPastEvents('TransferSingle', {
            filter: {
                _from: ''
            },
            fromBlock: 0,
            toBlock: 'latest'
        });

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


    this.getNftMeta = async function(erc1155ContractAddress, nftId){

        let erc1155 = new web3.eth.Contract( erc1155ABI, erc1155ContractAddress, {from:this.account} );
        let nftUri = await erc1155.methods.uri(nftId).call({from:this.account});

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
        let nftUri = await hrc1155.methods.uri(nftId).call({from:this.account});

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

    this.getErc1155Meta = async function(erc1155ContractAddress){

        let erc1155 = new web3.eth.Contract( erc1155ABI, erc1155ContractAddress, {from:this.account} );
        let contractURI = await erc1155.methods.contractURI().call({from:this.account});
        let name = await erc1155.methods.name.call({from:this.account});
        let symbol = await erc1155.methods.symbol.call({from:this.account});

        return {contractURI: contractURI, name: name, symbol: symbol};
    };

    this.getHrc1155Meta = async function(hrc1155ContractAddress){

        let hrc1155 = new web3.eth.Contract( hrc1155ABI, hrc1155ContractAddress, {from:this.account} );
        let contractURI = await erc1155.methods.contractURI().call({from:this.account});
        let name = await hrc1155.methods.name.call({from:this.account});
        let symbol = await hrc1155.methods.symbol.call({from:this.account});

        return {contractURI: contractURI, name: name, symbol: symbol};
    };

    this.getMyErc1155Length = async function(){
        return await this.genesis.methods.getPoolsLength(this.account).call({from:this.account});
    };

    this.getMyHrc1155Length = async function(){
        return await this.genesis.methods.getPoolsLength(this.account).call({from:this.account});
    };

    this.iHaveAnyWildcard = async function(){
        return await this.genesis.methods.iHaveAnyWildcard().call({from:this.account});
    };

    this.getMyErc1155 = async function(index){
        let erc1155 = await this.genesis.methods.getPool(this.account, index).call({from:this.account});
        let meta = await this.getErc1155Meta(erc1155);
        let _pool = {erc1155: erc1155, contractURI: meta.contractURI, name: meta.name, symbol: meta.symbol};
        return _pool;
    };

    this.getMyHrc1155 = async function(index){
        let hrc1155 = await this.genesis.methods.getPool(this.account, index).call({from:this.account});
        let meta = await this.getHrc1155Meta(erc1155);
        let _pool = {hrc1155: hrc1155, contractURI: meta.contractURI, name: meta.name, symbol: meta.symbol};
        return _pool;
    };

    this.newNft = async function(supply, maxSupply, jsonUrl, erc1155Address, preCallback, postCallback, errCallback){

        console.log('address: ', erc1155Address);

        let erc1155 = new web3.eth.Contract( erc1155ABI, erc1155Address, {from:this.account} );

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

        const gas = await hrc1155.methods.updateUri(parseInt(nftId), jsonUrl).estimateGas({
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

    this.getPoolFee = async function(){
       return await this.genesis.methods.poolFee().call({from:this.account});
    };

    this.getPoolMinimumNif = async function(){
        return await this.genesis.methods.poolFeeMinimumNif().call({from:this.account});
    };

    this.newErc1155 = async function(name, ticker, contractJsonUri, proxyRegistryAddress, preCallback, postCallback, errCallback){

        const gas = await this.genesis.methods.newPool(name, ticker, contractJsonUri, '', proxyRegistryAddress).estimateGas({
            from:this.account,
            value:
                await this.iHaveAnyWildcard() || await this.nif.methods.balanceOf(this.account).call({from:this.account}) >= await this.getPoolMinimumNif() ? 0 : await this.getPoolFee()
        });
        const price = await web3.eth.getGasPrice();

        await this.genesis.methods.newPool(name, ticker, contractJsonUri, '', proxyRegistryAddress)
        .send(
            {
                from:this.account,
                value:
                    await this.iHaveAnyWildcard() || await this.nif.methods.balanceOf(this.account).call({from:this.account}) >= await this.getPoolMinimumNif() ? 0 : await this.getPoolFee(),
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

    this.newHrc1155 = async function(name, ticker, contractJsonUri, proxyRegistryAddress, preCallback, postCallback, errCallback){

        const gas = await this.genesis.methods.newPool(name, ticker, contractJsonUri, '', proxyRegistryAddress).estimateGas({
            from:this.account,
            value:
                await this.iHaveAnyWildcard() || await this.nif.methods.balanceOf(this.account).call({from:this.account}) >= await this.getPoolMinimumNif() ? 0 : await this.getPoolFee()
        });
        const price = await web3.eth.getGasPrice();

        await this.genesis.methods.newPool(name, ticker, contractJsonUri, '', proxyRegistryAddress)
        .send(
            {
                from:this.account,
                value:
                    await this.iHaveAnyWildcard() || await this.nif.methods.balanceOf(this.account).call({from:this.account}) >= await this.getPoolMinimumNif() ? 0 : await this.getPoolFee(),
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

        const gas = await erc1155.methods.setContractURI(uri).estimateGas({
            from:this.account,
            value:
                await this.iHaveAnyWildcard() || await this.nif.methods.balanceOf(this.account).call({from:this.account}) >= await this.getPoolMinimumNif() ? 0 : await this.getPoolFee()
        });
        const price = await web3.eth.getGasPrice();

        await erc1155.methods.setContractURI(uri)
            .send({
                from:this.account,
                value:
                    await this.iHaveAnyWildcard() || await this.nif.methods.balanceOf(this.account).call({from:this.account}) >= await this.getPoolMinimumNif() ? 0 : await this.getPoolFee(),
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

        const gas = await hrc1155.methods.setContractURI(uri).estimateGas({
            from:this.account,
            value:
                await this.iHaveAnyWildcard() || await this.nif.methods.balanceOf(this.account).call({from:this.account}) >= await this.getPoolMinimumNif() ? 0 : await this.getPoolFee()
        });
        const price = await web3.eth.getGasPrice();

        await erc1155.methods.setContractURI(uri)
            .send({
                from:this.account,
                value:
                    await this.iHaveAnyWildcard() || await this.nif.methods.balanceOf(this.account).call({from:this.account}) >= await this.getPoolMinimumNif() ? 0 : await this.getPoolFee(),
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

            const block = await this.genesis.methods.getCurrentBlockNumber().call({from:this.account});

            return block;

        }catch(error){

            console.log(error);
        }

        return 0;
    };
}
