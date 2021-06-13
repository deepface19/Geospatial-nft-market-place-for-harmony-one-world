import userWallet from './userWallet';
let but = document.getElementById("inputtButton");

but.addEventListener("click",initWallet);

async function initWallet(){
    const wallet = new userWallet();
    await wallet.signin();
}
function getExtension(endpoint, shard, chaindID) {
    let ext;
    if (window.onewallet) {
      ext = new HarmonyExtension(window.onewallet);
      // Not mandatory, Harmony-One Wallet extension provides the mainnet to the third-party apps, to customize, you can change manually like below
      ext.setProvider(endpoint);
      ext.setShardID(shard);
      ext.setMessenger(new Messenger(ext.provider, ChainType.Harmony, chaindID));
      ext.contracts.wallet = ext.wallet;
    } else {
      console.error("Could not load harmony extension");
    }
    return ext;
  };
  const harmony = await new Harmony(rpc_url, {
    chainType: ChainType.Harmony,
    chainId: chain_id
  });

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function detectDivScroll(elem, resolver) {
    let height = $(elem).get(0).scrollHeight - $(elem).height();
    let scroll = $(elem).scrollTop();

    let isScrolledToEnd = ( scroll + 150 >= height );
    if (isScrolledToEnd)
    {
        resolver('done');
    }
}

function waitForDiv(elem, itemCount) {
    $(elem).off('scroll');
    return new Promise(
        function(resolve, reject){
            detectDivScroll(elem, resolve);
            $(elem).on('scroll', function(){
                detectDivScroll(elem, resolve);
            });
        }
    );
}

function waitForPaging(pageId, itemCount) {
    $(window).off('scroll');
    return new Promise(
        function(resolve, reject){
            if(itemCount % 50 == 49){
                $(window).on('scroll', function(){
                    let nearToBottom = window.screen.height;

                    if ($(window).scrollTop() + $(window).height() >=
                        $(document).height() - nearToBottom) {
                        console.log("Hit Shit");
                        resolve('done');
                    }
                });
            }
            else{

                resolve('done');
            }
        }
    );
}

