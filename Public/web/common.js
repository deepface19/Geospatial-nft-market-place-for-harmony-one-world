console.log('geospatial-nft-market-place 1.0');

//const ROOT  = window.location.hostname=='localhost'?'':'/geospatial-nft-market-place';
let Harmony = null;

function $(id){ return document.getElementById(id); }

function uuid(){ return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)); }

function hex(num) { return '0x'+(num).toString(16); }

function setLocalTimes() {
	let localTimes = document.getElementsByClassName('local-time');
	for(var i=0; i<localTimes.length; i++){ 
		localTimes[i].innerHTML = (new Date(parseInt(localTimes[i].dataset.time))).toLocaleString() 
	}
}

function randomAddress() {
	let buf = crypto.getRandomValues(new Uint8Array(20));
	let adr = '0x'+Array.from(buf).map(x=>{return x.toString(16).padStart(2,'0')}).join('');
	return adr;
}

function validNumber(text='') {
    let number, value;
    //let sep = Intl.NumberFormat(navigator.language).format(1000).substr(1,1) || ',';
    let sep = ',';
    if(sep==','){ value = text.replace(/\,/g,''); }
    else if(sep=='.'){ value = text.replace(/\./g,'').replace(',','.'); }
    try { number = parseFloat(value) || 0.0; } catch(ex){ console.log(ex); number = 0.0; }
    return number;
}

function intOrDec(amount=0, decs=2) {
	if(parseInt(amount)==amount) { return parseInt(amount); }
	return parseFloat(amount).toFixed(decs);
}

function money(amount, decs=2) {
	return parseFloat(amount).toFixed(decs);
}

function addressToOne(address) {
    if(address.startsWith('0x')){
        return Harmony.crypto.getAddress(address).bech32.toLowerCase();
    }
    return address.toLowerCase();
}

function addressToHex(address) {
    if(address.startsWith('one')){
        return Harmony.crypto.getAddress(address).checksum.toLowerCase();
    }
    return address.toLowerCase();
}

function setCookie(name, value, days) {
	var expires = "";
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		expires = "; expires=" + date.toUTCString();
	}
	document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
	let value = null;
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') { c = c.substring(1, c.length); }
		if (c.indexOf(nameEQ) == 0) { value = c.substring(nameEQ.length, c.length); break; }
	}
	return value;
}

function copyToClipboard(text) {
	navigator.clipboard.writeText(text).then(function() {
    	console.log('Copying to clipboard was successful!');
  	}, function(err) {
    	console.error('Could not copy text:', err);
  	});
}

function copyToClipboardOLD(evt) {
    var elm = evt.target;
    if(document.body.createTextRange) { /* for Internet Explorer */
	    var range = document.body.createTextRange();
	    range.moveToElementText(elm);
	    range.select();
    	document.execCommand("copy");
    } else if(window.getSelection) { /* other browsers */
	    var selection = window.getSelection();
	    var range = document.createRange();
	    range.selectNodeContents(elm);
	    selection.removeAllRanges();
	    selection.addRange(range);
    	document.execCommand("copy");
    }
}

function onAccount() {
	window.event.stopPropagation();
	if(typeof Davinci == 'undefined'){
		alert('Wallet not available');
		return;
	}

	let walletCookie = getCookie('wallet');
	if(walletCookie && Davinci.wallet && Davinci.wallet.isConnected()){
		showAccountPopup()
	} else {
		//Davinci.connect();
		//onWallet();
		showWalletPopup();
	}
}

function onSignout() {
	hideAccountPopup();
	Davinci.disconnect();
	showConnectLabel();
	//showAccountLabel();
	window.location.href = '/';
}

async function onWallet(wallet) {
	console.log('Wallet', wallet);
	if(Davinci.wallet && Davinci.wallet.isConnected()){
		console.log('Disconnecting');
		await Davinci.reconnect();
	} else {
		console.log('Connecting');
		await Davinci.start(wallet);
		await Davinci.connect(wallet);
	}
}

function showWalletPopup(){
	$('popup-wallets').style.display='block';
	$('popup-wallets').style.visibility='visible';
	$('popup-wallets').onclick = function(event){
		//console.log('clicked')
    	//event.preventDefault();
    	//event.stopPropagation();
    	//return true;
	};
	document.addEventListener('click', hideWalletPopup, true);
}

function hideWalletPopup(){
	console.log('Click');
	$('popup-wallets').style.display='none';
	document.removeEventListener('click', hideWalletPopup, true)
}

function showAccountLabel(){
	$('menu-account').innerHTML = 'Account'
	$('account-address').innerHTML = Davinci.address.substr(0,10);
}

function showConnectLabel(){
	$('menu-account').innerHTML = 'Connect'
	$('account-address').innerHTML = '';
}


function showAccountPopup(){
	//let tmp = $('template-account');
	//let pop = tmp.content.cloneNode(true);
	//document.body.appendChild(pop);
	$('popup-account').style.display='block';
	$('popup-account').style.visibility='visible';
	$('popup-account').onclick = function(event){
    	//event.stopPropagation();
	};
	document.addEventListener('click', hideAccountPopup, true);
}

function hideAccountPopup(){
	$('popup-account').style.display='none';
	document.removeEventListener('click', hideAccountPopup, true)
}

function onGovern() {
	window.event.stopPropagation();
	showGovernPopup()
}

function showGovernPopup(){
	$('popup-govern').style.display='block';
	$('popup-govern').style.visibility='visible';
	$('popup-govern').onclick = function(event){
    	//event.stopPropagation();
	};
	document.addEventListener('click', hideGovernPopup, true);
}

function hideGovernPopup(){
	$('popup-govern').style.display='none';
	document.removeEventListener('click', hideGovernPopup, true)
}

function onLike(address) {
	console.log('Like', address, Davinci.address);
	let img = window.event.target;
	if(img.dataset.like=='false'){ 
		img.src='/media/icon-liked.png';
		// DB like
	} else {
		img.src='/media/icon-likes.png';
		// DB unlike
	}
	img.dataset.like = img.dataset.like=='true'?'false':'true';
	fetch('/like/'+address);
}


function onFilter(evt) {
	console.log('Filters', evt);
	console.log('Pos', evt.pageX, evt.pageY);
	window.event.stopPropagation();
	showFiltersPopup(evt);
}

