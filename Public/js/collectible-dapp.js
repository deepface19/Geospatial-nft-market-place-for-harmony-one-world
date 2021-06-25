function TncDapp() {

    //const ipfs = window.IpfsHttpClient('ipfs.infura.io', '5001', { protocol: 'https' });
    const _this = this;
    this.collectibleTemplate = Handlebars.compile($('#collectible-template').html());
    this.noCollectibleTemplate = Handlebars.compile($('#no-collectible').html());
    this.pickerTemplate = Handlebars.compile($('#picker-template').html());
    this.noOffersTemplate = Handlebars.compile($('#no-offers').html());
    this.prevAccounts = [];
    this.prevChainId = '';

    this.render = async function(erc1155, id, index, category, id, index, category){

        fetchUrl(api_url + '1.0/'+chain_id+'/collections/events/URI/erc1155Address/'+erc1155+'/id/0', 5000);

        let nft = await window.tncLib.getNft(erc1155, id);


        if(!nft.uri){
            $('#collectiblePage').html(_this.noCollectibleTemplate({}));
            return;
        }
    
        // new opensea json uri pattern
        if(nft.uri.includes("api.opensea.io")){

            let nftUri = nft.uri;
            nftUri = decodeURI(nftUri).replace("{id}", id);
            nftUri = nftUri.split("/");
            if(nftUri.length > 0 && nftUri[ nftUri.length - 1 ].startsWith("0x")){
                nftUri[ nftUri.length - 1 ] = nftUri[ nftUri.length - 1 ].replace("0x", "");
                nft.uri = nftUri.join("/");
            }
        }

        nft.uri  = decodeURI(nft.uri).replace("{id}", id);

        let data_image = '';
        let data_animation_url = '';
        let data_audio_url = '';
        let data_interactive_url = '';
        let data_name = '';
        let data_description = '';
        let data_link = '';
        let data_attributes = [];

        try {

            let data = await $.getJSON(nft.uri.replace('ipfs://','https://gateway.ipfs.io/ipfs/').replace('/ipfs/ipfs/', '/ipfs/'));

            if (typeof data == 'object') {

                data_image = typeof data.image != 'undefined' && data.image ? data.image.replace('ipfs://','https://gateway.ipfs.io/ipfs/').replace('/ipfs/ipfs/', '/ipfs/') : '';
                data_animation_url = typeof data.animation_url != 'undefined' && data.animation_url ? data.animation_url.replace('ipfs://','https://gateway.ipfs.io/ipfs/').replace('/ipfs/ipfs/', '/ipfs/') : '';
                data_audio_url = typeof data.audio_url != 'undefined' && data.audio_url ? data.audio_url.replace('ipfs://','https://gateway.ipfs.io/ipfs/').replace('/ipfs/ipfs/', '/ipfs/') : '';
                data_interactive_url = typeof data.interactive_url != 'undefined' && data.interactive_url ? data.interactive_url.replace('ipfs://','https://gateway.ipfs.io/ipfs/').replace('/ipfs/ipfs/', '/ipfs/') : '';
                data_name = typeof data.name != 'undefined' && data.name ? data.name : '';
                data_description = typeof data.description != 'undefined' && data.description ? data.description : '';
                data_link = typeof data.external_link != 'undefined' && data.external_link ? data.external_link : '';
                data_attributes = typeof data.attributes != 'undefined' && data.attributes ? data.attributes : [];
            }

        }catch (e){

            try {
                let data = await $.getJSON(nft.uri.toLowerCase().replace('gateway.ipfs.io', 'cloudflare-ipfs.com'));

                if (typeof data == 'object') {

                    data_image = typeof data.image != 'undefined' && data.image ? data.image.replace('ipfs://','https://gateway.ipfs.io/ipfs/').replace('/ipfs/ipfs/', '/ipfs/').replace('gateway.ipfs.io', 'cloudflare-ipfs.com') : '';
                    data_animation_url = typeof data.animation_url != 'undefined' && data.animation_url ? data.animation_url.replace('ipfs://','https://gateway.ipfs.io/ipfs/').replace('/ipfs/ipfs/', '/ipfs/').replace('gateway.ipfs.io', 'cloudflare-ipfs.com') : '';
                    data_audio_url = typeof data.audio_url != 'undefined' && data.audio_url ? data.audio_url.replace('ipfs://','https://gateway.ipfs.io/ipfs/').replace('/ipfs/ipfs/', '/ipfs/').replace('gateway.ipfs.io', 'cloudflare-ipfs.com') : '';
                    data_interactive_url = typeof data.interactive_url != 'undefined' && data.interactive_url ? data.interactive_url.replace('ipfs://','https://gateway.ipfs.io/ipfs/').replace('/ipfs/ipfs/', '/ipfs/').replace('gateway.ipfs.io', 'cloudflare-ipfs.com') : '';
                    data_name = typeof data.name != 'undefined' && data.name ? data.name : '';
                    data_description = typeof data.description != 'undefined' && data.description ? data.description : '';
                    data_link = typeof data.external_link != 'undefined' && data.external_link ? data.external_link : '';
                    data_attributes = typeof data.attributes != 'undefined' && data.attributes ? data.attributes : [];
                }
            }catch (e){}

        }

        let traits_hide = '';
        if(data_attributes.length == 0){
            traits_hide = 'style="visibility:hidden;"';
        }

        let meta = await tncLib.getErc1155Meta(erc1155);


        if(data_interactive_url != ''){
            data_interactive_url = data_interactive_url + "?erc1155Address="+erc1155+"&id="+id+"&chain_id="+chain_id;
        }
        

        let ask = null;
        let swapMode = -1;
        let isBatch = false;
        let onsale = 0;
        let ticker = '';
        let price = 0;
        let swap = '';
        let options = '';
        let multiplier = 0;
        let seller = '';
        let royalties = '0.00';

        if(index){

            try {

                if(category > 0){

                    let ask_id = await tncLibMarket.getCategory(category, index);
                    ask = await tncLibMarket.getAskBase(ask_id);
                    index = ask_id;

                }else{

                    ask = await tncLibMarket.getAskBase(index);
                }

            }catch(e){
                _alert('Offer not found.');
                return;
            }

            console.log("ask: ", ask);

            price = ask.erc1155Address.length == 1 ? ask.pricePerItem[0] : ask.price;

            let decimals = await tncLib.tokenDecimalsErc20(ask.tokenAddress);
            price = _this.formatNumberString(price, decimals);

            if(decimals > 2) {

                price = price.substring(0, price.length - 10);
            }

            swapMode = ask.swapMode;
            isBatch = ask.erc1155Address.length > 1 ? true : false;
            onsale = ask.amount[0];
            ticker = await tncLib.tokenSymbolErc20(ask.tokenAddress);
            swap = ask.swapMode == 1 || ask.swapMode == 2 ? 'true' : '';
            options = ask.seller.toLowerCase() == tncLib.account.toLowerCase() ? 'true' : '';
            multiplier = ask.erc1155Address.length - 1;
            seller = ask.seller;
            royalties = _this.formatNumberString(await tncLibMarket.getRoyalties(ask.erc1155Address[0], ask.id[0]), 2);
        }

        let tmpl = _this.collectibleTemplate({

            buy : swapMode == 0 || swapMode == 1 ? ' true' : '',
            batch: isBatch ? 'true' : '',
            multiplier : multiplier,
            onsale: onsale,
            ticker: ticker,
            index: index,
            price: price,
            swap : swap,
            options: options,
            seller: seller,
            royalties: royalties,

            displayOpensea: chain_id == '1' || chain_id == '4' ? '' : 'false',
            image: data_image,
            animation_url: data_animation_url,
            audio_url: data_audio_url,
            interactive_url: data_interactive_url,
            name: data_name,
            description: data_description,
            url: data_link,
            attributes: data_attributes,
            id: id,
            erc1155: erc1155,
            supply: nft.supply,
            maxSupply: nft.maxSupply,
            balance: nft.balance,
            traitsHide : traits_hide,
            collectionName : meta.name != 'n/a' ? '<div class="text-truncate" style="font-size: 1.4rem !important;">' + meta.name + '</div>' : '<div class="text-truncate" style="font-size: 1.4rem !important;">' + erc1155 + '</div>',
            opensea : 'https://opensea.io/assets/'+erc1155+'/'+id
        });

        $('#collectiblePage').append(tmpl);

        $('#nftBuyButtonShortcut' + index).on('click', function(e){

            let _erc1155 = $(e.target).data('erc1155');
            let _id = $(e.target).data('id');
            let _name = $(e.target).data('name');
            let _index = $(e.target).data('index');

            $('#nftBuyErc1155Address').val( _erc1155 );
            $('#nftBuyNftId').val( _id );
            $('#nftBuyTitle').text( _name );
            $('#nftBuyIndex').val( _index );
            $('#nftBuyAmount').val('1');

            $('#nftBuyButton').click();

        });

        $('#nftBatchBuy' + index).on('click', function(e){

            let _index = $(e.target).data('index');
            _this.performBatchBuy(_index);
        });


    };

    this.render2 = async function(erc1155, id, amount, price, token, address, sellerAddress, swapMode, index, hasMore, which, isBatch, multiplier){

        let nft = await window.tncLib.getForeignNft(erc1155, address, id);
        // new opensea json uri pattern
        if(nft.uri.includes("api.opensea.io")){

            let nftUri = nft.uri;
            nftUri = decodeURI(nftUri).replace("{id}", id);
            nftUri = nftUri.split("/");
            if(nftUri.length > 0 && nftUri[ nftUri.length - 1 ].startsWith("0x")){
                nftUri[ nftUri.length - 1 ] = nftUri[ nftUri.length - 1 ].replace("0x", "");
                nft.uri = nftUri.join("/");
            }
        }

        nft.uri  = decodeURI(nft.uri).replace("{id}", id);

        let data_image = '';
        let data_animation_url = '';
        let data_audio_url = '';
        let data_interactive_url = '';
        let data_name = '';
        let data_description = '';
        let data_link = '';
        let data_attributes = [];

        try {

            let data = await $.getJSON(nft.uri.replace('ipfs://','https://gateway.ipfs.io/ipfs/').replace('/ipfs/ipfs/', '/ipfs/'));

            if (typeof data == 'object') {

                data_image = typeof data.image != 'undefined' && data.image ? data.image.replace('ipfs://','https://gateway.ipfs.io/ipfs/').replace('/ipfs/ipfs/', '/ipfs/') : '';
                data_animation_url = typeof data.animation_url != 'undefined' && data.animation_url ? data.animation_url.replace('ipfs://','https://gateway.ipfs.io/ipfs/').replace('/ipfs/ipfs/', '/ipfs/') : '';
                data_audio_url = typeof data.audio_url != 'undefined' && data.audio_url ? data.audio_url.replace('ipfs://','https://gateway.ipfs.io/ipfs/').replace('/ipfs/ipfs/', '/ipfs/') : '';
                data_interactive_url = typeof data.interactive_url != 'undefined' && data.interactive_url ? data.interactive_url.replace('ipfs://','https://gateway.ipfs.io/ipfs/').replace('/ipfs/ipfs/', '/ipfs/') : '';
                data_name = typeof data.name != 'undefined' && data.name ? data.name : '';
                data_description = typeof data.description != 'undefined' && data.description ? data.description : '';
                data_link = typeof data.external_link != 'undefined' && data.external_link ? data.external_link : '';
                data_attributes = typeof data.attributes != 'undefined' && data.attributes ? data.attributes : [];
            }

        }catch (e){

            try {
                let data = await $.getJSON(nft.uri.toLowerCase().replace('gateway.ipfs.io', 'cloudflare-ipfs.com'));

                if (typeof data == 'object') {

                    data_image = typeof data.image != 'undefined' && data.image ? data.image.replace('ipfs://','https://gateway.ipfs.io/ipfs/').replace('/ipfs/ipfs/', '/ipfs/').replace('gateway.ipfs.io', 'cloudflare-ipfs.com') : '';
                    data_animation_url = typeof data.animation_url != 'undefined' && data.animation_url ? data.animation_url.replace('ipfs://','https://gateway.ipfs.io/ipfs/').replace('/ipfs/ipfs/', '/ipfs/').replace('gateway.ipfs.io', 'cloudflare-ipfs.com') : '';
                    data_audio_url = typeof data.audio_url != 'undefined' && data.audio_url ? data.audio_url.replace('ipfs://','https://gateway.ipfs.io/ipfs/').replace('/ipfs/ipfs/', '/ipfs/').replace('gateway.ipfs.io', 'cloudflare-ipfs.com') : '';
                    data_interactive_url = typeof data.interactive_url != 'undefined' && data.interactive_url ? data.interactive_url.replace('ipfs://','https://gateway.ipfs.io/ipfs/').replace('/ipfs/ipfs/', '/ipfs/').replace('gateway.ipfs.io', 'cloudflare-ipfs.com') : '';
                    data_name = typeof data.name != 'undefined' && data.name ? data.name : '';
                    data_description = typeof data.description != 'undefined' && data.description ? data.description : '';
                    data_link = typeof data.external_link != 'undefined' && data.external_link ? data.external_link : '';
                    data_attributes = typeof data.attributes != 'undefined' && data.attributes ? data.attributes : [];
                }
            }catch (e){}

        }

        let traits_hide = '';
        if(data_attributes.length == 0){
            traits_hide = 'style="visibility:hidden;"';
        }

        let meta = await tncLib.getErc1155Meta(erc1155);
        let srcInfo = [0,0,0];
        let bridgeBack = false;

        if( chain_id == '1' && erc1155.toLowerCase() == tncLibBridgeIn.uniftyverseAddress.toLowerCase()){

            srcInfo = await tncLibBridgeIn.in_getSourceInfo(id);
            srcInfo[2] = _this.hexToInt(srcInfo[2]);
            srcInfo[1] = _this.hexToInt(srcInfo[1]);
            bridgeBack = true;
        }

        let decimals = await tncLib.tokenDecimalsErc20(token);
        price = _this.formatNumberString(price, decimals);
        if(decimals > 2) {

            price = price.substring(0, price.length - 10);
        }

        let explorer = 'https://etherscan.io/token/';
        switch(chain_id){
            case '4':
                explorer = 'https://rinkeby.etherscan.io/token/';
                break;
            case '61':
                explorer = 'https://testnet.bscscan.com/address/';
                break;
            case '38':
                explorer = 'https://bscscan.com/address/';
                break;
            case '4d':
                explorer = 'https://blockscout.com/poa/sokol/address/';
                break;
            case '507':
                explorer = 'https://moonbeam-explorer.netlify.app/address/';
                break;
            case 'a4ec':
                explorer = 'https://explorer.celo.org/address/';
                break;
            case 'a86a': // avalanche
                explorer = 'https://cchain.explorer.avax.network/address/';
                break;
            case '64':
                explorer = 'https://blockscout.com/poa/xdai/address/';
                break;
            case '89':
                explorer = 'https://explorer.matic.network/address/';
                break;
            case '1666600000':
                explorer = 'https://explorer.harmony.one/address/';
                break;
        }


        if(which == 'picker' || which == 'request' || which == 'request2'){

            if(data_interactive_url != ''){
                data_interactive_url = data_interactive_url + "?erc1155Address="+erc1155+"&id="+id+"&chain_id="+chain_id
            }

            let tmpl = _this.pickerTemplate({
                which: which,
                buy : swapMode == 0 || swapMode == 1 ? ' true' : '',
                srcChainid : srcInfo[2],
                srcCollection : srcInfo[0],
                srcId : srcInfo[1],
                bridgeOnBack : bridgeBack ? chain_id : '',
                checkOpenSea : 'Open Details',
                image: data_image,
                animation_url: data_animation_url,
                audio_url: data_audio_url,
                interactive_url: data_interactive_url,
                name: data_name,
                description: data_description,
                url: data_link,
                attributes: data_attributes,
                id: id,
                erc1155: erc1155,
                supply: nft.supply,
                maxSupply: nft.maxSupply,
                balance: nft.balance,
                traitsHide : traits_hide,
                batch: isBatch ? 'true' : '',
                multiplier : multiplier,
                onsale: amount,
                ticker: await tncLib.tokenSymbolErc20(token),
                index: index,
                price: price,
                explorer : explorer + token,
                swap : swapMode == 1 || swapMode == 2 ? 'true' : '',
                options: sellerAddress.toLowerCase() == tncLib.account.toLowerCase() ? 'true' : '',
                collectionName : meta.name != 'n/a' ? '<div class="text-truncate" style="font-size: 1.4rem !important;">' + meta.name + '</div>' : '<div class="text-truncate" style="font-size: 1.4rem !important;">' + erc1155 + '</div>',
                opensea : 'collectible.html?collection=' +  erc1155 + '&id=' + id
            });

            if(which == 'picker') {

                $('#nftSwapPicker').append(tmpl);

                $('[data-toggle="popover"]').popover();

                $('#nftListing' + index).off('click');
                $('#nftListing' + index).on('click', function () {

                    $('.nftListing').css('border', 'none');
                    $('.nftListing').css('border-radius', '0');

                    $(this).css('border', '5px solid pink');
                    $(this).css('border-radius', '10px');

                    $('#nftIndex1').val($(this).data('index'));

                });
            }
            else
            {
                // in this case we return to be flexible
                return tmpl;
            }

        }else{

            if(data_interactive_url != ''){
                data_interactive_url = data_interactive_url + "?erc1155Address="+erc1155+"&id="+id+"&chain_id="+chain_id
            }

            let tmpl = _this.offerTemplate({
                buy : swapMode == 0 || swapMode == 1 ? ' true' : '',
                srcChainid : srcInfo[2],
                srcCollection : srcInfo[0],
                srcId : srcInfo[1],
                bridgeOnBack : bridgeBack ? chain_id : '',
                checkOpenSea : 'Open Details',
                image: data_image,
                animation_url: data_animation_url,
                audio_url: data_audio_url,
                interactive_url: data_interactive_url,
                name: data_name,
                description: data_description,
                url: data_link,
                attributes: data_attributes,
                id: id,
                erc1155: erc1155,
                supply: nft.supply,
                maxSupply: nft.maxSupply,
                balance: nft.balance,
                traitsHide : traits_hide,
                batch: isBatch ? 'true' : '',
                multiplier : multiplier,
                onsale: amount,
                ticker: await tncLib.tokenSymbolErc20(token),
                index: index,
                price: price,
                explorer : explorer + token,
                swap : swapMode == 1 || swapMode == 2 ? 'true' : '',
                options: sellerAddress.toLowerCase() == tncLib.account.toLowerCase() ? 'true' : '',
                collectionName : meta.name != 'n/a' ? '<div class="text-truncate" style="font-size: 1.4rem !important;">' + meta.name + '</div>' : '<div class="text-truncate" style="font-size: 1.4rem !important;">' + erc1155 + '</div>',
                opensea : 'collectible.html?collection=' +  erc1155 + '&id=' + id
            });

            $('#offersPage').append(tmpl);

            $('[data-toggle="popover"]').popover();

            $('#nftBuyButtonShortcut' + index).on('click', function(e){

                let _erc1155 = $(e.target).data('erc1155');
                let _id = $(e.target).data('id');
                let _name = $(e.target).data('name');
                let _index = $(e.target).data('index');

                $('#nftBuyErc1155Address').val( _erc1155 );
                $('#nftBuyNftId').val( _id );
                $('#nftBuyTitle').text( _name );
                $('#nftBuyIndex').val( _index );
                $('#nftBuyAmount').val('1');

                $('#nftBuyButton').click();

            });

            $('#nftBatchBuy' + index).on('click', function(e){

                let _index = $(e.target).data('index');
                _this.performBatchBuy(_index);
            });

            $('.btn-clipboard' + index).off('click');
            $('.btn-clipboard' + index).on('click', function () {

                $(this).tooltip('enable');
                let _this2 = this;
                setTimeout(function () {
                    $(_this2).tooltip('show');
                }, 100);
                setTimeout(function () {
                    $(_this2).tooltip('hide');
                }, 3000);

            });

            $('.btn-clipboard' + index).off('mouseover');
            $('.btn-clipboard' + index).on('mouseover', function () {

                $(this).tooltip('disable');

            });

        }
    };

    this.getMarketNfts = async function(address, which, category){

        let nftCount = 0;

        let asksLengths = 0;
        let length = 0;
        let stop = 0;

        if(category > 0){

            length = await tncLibMarket.getCategoriesLength(category);
        }
        else {

            asksLengths = await tncLibMarket.getAsksLengths(address);
            length = address != '' ? asksLengths[1] : asksLengths[0];
            stop = 1;
        }

        // skipping the first as it is a dummy
        for(let i = length - 1; i >= stop; i--){

            let ret = null;

            if(category > 0){

                let ask_id = await tncLibMarket.getCategory(category, i);
                ret = {ask: await tncLibMarket.getAskBase(ask_id), index: i};

            }else{

                ret = await tncLibMarket.getAsk(i, address);
            }

            let ask = ret.ask;

            let hasMore = 0;

            if( ask.erc1155Address.length > 1){

                hasMore = ask.erc1155Address.length - 1;
            }


            _this.render2(
                ask.erc1155Address[0],
                ask.id[0],
                ask.amount[0],
                ask.erc1155Address.length == 1 ? ask.pricePerItem[0] : ask.price,
                ask.tokenAddress,
                address == '' ? tncLib.account : address,
                ask.seller,
                ask.swapMode,
                ret.index,
                hasMore,
                which,
                ask.erc1155Address.length > 1 ? true : false,
                ask.erc1155Address.length - 1
            );
            await sleep(300);
            nftCount++;

            if(which == '') {

                await waitForPaging('offersPage', nftCount);
            }
        }

        if(nftCount == 0){

            let domId = 'offersPage';

            if(which == 'picker'){
                domId = 'nftSwapPicker';
            }

            if(which == 'request'){
                domId = 'incomingSwapRequests';
            }

            $('#'+domId).append(_this.noOffersTemplate({}));
        }
    };

    this.performBatchBuy = async function(index){

        let ask = await tncLibMarket.getAskBase(index);

        if(ask.seller.toLowerCase() == tncLib.account.toLowerCase()){
            _alert('You cannot buy your own sale.');
            return;
        }

        let balance = web3.utils.toBN(await tncLib.balanceOfErc20Raw(ask.tokenAddress, tncLib.account));
        let fullPrice   = web3.utils.toBN(ask.price);

        if(fullPrice.gt(balance)){

            _alert('Insufficient funds: price exceeds your balance.');
            return;
        }

        let allowance = web3.utils.toBN( await tncLib.allowanceErc20Raw(
            ask.tokenAddress,
            tncLib.account,
            tncLibMarket.market.options.address
        ) );

        if(
            allowance.lt(fullPrice)
        ){

            _alert('Please approve first, then click the buy button again.');

            $(this).prop('disabled', true);
            $(this).html('Approve first!');

            $('#nftBatchBuy'+index).prop('disabled', true);
            $('#nftBatchBuy'+index).html('Approve first!');

            let _button = this;

            await window.tncLib.approveErc20(
                ask.tokenAddress,
                fullPrice.toString(),
                tncLibMarket.market.options.address,
                function () {
                    toastr["info"]('Please wait for the transaction to finish.', "Approve....");
                },
                function (receipt) {
                    console.log(receipt);
                    toastr.remove();
                    toastr["success"]('Transaction has been finished.', "Success");
                    $(_button).prop('disabled', false);
                    $(_button).html('Buy Now!');
                    $('#nftBatchBuy'+index).prop('disabled', false);
                    $('#nftBatchBuy'+index).html('Buy');
                    $('#alertModal').modal('hide');
                },
                function () {
                    toastr.remove();
                    toastr["error"]('An error occurred with your approval transaction.', "Error");
                    $(_button).prop('disabled', false);
                    $(_button).html('Buy!');
                    $('#nftBatchBuy'+index).prop('disabled', false);
                    $('#nftBatchBuy'+index).html('Buy');
                });
        }
        else{

            toastr.remove();
            $(this).html('Pending Transaction...');
            $(this).prop('disabled', 'disabled');

            $('#nftBatchBuy'+index).prop('disabled', true);
            $('#nftBatchBuy'+index).html('Pending Transaction...');

            let _button = this;

            let _ask = ask;

            tncLibMarket.buy(
                ask.seller,
                "0",
                localStorage.getItem('marketRef') != null ? localStorage.getItem('marketRef') : '0x0000000000000000000000000000000000000000',
                index,
                function (){
                    toastr["info"]('Please wait for the transaction to finish.', "Buying....");
                },
                async function(receipt){
                    console.log(receipt);
                    toastr.remove();
                    $(_button).html('Buy!');
                    $(_button).prop('disabled', false);
                    $('#nftBatchBuy'+index).prop('disabled', false);
                    $('#nftBatchBuy'+index).html('Buy');
                    toastr["success"]('Transaction has been finished.', "Success");
                    for(let i = 0; i < _ask.erc1155Address.length; i++) {
                        _this.updateRegisteredCollections(_ask.erc1155Address[i]);
                    }
                    _alert('Purchase successful!');
                    let ask = await tncLibMarket.getAskBase(index);
                    if(ask.amounts == 0) {
                        $('#nftBuy' + index).closest('.nftListing').css('display', 'none');
                        $('#nftBatchBuy'+index).closest('.nftListing').css('display', 'none');
                    }
                },
                function(){
                    toastr.remove();
                    $(_button).prop('disabled', false);
                    $('#nftBatchBuy'+index).prop('disabled', false);
                    $('#nftBatchBuy'+index).html('Buy');
                    $(_button).html('Buy!');
                    toastr["error"]('An error occurred with your buying transaction.', "Error");
                }
            );
        }

    }

    this.performBuy = async function(){

        let ask = await tncLibMarket.getAskBase($('#nftBuyIndex').val());
        let amount = parseInt( $('#nftBuyAmount').val().trim() );
        let index = $('#nftBuyIndex').val();
        let found = false;

        for(let i = 0; i < ask.erc1155Address.length; i++){

            if(
                ask.erc1155Address[i].toLowerCase() == $('#nftBuyErc1155Address').val().toLowerCase() &&
                ask.id[i] == $('#nftBuyNftId').val()
            )
            {

                let _ask = ask;

                if(isNaN(amount) || ask.amount[i] < amount){

                    _alert('Requested amount exceeds stock.');
                    return;
                }

                if(ask.seller.toLowerCase() == tncLib.account.toLowerCase()){
                    _alert('You cannot buy your own sale.');
                    return;
                }

                let balance = web3.utils.toBN(await tncLib.balanceOfErc20Raw(ask.tokenAddress, tncLib.account));
                let price   = web3.utils.toBN(ask.pricePerItem[i]);
                amount  = web3.utils.toBN(amount);
                let fullPrice = price.mul( amount );

                if(fullPrice.gt(balance)){

                    _alert('Insufficient funds: price exceeds your balance.');
                    return;
                }

                let allowance = web3.utils.toBN( await tncLib.allowanceErc20Raw(
                    ask.tokenAddress,
                    tncLib.account,
                    tncLibMarket.market.options.address
                ) );

                console.log('ALLOWANCE: ', allowance.toString());

                if(
                    allowance.lt(fullPrice)
                ){

                    _alert('Please approve first, then click the buy button again.');

                    $(this).prop('disabled', true);
                    $(this).html('Approve first!');

                    $('#nftBuyButtonShortcut'+index).prop('disabled', true);
                    $('#nftBuyButtonShortcut'+index).html('Approve first!');

                    let _button = this;

                    await window.tncLib.approveErc20(
                        ask.tokenAddress,
                        fullPrice.toString(),
                        tncLibMarket.market.options.address,
                        function () {
                            toastr["info"]('Please wait for the transaction to finish.', "Approve....");
                        },
                        function (receipt) {
                            console.log(receipt);
                            toastr.remove();
                            toastr["success"]('Transaction has been finished.', "Success");
                            $(_button).prop('disabled', false);
                            $(_button).html('Buy Now!');
                            $('#nftBuyButtonShortcut'+index).prop('disabled', false);
                            $('#nftBuyButtonShortcut'+index).html('Buy');
                            $('#alertModal').modal('hide');
                        },
                        function () {
                            toastr.remove();
                            toastr["error"]('An error occurred with your approval transaction.', "Error");
                            $(_button).prop('disabled', false);
                            $(_button).html('Buy!');
                            $('#nftBuyButtonShortcut'+index).prop('disabled', false);
                            $('#nftBuyButtonShortcut'+index).html('Buy');
                        });
                }
                else{

                    toastr.remove();
                    $(this).html('Pending Transaction...');
                    $(this).prop('disabled', 'disabled');

                    $('#nftBuyButtonShortcut'+index).prop('disabled', true);
                    $('#nftBuyButtonShortcut'+index).html('Pending Transaction...');

                    let _button = this;

                    tncLibMarket.buy(
                        ask.seller,
                        amount.toString(),
                        _this.getUrlParam('ref') != null ? _this.getUrlParam('ref') : '0x0000000000000000000000000000000000000000',
                        index,
                        function (){
                            toastr["info"]('Please wait for the transaction to finish.', "Buying....");
                        },
                        async function(receipt){
                            console.log(receipt);
                            toastr.remove();
                            $(_button).html('Buy!');
                            $(_button).prop('disabled', false);
                            $('#nftBuyButtonShortcut'+index).prop('disabled', false);
                            $('#nftBuyButtonShortcut'+index).html('Buy');
                            toastr["success"]('Transaction has been finished.', "Success");
                            _this.updateRegisteredCollections(_ask.erc1155Address[i]);
                            $('#nftBuyModal').modal('hide');
                            _alert('Purchase successful!');
                            let ask = await tncLibMarket.getAskBase(index);
                            if(ask.amounts == 0) {
                                $('#nftBuy' + index).closest('.nftListing').css('display', 'none');
                                $('#nftBuyButtonShortcut'+index).closest('.nftListing').css('display', 'none');
                            }
                        },
                        function(){
                            toastr.remove();
                            $(_button).prop('disabled', false);
                            $('#nftBuyButtonShortcut'+index).prop('disabled', false);
                            $('#nftBuyButtonShortcut'+index).html('Buy');
                            $(_button).html('Buy!');
                            toastr["error"]('An error occurred with your buying transaction.', "Error");
                        }
                    );
                }

                found = true;
                break;
            }
        }

        if(!found){

            _alert('NFT not found.');
        }
    }

    this.performSwapRequest = async function(){

        let _nif = parseFloat( $('#nftSwapNif').val().trim() );

        if(isNaN(_nif) || _nif < 0){
            alert('Please use a valid NIF amount you would like to add to the swap.');
            return;
        }

        let nif = web3.utils.toBN(_this.resolveNumberString($('#nftSwapNif').val().trim(), 18));
        let index0 = $('#nftIndex0').val();
        let index1 = $('#nftIndex1').val();

        if(index1 == '' || index1 == 0){

            _alert('Please select an offer of yours prior requesting a swap.');
            return;
        }

        let ask = await tncLibMarket.getAskBase(index0);
        let ask1 = await tncLibMarket.getAskBase(index1);

        if(await tncLibMarket.getSwapExists(ask.seller, ask1.seller, index0)){
            _alert('You already placed a swap request for this offer.');
            return;
        }

        if(ask.updates != 0){
            _alert('The opposing offer has changed since it has been released. Swapping is not possible when the conditions changed.');
            return;
        }

        if(ask1.updates != 0){
            _alert('Your offer has changed since you have been releasing it. Swapping is not possible when the conditions changed.');
            return;
        }

        if(ask.seller == tncLib.account){

            _alert('You cannot swap your own offers.');
            return;
        }

        if(ask.swapMode == 0){

            _alert('Swapping not permitted.');
            return;
        }

        let balance = web3.utils.toBN(await tncLib.balanceOfErc20Raw(tncLib.nif.options.address, tncLib.account));
        if(balance.lt(nft)){

            _alert('Insufficient NFT funds.');
            return;
        }

        let allowance = web3.utils.toBN( await tncLib.allowanceErc20Raw(
            tncLib.nif.options.address,
            tncLib.account,
            tncLibMarket.swap.options.address
        ) );

        if(
            allowance.lt(nft)
        ){

            $(this).prop('disabled', true);
            $(this).html('Approve first!');

            let _button = this;

            await window.tncLib.approveErc20(
                tncLib.nif.options.address,
                nif.toString(),
                tncLibMarket.swap.options.address,
                function () {
                    toastr["info"]('Please wait for the transaction to finish.', "Approve....");
                },
                function (receipt) {
                    console.log(receipt);
                    toastr.remove();
                    toastr["success"]('Transaction has been finished.', "Success");
                    $(_button).prop('disabled', false);
                    $(_button).html('Swap!');
                },
                function () {
                    toastr.remove();
                    toastr["error"]('An error occurred with your approval transaction.', "Error");
                    $(_button).prop('disabled', false);
                    $(_button).html('Swap!');
                });
        }
        else{

            toastr.remove();
            $(this).html('Pending Transaction...');
            $(this).prop('disabled', 'disabled');

            let _button = this;

            tncLibMarket.requestSwap(
                index0,
                index1,
                nif.toString(),
                function (){
                    toastr["info"]('Please wait for the transaction to finish.', "Swapping....");
                },
                async function(receipt){
                    console.log(receipt);
                    toastr.remove();
                    $(_button).html('Swap!');
                    $(_button).prop('disabled', false);
                    toastr["success"]('Transaction has been finished.', "Success");
                    for(let i = 0; i < ask.erc1155Address.length; i++){
                        _this.updateRegisteredCollections(ask.erc1155Address[i]);
                    }
                    _alert('Swap request successful. If your request is getting accepted, the swap will be performed. You can cancel your request at any time.');
                },
                function(){
                    toastr.remove();
                    $(_button).prop('disabled', false);
                    $(_button).html('Swap!');
                    toastr["error"]('An error occurred with your swapping transaction.', "Error");
                }
            );
        }
    }

    this.populateBuy = async function(e){

        let erc1155 = $(e.relatedTarget).data('erc1155');
        let id = $(e.relatedTarget).data('id');
        let name = $(e.relatedTarget).data('name');
        let price = $(e.relatedTarget).data('price');
        let index = $(e.relatedTarget).data('index');
        let ticker = $(e.relatedTarget).data('ticker');

        $('#nftBuyErc1155Address').val( erc1155 );
        $('#nftBuyNftId').val( id );
        $('#nftBuyTitle').text( name );
        $('#nftBuyIndex').val( index );
        $('#nftBuyAmount').val( "1" );

        if(!isNaN(parseInt( $('#nftBuyAmount').val() ) )) {
            price = parseInt($('#nftBuyAmount').val()) * parseFloat(price);
        }
        $('#nftBuyInfo').text("Total: " + price + " " +  ticker);

        $('#nftBuyAmount').off('change');
        $('#nftBuyAmount').on('change', function(){
            let _price = "0";
            if(!isNaN(parseInt( $('#nftBuyAmount').val() ) )) {
                _price = parseInt($('#nftBuyAmount').val()) * parseFloat(price);
            }
            $('#nftBuyInfo').text("Total: " + _price + " " +  ticker);
        });

        $('#buyAddMax').off('click');
        $('#buyAddMax').on('click', async function(){
            let ask = await tncLibMarket.getAskBase(index);
            $('#nftBuyAmount').val(ask.amounts);
            $('#nftBuyAmount').change();
        });
    }

    this.populateSwap = async function(e){

        let erc1155 = $(e.relatedTarget).data('erc1155');
        let id = $(e.relatedTarget).data('id');
        let name = $(e.relatedTarget).data('name');
        let index = $(e.relatedTarget).data('index');

        $('#nftSwapPicker').html('');
        $('#nftSwapErc1155Address').val( erc1155 );
        $('#nftSwapNftId').val( id );
        $('#nftSwapTitle').text( "You want: " + name );
        $('#nftIndex0').val( index );

        _this.getMarketNfts(tncLib.account, 'picker', 0);

    }

    this.populateNftsView = async function(e){

        $('#nftsViewContainer').html('');

        let index = $(e.relatedTarget).data('index');

        let ask = await tncLibMarket.getAskBase(index);

        for(let i = 0; i < ask.erc1155Address.length; i++){

            let out = await _this.render2(
                ask.erc1155Address[i],
                ask.id[i],
                ask.amount[i],
                ask.pricePerItem[i],
                ask.tokenAddress,
                ask.seller,
                ask.seller,
                ask.swapMode,
                ask.index0,
                false,
                'request2',
                false,
                0
            );

            $('#nftsViewContainer').append(out);

            $(".popover-description").popover({
                trigger: "manual",
                html: true,
                animation: false
            }).on("mouseenter", function() {
                var _this = this;
                $(this).popover("show");
                $(".popover").on("mouseleave", function() {
                    $(_this).popover('hide');
                });
            }).on("mouseleave", function() {
                var _this = this;
                setTimeout(function() {
                    if (!$(".popover:hover").length) {
                        $(_this).popover("hide");
                    }
                }, 300);
            });
        }
    }

    this.hexToInt = function (hex) {
        return parseInt(hex.replace('0x','').replace(/\b0+/g, ''));
    }

    this.populateTransfer = async function(e){

        let erc1155 = $(e.relatedTarget).data('contractAddress');
        let id = $(e.relatedTarget).data('id');

        $('#nftTransferErc1155Address').val(erc1155);
        $('#nftTransferNftId').val(id);
    };

    this.populateInteractive = async function(e){
        let tmp = $('#interactiveBody').html();
        let url = $(e.relatedTarget).data('interactiveUrl');
        $('#nftInteractiveUrl').val(url);
        $('#runNftNewTab').off('click');
        $('#runNftNewTab').on('click', function(){
            window.open($('#nftInteractiveUrl').val(), '_blank');
        });
        $('#runNft').off('click');
        $('#runNft').on('click', function(){
            let tag = '<iframe style="width:100%;height:400px;border:none;" hspace="0" vspace="0" marginHeight="0" marginWidth="0" frameBorder="0" allowtransparency="true" src=' + JSON.stringify($('#nftInteractiveUrl').val()) + ' sandbox="allow-scripts allow-pointer-lock allow-popups allow-forms"></iframe>';
            $('#interactiveBody').html(tag);
        });
        $('#closeInteractive').off('click');
        $('#closeInteractive').on('click', function(){
            $('#interactiveBody').html(tmp);
        });
    };

    this.transfer = async function(){

        let erc1155 = $('#nftTransferErc1155Address').val();
        let id = $('#nftTransferNftId').val();
        let amount = parseInt($('#nftTransferAmount').val().trim()) || 0;

        if(!web3.utils.isAddress($('#nftTransferToAddress').val().trim())){
            _alert('Please enter a valid address.');
            return;
        }

        if(amount <= 0){
            _alert('Please enter a valid amount to transfer.');
            return;
        }

        let balance = await tncLib.balanceof(erc1155, tncLib.account, id);
        if(balance < amount){
            _alert('Insufficient balance. You own ' + balance + ' items of this NFT.');
            return;
        }

        toastr.remove();
        $('#nftTransferButton').html('Pending Transaction...');
        $('#nftTransferButton').prop('disabled', true);

        window.tncLib.transfer(
            erc1155,
            ""+id,
            ""+amount,
            $('#nftTransferToAddress').val().trim(),
            function (){
                toastr["info"]('Please wait for the transaction to finish.', "Transferring NFTs....");
            },
            function(receipt){
                console.log(receipt);
                toastr.remove();
                $('#nftTransferButton').html('Send');
                $('#nftTransferButton').prop('disabled', false);
                toastr["success"]('Transaction has been finished.', "Success");
            },
            function(){
                toastr.remove();
                $('#nftTransferButton').prop('disabled', false);
                $('#nftTransferButton').html('Send');
                toastr["error"]('An error occurred with your transfer transaction.', "Error");
            });
    };

    this.loadPage = async function (page){

        $('#collectiblePage').css('display', 'none');

        if( _this.getUrlParam('ref') != null &&
            localStorage.getItem('marketRef') == null &&
            web3.utils.isAddress(_this.getUrlParam('ref'))
        ){

            localStorage.setItem('marketRef', _this.getUrlParam('ref'));
        }

        switch (page){

            default:

                $('#nftBuyButton').on('click', _this.performBuy);
                $('#nftSwapButton').on('click', _this.performSwapRequest);

                $('#nftsView').off('show.bs.modal');
                $('#nftsView').on('show.bs.modal', _this.populateNftsView);

                $('#nftSwapModal').off('show.bs.modal');
                $('#nftSwapModal').on('show.bs.modal', _this.populateSwap);

                $('#nftBuyModal').off('show.bs.modal');
                $('#nftBuyModal').on('show.bs.modal', _this.populateBuy);

                $('#nftTransferButton').on('click', _this.transfer);

                $('#nftInteractiveModal').off('hide.bs.modal');
                $('#nftInteractiveModal').on('hide.bs.modal', _this.populateInteractive);

                $('#nftInteractiveModal').off('show.bs.modal');
                $('#nftInteractiveModal').on('show.bs.modal', _this.populateInteractive);

                $('#nftTransferModal').off('show.bs.modal');
                $('#nftTransferModal').on('show.bs.modal', _this.populateTransfer);

                $('#collectiblePage').css('display', 'grid');

                if(!web3.utils.isAddress(_this.getUrlParam('collection'))){
                    _alert('Invalid  Address Provided');
                    return;
                }

                if(!await tncLib.isErc1155Supported(_this.getUrlParam('collection'))){
                    _alert('Unsupported collection type.');
                    return;
                }
                _this.render(_this.getUrlParam('collection'), _this.getUrlParam('id'), _this.getUrlParam('market_index'), _this.getUrlParam('market_category'));

                break;
        }
    };

    this.formatNumberString = function (string, decimals) {

        let pos = string.length - decimals;

        if(decimals == 0) {
            // nothing
        }else
        if(pos > 0){
            string = string.substring(0, pos) + "." + string.substring(pos, string.length);
        }else{
            string = '0.' + ( "0".repeat( decimals - string.length ) ) + string;
        }

        return string
    };

    this.resolveNumberString = function(number, decimals){

        let splitted = number.split(".");
        if(splitted.length == 1 && decimals > 0){
            splitted[1] = '';
        }
        if(splitted.length > 1) {
            let size = decimals - splitted[1].length;
            for (let i = 0; i < size; i++) {
                splitted[1] += "0";
            }
            number = "" + (splitted[0] == 0 ? '' : splitted[0]) + splitted[1];
            if(parseInt(number) == 0){
                number = "0";
            }
        }

        return number;
    };

    this.getUrlParam = function(param_name) {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        return urlParams.get(param_name);
    };

    this.accountChangeAlert = function(){
        _alert('Account has been changed. Please <button class="btn btn-primary" onclick="location.reload()">click here</button> to reload this dapp.');
    };

    this.chainChangeAlert = function(){
        _alert('The network has been changed. Please <button class="btn btn-primary" onclick="location.reload()">click here</button> to reload this dapp.');
    };

    this.startAccountCheck = function(){

        if(window.ethereum){

            window.ethereum.on('accountsChanged', function(accounts){
                const _that = _this;
                if (accounts.length != _that.prevAccounts.length || accounts[0].toUpperCase() != _that.prevAccounts[0].toUpperCase()) {
                    _that.accountChangeAlert();
                    _that.prevAccounts = accounts;
                }
            });

        }else if(window.web3){

            setInterval( function() {
                web3.eth.getAccounts(function(err, accounts){
                    const _that = _this;
                    if (accounts.length != 0 && ( accounts.length != _that.prevAccounts.length || accounts[0].toUpperCase() != _that.prevAccounts[0].toUpperCase())) {
                        _that.accountChangeAlert();
                        _that.prevAccounts = accounts;
                    }
                });
            }, 1000);
        }
    };

    this.startChainCheck = function(){

        if(window.ethereum) {
            window.ethereum.on('chainChanged', async function (chain) {
                let actualChainId = chain.toString(16);
                console.log('chain check: ', actualChainId + " != " + _this.prevChainId);
                if (actualChainId != _this.prevChainId) {
                    _this.prevChainId = actualChainId;
                    _this.chainChangeAlert();
                }
            });

        }else if(window.web3){

            setInterval( async function() {

                if(await web3.eth.net.getId() != _this.prevChainId){
                    _this.prevChainId = await web3.eth.net.getId();
                    _this.chainChangeAlert();
                }

            }, 1000);
        }
    };

    $(document).ready(async function(){

        await web3.eth.subscribe("newBlockHeaders", async (error, event) => {
            if (!error) {
                return;
            }
            console.log(error);
        });
    });
}

