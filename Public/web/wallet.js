// WALLET

let web3 = null;

async function onConnect(info) {
	console.log('onConnect', info);
	// info.chainId
	window.DaVinci.setNetwork(info.chainId);
	//loadWallet();
}

async function onDisconnect(info) {
	console.log('onDisconnect', info)
	if(window.DaVinci.wallet.isOneWallet){ window.DaVinci.wallet.forgetIdentity(); }
	console.log('Disconnected')
}

async function onAccounts(info) {
	console.log('onAccounts', info)
	window.DaVinci.accounts = info;
	window.DaVinci.myaccount = info[0];
	console.log('My account', window.DaVinci.myaccount);
	window.DaVinci.getBalance(window.DaVinci.myaccount);
}

async function onChain(chainId) {
	console.log('onChain', chainId)
	if(chainId==window.DaVinci.chainId) { console.log('Already on chain', chainId); return; }
	window.DaVinci.setNetwork(chainId);
	window.DaVinci.loadWallet();
	//requestAccount();
	//getAccounts();
}

async function onMessage(info) {
	console.log('onMessage', info)
}

class Wallet {
	MAINURL   = 'https://api.s0.t.hmny.io/';
	TESTURL   = 'https://api.s0.b.hmny.io/';
	TESTEXP   = 'https://explorer.testnet.harmony.one';
	MAINEXP   = 'https://explorer.harmony.one';
	provider  = null;
	wallet    = null;
	extension = null;
	chainId   = null;
	chainType = null;
	mainnet   = null;
	network   = null;
	neturl    = null;
	explorer  = null;
	_connected = false;

	async init() {
	    console.log('Wallet init...');
	    this.chainId   = config.CHAINID;
	    this.chainType = config.CHAINTYPE;
	    this.neturl    = config.NETURL;
	    this.network   = config.NETWORK;
	    this.mainnet   = config.NETWORK=='mainnet';
	    this.explorer  = this.mainnet?this.MAINEXP:this.TESTEXP;
	}

	async start(wallet) {
		if(wallet=='metamask'){
			if(window.ethereum && window.ethereum.isMetaMask){
		    	console.log('Metamask is present');
	    		web3 = new Web3(window.ethereum);
		    	this.wallet = window.ethereum;
		    	this.wallet.getAccount = async function() {
		    		let accts = await web3.eth.getAccounts();
		    		if(accts.length>0) { return {address:accts[0].toLowerCase()}; }
		    		else { return {address:null}; }
		    	}
		    	//window.ethereum.enable();
			 	this.setListeners();
				//web3 = new Web3(this.neturl);
				//web3.eth.getChainId().then(id => { console.log('ChainId', id) })
				//console.log('WEB3', web3);
				//console.log('VER', web3.version)

			 	//this.setNetwork();
			 	//this.loadWallet();
			 	//this.provider = new ethers.providers.Web3Provider(window.ethereum)
			 	//this.wallet.provider  = new Harmony.Modules.HttpProvider(window.ethereum);
			 	//console.log('Provider', this.wallet.provider)
			 	//this.wallet.messenger = new Harmony.Modules.Messenger(this.wallet.provider, 'hmy', 1666600000);
			 	//console.log('Messenger', this.wallet.messenger)
			 	//this.wallet.messenger.setNetworkId = function(x){ console.log(x) };
		    	//this.extension = {}; //await new Harmony.HarmonyExtension(this.wallet);
			 	//this.extension.wallet = this.wallet;
			} else {
		    	console.log('Metamask not available');
		    }
		} else {
		    if (window.onewallet && window.onewallet.isOneWallet) {
		    	console.log('Harmony wallet is present')
			 	this.wallet = window.onewallet;
			 	this.wallet.isConnected = function(){ return this._connected; }
		    	this.extension = await new HarmonyJs.HarmonyExtension(this.wallet);
	        	//this.extension.provider  = new HarmonyNetwork.Provider(this.network).provider;
	        	//this.extension.messenger = new HarmonyNetwork.Messenger(this.extension.provider, HarmonyUtils.ChainType.Harmony, chain);
	        	this.extension.provider.url           = this.neturl;
	        	this.extension.messenger.chainId      = this.chainId;
	        	this.extension.messenger.Network_ID   = this.network;
	        	this.extension.setShardID(0);
	        	this.extension.wallet.messenger       = this.extension.messenger;
	        	this.extension.blockchain.messenger   = this.extension.messenger;
	        	this.extension.transactions.messenger = this.extension.messenger;
	        	this.extension.contracts.wallet       = this.extension.wallet;
			 	//this.setListeners();
			 	//this.setNetwork();
			 	//this.loadWallet();
			} else {
		    	console.log('Harmony Wallet not available');
		    }
		}
	}

	async setListeners() {
		this.wallet.on('connect', onConnect);
		this.wallet.on('disconnect', onDisconnect);
		this.wallet.on('accountsChanged', onAccounts);
		this.wallet.on('chainChanged', onChain);
		this.wallet.on('message', onMessage);
		console.log('Listeners set');
	}