function showFiltersPopup(evt){
	$('popup-filters').style.display='block';
	$('popup-filters').style.visibility='visible';

	console.log('Tgt', evt.target.offsetLeft, evt.target.offsetTop);
	//let top = evt.target.offsetTop+'px';
	//let lft = evt.target.offsetLeft+'px';
	//let top = evt.pageY+'px';
	//let lft = evt.pageX+'px';
	//let mouseX = evt.pageX;
	//let mouseY = evt.pageY;
	let mouseX = evt.target.offsetLeft;
	let mouseY = evt.target.offsetTop + evt.target.offsetHeight;

   	//var bodyTop = document.body.scrollTop;
   	var bodyTop = document.documentElement.scrollTop + document.body.scrollTop;
    var windowWidth = window.outerWidth;
    var windowHeight = window.outerHeight;
	console.log('mouse', mouseX, mouseY);
	console.log('bodytop', bodyTop);
	//console.log('window', windowWidth, windowHeight);

    var popupLeft   = mouseX;
    var popupTop    = mouseY - bodyTop;
    var popupWidth  = $('popup-filters').clientWidth;
    var popupHeight = $('popup-filters').clientHeight;
	console.log('popup pos',  popupTop, popupLeft);
	console.log('popup size', popupWidth, popupHeight);

    if(popupLeft+popupWidth > windowWidth) { popupLeft = mouseX-popupWidth+evt.target.clientWidth; }
    if(mouseY+popupHeight > windowHeight)  { popupTop  = mouseY-popupHeight-evt.target.clientHeight; }
    if(popupTop  < 0) { popupTop  = 0; }
    if(popupLeft < 0) { popupLeft = 0; }

    var x = popupLeft;
    var y = popupTop;
	console.log('X,Y', x, y);

	//alert(x+' '+y);
	//$('popup-filters').top=x+'px';
	//$('popup-filters').left=y+'px';
	$('popup-filters').style.left=x+'px';
	$('popup-filters').style.top=y+'px';
	$('popup-filters').onclick = function(event){
    	//event.stopPropagation();
	};
	document.addEventListener('click', hideFiltersPopup, true);
}

function hideFiltersPopup(){
	$('popup-filters').style.display='none';
	document.removeEventListener('click', hideFiltersPopup, true)
}

function onCategory(evt) {
	console.log('Categories', evt);
	console.log('Pos', evt.pageX, evt.pageY);
	window.event.stopPropagation();
	showCategoriesPopup(evt);
}

function showCategoriesPopup(evt){
	$('popup-categories').style.display='block';
	$('popup-categories').style.visibility='visible';

	console.log('Tgt', evt.target.offsetLeft, evt.target.offsetTop);
	//let top = evt.target.offsetTop+'px';
	//let lft = evt.target.offsetLeft+'px';
	//let top = evt.pageY+'px';
	//let lft = evt.pageX+'px';
	//let mouseX = evt.pageX;
	//let mouseY = evt.pageY;
	let mouseX = evt.target.offsetLeft;
	let mouseY = evt.target.offsetTop + evt.target.offsetHeight;

   	//var bodyTop = document.body.scrollTop;
   	var bodyTop = document.documentElement.scrollTop + document.body.scrollTop;
    var windowWidth = window.outerWidth;
    var windowHeight = window.outerHeight;
	console.log('mouse', mouseX, mouseY);
	console.log('bodytop', bodyTop);
	//console.log('window', windowWidth, windowHeight);

    var popupLeft   = mouseX;
    var popupTop    = mouseY - bodyTop;
    var popupWidth  = $('popup-categories').clientWidth;
    var popupHeight = $('popup-categories').clientHeight;
	console.log('popup pos',  popupTop, popupLeft);
	console.log('popup size', popupWidth, popupHeight);

    if(popupLeft+popupWidth > windowWidth) { popupLeft = mouseX-popupWidth+evt.target.clientWidth; }
    if(mouseY+popupHeight > windowHeight)  { popupTop  = mouseY-popupHeight-evt.target.clientHeight; }
    if(popupTop  < 0) { popupTop  = 0; }
    if(popupLeft < 0) { popupLeft = 0; }

    var x = popupLeft;
    var y = popupTop;
	console.log('X,Y', x, y);

	//alert(x+' '+y);
	//$('popup-categories').top=x+'px';
	//$('popup-categories').left=y+'px';
	$('popup-categories').style.left=x+'px';
	$('popup-categories').style.top=y+'px';
	$('popup-categories').onclick = function(event){
    	//event.stopPropagation();
	};
	document.addEventListener('click', hideCategoriesPopup, true);
}

function hideCategoriesPopup(){
	$('popup-categories').style.display='none';
	document.removeEventListener('click', hideCategoriesPopup, true)
}

function onSelectFilter(filter) {
	console.log('Filter', filter);
	let url = window.location.origin + window.location.pathname + '?filter='+filter;
	window.location.href = url;
}

function onBuyDirect(obj, item) {
	//window.event.stopPropagation();
	$('buy-title').innerHTML = item.name;
	$('buy-media').innerHTML = item.media;
	$('buy-address').innerHTML = item.address;
	$('buy-cover').src = '/uploads/thumbs/'+item.thumbnail;
	$('buy-price').innerHTML = parseInt(item.saleprice);
	$('buy-royalty').innerHTML = item.royalties;
	$('buy-status').innerHTML = 'One payment confirmation required';
	setBuyAction();
	showBuyDirectPopup();
}

function showBuyDirectPopup(){
	$('popup-buydirect').style.display = 'block';
	$('popup-buydirect').style.visibility = 'visible';
	$('popup-buydirect').onclick = function(event){
		console.log('click')
    	event.preventDefault();
    	event.stopPropagation();
    	return false;
	};
	document.addEventListener('click', hideBuyDirectPopup, false);
}

function hideBuyDirectPopup(){
	$('popup-buydirect').style.display = 'none';
	document.removeEventListener('click', hideBuyDirectPopup, false)
}

function enableBuyDirectPopupClick(){
	$('popup-buydirect').onclick = function(event){
		console.log('click')
    	//event.preventDefault();
    	//event.stopPropagation();
    	return true;
	};
	document.addEventListener('click', hideBuyDirectPopup, false);
}

function onResell(obj, item, order) {
	//window.event.stopPropagation();
	$('resell-title').innerHTML = item.name;
	$('resell-media').innerHTML = item.media;
	$('resell-address').innerHTML = item.address;
	$('resell-cover').src = '/uploads/thumbs/'+item.thumbnail;
	$('resell-price').innerHTML = parseInt(order.sellprice);
	$('resell-royalty').innerHTML = item.royalties;
	$('resell-status').innerHTML = 'One payment confirmation required';
	setResellAction();
	showResellPopup();
}

function showResellPopup(){
	$('popup-resell').style.display = 'block';
	$('popup-resell').style.visibility = 'visible';
	$('popup-resell').onclick = function(event){
		console.log('click')
    	event.preventDefault();
    	event.stopPropagation();
    	return false;
	};
	document.addEventListener('click', hideResellPopup, false);
}

function hideResellPopup(){
	$('popup-resell').style.display = 'none';
	document.removeEventListener('click', hideResellPopup, false)
}

function enableResellPopupClick(){
	$('popup-resell').onclick = function(event){
		console.log('click')
    	//event.preventDefault();
    	//event.stopPropagation();
    	return true;
	};
	document.addEventListener('click', hideResellPopup, false);
}

