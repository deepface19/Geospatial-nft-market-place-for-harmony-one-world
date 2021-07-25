// DAVINCI

const FlexSlider = {
	num_items: document.querySelectorAll(".slide").length,
	current: 1,

	init: function() {
		// set CSS order of each item initially
		document.querySelectorAll(".slide").forEach(function(element, index) {
			element.style.order = index+1;
		});

		this.addEvents();
	},

	addEvents: function() {
		var that = this;

		// click on move item button
		//document.querySelector("#move-button").addEventListener('click', () => {
		//	this.goNext();
		//});

		// after each item slides in, slider container fires transitionend event
		document.querySelector("#slider-box").addEventListener('transitionend', () => {
			this.changeOrder();
		});
	},

	changeOrder: function() {
		// change current position
		if(this.current == this.num_items)
			this.current = 1;
		else 
			this.current++;

		let order = 1;

		// change order from current position till last
		for(let i=this.current; i<=this.num_items; i++) {
			document.querySelector(".slide[data-position='" + i + "']").style.order = order;
			order++;
		}

		// change order from first position till current
		for(let i=1; i<this.current; i++) {
			document.querySelector(".slide[data-position='" + i + "']").style.order = order;
			order++;
		}

		// translate back to 0 from -100%
		// we don't need transitionend to fire for this translation, so remove transition CSS
		document.querySelector("#slider-box").classList.remove('slider-transition');
		document.querySelector("#slider-box").style.transform = 'translateX(0)';
	},

	goNext: function() {
		// translate from 0 to -100% 
		// we need transitionend to fire for this translation, so add transition CSS
		document.querySelector("#slider-box").classList.add('slider-transition');
		document.querySelector("#slider-box").style.transform = 'translateX(-100%)';
		setTimeout(FlexSlider.goNext, 6000);
	}
};

FlexSlider.init();
setTimeout(FlexSlider.goNext, 8000);
//setTimeout(FlexSlider.goNext, 2000);
//setTimeout(FlexSlider.goNext, 4000);


async function enableMetamask() {
	// mainnet = 0x63564c40
	// testnet = 0x6357d2e0 
	let shardNum  = 0;
	let chainId   = config.CHAINID==1?1666600000:1666700000;
	let chainName = config.CHAINID==1?'Harmony Mainnet':'Harmony Testnet';
	let chainURL  = config.NETURL;
	let chainExp  = config.EXPLORER;

	try {
		let web3 = new Web3(window.ethereum);
		let list = await web3.eth.getAccounts();
		if(!list || list.length<1){ alert('Wallet not connected'); return; }
		let address = list[0];
	    let params  = [
		    {
		        chainId: '0x' + Number(chainId + shardNum).toString(16),
		        chainName: chainName,
		        nativeCurrency: { name: 'ONE', symbol: 'ONE', decimals: 18 },
		        rpcUrls: [chainURL],
		        blockExplorerUrls: [chainExp],
		    },
		    address,
		];
	    let result = await window.ethereum.request({ method: 'wallet_addEthereumChain', params: params });
	    console.log('Metamask result', result);
	} catch(ex) {
	    console.log('Metamask error', ex);
	    alert('Error enabling Harmony Network on Metamask: '+ex.message);
	}
}

async function main() {
	startDavinci();
	//extra
}

window.onload = main

// end