	async setNetwork(chainId) {
		if(!chainId){ chainId = this.wallet.chainId; }
		this.mainnet  = (chainId == 1);
		this.network  = this.mainnet ? 'mainnet' : 'testnet';
		this.neturl   = this.mainnet ? this.MAINURL : this.TESTURL;
		this.explorer = this.mainnet ? this.MAINEXP : this.TESTEXP;
		this.chainId  = chainId;
		console.log('Network', this.network, this.chainId);
	}

	async loadWallet() {
		console.log('Loading wallet...', this.network);
		//web3 = new Web3(this.neturl);
		//web3.eth.getChainId().then(id => { console.log('ChainId', id) })
		//console.log('WEB3', web3);
		//console.log('VER', web3.version)

	    if (this.wallet) {
		 	if(this.wallet.isConnected()) { 
		 		console.log('Already connected to', this.wallet.chainId==0x1?'MAINNET':'TESTNET', this.wallet.chainId); 
				getAccounts();
				//getAddress();
				//getBalance();
		 	} else {
		 		connect();
		 		console.log('Connecting...')
		 		if(this.wallet.isMetaMask){
					this.wallet.enable().then((err, accts) => { 
						console.log('Enabled', err, accts)
						getAccounts();
						//getAddress();
						//getBalance();
						showAccountLabel();
					});
		 		} else {
		 			let act = await this.wallet.getAccount();
		 			if(act){ 
		 				this.wallet._connected = true; 
		 				this.address = act.address;
		 				//document.cookie = 'user='+addressToHex(act.address).toLowerCase();
		 				setCookie('user', addressToHex(act.address).toLowerCase());
						showAccountLabel();
		 			}
			 		console.log('Account:', act);
		 		}
			}
	    } else {
	    	console.log('Wallet not available')
	    }
	}


/*
	// Connect
	const walletAddress = await window.ethereum.request({
      method: "eth_requestAccounts",
      params: [
        {
          eth_accounts: {}
        }
      ]
    });

	// New user
    if (!isReturningUser) {
    // Runs only they are brand new, or have hit the disconnect button
      await window.ethereum.request({
        method: "wallet_requestPermissions",
        params: [
          {
            eth_accounts: {}
          }
        ]
      });
    }
*/

	// Wallet Events
	async connect(wallet) {
	    if (this.wallet) {
	 		console.log('Connecting...')
	 		//if(this.wallet.isMetaMask){
	 		if(wallet=='metamask'){
	 			try {
					//let accts = await this.wallet.enable();
					//console.log('Enabled', accts)
					//this.address = accts[0];
					this.address = await this.getAccounts();
					this.addrexx = this.address.toLowerCase(); // hex
		 			//console.log('Account:', this.address);
	 				setCookie('user', this.addrexx);
	 				setCookie('wallet', 'metamask');
					showAccountLabel();
				} catch(ex) {
					console.error('Metamask error', ex);
	 			}
	 		} else {
	 			let act = await this.wallet.getAccount();
	 			if(act){ 
	 				this.wallet._connected = true; 
	 				this.address = act.address; // one
	 				this.addrexx = addressToHex(act.address).toLowerCase(); // hex
	 				setCookie('user', this.addrexx);
	 				setCookie('wallet', 'harmony');
					showAccountLabel();
	 			}
		 		console.log('Account:', act);
	 		}
	    } else {
	    	console.log('Wallet not available')
	    }
	}

	async reconnect() {
		try {
			const permissions = await this.wallet.request({
				method: 'wallet_requestPermissions',
	  			params: [{
	    			eth_accounts: {},
	  			}]
			});
		} catch(ex) {
			console.error('Error:', ex.message);
		}
	}

	async disconnect() {
	    if (this.wallet) {
	 		console.log('Disconnecting...')
	 		if(this.wallet.isMetaMask){
	 			console.log('Nothing to do');
	 			this.address = ''; 
	 		} else {
	 			let ok = await this.wallet.forgetIdentity();
	 			if(ok){ this.wallet._connected = false; this.address = ''; }
	 		}
			setCookie('wallet', '');
		 	console.log('Disconnected');
	    } else {
	    	console.log('Wallet not available')
	    }
		showConnectLabel();
	}

	// Methods
	async getAccounts() {
		try {
			let accts = await this.wallet.request({method: 'eth_requestAccounts'});
			this.accounts = accts;
			console.log('Accounts', accts)
			return accts[0];
		} catch(ex) {
			console.log('Error: User rejected'); 
			console.error('Error', err);
			//$('wallet').innerHTML = 'User rejected connection'; 
		}
	}

	async getAddress() {
		if(this.isMetaMask){
			this.myaccount = this.wallet.selectedAddress;
			console.log('Account', this.myaccount);
			//$('user-address').innerHTML = 'Address: '+this.myaccount.substr(0,10); 
			//callback(this.myaccount);
		} else {
			console.log('Get accounts...');
			this.wallet.request({method: 'eth_requestAccounts'}).then(res=>{
				console.log('Account', res);
				this.myaccount = res[0];
				//$('user-address').innerHTML = 'Address: '+this.myaccount.substr(0,10); 
				//callback(this.myaccount)
			}).catch(err => { 
				console.log('Error: Wallet not connected'); 
				console.error('Error', err) 
				//$('user-address').innerHTML = 'Wallet not connected'; 
				//$('user-balance').innerHTML = 'Balance: 0.0000 BNB'; 
				//callback(null);
			});
		}
	}