function onPlaceBid(obj, item) {
	//window.event.stopPropagation();
	let lastbid = item.lastbid || 0;
	$('bid-title').innerHTML    = item.name;
	$('bid-media').innerHTML    = item.media;
	$('bid-address').innerHTML  = item.address;
	$('bid-cover').src = '/uploads/thumbs/'+item.thumbnail;
	$('bid-price').innerHTML    = parseInt(lastbid);
	$('bid-reserve').innerHTML  = lastbid < item.reserve ? 'Reserve price not met' : '';
	$('bid-status').innerHTML   = 'One payment confirmation required';
	//$('bid-amount').placeholder = 'Place your bid';
	if(lastbid==0){
		$('bid-amount').value   = intOrDec(item.saleprice);
	} else {
		$('bid-amount').value   = parseInt(lastbid * 1.10);
	}
	$('bid-enddate').innerHTML  = new Date(item.enddate).toLocaleString();
	setBidAction();
	showPlaceBidPopup();
}

function showPlaceBidPopup(){
	$('popup-placebid').style.display = 'block';
	$('popup-placebid').style.visibility = 'visible';
	$('popup-placebid').onclick = function(event){
		console.log('click')
    	event.preventDefault();
    	event.stopPropagation();
    	return false;
	};
	document.addEventListener('click', hidePlaceBidPopup, false);
}

function hidePlaceBidPopup(){
	$('popup-placebid').style.display = 'none';
	document.removeEventListener('click', hidePlaceBidPopup, false)
}

function enablePlaceBidPopupClick(){
	$('popup-placebid').onclick = function(event){
		console.log('click')
    	//event.preventDefault();
    	//event.stopPropagation();
    	return true;
	};
	document.addEventListener('click', hidePlaceBidPopup, false);
}

async function onImport(evt) {
	console.log('Import token');
	window.event.stopPropagation();
	showImportPopup();
}

async function onImportAction(evt) {
	console.log('Import action');
	window.event.stopPropagation();
	let contract = $('import-contract').value.toLowerCase();
	let tokenId  = $('import-token').value.toLowerCase();
	let imageUrl = $('import-url').value;
	importToken(contract, tokenId, imageUrl);
}

function showImportPopup(){
	console.log('Show Import');
	$('popup-import').style.display = 'block';
	$('popup-import').style.visibility = 'visible';
	$('popup-import').onclick = function(event){
		console.log('click')
    	event.preventDefault();
    	event.stopPropagation();
    	return false;
	};
	document.addEventListener('click', hideImportPopup, false);
}

function hideImportPopup(){
	console.log('Hide Import');
	$('popup-import').style.display = 'none';
	document.removeEventListener('click', hideImportPopup, false)
}

function showSenderPopup(){
	console.log('Show Sender');
	window.event.stopPropagation();
	$('popup-sender').style.display = 'block';
	$('popup-sender').style.visibility = 'visible';
	$('popup-sender').onclick = function(event){
		console.log('click')
    	event.preventDefault();
    	event.stopPropagation();
    	return false;
	};
	document.addEventListener('click', hideSenderPopup, false);
}

function hideSenderPopup(){
	console.log('Hide sender');
	$('popup-sender').style.display = 'none';
	document.removeEventListener('click', hideSenderPopup, false)
}

function showReportedPopup(){
	console.log('Reported Popup');
	window.event.stopPropagation();
	$('popup-reported').style.display = 'block';
	$('popup-reported').style.visibility = 'visible';
	$('popup-reported').onclick = function(event){
		console.log('click')
    	event.preventDefault();
    	event.stopPropagation();
    	return false;
	};
	document.addEventListener('click', hideReportedPopup, false);
}

function hideReportedPopup(){
	console.log('Hide reported');
	$('popup-reported').style.display = 'none';
	document.removeEventListener('click', hideReportedPopup, false)
}

function onReported(adr){
	$('reported-artwork').value = session.item.address;
	showReportedPopup();
}

async function onReportedAction(adr){
	setReportedStatus('Reporting token, please wait...');
	setReportedAction('WAIT', true);
	try {
		var data = new FormData();
		data.append('artwork', session.item.address);
		data.append('reason',  $('reported-reason').value);
		data.append('url',     $('reported-url').value);
		data.append('contact', $('reported-contact').value);
		let res = await fetch('/api/reported', {method:'post', body: data});
		let jsn = await res.json();
		//console.log('Res', res);
		console.log('Res', jsn);
		if(jsn.error) { 
			console.log('Reported error:', jsn.error); 
			setReportedStatus(jsn.error, true);
			setReportedAction();
			return;
		}
	} catch(ex){
		console.log('Reported error:', ex); 
		setReportedStatus(ex.message, true);
		setReportedAction();
		return;
	}
	setReportedStatus('Token has been reported');
	setReportedAction('SUCCESS', true);
}

function setReportedStatus(txt, warn=false){
	console.log(txt);
	if(warn){ txt = '<warn>'+txt+'</warn>'; }
	$('reported-status').innerHTML = txt;
}

function setReportedAction(txt='REPORT', wait=false){
	$('reported-button').innerHTML = txt;
	$('reported-button').disabled = wait;
}

function setBuyStatus(txt, warn=false){
	console.log(txt);
	if(warn){ txt = '<warn>'+txt+'</warn>'; }
	$('buy-status').innerHTML = txt;
}

function setBuyAction(txt='CONFIRM', wait=false){
	$('buy-action').innerHTML = txt;
	$('buy-action').disabled = wait;
}

function setResellStatus(txt, warn=false){
	console.log(txt);
	if(warn){ txt = '<warn>'+txt+'</warn>'; }
	$('resell-status').innerHTML = txt;
}

function setResellAction(txt='CONFIRM', wait=false){
	$('resell-action').innerHTML = txt;
	$('resell-action').disabled = wait;
}

function setBidStatus(txt, warn=false){
	console.log(txt);
	if(warn){ txt = '<warn>'+txt+'</warn>'; }
	$('bid-status').innerHTML = txt;
}

function setBidAction(txt='CONFIRM', wait=false){
	$('bid-action').innerHTML = txt;
	$('bid-action').disabled = wait;
}