$(document).ready(async function(){

    if(window.celo){

        window.ethereum = window.celo;
    }
    if(window.onewallet){

        window.ethereum = window.onewallet;
    }
    if (window.ethereum) {

        setTimeout(async function(){

            window.web3 = new Web3(ethereum);

            /*
            if(window.ethereum.isTrust){
                _alert('Trust Wallet not supported due to insufficient Web3 support. Please use One wallet or Metamask that fully supports Web3.');
                return;
            }*/

            try {

                // Request account access if needed

                let chain = await web3.eth.getChainId();
                let actualChainId = chain.toString(16);

                console.log(actualChainId);

                if(actualChainId != chain_id){

                    let chainName = '';
                    let rpcUrl = '';
                    let currencyName = '';
                    let currencySymbol = '';
                    let currencyDecimals = '';
                    let blockExplorerUrl = '';

                    let desc =  'You are not connected to ' + network + '. Please change to the right network in your wallet (Metamask) and reload.';

                    if(chain_id == '61'){

                        chainName = 'Binance Smart Chain TESTNET';
                        rpcUrl = 'https://data-seed-prebsc-1-s1.binance.org:8545/';
                        currencyName = 'BNB';
                        currencySymbol = 'BNB';
                        currencyDecimals = 18;
                        blockExplorerUrl = 'https://testnet.bscscan.com';

                        desc =  'You are not connected to the ' + chainName + '.<br/><br/>' +
                            'Please use the following setup in Metamask => Settings => Networks => Add Network: <br /><br />' +
                            'Network Name: ' + chainName + '<br/>' +
                            'New RPC URL: ' + rpcUrl + '<br/>' +
                            'ChainID: 97<br/>' +
                            'Symbol: '+currencySymbol+'<br/>' +
                            'Block Explorer URL: '+blockExplorerUrl+'<br /><br/>' +
                            'Get free test BNB from <a href="https://testnet.binance.org/faucet-smart" target="_blank">here</a>.<br/>' +
                            'More information on the setup <a href="https://docs.binance.org/smart-chain/wallet/metamask.html" target="_blank">here</a>.';

                    }else if(chain_id == '38'){

                        chainName = 'Binance Smart Chain';
                        rpcUrl = 'https://bsc-dataseed.binance.org/';
                        currencyName = 'BNB';
                        currencySymbol = 'BNB';
                        currencyDecimals = 18;
                        blockExplorerUrl = 'https://bscscan.com';

                        desc =  'You are not connected to '+chainName+'.<br/><br/>' +
                            'Please use the following setup in Metamask => Settings => Networks => Add Network: <br /><br />' +
                            'Network Name: '+chainName+'<br/>' +
                            'New RPC URL: '+rpcUrl+' (or https://bsc2-rpc.unifty.cloud/)<br/>' +
                            'ChainID: 56<br/>' +
                            'Symbol: '+currencySymbol+'<br/>' +
                            'Block Explorer URL: '+blockExplorerUrl+'<br /><br/>' +
                            'More information on the setup <a href="https://docs.binance.org/smart-chain/wallet/metamask.html" target="_blank">here</a>.';

                    }else if(chain_id == '507'){

                        chainName = 'Moonbase Alpha Testnet (Moonbeam/Polkadot)';
                        rpcUrl = 'https://rpc.testnet.moonbeam.network';
                        currencyName = 'DEV';
                        currencySymbol = 'DEV';
                        currencyDecimals = 18;
                        blockExplorerUrl = '';

                        desc =  'You are not connected to the '+chainName+'.<br/><br/>' +
                            'Please use the following setup in Metamask => Settings => Networks => Add Network: <br /><br />' +
                            'Network Name: '+chainName+'<br/>' +
                            'New RPC URL: '+rpcUrl+'<br/>' +
                            'ChainID: 1287<br/>' +
                            'Symbol: '+currencySymbol+'<br/>' +
                            'Block Explorer URL: N/A<br /><br/>' +
                            'More information on the setup, including how to receive test DEV <a href="https://docs.moonbeam.network/getting-started/testnet/connect/" target="_blank">here</a>.';

                    }else if(chain_id == 'a4ec'){

                        chainName = 'CELO';
                        rpcUrl = 'https://forno.celo.org/';
                        currencyName = 'CELO';
                        currencySymbol = 'CELO';
                        currencyDecimals = 18;
                        blockExplorerUrl = 'https://explorer.celo.org/';

                        desc =  'You are not connected to '+chainName+'.<br/><br/>' +
                            'Please use the following setup in the CELO Desktop Wallet => Settings => Networks => Add Network: <br /><br />' +
                            '*** Please disable Metamask when using the CELO Desktop Wallet. You can turn it back on at any time but do not run both at the same time. ***<br/><br/>' +
                            'Network Name: '+chainName+'<br/>' +
                            'New RPC URL: '+rpcUrl+'<br/>' +
                            'ChainID: 42220<br/>' +
                            'Symbol: '+currencySymbol+'<br/>' +
                            'Block Explorer URL: '+blockExplorerUrl+'<br /><br/>' +
                            'Install the CELO Desktop Wallet from here <a href="https://chrome.google.com/webstore/detail/celo-desktop-wallet/kkilomkmpmkbdnfelcpgckmpcaemjcdh" target="_blank">here</a>.';

                    }else if(chain_id == 'a86a'){

                        chainName = 'Avalanche';
                        rpcUrl = 'https://api.avax.network/ext/bc/C/rpc';
                        currencyName = 'AVAX';
                        currencySymbol = 'AVAX';
                        currencyDecimals = 18;
                        blockExplorerUrl = 'https://cchain.explorer.avax.network/';

                        desc =  'You are not connected to '+chainName+'.<br/><br/>' +
                            'Please use the following setup in Metamask => Settings => Networks => Add Network: <br /><br />' +
                            'Network Name: '+chainName+'<br/>' +
                            'New RPC URL: '+rpcUrl+'<br/>' +
                            'ChainID: 43114<br/>' +
                            'Symbol: '+currencySymbol+'<br/>' +
                            'Block Explorer URL: '+blockExplorerUrl+'<br /><br/>';

                    }else if(chain_id == '4d'){

                        chainName = 'xDAI/POA (Sokol) TESTNET';
                        rpcUrl = 'https://sokol.poa.network';
                        currencyName = 'SPOA';
                        currencySymbol = 'SPOA';
                        currencyDecimals = 18;
                        blockExplorerUrl = 'https://blockscout.com/poa/sokol';

                        desc =  'You are not connected to the '+chainName+'.<br/><br/>' +
                            'Please use the following setup in Metamask => Settings => Networks => Add Network: <br /><br />' +
                            'Network Name: '+chainName+'<br/>' +
                            'New RPC URL: '+rpcUrl+'<br/>' +
                            'ChainID: 77<br/>' +
                            'Symbol: '+currencySymbol+'<br/>' +
                            'Block Explorer URL: '+blockExplorerUrl+'<br /><br/>' +
                            'More information on the setup, including how to receive test SPOA <a href="https://www.poa.network/for-developers/getting-tokens-for-tests/sokol-testnet-faucet" target="_blank">here</a>.';

                    }else if(chain_id == '64'){

                        chainName = 'xDAI';
                        rpcUrl = 'https://xdai1-rpc.unifty.cloud/';
                        currencyName = 'xDai';
                        currencySymbol = 'xDai';
                        currencyDecimals = 18;
                        blockExplorerUrl = 'https://blockscout.com/poa/xdai';

                        desc =  'You are not connected to '+chainName+'<br/><br/>' +
                            'Please use the following setup in Metamask => Settings => Networks => Add Network: <br /><br />' +
                            'Network Name: '+chainName+'<br/>' +
                            'New RPC URL: <input type="text" class="w-100" value="'+rpcUrl+'"/><br/>' +
                            'ChainID: 100<br/>' +
                            'Symbol: '+currencySymbol+'<br/>' +
                            'Block Explorer URL: '+blockExplorerUrl+'<br /><br/>' +
                            'More information on the setup <a href="https://www.xdaichain.com/for-users/wallets/metamask/metamask-setup" target="_blank">here</a>.';

                    }else if(chain_id == '89'){

                        chainName = 'Polygon (Matic)';
                        rpcUrl = 'https://rpc-mainnet.maticvigil.com/';
                        currencyName = 'MATIC';
                        currencySymbol = 'MATIC';
                        currencyDecimals = 18;
                        blockExplorerUrl = 'https://explorer.matic.network';

                        desc =  'You are not connected to '+chainName+'.<br/><br/>' +
                            'Please use the following setup in Metamask => Settings => Networks => Add Network: <br /><br />' +
                            'Network Name: '+chainName+'<br/>' +
                            'New RPC URL: '+rpcUrl+'<br/>' +
                            'ChainID: 137<br/>' +
                            'Symbol: '+currencySymbol+'<br/>' +
                            'Block Explorer URL: '+blockExplorerUrl+'<br /><br/>' +
                            'More information on the setup <a href="https://docs.matic.network/docs/develop/metamask/config-matic/" target="_blank">here</a>.';
                  
                  }else if(chain_id == '1666600000'){

                            chainName = 'Harmony (One)';
                            rpcUrl = 'https://api.harmony.one';
                            currencyName = 'ONE';
                            currencySymbol = 'ONE';
                            currencyDecimals = 18;
                            blockExplorerUrl = 'https://explorer.harmony.one/#/';
    
                            desc =  'You are not connected to '+chainName+'.<br/><br/>' +
                                'Please use the following setup in Metamask => Settings => Networks => Add Network: <br /><br />' +
                                'Network Name: '+chainName+'<br/>' +
                                'New RPC URL: '+rpcUrl+'<br/>' +
                                'ChainID: 137<br/>' +
                                'Symbol: '+currencySymbol+'<br/>' +
                                'Block Explorer URL: '+blockExplorerUrl+'<br /><br/>' +
                                'More information on the setup <a href="https://docs.harmony.one/home/network/wallets" target="_blank">here</a>.';
                    }

                    desc += '<br /><br /><button class="btn btn-primary" onclick="location.reload()">Reload</button>';

                    try {
                        ethereum
                            .request({
                                method: 'wallet_addEthereumChain',
                                params: [
                                    {
                                        "chainId": "0x" + chain_id,
                                        "chainName": chainName + '  ',
                                        "rpcUrls": [rpcUrl],
                                        "nativeCurrency": {
                                            "name": currencyName,
                                            "symbol": currencySymbol,
                                            "decimals": currencyDecimals
                                        },
                                        "blockExplorerUrls": [blockExplorerUrl]
                                    }
                                ],
                            }).then(function () {
                                location.reload();
                            })
                            .catch(function (error) {

                                $('#alertModal').find('.modal-dialog').addClass('modal-lg')
                                _alert(desc);

                            });

                    }catch(e){

                        $('#alertModal').find('.modal-dialog').addClass('modal-lg')
                        _alert(desc);
                    }

                } else {

                    if(typeof ethereum.enable == 'function' && ethereum.enable){

                        await ethereum.enable();
                    }

                    run(true);
                }

            } catch (error) {
                console.log(error);
                _alert('You refused to use this dapp.');
            }

        }, 500);
    }
    // Legacy dapp browsers...
    else if (window.web3) {

        if(typeof  window.web3 == 'undefined' || !window.web3) {
            window.web3 = new Web3(web3.currentProvider);
        }

        if(await web3.eth.net.getId() != chain_id.toString(16)){

            let desc =  'You are not connected to ' + network;
            desc += '<br /><br /><button class="btn btn-primary" onclick="location.reload()">Try again and reload/button>';

            _alert(desc);
        }

        run(true);
    }
    // Non-dapp browsers...
    else {

        if(localStorage.getItem('onewalletLoaded') != 'true') {
            $('#onewallet').css('display', 'inline-block');
            runReadableOnly();
        }else{
            enableOnewallet();
        }
            /*$.getExtension('https://chrome.google.com/webstore/detail/harmony-one-wallet/fnnegphlobjdpkhecapkijjdkgcjhkib').done(function(){
              const harmonyExt = await new HarmonyExtension(window.onewallet);
                let chain = '0';
                switch(chain_id){
                    case '4':
                        chain = 'rinkeby';
                        break;
                    case '64':
                        chain = 'xdai';
                        break;
                    case '89':
                        chain = 'matic';
                        break;
                    case '38':
                        chain = 'bsc';
                        break;
                    case '1666600000':
                        chain = 'harmony';
                        break;
                }
                if(chain != '0') {
                    localStorage.setItem('useWallet', 'true');
                    const onewallet = new Onewallet('', chain);
                    window.web3 = new Web3(onewallet.provider);
                    run(true);
                }
                else{
                    _alert('Unsupported Network. You may still browser our dapp but not interact with the blockchain.');
                    runReadableOnly();
                }
            });*/
    }
});