function run(connected) {

    $(document).ready(async function() {

        toastr.options = {
            "closeButton": true,
            "debug": false,
            "newestOnTop": true,
            "progressBar": false,
            "positionClass": "toast-bottom-right",
            "preventDuplicates": false,
            "onclick": null,
            "showDuration": "100",
            "hideDuration": "1000",
            "timeOut": "0",
            "extendedTimeOut": "0",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        };

        let accounts = [];

        if(typeof ethereum != 'undefined' && ethereum && typeof ethereum.enable != 'undefined' && ethereum.enable){
            accounts = await web3.eth.getAccounts();
            console.log('account classic with ethereum');
        }
        else if(typeof ethereum != 'undefined' && ethereum && ( typeof ethereum.enable == 'undefined' || !ethereum.enable ) ){
            accounts = await window.ethereum.request({
                method: 'eth_requestAccounts',
            });
            console.log('account new with ethereum');
        }else{
            accounts = await web3.eth.getAccounts();
            console.log('account classic without ethereum');
        }

        window.tncLib = new TncLib();
        tncLib.account = accounts[0];
        window.tncLibMarket = new TncLibMarket();
        tncLibMarket.account = tncLib.account;

        if(typeof accounts == 'undefined' || accounts.length == 0){

            tncLib.account = '0x0000000000000000000000000000000000000000';
            tncLibMarket.account = '0x0000000000000000000000000000000000000000';
        }

        let dapp = new TncDapp();
        window.tncDapp = dapp;
        dapp.prevAccounts = accounts;
        if(window.ethereum){
            let chain = await web3.eth.getChainId()
            let actualChainId = chain.toString(16);
            dapp.prevChainId = actualChainId;
        }
        else if(window.web3){
            dapp.prevChainId = await web3.eth.net.getId();
        }
        if(window.onewallet){
            $('#onewalletAddress').css('display', 'inline-block')
            $('#onewalletAddressPopover').data('content', tncLib.account);
            $('#onewalletAddressPopover').popover();
            $('#onewalletAddressPopover').on('click', function(){
                let input = document.createElement("textarea");
                input.value = tncLib.account;
                document.body.appendChild(input);
                input.select();
                document.execCommand("Copy");
                input.remove();
            })
        }
        dapp.startAccountCheck();
        dapp.startChainCheck();
        dapp.loadPage(''); // default
    });
}