async function onBuyConfirm() {
	window.event.stopPropagation();

	if(typeof Davinci == 'undefined'){ setBuyStatus('Wallet not available', true); return; }
	if(!Davinci.address){ setBuyStatus('Wallet not connected', true); return; }

	let item   = session.artwork;
	let seller = item.owner;
    let buyer  = Davinci.addrexx;
    console.log('Seller & buyer', seller, buyer);

    if(seller==buyer){ 
		setBuyStatus('You are the owner, can not buy this token', true);
    	return;
    }
    if(!item.onsale){
		setBuyStatus('Token not for sale', true);
    	return;
    }
    if(item.copies<1){
		setBuyStatus('No more copies available', true);
    	return;
    }

	setBuyStatus('Confirming sale...');
	setBuyAction('WAIT', true);

	try {
    	let url   = '/api/orderbyartwork/'+item.address;
    	let res   = await fetch(url);
    	let order = await res.json();
    	console.log('Order', order);
        if(!order){ 
    		console.error('Order not found', order);
			setBuyStatus('Sell order not created by owner yet', true);
			setBuyAction();
			return;
    	}
    	let orderId = order.address;
    	console.log('OrderId', orderId);
    	console.log('Proxy', config.TransferProxy);

    	// Check approval
		let approved = await isApproved(item.collection, item.type, seller, config.TransferProxy);
		//let approved = await isApproved(item.collection, item.type, seller, config.Operator);
		//let approved = await isApproved(item.collection, item.type, seller, config.Market);
		console.log('Approved?', approved);
		if(!approved) { 
			setBuyStatus('Order has not been approved by seller', true);
			setBuyAction();
			return;
		}

		setBuyStatus('Sending payment, please wait...');
	    adr = config.Market;
	    abi = Market3.abi
		//ctr = Harmony.contracts.createContract(abi, adr);
		ctr = await Davinci.contract(abi, adr);
		ctr.wallet = Davinci.wallet;
		wei = new Harmony.utils.Unit(item.saleprice).asOne().toWei();
		gas = { gasPrice: config.GASPRICE, gasLimit: config.GASLIMIT, value: wei, from: Davinci.address };
        console.log('Wei', wei.toString());
        console.log('Contract info', orderId, buyer, gas);
	    res = await ctr.methods.buy(orderId, buyer, 1).send(gas);
	    console.log('RES', res);
	    let ok = false;
		if(Davinci.wallet.isMetaMask){
	    	ok = res.status;
	    	txid = res.transactionHash;
		} else {
        	if (res.transaction.txStatus == 'REJECTED') { ok = false; }
	        else if (res.transaction.txStatus == 'CONFIRMED') { ok = true; }
	        else {
	            setBuyStatus('Unknown status: '+res.transaction.txStatus, true);
	            setBuyAction();
	            return;
	        }
	    	txid = res.transaction.id;
		}
	    console.log('OK', ok, txid);

        if (ok) {
        	// Add token copies to owners table
        	// Davinci.api.buy(orderid, buyer, tokenid, qty)
			var data = new FormData();
			data.append('address',    item.address);
			data.append('collection', item.collection);
			data.append('tokenid',    item.tokenid);
			data.append('tokentype',  item.type);
			data.append('seller',     seller);
			data.append('ownerid',    buyer);
			data.append('copies',     1);
			data.append('total',      item.copies);
			data.append('available',  1);
			data.append('onsale',     false);
			data.append('saletype',   0);
			data.append('saleprice',  item.saleprice);
			data.append('updateqty',  true);

        	if(item.copies==1){
				console.log('Change owner from', seller, 'to', buyer);
				res = await fetch('/api/changeowner', {method: 'POST', body: data});
				jsn = await res.json();
				console.log('Response', jsn);
				if(jsn.error) { 
					console.log('Change owner error: ', jsn.error); 
				}
        	}
        	
            try {
				console.log('Save new owner', buyer);
				res = await fetch('/api/saveowner', {method: 'POST', body: data});
				jsn = await res.json();
				console.log('Response', jsn);
				if(jsn.error) { 
					console.log('Save owner error: ', jsn.error); 
				} else {
					console.log('Ownership saved', jsn);
				}
            } catch(ex1){
                console.warn('Error saving owner', ex1);
                console.warn('Owner record', data);
            }

			// Save Transfer
            try {
				console.log('Saving transfer...', item.address);
				var xfer = new FormData();
				xfer.append('txhash',     txid);
				xfer.append('orderid',    orderId);
				xfer.append('sender',     seller);
				xfer.append('receiver',   buyer);
				xfer.append('tokentype',  item.type);
				xfer.append('collection', item.collection);
				xfer.append('tokenid',    item.tokenid);
				xfer.append('value',      item.saleprice);
				xfer.append('artwork',    item.address);

				res = await fetch('/api/transfer', {method: 'POST', body: xfer});
				jsn = await res.json();
				console.log('Xfer response', jsn);
				if(jsn.error) { 
					console.log('Xfer error: ', jsn.error); 
				} else {
					console.log('Xfer saved', jsn);
				}
            } catch(ex2){
                console.warn('Error saving transfer', ex2);
                console.warn('Transfer record', xfer);
            }

            setBuyStatus('Sale completed! <a href="/mycollection">View token in my collection</a>');
            setBuyAction('SUCCESS', true);
            enableBuyDirectPopupClick();
            return;
        } else {
            setBuyStatus('Error in buy order', true);
            setBuyAction();
            ctr.methods.buy(orderId, buyer, 1).call().then().catch(revertReason => {
            	console.error(revertReason);
            	if(revertReason.revert){
		            setBuyStatus('Error in buy order: '+revertReason.revert, true);
		            setBuyAction();
            	}
            });
            return;
        }
    } catch(ex){ 
        console.log('Contract error:', ex) ;
        setBuyStatus(ex.message||ex, true);
        setBuyAction();
        return;
    }
	setBuyStatus('Buy Token: Unknown error?', true);
    setBuyAction();
}