function enableOnewallet(){

    $.getExtension('https://chrome.google.com/webstore/detail/harmony-one-wallet/fnnegphlobjdpkhecapkijjdkgcjhkib').done(async function(){
        const { HarmonyExtension } = require('@harmony-js/core');
        const harmonyExt = await new HarmonyExtension(window.onewallet);
        let chain = '0';
        let networkName = '';

        switch(chain_id){
            case '4':
                chain = 'rinkeby';
                networkName = 'Rinkeby';
                break;
            case '64':
                chain = 'https://xdai1-rpc.unifty.cloud';
                networkName = 'xDai';
                break;
            case '89':
                chain = 'matic';
                networkName = 'Polygon';
                break;
            case '38':
                chain = 'https://bsc-dataseed.binance.org/';
                networkName = 'Binance Smart Chain';
                break;
            case 'a86a':
                chain = 'https://api.avax.network/ext/bc/C/rpc';
                networkName = 'Avalanche';
                break;
            case '1666600000':
                chain = 'https://api.harmony.on';
                networkName = 'Harmony';
                break;
        }

        if(chain != '0') {

            const Onewallet = new Onewallet({
                buttonPosition: "bottom-right" // default: bottom-left
            });
            await onewallet.init({
                buildEnv: "production", // default: production
                enableLogging: true, // default: false
                network: {
                    host: chain, // default: https://api.harmony.on
                    chainId: chain_id, // default: 1666600000
                    networkName: networkName // default: Harmony
                },
                showOnewalletButton: true // default: true
            });

            $('#torus').css('display', 'none');
            localStorage.setItem('torusLoaded', 'true'); 
            await onewallet.login(); // await onewallet.enable()
            window.web3 = new Web3(onewallet.provider);
            window.onewallet = onewallet;
            const isOneWallet = window.onewallet && window.onewallet.isOneWallet;
            const onewallet = window.onewallet;
            const getAccount = await this.onewallet.getAccount();
            await this.connectToOneWallet(this.onewallet)
            // await this.onewallet.getAccount()
                const getAccount = await this.onewallet.getAccount();
                console.log("slkdfjds")
                console.log(getAccount)
        
                this.address = getAccount.address;
                this.isAuthorized = true;
            run(true);

        }
        else{

            runReadableOnly();
        }
    });
}