	async getBalance(adr) {
		console.log('Get balance...', adr);
		let res, bal;
		if(this.wallet.isMetaMask){
			try {
				res = await web3.eth.getBalance(adr);
				console.log('Balance', adr.substr(0,8), res);
				//bal = (parseInt(res)/10**18).toLocaleString('en-US', { useGrouping: true, minimumFractionDigits: 4, maximumFractionDigits: 4});
				bal = (parseInt(res)/10**18);
				//$('user-address').innerHTML = 'Address: '+adr.substr(0,10); 
		    	//$('user-balance').innerHTML = 'Balance: '+bal+' BNB';
			} catch(ex) {
				console.log('Metamask error', ex)
				bal = 0.0;
			}
		} else {
			try {
				res = await Harmony.blockchain.getBalance({address:adr});
				console.log('Balance', adr.substr(0,8), res.result);
				//bal = (parseInt(res.result)/10**18).toLocaleString('en-US', { useGrouping: true, minimumFractionDigits: 4, maximumFractionDigits: 4});
				bal = (parseInt(res.result)/10**18);
				//$('user-address').innerHTML = 'Address: '+adr.substr(0,10); 
		    	//$('user-balance').innerHTML = 'Balance: '+bal+' BNB';
			} catch(ex) {
				console.log('Harmony error', ex)
				bal = 0.0;
			}
		}
		return bal;
	}

	async getGasPrice() {
	    let gas = await web3.eth.getGasPrice();
	    console.log('Average gas price:', gas);
	    return gas;
	}

	async waitForReceipt(hash, n=0) {
		try {
			let receipt = await web3.eth.getTransactionReceipt(hash);
			console.log('Receipt', receipt);
		    if (receipt !== null) {
		        return receipt.transactionHash;
		    } else {
		    	//if(n>5){ console.log('Confirmation timeout'); }
		        //else { setTimeout(function(){ this.waitForReceipt(hash, callback, n++); }, 2000); }
		        return null;
		    }
		} catch (ex) {
			console.error('Error in receipt', ex);
		}
		return null;
	}


	async contract(abi, address) {
		let ctr;
		//console.log('This', this);
		if(this.wallet.isMetaMask){
			//window.ethereum.messenger.currentShard = 0;
			console.log('Metamask contract...');
		    //let web3 = new Web3(window.web3.currentProvider);
		    if(address){
	    	    //let web3 = new Web3(window.ethereum);
				ctr = await new web3.eth.Contract(abi, address);
				//ctr.send = web3.eth.sendTransaction;
				//ctr.send = async function(params){
				//	console.log('-Params', params)
				//	let res = await web3.eth.sendTransaction(params);
				//	//let res = await this.wallet.request({ method: 'eth_sendTransaction', params })
				//	console.log('-Res', res);
				//	//let txr = {transaction:{txStatus:'CONFIRMED', receipt:{transactionHash:res}}};
				//	//return txr;
				//	return res;
				//}
				//ctr.methods = {};
				//let keys = Object.keys(ctr);
				//for (var i = 0; i < keys.length; i++) {
				//	ctr.methods[keys[i]] = ctr[keys[i]]
				//}
				//ctr = new this.wallet.provider.Contract(abi, address, {}, window.ethereum);
				//ctr = window.web3.currentProvider.Contract(abi, address, {}, window.ethereum);
		    } else {
	    	    //let web3 = new Web3(window.ethereum);
				ctr = await new web3.eth.Contract(abi);
				//ctr.send = web3.eth.sendTransaction;
				//ctr.send = async function(params){
				//	console.log('-Params', params)
				//	//let res = await this.wallet.request({ method: 'eth_sendTransaction', params })
				//	let res = await web3.eth.sendTransaction(params);
				//	console.log('-Res', res);
				//	//let receipt = await this.waitForReceipt(res);
				//	//return receipt;
				//	//let txr = {transaction:{txStatus:'CONFIRMED', receipt:{transactionHash:res}}};
				//	//return txr;
				//	return res;
				//}

				//ctr.methods = {};
				//let keys = Object.keys(ctr);
				//for (var i = 0; i < keys.length; i++) {
				//	ctr.methods[keys[i]] = ctr[keys[i]]
				//}
				//ctr = new this.wallet.provider.Contract(abi, '0x', {}, window.ethereum);
		    }
			console.log('Metamask contract', ctr);
			return ctr;
		} else {
			console.log('Harmony contract...');
		    if(address){
				ctr = Harmony.contracts.createContract(abi, address);
		    } else {
				ctr = Harmony.contracts.createContract(abi);
			}
			console.log('Harmony contract', ctr);
			return ctr;
		}
	}
}

window.Davinci = new Wallet();

// END