async function onResellConfirm() {
	window.event.stopPropagation();

	if(typeof Davinci == 'undefined'){ setResellStatus('Wallet not available', true); return; }
	if(!Davinci.address){ setResellStatus('Wallet not connected', true); return; }

	let item   = session.artwork;
	let order  = session.order;
	let seller = order.owner;
    let buyer  = Davinci.addrexx;
    console.log('Item', item);
    console.log('Order', order);
    console.log('Seller', seller);
    console.log('Buyer', buyer);

    if(seller==buyer){ 
		setResellStatus('You are the owner, can not buy this token', true);
    	return;
    }
    if(!item.onsale){
		setResellStatus('Token not for sale', true);
    	return;
    }
    if(item.copies<1){
		setResellStatus('No more copies available', true);
    	return;
    }

	setResellStatus('Confirming sale...');
	setResellAction('WAIT', true);

	try {
    	let orderId = order.address;
    	console.log('OrderId', orderId);
    	console.log('Proxy', config.TransferProxy);
		setResellStatus('Sending payment, please wait...');
	    adr = config.Market;
	    abi = Market3.abi
		ctr = await Davinci.contract(abi, adr);
		ctr.wallet = Davinci.wallet;
		wei = new Harmony.utils.Unit(order.sellprice).asOne().toWei();
		gas = { gasPrice: config.GASPRICE, gasLimit: config.GASLIMIT, value: wei, from: Davinci.address };
        console.log('Wei', wei.toString());
        console.log('Contract info', orderId, buyer, gas);
	    res = await ctr.methods.buy(orderId, buyer, 1).send(gas);
	    console.log('RES', res);
	    let ok = false;
		if(Davinci.wallet.isMetaMask){
	    	ok = res.status;
	    	txid = res.transactionHash;
		} else {
        	if (res.transaction.txStatus == 'REJECTED') { ok = false; }
	        else if (res.transaction.txStatus == 'CONFIRMED') { ok = true; }
	        else {
	            setResellStatus('Unknown status: '+res.transaction.txStatus, true);
	            setResellAction();
	            return;
	        }
	    	txid = res.transaction.id;
		}
	    console.log('OK', ok, txid);

        if (ok) {
        	// Add token copies to owners table
        	// Davinci.api.buy(orderid, buyer, tokenid, qty)
			var data = new FormData();
			data.append('address',    item.address);
			data.append('collection', item.collection);
			data.append('tokenid',    item.tokenid);
			data.append('tokentype',  item.type);
			data.append('seller',     seller);
			data.append('ownerid',    buyer);
			data.append('total',      item.copies);
			data.append('copies',     1);
			data.append('available',  1);
			data.append('onsale',     false);
			data.append('saletype',   0);
			data.append('saleprice',  order.sellprice);
			data.append('updateqty',  true);

        	if(item.copies==1){
				console.log('Change owner from', seller, 'to', buyer);
				res = await fetch('/api/changeowner', {method: 'POST', body: data});
				jsn = await res.json();
				console.log('Response', jsn);
				if(jsn.error) { 
					console.log('Change owner error: ', jsn.error); 
				}
        	}
        	
            try {
				console.log('Save new owner', buyer);
				res = await fetch('/api/resellowner', {method: 'POST', body: data});
				jsn = await res.json();
				console.log('Response', jsn);
				if(jsn.error) { 
					console.log('Save owner error: ', jsn.error); 
				} else {
					console.log('Ownership saved', jsn);
				}
            } catch(ex1){
                console.warn('Error saving owner', ex1);
                console.warn('Owner record', data);
            }

			// Save Transfer
            try {
				console.log('Saving transfer...', item.address);
				var xfer = new FormData();
				xfer.append('txhash',     txid);
				xfer.append('orderid',    orderId);
				xfer.append('sender',     seller);
				xfer.append('receiver',   buyer);
				xfer.append('tokentype',  item.type);
				xfer.append('collection', item.collection);
				xfer.append('tokenid',    item.tokenid);
				xfer.append('value',      order.sellprice);
				xfer.append('artwork',    item.address);

				res = await fetch('/api/transfer', {method: 'POST', body: xfer});
				jsn = await res.json();
				console.log('Xfer response', jsn);
				if(jsn.error) { 
					console.log('Xfer error: ', jsn.error); 
				} else {
					console.log('Xfer saved', jsn);
				}
            } catch(ex2){
                console.warn('Error saving transfer', ex2);
                console.warn('Transfer record', xfer);
            }

            setResellStatus('Sale completed! <a href="/mycollection">View token in my collection</a>');
            setResellAction('SUCCESS', true);
            enableResellPopupClick();
            return;
        } else {
            setResellStatus('Error in buy order', true);
            setResellAction();
            ctr.methods.buy(orderId, buyer, 1).call().then().catch(revertReason => {
            	console.error(revertReason);
            	if(revertReason.revert){
		            setResellStatus('Error in buy order: '+revertReason.revert, true);
		            setResellAction();
            	}
            });
            return;
        }
    } catch(ex){ 
        console.log('Contract error:', ex) ;
        setResellStatus(ex.message||ex, true);
        setResellAction();
        return;
    }
	setResellStatus('Buy Token: Unknown error?', true);
    setResellAction();
}

async function updateCardPrice(price=0) {
	try { session.card.children[3].children[0].children[0].innerHTML = parseInt(price) + ' ONE'; }
	catch(ex){ console.log('No card available'); }
}

async function onBidConfirm() {
	window.event.stopPropagation();
	if(typeof Davinci == 'undefined'){ setBidStatus('Wallet not available', true); return; }
	if(!Davinci.address){ setBidStatus('Wallet not connected', true); return; }

	let amount = validNumber($('bid-amount').value);
	let item   = session.artwork;
	let seller = item.owner;
    let bidder = Davinci.addrexx;
	let uname  = bidder.substr(0,10);
	console.log('Bid on item', item);
	console.log('Token ', item.address);
    console.log('Seller', seller);
    console.log('Bidder', bidder);
    console.log('Order ', item.orderid);
	console.log('Proxy ', config.TransferProxy);
	console.log('Amount', amount);

	if(typeof Davinci == 'undefined'){ setBidStatus('Wallet not available', true); return; }
	if(!Davinci.address){ setBidStatus('Wallet not connected', true); return; }

    if(seller==bidder){ 
		setBidStatus('You are the owner, can not bid on this token', true);
    	return;
    }
    if(item.bids.length>0 && item.bids[0].bidder==bidder){ 
		setBidStatus('Can not bid on this token again', true);
    	return;
    }
    if(!item.orderid){
		setBidStatus('Error: Auction not found', true);
    	return;
    }
    if(!item.onsale){
		setBidStatus('Token not for sale', true);
    	return;
    }
    if(item.available<1){
		setBidStatus('No more copies available', true);
    	return;
    }

    // Check Dates
	let now  = new Date();
	let dini = new Date(item.inidate);
	let dend = new Date(item.enddate);
    if(now<dini){ setBidStatus('Auction not started yet', true); return; }
    if(now>dend){ setBidStatus('Auction already ended', true); return; }

	setBidStatus('Confirming bid...');
	setBidAction('WAIT', true);

	try {
		setBidStatus('Placing bid, please wait...');
	    adr = config.Auctions;
	    abi = Auctions.abi;
		ctr = await Davinci.contract(abi, adr);
		ctr.wallet = Davinci.wallet;
		wei = new Harmony.utils.Unit(amount).asOne().toWei();
		gas = { gasPrice: config.GASPRICE, gasLimit: config.GASLIMIT, from: Davinci.addrexx };
        console.log('Wei', wei.toString());
        console.log('Gas', gas);
	    res = await ctr.methods.placeBid(item.orderid, wei).send(gas);
	    console.log('RES', res);
	    let ok = false;
		if(Davinci.wallet.isMetaMask){
	    	ok = res.status;
	    	txid = res.transactionHash;
		} else {
        	if (res.transaction.txStatus == 'REJECTED') { ok = false; }
	        else if (res.transaction.txStatus == 'CONFIRMED') { ok = true; }
	        else {
	            setBidStatus('Unknown status: '+res.transaction.txStatus, true);
	            setBidAction('PLACE BID');
	            return;
	        }
	    	txid = res.transaction.id;
		}
	    console.log('OK', ok, txid);

        if (ok) {
        	// Save bid to DB
			var data = new FormData();
			// 'orderid', 'collection', 'tokenid', 'owner', 'price'
			data.append('orderid',    item.orderid);
			data.append('collection', item.collection);
			data.append('tokenid',    item.tokenid);
			data.append('artwork',    item.address);
			data.append('bidder',     bidder);
			data.append('price',      amount);
            try {
				console.log('New bid', amount, 'by', bidder);
				res = await fetch('/api/newbid', {method: 'POST', body: data});
				jsn = await res.json();
				console.log('New bid resp', jsn);
				if(jsn.error) { 
					console.log('New bid error: ', jsn.error); 
				}
				// Get username
				//res = await fetch('/api/username/'+bidder, {method: 'GET'});
				//jsn = await res.json();
            	//uname = jsn.name || bidder.substr(0,10);
				//console.log('Username', uname);
            } catch(ex1){
                console.warn('Error saving bid', ex1);
                console.warn('Bid record', data);
            }

            setBidStatus('Bid completed!');
            setBidAction('SUCCESS', true);
            updateCardPrice(amount);  // Update card price with latest bid
            return;
        } else {
            setBidStatus('Error placing bid', true);
            setBidAction('PLACE BID');
            ctr.methods.placeBid(item.orderid, wei).call().then().catch(revertReason => {
            	console.error(revertReason);
            	if(revertReason.revert){
		            setBidStatus('Error placing bid: '+revertReason.revert, true);
		            setBidAction('PLACE BID');
            	}
            });
            return;
        }
    } catch(ex){ 
        console.log('Bidding error:', ex) ;
        setBidStatus(ex.message||ex, true);
        setBidAction('PLACE BID');
        return;
    }
	setBidStatus('Place bid: Unknown error?', true);
    setBidAction('PLACE BID');
}