function runReadableOnly(){

    if(chain_id == '89' || chain_id == '38' || chain_id == '64' || chain_id == '4' || chain_id == '1' || chain_id == 'a4ec' || chain_id == 'a86a' || chain_id == '1666600000') {

        let rpcUrl = '';

        switch (chain_id) {
            case 'a86a':
                rpcUrl = 'https://api.avax.network/ext/bc/C/rpc';
                break;
            case 'a4ec':
                rpcUrl = 'https://forno.celo.org/';
                break;
            case '89':
                rpcUrl = 'https://rpc-mainnet.maticvigil.com/';
                break;
            case '38':
                rpcUrl = 'https://bsc-dataseed.binance.org/';
                break;
            case '64':
                rpcUrl = 'https://xdai1-rpc.unifty.cloud/';
                break;
            case '1666600000':
                rpcUrl = 'https://api.harmony.one';
                break;
            case '4':
                rpcUrl = 'https://rinkeby.infura.io/v3/fb5477e6dc7145b8a89f4296d78c500a';
                break;
            default:
                rpcUrl = 'https://mainnet.infura.io/v3/ba2d61d52e4246fd8d58a64e2f754d48';
        }

        window.web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));

        run(true);

    }else{

        _alert('Please install a one wallet or metamask to use this dapp.');
    }

}