async function getTransaction(txid) {
	console.log('Getting transaction', txid);
	//let hmy = await HarmonyJs.Harmony(config.NETURL, {chainType: 'hmy', chainId: config.CHAINID});
	let tx, rec;
	try	{
		rec = await Harmony.blockchain.getTransactionByHash({txnHash:txid})
		tx = rec.result;
	} catch(ex) {
		console.log('Error getting transaction:', ex);
	}
	console.log('Tx', tx)
	return tx
}

/*
async function sendPayment(receiver, amount, tokenId) {
	let res, txn;
	txn = Harmony.transactions.newTx({
        to: receiver,
        value: new Harmony.utils.Unit(amount).asOne().toWei(),
        data: tokenId,
        shardID: 0,         // send token from shardID
        toShardID: 0,       // send token to toShardID
        gasLimit: '51000',  // gas limit, you can use string
        gasPrice: new Harmony.utils.Unit('1').asGwei().toWei()
    });
 
    //Harmony.wallet.addByPrivateKey(secret);
    let signed = await Davinci.wallet.signTransaction(txn);
    //const acct = await new hact.Account(secret)
    //const signed = await account.signTransaction(txn)

    //console.log(txn); return;
    try { 
        res = await Harmony.blockchain.sendTransaction(signed);
        if(res.error){ 
        	console.log('Tx Error:', res.error.message)
        	return {error:res.error.message};
        } else { 
        	console.log('CONFIRMED', res.result);
        	return {status:'CONFIRMED', result:res.result};
        }
    } catch(ex){
    	console.log('Error:', ex);
    	return {error:ex.message};
    }
	return {error:'Error while sending payment'};
}
*/

async function onSearch() {
	let tag = $('searchtxt').value;
	if(tag.startsWith('#')) { tag = tag.substr(1); }
	window.location.href = '/explore/tag/'+tag;
}

async function enableSearchClick() {
	let searchText = $('searchtxt');
	if(searchText){
		searchText.addEventListener('keyup', function(event) {
		    if (event.keyCode === 13) {
		        event.preventDefault();
		    	//document.getElementById("searchbtn").click();
		        onSearch();
		    }
		});
	}
}

async function isApproved(collection, type='1155', user, operator) {
	console.log('Is approved?', collection, type, user, operator);
	console.log('Collection', type, collection);
	console.log('Owner', user);
	console.log('Proxy', operator);
	let abi, ctr, gas, res;
	if(type=='721'){ 
    	abi = DavinciToken.abi;
	} else {
    	abi = DavinciMultipleToken.abi;
	}
	try {	
	    adr = collection;
		//ctr = Harmony.contracts.createContract(abi, adr);
		ctr = await Davinci.contract(abi, adr);
		//console.log('CTR', ctr);
		//console.log('Methods', ctr.methods);
		ctr.wallet = Davinci.wallet;
		console.log('address', Davinci.addrexx)
		gas = { gasPrice: config.GASPRICE, gasLimit: config.GASLIMIT, from: Davinci.addrexx };
	    res = await ctr.methods.isApprovedForAll(user, operator).call(gas);
	    console.log('isApproved RES', res);
	    return res;
	} catch(ex){
		console.log('isApproved error', ex)
		return false;
	}
    return false;
}

async function approveSales(collection, type='1155', operator) {
	console.log('Approving sales', collection, type, operator);
	if(type=='721'){ 
    	abi = DavinciToken.abi;
	} else {
    	abi = DavinciMultipleToken.abi;
	}
	try {
	    adr = collection;
		//ctr = Harmony.contracts.createContract(abi, adr);
		ctr = await Davinci.contract(abi, adr);
		ctr.wallet = Davinci.wallet;
		gas = { gasPrice: hex(config.GASPRICE), gasLimit: hex(config.GASLIMIT), from: Davinci.addrexx };

		//if(Davinci.wallet.isMetaMask){
	    	//res = await ctr.methods.setApprovalForAll(operator, true).send(gas);
			//let dt = ctr.methods.setApprovalForAll(operator, true).encodeABI()
			//let tx = { data: dt, ...gas };
	    	//console.log('GAS',tx);
			//res = await ctr.send(tx); //<<< wait for confirmation
			//let res = await web3.eth.sendTransaction(gas);
	    	//console.log('>>>>>>>', Davinci.neturl);
	    	//let web3 = new Web3(Davinci.neturl);
	    	//let web3 = new Web3(window.ethereum);
			//ctr = new web3.eth.Contract(abi, adr);
	    //	res = await ctr.methods.setApprovalForAll(operator, true).send(gas);
	    //	console.log('RES',res);
		//} else {
	    //	res = await ctr.methods.setApprovalForAll(operator, true).send(gas);
		//}
	    res = await ctr.methods.setApprovalForAll(operator, true).send(gas);
	    console.log('RES',res);
	    let ok = false;
		if(Davinci.wallet.isMetaMask){
	    	ok = res.status;
	    	txid = res.transactionHash;
		} else {
	        if (res.transaction.txStatus == 'REJECTED') { ok = false; }
	        else if (res.transaction.txStatus == 'CONFIRMED') { ok = true; }
	        else { return {error: 'Unknown status: '+res.transaction.txStatus}; }
	    	txid = res.transaction.id;
		}
        if (ok) {
	        console.log('Approved', txid);
            return {status:'SUCCESS'};
        }  else {
            console.log('Rejected', res);
            return {error: 'Transaction rejected'};
        }
    } catch(ex){ 
        console.log('Contract error:', ex) ;
        return {error: ex.message||ex};
    }
    return {error: 'Approval unknown'};
}


function onManage(obj){
	console.log('On edit', obj.dataset.address);
	window.location.href = '/edit/'+obj.dataset.address;
}

function onView(obj){
	console.log('On view', obj.dataset.address);
	window.location.href = '/view/'+obj.dataset.address;
}

async function onComment(artwork){
	console.log('On comment', artwork);
	if(typeof Davinci == 'undefined'){
		alert('Wallet not connected');
		return;
	}
	let userid = Davinci.addrexx;
	if(!userid){
		alert('Anonymous comments are not allowed, connect your wallet');
		return;
	}
	// Clean comment
	let comment = $('comment-text').value;
	if(comment.length>1000){ comment = comment.substr(0,1000); }
	comment = comment.replace(/<.*?>/g, '');
	$('comment-text').value = comment;
	// No flood
	if(session.comments && session.comments.length>0){ 
		if(userid == session.comments[session.comments.length-1].userid){
			alert("Can not comment again, wait for more people to participate");
			return;
		}
	}

	// Anonymous comments not allowed
	let username = 'Anonymous';
	let avatar   = 'anonymous';
	let res, jsn;
	try {
		console.log('Getting user info...');
		res = await fetch('/api/user/'+userid);
		jsn = await res.json();
		if(!jsn || jsn.error){
			alert('Anonymous comments are not allowed, connect your wallet');
			return;
		}
		username = jsn.name;
		avatar   = jsn.avatar;

		console.log('Saving comment...');
		var data = new FormData();
		data.append('userid',  userid);
		data.append('artwork', artwork);
		data.append('comment', comment);
		res = await fetch('/api/newcomment', {method:'post', body: data});
		jsn = await res.json();
		//console.log('Res', res);
		console.log('Res', jsn);
		if(jsn.error) { 
			console.log('Comment error:', jsn.error); 
			showComment('Error', 'alert', '', 'Error saving comment: '+jsn.error);
			return;
		} else {
			showComment(username, avatar, 'Just now', comment);
			$('comment-text').value = '';
			$('comment-action').disabled = true;
			let created = new Date().toJSON();
			session.comments.push({userid,username,avatar,artwork,comment,created});
		}
	} catch(ex){
		console.log('Comment error:', ex); 
		showComment('Error', 'alert', '', 'Error saving comment: '+ex.message);
		return;
	}
}

function showComment(user, avatar, time, text){
	let list = $('comments-list');
	let temp = $('tmp-comment').innerHTML;
	let html = temp.replace('{user}',   user)
	               .replace('{avatar}', avatar)
	               .replace('{time}',   time)
	               .replace('{text}',   text);
	list.innerHTML += html;
}

async function delComment(comid){
	console.log('Delete comment', comid);
	let res, jsn;
	try {
		res = await fetch('/api/moderate/'+comid);
		jsn = await res.json();
		console.log('Response', jsn);
		if(!jsn || jsn.error){
			alert('Error deleting comment');
			return;
		}
		if(jsn.success=='OK'){
			console.log('Deleted comment', comid);
			let obj = document.querySelector(`[data-comid='${comid}']`);
			if(obj){ obj.parentNode.removeChild(obj); }
		}
	} catch(ex){
		console.log('Moderation error:', ex);
		alert('Moderation error: '+ex.message);
		return;
	}
}

async function undoComment(btn, comid){
	console.log('Restore comment', comid);
	let res, jsn;
	try {
		var data = new FormData();
		data.append('comid',  comid);
		data.append('status', 0);
		res = await fetch('/api/comment/', {method:'PUT', body: data});
		jsn = await res.json();
		console.log('Response', jsn);
		if(!jsn || jsn.error){
			alert('Error restoring comment');
			return;
		}
		if(jsn.success=='OK'){
			console.log('Restored comment', comid);
			btn.innerHTML = 'OK';
		}
	} catch(ex){
		console.log('Moderation error:', ex);
		alert('Moderation error: '+ex.message);
		return;
	}
}

function setSendStatus(txt, warn=false){
	console.log(txt);
	if(warn){ txt = '<warn>'+txt+'</warn>'; }
	$('sender-status').innerHTML = txt;
}

function setSendAction(txt='SEND TOKEN', wait=false){
	$('send-button').innerHTML = txt;
	$('send-button').disabled = wait;
}

async function onSendAction(){
	setSendStatus('Sending token, please wait...');
	let item       = session.item;
	let address    = item.address;
	let collection = item.collection;
	let tokenId    = item.tokenid;
	let sender     = Davinci.addrexx;
	let receiver   = $('receiver').value;
	if(!receiver){ setSendStatus('Receiver address is required', true); setSendAction(); return; }
	if(receiver.length != 42){ setSendStatus('Invalid receiver address', true); setSendAction(); return; }
	receiver = receiver.toLowerCase();
	if(sender==receiver){ setSendStatus('Can not send token to self', true); setSendAction(); return; }
	receiver = addressToHex(receiver);

	// Transfer
	try {
		console.log('Transfer token', item.type, address);
		console.log('Source', sender);
		console.log('Target', receiver);
		//return;

		// Token Transfer
		setSendStatus('Sending token, please wait...');
		let gas = { gasPrice: config.GASPRICE, gasLimit: config.GASLIMIT, from: Davinci.addrexx };
		if(item.type=='721'){
	    	abi = DavinciToken.abi;
			ctr = await Davinci.contract(abi, collection);
			ctr.wallet = Davinci.wallet;
		    res = await ctr.methods.safeTransferFrom(sender, receiver, address).send(gas);
		} else {
	    	abi = DavinciMultipleToken.abi;
			ctr = await Davinci.contract(abi, collection);
			ctr.wallet = Davinci.wallet;
		    res = await ctr.methods.safeTransferFrom(sender, receiver, address, 1, []).send(gas);
		}
	    console.log('RES', res);
	    let ok = false;
	    let txid = null;
		if(Davinci.wallet.isMetaMask){
	    	ok = res.status;
	    	txid = res.transactionHash;
		} else {
        	if (res.transaction.txStatus == 'REJECTED') { 
        		ok = false; 
        		// TODO: Get revert reason
        	} else if (res.transaction.txStatus == 'CONFIRMED') { ok = true; }
	        else {
	            setSendStatus('Unknown status: '+res.transaction.txStatus, true);
	            setSendAction();
	            return;
	        }
	    	txid = res.transaction.id;
		}
	    console.log('OK', ok, txid);
	    if(ok){
			setSendStatus('Token sent');
			//setSendAction('SUCCESS!', true);
	    } else {
			setSendStatus('Error sending token');
			setSendAction('FAIL!', true);
			return;
	    }

		// Token ownership
		setSendStatus('Updating ownership');
		var data = new FormData();
		data.append('address',    address);
		data.append('collection', collection);
		data.append('tokenid',    tokenId);
		data.append('sender',     sender);
		data.append('ownerid',    receiver);
		data.append('copies',     1);
		data.append('available',  1);
		data.append('total',      item.copies);
		data.append('updateqty',  true);
		data.append('onsale',     false);
		data.append('saletype',   2);
		data.append('saleprice',  item.saleprice);

		//let json = Object.fromEntries(data);

		res = await fetch('/api/saveowner/', {method: 'POST', body: data});
		jsn = await res.json();
		console.log('Response', jsn);
		if(jsn.error) { 
			console.log('Transfer error: ', jsn.error); 
		} else {
			console.log('Transfer saved', jsn);
		}

		// Save Transfer
        try {
			console.log('Saving transfer...', item.address);
			var xfer = new FormData();
			xfer.append('txhash',     txid);
			//xfer.append('orderid',    orderId);
			xfer.append('sender',     sender);
			xfer.append('receiver',   receiver);
			xfer.append('tokentype',  item.type);
			xfer.append('collection', collection);
			xfer.append('tokenid',    tokenId);
			xfer.append('value',      item.saleprice);
			xfer.append('artwork',    item.address);

			res = await fetch('/api/transfer', {method: 'POST', body: xfer});
			jsn = await res.json();
			console.log('Xfer response', jsn);
			if(jsn.error) { 
				console.log('Xfer error: ', jsn.error); 
			} else {
				console.log('Xfer saved', jsn);
			}
        } catch(ex2){
            console.warn('Error saving transfer', ex2);
            console.warn('Transfer record', xfer);
        }
    } catch(ex){ 
        console.log('Transfer error:', ex) ;
        setSendStatus('Error sending token', true);
        setSendAction();
        return;
    }

    // Update available count
    let qty = parseInt($('available').innerHTML) || 1;
	$('available').innerHTML = qty-1;
	setSendStatus('Token sent');
	setSendAction('SUCCESS!', true);
}

async function loadMore() {
	session.page += 1;
	let res  = await fetch('/api/artworks/'+session.page);
	let html = await res.text();
	//console.log('Html', html);
	if(html){ $('cards').innerHTML += html; }
	else { $('button-pager').classList.add('disabled'); }
}

async function moreMycreations() {
	//console.log('More...');
	session.page += 1;
	let res  = await fetch('/api/mycreations?page='+session.page);
	let html = await res.text();
	//console.log('Html', html);
	if(html){ $('cards').innerHTML += html; }
	else { $('button-pager').classList.add('disabled'); }
}

async function moreMycollection() {
	//console.log('More...');
	session.page += 1;
	let res  = await fetch('/api/mycollection?page='+session.page);
	let html = await res.text();
	//console.log('Html', html);
	if(html){ $('cards').innerHTML += html; }
	else { $('button-pager').classList.add('disabled'); }
}

async function showPrivate() {
	let url = new URL(window.location.href);
	url.searchParams.set('private', 1);
	window.location.href = url;
}

async function showInactive() {
	let url = new URL(window.location.href);
	url.searchParams.set('inactive', 1);
	window.location.href = url;
}

async function recount(address, obj) {
	console.log('Recount', address, obj);
	let res = await fetch('/api/counter/'+address);
	let cnt = await res.json();
	console.log('Available', cnt);
	if(cnt){ obj.firstElementChild.innerHTML = cnt.balance; }
	return false;
}
/*
async function newUser(address) {
	var data = {
		address: address,
		name: address.substr(0,10)
	};
	let opts = {
		method: 'POST', 
		headers: {'content-type': 'application/json'}, 
		body: JSON.stringify(data)
	};
	let res = await fetch('/api/user', opts);
	console.log('New user res', res);
	let rex = await res.json();
	console.log('New user rex', rex);
}
*/

function showActivity() {
	window.location.href = '/activity';
}

/*
async function newActivity(type, text, ref) {
	var data = {
		type: type,
		userid: Davinci.addrexx,
		activity: text.substr(0,1000),
		reference: ref
	};
	let opts = {
		method: 'POST', 
		headers: {'content-type': 'application/json'}, 
		body: JSON.stringify(data)
	};
	let res = await fetch('/api/activity', opts);
	console.log('New activity res', res);
	let rex = await res.json();
	console.log('New activity rex', rex);
}
*/

async function tokenBalance(obj, tokentype, collection, tokenId, buyer) {
    console.log('Balance', tokentype, collection, tokenId, buyer);
    obj.innerHTML = 'Wait...';
	let gas, abi, ctr, res, bal = 0;
	try {
    	gas = { gasPrice: config.GASPRICE, gasLimit: config.GASLIMIT };
		if(tokentype=='712'){
		    abi = DavinciToken.abi;
			ctr = await Davinci.contract(abi, collection);
			ctr.wallet = Davinci.wallet;
			res = await ctr.methods.ownerOf(tokenId).call(gas);
		    console.log('Owner', res);
			if(buyer==res.toLowerCase()){ bal = 1; }
		    console.log('Balance', bal);
		} else {
		    abi = DavinciMultipleToken.abi;
			ctr = await Davinci.contract(abi, collection);
			ctr.wallet = Davinci.wallet;
			res = await ctr.methods.balanceOf(buyer, tokenId).call(gas);
			bal = res.toString();
		    console.log('Balance', bal);
		}
		obj.innerHTML = bal;
	} catch(ex) {
	    console.log('Error getting balance', ex.message);
	}
}

async function resellBalance(obj, artwork, ownerid) {
    console.log('Update', artwork, ownerid);
    obj.innerHTML = 'Wait...';
	let res, jsn;
	try {
    	res = await fetch(`/api/countresell/${artwork}/${ownerid}`);
    	jsn = await res.json();
	    console.log('Balance', jsn.balance);
		obj.innerHTML = jsn.balance;
	} catch(ex) {
	    console.log('Error getting balance', ex.message);
	}
}

function changeTheme() {
	theme = (document.body.className=='lite-mode'?'dark-mode':'lite-mode');
    document.body.className = theme;
	//$('icon-theme').src = (theme=='lite-mode'?'/media/theme.png':'/media/theme-dark.png');
	setCookie('theme', theme);
	$('theme-label').innerHTML = (theme=='lite-mode'?'Dark theme':'Light theme');
	console.log('New theme', theme);
}

function setTheme() {
	let theme = getCookie('theme');
	console.log('Ini theme', theme);
	if(theme){ 
		document.body.className = theme;
		$('theme-label').innerHTML = (theme=='lite-mode'?'Dark theme':'Light theme');
		//$('icon-theme').src = (theme=='lite-mode'?'/media/theme.png':'/media/theme-dark.png');
	}
}


async function startDavinci() {
	console.log('DaVinci starting...')
	console.log('Config', config);
	setTheme();
	Harmony = await HarmonyJs.Harmony(config.NETURL, {chainType: config.CHAINTYPE, chainId: config.CHAINID});
	await Davinci.init();
	let wallet = getCookie('wallet');
	if(wallet){
		await onWallet(wallet)
	}
	enableSearchClick();
	setLocalTimes();
	//await Davinci.connect();
	//if(Davinci.address) {
	//	showAccountLabel();
	//}
}

// window.onload = init()