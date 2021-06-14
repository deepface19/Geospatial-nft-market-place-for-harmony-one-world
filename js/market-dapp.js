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
import './geospatial.marketplaceNFT.sol';
import './geospatial_location.sol';
import './NFT.sol';
import './HarmonyNFT.sol';


function TncDapp() {

    //const ipfs = window.IpfsHttpClient('ipfs.infura.io', '5001', { protocol: 'https' });
    const _this = this;
    this.offerTemplate = Handlebars.compile($('#offer-template').html());
    this.pickerTemplate = Handlebars.compile($('#picker-template').html());
    this.noOffersTemplate = Handlebars.compile($('#no-offers').html());
    this.prevAccounts = [];
    this.prevChainId = '';

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
                ret = {ask: await tncLibMarket.getAskBase(ask_id), index: ask_id};

            }else{

                ret = await tncLibMarket.getAsk(i, address);
            }

            let ask = ret.ask;

            let shadowed = 'true';

            if( !blocked_collections.includes(ask.erc1155Address[0].toLowerCase()) ) {

                shadowed = 'false';
            }
            
            if( !blocked_collections.includes(ask.hrc1155Address[0].toLowerCase()) ) {

                shadowed = 'false';
            }

            let hasMore = 0;

            if (ask.erc1155Address.length > 1) {

                hasMore = ask.erc1155Address.length - 1;
            }
            
            if (ask.hrc1155Address.length > 1) {

                hasMore = ask.hrc1155Address.length - 1;
            }

            if('false' == shadowed || ( address != '' && tncLib.account.toLowerCase() == address.toLowerCase() ) ) {

                _this.render(
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
                    ask.erc1155Address.length - 1,
                    category,
                    i,
                    shadowed
                );

                nftCount++;
            }

            if('false' == shadowed || ( address != '' && tncLib.account.toLowerCase() == address.toLowerCase() ) ) {

                _this.render(
                    ask.hrc1155Address[0],
                    ask.id[0],
                    ask.amount[0],
                    ask.hrc1155Address.length == 1 ? ask.pricePerItem[0] : ask.price,
                    ask.tokenAddress,
                    address == '' ? tncLib.account : address,
                    ask.seller,
                    ask.swapMode,
                    ret.index,
                    hasMore,
                    which,
                    ask.hrc1155Address.length > 1 ? true : false,
                    ask.hrc1155Address.length - 1,
                    category,
                    i,
                    shadowed
                );

                nftCount++;
            }

            await sleep(100);


            if (which == '') {

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

    this.render = async function(erc1155, hrc1155, id, amount, price, token, address, sellerAddress, swapMode, index, hasMore, which, isBatch, multiplier, category, category_index, shadowed){

        fetchUrl(api_url + '1.0/'+chain_id+'/collections/events/URI/erc1155Address/'+erc1155+'/id/0', 5000);

        fetchUrl(api_url + '1.0/'+chain_id+'/collections/events/URI/hrc1155Address/'+hrc1155+'/id/0', 5000);

        let nft = await window.tncLib.getForeignNft(erc1155, hrc1155, address, id);

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

        // new DaVinci json uri pattern
        if(nft.uri.includes("api.davinci.gallery")){

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
        let meta = await tncLib.getHrc1155Meta(hrc1155);

        let srcInfo = [0,0,0];
        let bridgeBack = false;

        if( chain_id == '1' && erc1155.toLowerCase() == tncLibBridgeIn.uniftyverseAddress.toLowerCase()){

            srcInfo = await tncLibBridgeIn.in_getSourceInfo(id);
            srcInfo[2] = _this.hexToInt(srcInfo[2]);
            srcInfo[1] = _this.hexToInt(srcInfo[1]);
            bridgeBack = true;
        }

        if( chain_id == '1' && hrc1155.toLowerCase() == tncLibBridgeIn.uniftyverseAddress.toLowerCase()){

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

        let decimals = await tncLib.tokenDecimalsHrc20(token);
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

            if(data_interactive_url != ''){
                data_interactive_url = data_interactive_url + "?hrc1155Address="+hrc1155+"&id="+id+"&chain_id="+chain_id
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
                description: _this.truncate(data_description, 1250),
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
                shadowed: shadowed,
                explorer : explorer + token,
                swap : swapMode == 1 || swapMode == 2 ? 'true' : '',
                options: sellerAddress.toLowerCase() == tncLib.account.toLowerCase() ? 'true' : '',
                collectionName : meta.name != 'n/a' ? '<div class="text-truncate" style="font-size: 1.4rem !important;">' + meta.name + '</div>' : '<div class="text-truncate" style="font-size: 1.4rem !important;">' + erc1155 + '</div>',
                opensea : 'collectible.html?collection=' +  erc1155 + '&id=' + id + '&market_index=' + ( category > 0 ? category_index + "&market_category=" + category : index + "&market_category=0" )
            });

            let tmpl = _this.pickerTemplate({
                which: which,
                buy : swapMode == 0 || swapMode == 1 ? ' true' : '',
                srcChainid : srcInfo[2],
                srcCollection : srcInfo[0],
                srcId : srcInfo[1],
                bridgeOnBack : bridgeBack ? chain_id : '',
                checkDaVinci : 'Open Details',
                image: data_image,
                animation_url: data_animation_url,
                audio_url: data_audio_url,
                interactive_url: data_interactive_url,
                name: data_name,
                description: _this.truncate(data_description, 1250),
                url: data_link,
                attributes: data_attributes,
                id: id,
                hrc1155: hrc1155,
                supply: nft.supply,
                maxSupply: nft.maxSupply,
                balance: nft.balance,
                traitsHide : traits_hide,
                batch: isBatch ? 'true' : '',
                multiplier : multiplier,
                onsale: amount,
                ticker: await tncLib.tokenSymbolHrc20(token),
                index: index,
                price: price,
                shadowed: shadowed,
                explorer : explorer + token,
                swap : swapMode == 1 || swapMode == 2 ? 'true' : '',
                options: sellerAddress.toLowerCase() == tncLib.account.toLowerCase() ? 'true' : '',
                collectionName : meta.name != 'n/a' ? '<div class="text-truncate" style="font-size: 1.4rem !important;">' + meta.name + '</div>' : '<div class="text-truncate" style="font-size: 1.4rem !important;">' + hrc1155 + '</div>',
                opensea : 'collectible.html?collection=' +  hrc1155 + '&id=' + id + '&market_index=' + ( category > 0 ? category_index + "&market_category=" + category : index + "&market_category=0" )
            });

            if(which == 'picker') {

                $('#nftSwapPicker').append(tmpl);

                // $('[data-toggle="popover"]').popover();
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

            if(data_interactive_url != ''){
                data_interactive_url = data_interactive_url + "?hrc1155Address="+hrc1155+"&id="+id+"&chain_id="+chain_id
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
                description: _this.truncate(data_description, 1250),
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
                shadowed: shadowed,
                explorer : explorer + token,
                swap : swapMode == 1 || swapMode == 2 ? 'true' : '',
                options: sellerAddress.toLowerCase() == tncLib.account.toLowerCase() ? 'true' : '',
                collectionName : meta.name != 'n/a' ? '<div class="text-truncate" style="font-size: 1.4rem !important;">' + meta.name + '</div>' : '<div class="text-truncate" style="font-size: 1.4rem !important;">' + erc1155 + '</div>',
                opensea : 'collectible.html?collection=' +  erc1155 + '&id=' + id + '&market_index=' + ( category > 0 ? category_index + "&market_category=" + category : index + "&market_category=0" )
            });

            let tmpl = _this.offerTemplate({
                buy : swapMode == 0 || swapMode == 1 ? ' true' : '',
                srcChainid : srcInfo[2],
                srcCollection : srcInfo[0],
                srcId : srcInfo[1],
                bridgeOnBack : bridgeBack ? chain_id : '',
                checkDaVinci : 'Open Details',
                image: data_image,
                animation_url: data_animation_url,
                audio_url: data_audio_url,
                interactive_url: data_interactive_url,
                name: data_name,
                description: _this.truncate(data_description, 1250),
                url: data_link,
                attributes: data_attributes,
                id: id,
                hrc1155: hrc1155,
                supply: nft.supply,
                maxSupply: nft.maxSupply,
                balance: nft.balance,
                traitsHide : traits_hide,
                batch: isBatch ? 'true' : '',
                multiplier : multiplier,
                onsale: amount,
                ticker: await tncLib.tokenSymbolHrc20(token),
                index: index,
                price: price,
                shadowed: shadowed,
                explorer : explorer + token,
                swap : swapMode == 1 || swapMode == 2 ? 'true' : '',
                options: sellerAddress.toLowerCase() == tncLib.account.toLowerCase() ? 'true' : '',
                collectionName : meta.name != 'n/a' ? '<div class="text-truncate" style="font-size: 1.4rem !important;">' + meta.name + '</div>' : '<div class="text-truncate" style="font-size: 1.4rem !important;">' + hrc1155 + '</div>',
                opensea : 'collectible.html?collection=' +  hrc1155 + '&id=' + id + '&market_index=' + ( category > 0 ? category_index + "&market_category=" + category : index + "&market_category=0" )
            });

            $('#offersPage').append(tmpl);

            // $('[data-toggle="popover"]').popover();
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

    this.truncate = function(str, n){
        return (str.length > n) ? str.substr(0, n-1) + '&hellip;' : str;
    }

    this.performCancellation = async function(){

        toastr.remove();
        $(this).html('Pending Transaction...');
        $(this).prop('disabled', 'disabled');

        let _button = this;

        tncLibMarket.cancel(
            $('#nftBuyIndex').val(),
            function (){
                toastr["info"]('Please wait for the transaction to finish.', "Cancelling....");
            },
            function(receipt){
                console.log(receipt);
                toastr.remove();
                $(_button).html('Cancel');
                $(_button).prop('disabled', false);
                toastr["success"]('Transaction has been finished.', "Success");
                $('#nftCancelModal').modal('hide');
                _alert('Cancellation successful!');
                $('#nftCancel'+$('#nftBuyIndex').val()).closest('.nftListing').css('display', 'none');
            },
            function(){
                toastr.remove();
                $(_button).prop('disabled', false);
                $(_button).html('Cancel');
                toastr["error"]('An error occurred with your cancellation transaction.', "Error");
            }
        );
    }

    this.performBatchBuy = async function(index){

        let ask = await tncLibMarket.getAskBase(index);

        if(ask.seller.toLowerCase() == tncLib.account.toLowerCase()){
            _alert('You cannot buy your own sale.');
            return;
        }

        let balance = web3.utils.toBN(await tncLib.balanceOfErc20Raw(ask.tokenAddress, tncLib.account));
        let balance = web3.utils.toBN(await tncLib.balanceOfHrc20Raw(ask.tokenAddress, tncLib.account));
        let fullPrice   = web3.utils.toBN(ask.price);

        if(fullPrice.gt(balance)){

            _alert('Insufficient funds: price exceeds your balance.');
            return;
        }

        let allowance = web3.utils.toBN( await tncLib.allowanceHrc20Raw(
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
            await window.tncLib.approveHrc20(
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
                    for(let i = 0; i < _ask.hrc1155Address.length; i++) {
                        _this.updateRegisteredCollections(_ask.hrc1155Address[i]);
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

        for(let i = 0; i < ask.erc1155Address.length, ask.hrc1155Address.length; i++){

            if(
                ask.erc1155Address[i].toLowerCase() == $('#nftBuyErc1155Address').val().toLowerCase() &&
                ask.id[i] == $('#nftBuyNftId').val()
            )
            if(
                ask.hrc1155Address[i].toLowerCase() == $('#nftBuyHrc1155Address').val().toLowerCase() &&
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
                let balance = web3.utils.toBN(await tncLib.balanceOfHrc20Raw(ask.tokenAddress, tncLib.account));
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
                let allowance = web3.utils.toBN( await tncLib.allowanceHrc20Raw(
                    ask.tokenAddress,
                    tncLib.account,
                    tncLibMarket.market.options.address
                ) );
            

                console.log('ALLOWANCE: ', allowance.toString());
                console.log('PRICE: ', price.toString());
                console.log('AMOUNT: ', amount.toString());
                console.log('FULL PRICE: ', fullPrice.toString());
                console.log('BALANCE: ', balance.toString());
                console.log('TOKEN ADDRESS: ', ask.tokenAddress);
                console.log('ACCOUNT: ', tncLib.account);

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
                        await window.tncLib.approveHrc20(
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

        let _nft = parseFloat( $('#nftSwapnft').val().trim() );

        if(isNaN(_nft) || _nft < 0){
            alert('Please use a valid nft amount you would like to add to the swap.');
            return;
        }

        let nif = web3.utils.toBN(_this.resolveNumberString($('#nftSwapnft').val().trim(), 18));
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
        let balance = web3.utils.toBN(await tncLib.balanceOfHrc20Raw(tncLib.nif.options.address, tncLib.account));

        if(balance.lt(nft)){

            _alert('Insufficient  funds.');
            return;
        }

        let allowance = web3.utils.toBN( await tncLib.allowanceErc20Raw(
            tncLib.any.options.address,
            tncLib.account,
            tncLibMarket.swap.options.address
        ) );
        let allowance = web3.utils.toBN( await tncLib.allowanceHrc20Raw(
            tncLib.any.options.address,
            tncLib.account,
            tncLibMarket.swap.options.address
        ) );

        if(
            allowance.lt(any)
        ){

            $(this).prop('disabled', true);
            $(this).html('Approve first!');

            let _button = this;

            await window.tncLib.approveErc20(
                tncLib.any.options.address,
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
                await window.tncLib.approveHrc20(
                    tncLib.any.options.address,
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
                    for(let i = 0; i < ask.hrc1155Address.length; i++){
                        _this.updateRegisteredCollections(ask.hrc1155Address[i]);
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

    this.updateRegisteredCollections = async function(address){

        let collectionAddresses = [];

        if(localStorage.getItem('collectionAddresses'+chain_id)){
            collectionAddresses = JSON.parse(localStorage.getItem('collectionAddresses'+chain_id));
        }

        if(!collectionAddresses.includes(address)) {
            collectionAddresses.push(address);
            localStorage.setItem('collectionAddresses'+chain_id, JSON.stringify(collectionAddresses));
        }

    }

    this.populateBuy = async function(e){

        let erc1155 = $(e.relatedTarget).data('erc1155');
        let hrc1155 = $(e.relatedTarget).data('hrc1155');
        let id = $(e.relatedTarget).data('id');
        let name = $(e.relatedTarget).data('name');
        let price = $(e.relatedTarget).data('price');
        let index = $(e.relatedTarget).data('index');
        let ticker = $(e.relatedTarget).data('ticker');

        $('#nftBuyErc1155Address').val( erc1155 );
        $('#nftBuyHrc1155Address').val( hrc1155 );
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

    this.populateInteractive = async function(e){
        window.interactiveDefault = $('#interactiveBody').html();
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
            $('#interactiveBody').html(window.interactiveDefault);
        });
    };

    this.populateCancellation = async function(e){

        let index = $(e.relatedTarget).data('index');
        $('#nftBuyIndex').val( index );
    }

    this.populateTokenLookup = async function(e){

        $("#lookupToken").html('');

        switch(chain_id){
           case '64': // xDai
                var o = new Option("HNY", " ");
                $(o).html("HNY");
                $("#nftSellToken2").append(o);

                var o2 = new Option(" ()", " ");
                $(o2).html(" ()");
                $("#nftSellToken2").append(o2);

                var o3 = new Option("COLD", " ");
                $(o3).html("COLD");
                $("#nftSellToken2").append(o3);

                var o4 = new Option("wxDai (Wrapped xDai)", " ");
                $(o4).html("wxDai (Wrapped xDai)");
                $("#nftSellToken2").append(o4);

                var o6 = new Option("WETH (Wrapped Ether)", " ");
                $(o6).html("WETH (Wrapped Ether)");
                $("#nftSellToken2").append(o6);

                var o5 = new Option("AGVE (Agave Token)", " ");
                $(o5).html("AGVE (Agave Token)");
                $("#nftSellToken2").append(o5);

                var o6 = new Option("USDC", " ");
                $(o6).html("USDC");
                $("#nftSellToken2").append(o6);
                break;
            case '4d': // xDai (SPOA) Testnet
                var o = new Option("  ( )", " ");
                $(o).html("  ( )");
                $("#nftSellToken2").append(o);
                break;
            case '507': // xDai (SPOA) Testnet
                var o = new Option("  ( )", " ");
                $(o).html("  ( )");
                $("#nftSellToken2").append(o);
                break;
            case 'a4ec': // CELO

                var o = new Option("CELO (token)", " ");
                $(o).html("CELO (token)");
                $("#lookupToken").append(o);
                console.log($("#lookupToken").html());

                var o2 = new Option("CUSD", " ");
                $(o2).html("CUSD");
                $("#lookupToken").append(o2);
                console.log($("#lookupToken").html());

                break;
            case 'a86a': // AVALANCHE

                var o = new Option("WAVAX (Wrapped AVAX)", " ");
                $(o).html("WAVAX (Wrapped AVAX)");
                $("#lookupToken").append(o);
                console.log($("#lookupToken").html());

                break;
            case '1666600000': // HARMONY

                var o = new Option("WONE (Wrapped ONE)", " ");
                $(o).html("WONE (Wrapped ONE)");
                $("#lookupToken").append(o);
                console.log($("#lookupToken").html());
                
                break;
               case 'a86a': // CELO
                var o = new Option("WBNB (Wrapped BNB)", " ");
                $(o).html("WBNB (Wrapped BNB)");
                $("#nftSellToken2").append(o);

                var o3 = new Option("CAKE", " ");
                $(o3).html("CAKE");
                $("#nftSellToken2").append(o3);

                var o4 = new Option("BUSD", " ");
                $(o4).html("BUSD");
                $("#nftSellToken2").append(o4);

                var o5 = new Option("ETH", " ");
                $(o5).html("ETH");
                $("#nftSellToken2").append(o5);

                var o6 = new Option("TETHER", " ");
                $(o6).html("TETHER");
                $("#nftSellToken2").append(o6);

                var o7 = new Option("BDT (Block Duelers)", " ");
                $(o7).html("BDT (Block Duelers)");
                $("#nftSellToken2").append(o7);

                var o8 = new Option("DC (Duelers Credits)", " ");
                $(o8).html("DC (Duelers Credits)");
                $("#nftSellToken2").append(o8);
                
                var o9 = new Option("ONE", " ");
                $(o9).html("ONE");
                $("#nftSellToken2").append(o9);
                break;
           case '89': // Matic Mainnet
                var o = new Option("wMatic (Wrapped Matic)", " ");
                $(o).html("Matic (Wrapped)");
                $("#nftSellToken2").append(o);

                break;
           case '1666600000': // Harmony MAINET
                var o = new Option("wOne (Wrapped One)", " ");
                $(o).html("One (Wrapped)");
                $("#nftSellToken2").append(o); 
                break;
            case '61': // BSC TESTNET
                var o = new Option(" ()", " ");
                $(o).html(" ()");
                $("#nftSellToken2").append(o);
                break;
            case '4': // ETHEREUM TESTNET
                var o = new Option(" ()", " ");
                $(o).html(" ()");
                $("#nftSellToken2").append(o);
                break;
            default: // ETHEREUM MAINNET
                var o = new Option(" ()", "");
                $(o).html(" ()");
                $("#nftSellToken2").append(o);
                var o2 = new Option("WETH (Wrapped Ether)", " ");
                $(o2).html("WETH (Wrapped Ether)");
                $("#nftSellToken2").append(o2);
                
             }

        var o = new Option("Custom...", "custom");
        $(o).html("Custom...");
        $("#lookupToken").append(o);

        let currToken = $('#lookupToken').val();

        $('#lookupToken').off('change');
        $('#lookupToken').on('change', function(){
            $('#withdrawFundsButton').css('display', 'none');
            $('#lookupInfo').text('');
            if($(this).val() == 'custom'){
                currToken = $('#lookupTokenAddress').val().trim();
                $('#lookupTokenWrapper').css('display', 'block');
            }else{
                currToken = $('#lookupToken').val();
                $('#lookupTokenWrapper').css('display', 'none');
            }
        });

        $('#lookupTokenAddress').off('change');
        $('#lookupTokenAddress').on('change', function(){
            currToken = $('#lookupTokenAddress').val().trim();
        });

        $('#lookupButton').off('click');
        $('#lookupButton').on('click', async function(){

            if(await web3.utils.isAddress(currToken)){
                try {
                    let funds = await tncLibMarket.getFunds(tncLib.account, currToken);
                    let symbol = await tncLib.tokenSymbolErc20(currToken);
                    $('#lookupInfo').text('Funds: ' + (
                        _this.formatNumberString(
                            ""+funds,
                            await tncLib.tokenDecimalsErc20(currToken)
                        )
                    ) + " " + symbol);
                    let testFunds = web3.utils.toBN(funds);
                    let testZero = web3.utils.toBN("0");
                    if(testFunds.gt(testZero)) {
                        $('#withdrawFundsButton').css('display', 'inline-block');
                    }else{
                        $('#withdrawFundsButton').css('display', 'none');
                    }
                }catch (e){
                    $('#lookupInfo').text('No valid token!');
                }
            }
            else{
                $('#lookupInfo').text('Invalid token address!');
            }
        });

        $('#withdrawFundsButton').off('click');
        $('#withdrawFundsButton').on('click', async function(){

            toastr.remove();
            $(this).html('Pending Transaction...');
            $(this).prop('disabled', 'disabled');

            let _button = this;

            tncLibMarket.withdrawFunds(
                currToken,
                function (){
                    toastr["info"]('Please wait for the transaction to finish.', "Withdrawing....");
                },
                function(receipt){
                    console.log(receipt);
                    toastr.remove();
                    $(_button).html('Withdraw');
                    $(_button).prop('disabled', false);
                    toastr["success"]('Transaction has been finished.', "Success");
                    $('#withdrawFundsModal').modal('hide');
                    $('#withdrawFundsButton').css('display', 'none');
                    $('#lookupInfo').text('');
                    _alert('Withdraw successful!');
                },
                function(){
                    toastr.remove();
                    $(_button).prop('disabled', false);
                    $(_button).html('Withdraw');
                    toastr["error"]('An error occurred with your withdrawal transaction.', "Error");
                }
            );
        });
    }

    this.populateSwap = async function(e){

        let erc1155 = $(e.relatedTarget).data('erc1155');
        let hrc1155 = $(e.relatedTarget).data('hrc1155');
        let id = $(e.relatedTarget).data('id');
        let name = $(e.relatedTarget).data('name');
        let index = $(e.relatedTarget).data('index');

        $('#nftSwapPicker').html('');
        $('#nftSwapErc1155Address').val( erc1155 );
        $('#nftSwapHrc1155Address').val( hrc1155 );
        $('#nftSwapNftId').val( id );
        $('#nftSwapTitle').text( "You want: " + name );
        $('#nftIndex0').val( index );

        _this.getMarketNfts(tncLib.account, 'picker', 0);

    }

    this.getWalletNfts = async function(address){

        let nftCount = 0;
        let collections = [];

        // 
        if(chain_id == '1') {
            let verse = tncLibBridgeIn.uniftyverse.options.address;
            collections.push(verse);
            let nfts = await tncLib.getNftsByAddress(address, verse);
            for (let i = 0; i < nfts.length; i++) {
                if (await tncLib.balanceof(verse, address, nfts[i]) > 0) {
                    _this.renderSellSelection(verse, nfts[i], address);
                    await sleep(300);
                    nftCount++;
                    await waitForDiv($('#nftSellWallet'), nftCount);
                }
            }
        }

        // my NFTs collections
        let length = await tncLib.getErc1155Length(address);

        for(let i = length - 1; i >= 0; i--){
            let myCollection = await tncLib.getErc1155(address, i);
            collections.push(myCollection.erc1155);
            let nfts = await tncLib.getNftsByAddress(address, myCollection.erc1155);
            for(let j = 0; j < nfts.length; j++){
                if(await tncLib.balanceof(myCollection.erc1155, address, nfts[j]) > 0) {
                    _this.renderSellSelection(myCollection.erc1155, nfts[j], address);
                    await sleep(300);
                    nftCount++;
                    await waitForDiv($('#nftSellWallet'), nftCount);
                }
            }
        }

        let length = await tncLib.getHrc1155Length(address);

        for(let i = length - 1; i >= 0; i--){
            let myCollection = await tncLib.getHrc1155(address, i);
            collections.push(myCollection.hrc1155);
            let nfts = await tncLib.getNftsByAddress(address, myCollection.erc1155);
            for(let j = 0; j < nfts.length; j++){
                if(await tncLib.balanceof(myCollection.hrc1155, address, nfts[j]) > 0) {
                    _this.renderSellSelection(myCollection.hrc1155, nfts[j], address);
                    await sleep(300);
                    nftCount++;
                    await waitForDiv($('#nftSellWallet'), nftCount);
                }
            }
        }

        // rarible collection
        if(chain_id == '1') {
            let rarible = '0xd07dc4262BCDbf85190C01c996b4C06a461d2430';
            collections.push(rarible);
            let nfts = await tncLib.getNftsByAddress(address, rarible);
            for (let i = 0; i < nfts.length; i++) {
                if (await tncLib.balanceof(rarible, address, nfts[i]) > 0) {
                    _this.renderSellSelection(rarible, nfts[i], address);
                    await sleep(300);
                    nftCount++;
                    await waitForDiv($('#nftSellWallet'), nftCount);
                }
            }
        }

        // given custom collections
        let collectionAddresses = [];

        if(localStorage.getItem('collectionAddresses'+chain_id)){
            collectionAddresses = JSON.parse(localStorage.getItem('collectionAddresses'+chain_id));
        }

        for(let i = 0; i < collectionAddresses.length; i++){
            let custom = collectionAddresses[i];
            if(collections.includes(custom)){
                continue;
            }

            let nfts = await tncLib.getNftsByAddress(address, custom);

            for(let j = 0; j < nfts.length; j++){
                if(await tncLib.balanceof(custom, address, nfts[j]) > 0) {
                    _this.renderSellSelection(custom, nfts[j], address);
                    await sleep(300);
                    nftCount++;
                    await waitForDiv($('#nftSellWallet'), nftCount);
                }
            }
        }

        if(nftCount == 0){

            // default text
        }
    };

    this.renderSellSelection = async function(erc1155Address, hrc1155Address, id, address){

        let nft = await window.tncLib.getForeignNft(erc1155Address, hrc1155Address, address, id);

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

         // new davinci json uri pattern
         if(nft.uri.includes("api.davinci.gallery")){

            let nftUri = nft.uri;
            nftUri = decodeURI(nftUri).replace("{id}", id);
            nftUri = nftUri.split("/");
            if(nftUri.length > 0 && nftUri[ nftUri.length - 1 ].startsWith("0x")){
                nftUri[ nftUri.length - 1 ] = nftUri[ nftUri.length - 1 ].replace("0x", "");
                nft.uri = nftUri.join("/");
            }
        }

        nft.uri  = decodeURI(nft.uri).replace("{id}", id);

        let erc1155Meta = await tncLib.getErc1155Meta(erc1155Address);
        let erc1155Name = erc1155Meta.name;

        let hrc1155Meta = await tncLib.getHrc1155Meta(hrc1155Address);
        let hrc1155Name = hrc1155Meta.name;

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
                data_name = typeof data.name != 'undefined' && data.name ? data.name : "#"+id;
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
                    data_name = typeof data.name != 'undefined' && data.name ? data.name : "#"+id;
                    data_description = typeof data.description != 'undefined' && data.description ? data.description : '';
                    data_link = typeof data.external_link != 'undefined' && data.external_link ? data.external_link : '';
                    data_attributes = typeof data.attributes != 'undefined' && data.attributes ? data.attributes : [];
                }
            }catch (e){}

        }

        let name = '';
        if(typeof data_name != "undefined" && data_name != '') {
            name = data_name;
        }

        let image = '';
        if(typeof data_image != "undefined" && data_image != '') {
            image = '<img src="' + data_image + '" border="0" style="width: 50px;" />';
        }

        let out = '<div class="row mb-5">';
        out += '<div class="col-2">';
        out += image;
        out += '</div>';
        out += '<div class="col-7">';
        out += erc1155Name + ' / ' + name;
        out += '</div>';
        out += '<div class="col-3">';
        out += '<input type="text" value="" placeholder="0" style="width: 50px;" data-erc1155address="'+erc1155Address+'" data-id="'+id+'" id="amountToAdd'+erc1155Address+id+'"/>';
        out += '<br/>You own: ' + nft.balance;
        out += '</div>';
        out += '</div>';

        $('#nftSellWallet').append(out);

        $('#amountToAdd'+erc1155Address+hrc1155Address+id).off('change');
        $('#amountToAdd'+erc1155Address+hrc1155Address+id).on('change', async function(e){

            let amount = parseInt($(this).val());

            if(!isNaN(amount) && amount > 0){

                let balance = await tncLib.balanceof($(e.target).data('erc1155address'), tncLib.account, $(e.target).data('id'));
                if(balance < amount){
                    _alert('Insufficient balance. You own ' + balance + ' items of this NFT.');
                    return;
                }
                let balance = await tncLib.balanceof($(e.target).data('hrc1155address'), tncLib.account, $(e.target).data('id'));
                if(balance < amount){
                    _alert('Insufficient balance. You own ' + balance + ' items of this NFT.');
                    return;
                }

                let approved = await tncLib.erc1155IsApprovedForAll(tncLib.account, tncLibMarket.market.options.address, $(e.target).data('erc1155address'));
                let approved = await tncLib.hrc1155IsApprovedForAll(tncLib.account, tncLibMarket.market.options.address, $(e.target).data('hrc1155address'));

                if(!approved){

                    _alert('Please approve the NFT to be sold.');

                    tncLib.erc1155SetApprovalForAll(
                        tncLibMarket.market.options.address,
                        true,
                        $(e.target).data('erc1155address'),
                        function () {
                            toastr["info"]('Please wait for the transaction to finish.', "Set approval for all....");
                        },
                        function (receipt) {
                            console.log(receipt);
                            toastr.remove();
                            toastr["success"]('Transaction has been finished.', "Success");
                            $('#alertModal').modal('hide');
                        },
                        function (err) {
                            toastr.remove();
                            let errMsg = 'An error occurred with your set approval for all transaction.';
                            toastr["error"](errMsg, "Error");
                            $('#alertModal').modal('hide');
                            $('#amountToAdd'+erc1155Address+id).val('');
                        }
                    );
                    tncLib.hrc1155SetApprovalForAll(
                        tncLibMarket.market.options.address,
                        true,
                        $(e.target).data('hrc1155address'),
                        function () {
                            toastr["info"]('Please wait for the transaction to finish.', "Set approval for all....");
                        },
                        function (receipt) {
                            console.log(receipt);
                            toastr.remove();
                            toastr["success"]('Transaction has been finished.', "Success");
                            $('#alertModal').modal('hide');
                        },
                        function (err) {
                            toastr.remove();
                            let errMsg = 'An error occurred with your set approval for all transaction.';
                            toastr["error"](errMsg, "Error");
                            $('#alertModal').modal('hide');
                            $('#amountToAdd'+hrc1155Address+id).val('');
                        }
                    );
                }
            }
        });
    }

    this.populateSellSelection = async function(){

        $('#nftSellWallet').html('');
        _this.getWalletNfts(tncLib.account);

        $("#nftSellToken2").html('');

        switch(chain_id){
            case '64': // xDai
                var o = new Option("HNY", " ");
                $(o).html("HNY");
                $("#nftSellToken2").append(o);

                var o2 = new Option(" ()", " ");
                $(o2).html(" ()");
                $("#nftSellToken2").append(o2);

                var o3 = new Option("COLD", " ");
                $(o3).html("COLD");
                $("#nftSellToken2").append(o3);

                var o4 = new Option("wxDai (Wrapped xDai)", " ");
                $(o4).html("wxDai (Wrapped xDai)");
                $("#nftSellToken2").append(o4);

                var o6 = new Option("WETH (Wrapped Ether)", " ");
                $(o6).html("WETH (Wrapped Ether)");
                $("#nftSellToken2").append(o6);

                var o5 = new Option("AGVE (Agave Token)", " ");
                $(o5).html("AGVE (Agave Token)");
                $("#nftSellToken2").append(o5);

                var o6 = new Option("USDC", " ");
                $(o6).html("USDC");
                $("#nftSellToken2").append(o6);
                break;
            case '4d': // xDai (SPOA) Testnet
                var o = new Option("  ( )", " ");
                $(o).html("  ( )");
                $("#nftSellToken2").append(o);
                break;
            case '507': // xDai (SPOA) Testnet
                var o = new Option("  ( )", " ");
                $(o).html("  ( )");
                $("#nftSellToken2").append(o);
                break;
            case 'a4ec': // CELO
                var o = new Option("CELO (token)", " ");
                $(o).html("CELO (token)");
                $("#nftSellToken2").append(o);
                console.log($("#nftSellToken2").html());

                var o2 = new Option("CUSD", " ");
                $(o2).html("CUSD");
                $("#nftSellToken2").append(o2);
                console.log($("#nftSellToken2").html());
                break;
            case 'a86a': // AVALANCHE
                var o = new Option("WAVAX (Wrapped AVAX)", " ");
                $(o).html("WAVAX (Wrapped AVAX)");
                $("#nftSellToken2").append(o);
                console.log($("#nftSellToken2").html());
                break;
            case '1666600000': // HARMONY
                var o = new Option("WONE (Wrapped ONE)", " ");
                $(o).html("WONE (Wrapped ONE)");
                $("#nftSellToken2").append(o);
                console.log($("#nftSellToken2").html());
                break;
            case '38': // BSC MAINNET
                var o2 = new Option("b ( )", " ");
                $(o2).html("b ( )");
                $("#nftSellToken2").append(o2);

                var o = new Option("WBNB (Wrapped BNB)", " ");
                $(o).html("WBNB (Wrapped BNB)");
                $("#nftSellToken2").append(o);

                var o3 = new Option("CAKE", " ");
                $(o3).html("CAKE");
                $("#nftSellToken2").append(o3);

                var o4 = new Option("BUSD", " ");
                $(o4).html("BUSD");
                $("#nftSellToken2").append(o4);

                var o5 = new Option("ETH", " ");
                $(o5).html("ETH");
                $("#nftSellToken2").append(o5);

                var o6 = new Option("TETHER", " ");
                $(o6).html("TETHER");
                $("#nftSellToken2").append(o6);

                var o7 = new Option("BDT (Block Duelers)", " ");
                $(o7).html("BDT (Block Duelers)");
                $("#nftSellToken2").append(o7);

                var o8 = new Option("DC (Duelers Credits)", " ");
                $(o8).html("DC (Duelers Credits)");
                $("#nftSellToken2").append(o8);
                
                var o9 = new Option("ONE", " ");
                $(o9).html("ONE");
                $("#nftSellToken2").append(o9);
                break;
            case '89': // Matic Mainnet
                var o = new Option("wMatic (Wrapped Matic)", " ");
                $(o).html("Matic (Wrapped)");
                $("#nftSellToken2").append(o);

                break;
           case '1666600000': // Harmony MAINET
                var o = new Option("wOne (Wrapped One)", " ");
                $(o).html("One (Wrapped)");
                $("#nftSellToken2").append(o); 
                break;
            case '61': // BSC TESTNET
                var o = new Option(" ()", " ");
                $(o).html(" ()");
                $("#nftSellToken2").append(o);
                break;
            case '4': // ETHEREUM TESTNET
                var o = new Option(" ()", " ");
                $(o).html(" ()");
                $("#nftSellToken2").append(o);
                break;
            default: // ETHEREUM MAINNET
                var o = new Option(" ()", "");
                $(o).html(" ()");
                $("#nftSellToken2").append(o);
                var o2 = new Option("WETH (Wrapped Ether)", " ");
                $(o2).html("WETH (Wrapped Ether)");
                $("#nftSellToken2").append(o2);
        }

        var o = new Option("Custom...", "custom");
        $(o).html("Custom...");
        $("#nftSellToken2").append(o);

        $('#nftSellToken2').off('change');
        $('#nftSellToken2').on('change', function(){
            if($(this).val() == 'custom'){
                $('#nftSellCustomTokenAddressWrapper2').css('display', 'block');
            }else{
                $('#nftSellCustomTokenAddressWrapper2').css('display', 'none');
            }
        });

        $('#nftSellCustomTokenAddress2').off('change');
        $('#nftSellCustomTokenAddress2').on('change', async function(){

            let token = $(this).val().trim();
            if(await web3.utils.isAddress(token)){
                try {
                    let symbol = await tncLib.tokenSymbolErc20(token);
                    $('#nftSellCustomTokenAddressInfo2').text('Selected token: ' + symbol);
                }catch (e){
                    $('#nftSellCustomTokenAddressInfo2').text('No valid token!');
                }
            }
            else{
                $('#nftSellCustomTokenAddressInfo2').text('Invalid token address!');
            }

        });


    }

    this.swapOtherRequests = async function(){

        $('#outgoingSwapRequests').html('');

        let nftCount = 0;
        let length = await tncLibMarket.getSwapRequestsListLength(tncLib.account);

        let out = '<div class="row mb-5">';
        out += '<div class="col" style="text-align: center;">Yours</div>';
        out += '<div class="col"> </div>';
        out += '<div class="col" style="text-align: center;">Offered</div>';
        out += '</div>';

        $('#outgoingSwapRequests').append(out);

        for(let i = length - 1; i >= 0; i--){

            out = '<div class="row mb-5">';

            let listEntry = await tncLibMarket.getSwapRequestListEntry(tncLib.account, i);

            let request = await tncLibMarket.getSwapRequest(listEntry.seller, listEntry.swapIndex);

            // "the other"
            let ask0    = await tncLibMarket.getAskBase(request.index0);
            // "mine"
            let ask1    = await tncLibMarket.getAskBase(request.index1);

            let hasMore0 = 0;

            let hasMore1 = 0;

            if( ask0.erc1155Address.length > 1){

                hasMore0 = ask0.erc1155Address.length - 1;
            }

            if( ask1.erc1155Address.length > 1){

                hasMore1 = ask1.erc1155Address.length - 1;
            }
            if( ask0.hrc1155Address.length > 1){

                hasMore0 = ask0.hrc1155Address.length - 1;
            }

            if( ask1.hrc1155Address.length > 1){

                hasMore1 = ask1.hrc1155Address.length - 1;
            }

            let anyAmount = web3.utils.toBN(request.nifAmount);
            let zero      = web3.utils.toBN('0');
            let extraNif = '';
            if(ANYAmount.gt(zero)){
                extraAny = _this.formatNumberString(anyAmount.toString(), 18);
                extraAny = '<div style="margin-top: -10px; color: #ffffff; font-size: 2rem;" class="mb-1">+'+extraAny.substring(0, extraAny.length - 10)+' ANY</div>';
            }

            out += '<div class="col">';

            out += extraAny;

            out += await _this.render(
                ask1.erc1155Address[0],
                ask1.id[0],
                ask1.amount[0],
                ask1.pricePerItem[0],
                ask1.tokenAddress,
                ask1.seller,
                ask1.seller,
                ask1.swapMode,
                request.index1,
                hasMore1,
                'request',
                ask1.erc1155Address.length > 1,
                ask1.erc1155Address.length - 1
            );
            out += await _this.render(
                ask1.hrc1155Address[0],
                ask1.id[0],
                ask1.amount[0],
                ask1.pricePerItem[0],
                ask1.tokenAddress,
                ask1.seller,
                ask1.seller,
                ask1.swapMode,
                request.index1,
                hasMore1,
                'request',
                ask1.hrc1155Address.length > 1,
                ask1.hrc1155Address.length - 1
            );

            out += '</div><div class="col" style="text-align: center; margin-bottom: 50px;">';

            let info = '';

            if(!request.settled && !request.rejected) {
                out += '<button type="button" class="cancelSwapButton btn btn-danger mt-lg-5" data-seller="'+ask0.seller+'" data-swapindex="'+listEntry.swapIndex+'" id="cancelSwapButton' + i + '">Cancel</button>';
            }else if(request.settled){
                info += '<div>Swapped</div><br/>';
            }else if(request.rejected){
                info += '<div>Cancelled</div><br/>';
            }

            if(ask0.amounts == 0 && !request.settled && !request.rejected){
                info += '<div>The other offer ended</div><br/>';
            }

            if(ask1.amounts == 0 && !request.settled && !request.rejected){
                info += '<div>Your offer ended</div><br/>';
            }

            if(ask0.updates > 0 && !request.settled && !request.rejected){
                info += '<div>The other offer changed</div><br/>';
            }

            if(ask1.updates > 0 && !request.settled && !request.rejected){
                info += '<div>Your offer changed</div><br/>';
            }

            if(info != '') {
                out += '<div style="margin-top: 50px;">' + info + '</div>';
            }

            //out += '<button type="button" class="btn btn-danger mt-3" id="rejectSwapButton'+i+'">Reject</button>';

            out += '</div><div class="col">';

            out += await _this.render(
                ask0.erc1155Address[0],
                ask0.id[0],
                ask0.amount[0],
                ask0.pricePerItem[0],
                ask0.tokenAddress,
                ask0.seller,
                ask0.seller,
                ask0.swapMode,
                request.index0,
                hasMore0,
                'request',
                ask0.erc1155Address.length > 1,
                ask0.erc1155Address.length - 1
            );
            out += await _this.render(
                ask0.hrc1155Address[0],
                ask0.id[0],
                ask0.amount[0],
                ask0.pricePerItem[0],
                ask0.tokenAddress,
                ask0.seller,
                ask0.seller,
                ask0.swapMode,
                request.index0,
                hasMore0,
                'request',
                ask0.hrc1155Address.length > 1,
                ask0.hrc1155Address.length - 1
            );

            out += '</div>';
            out += '</div>';

            $('#outgoingSwapRequests').append(out);

            // $('[data-toggle="popover"]').popover();
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


            $('.cancelSwapButton').off('click');
            $('.cancelSwapButton').on('click', _this.performSwapCancel);

            await sleep(300);
            nftCount++;
            await waitForDiv($('#outgoingSwapRequests'), nftCount);
        }

    }

    this.swapRequests = async function(){

        $('#incomingSwapRequests').html('');

        let nftCount = 0;
        let length = await tncLibMarket.getSwapRequestsLength(tncLib.account);

        let out = '<div class="row mb-5">';
        out += '<div class="col" style="text-align: center;">Yours</div>';
        out += '<div class="col"> </div>';
        out += '<div class="col" style="text-align: center;">Offered</div>';
        out += '</div>';

        $('#incomingSwapRequests').append(out);

        for(let i = length - 1; i >= 0; i--){

            out = '<div class="row mb-5">';

            let request = await tncLibMarket.getSwapRequest(tncLib.account, i);
            // "mine"
            let ask0    = await tncLibMarket.getAskBase(request.index0);
            // "the other"
            let ask1    = await tncLibMarket.getAskBase(request.index1);

            let hasMore0 = 0;

            let hasMore1 = 0;

            if( ask0.erc1155Address.length > 1){

                hasMore0 = ask0.erc1155Address.length - 1;
            }

            if( ask1.erc1155Address.length > 1){

                hasMore1 = ask1.erc1155Address.length - 1;
            }
            if( ask0.hrc1155Address.length > 1){

                hasMore0 = ask0.hrc1155Address.length - 1;
            }

            if( ask1.hrc1155Address.length > 1){

                hasMore1 = ask1.hrc1155Address.length - 1;
            }

            out += '<div class="col">';

            out += await _this.render(
                ask0.erc1155Address[0],
                ask0.id[0],
                ask0.amount[0],
                ask0.pricePerItem[0],
                ask0.tokenAddress,
                ask0.seller,
                ask0.seller,
                ask0.swapMode,
                request.index0,
                hasMore0,
                'request',
                ask0.erc1155Address.length > 1,
                ask0.erc1155Address.length - 1
            );
            out += await _this.render(
                ask0.hrc1155Address[0],
                ask0.id[0],
                ask0.amount[0],
                ask0.pricePerItem[0],
                ask0.tokenAddress,
                ask0.seller,
                ask0.seller,
                ask0.swapMode,
                request.index0,
                hasMore0,
                'request',
                ask0.hrc1155Address.length > 1,
                ask0.hrc1155Address.length - 1
            );

            out += '</div>';

            let info = '';

            if(!request.settled && !request.rejected && ask0.amounts > 0 && ask1.amounts > 0) {
                out += '<div class="col" style="text-align: center; margin-bottom: 50px;"><button type="button" class="acceptSwapButton btn btn-primary mt-lg-5" data-swapindex="'+i+'" id="acceptSwapButton' + i + '">Accept</button></div>';
            }else if(request.settled){
                info += '<div>Swapped</div><br/>';
            }else if(request.rejected){
                info += '<div>Cancelled</div><br/>';
            }

            if(ask0.amounts == 0 && !request.settled && !request.rejected){
                info += '<div>Your offer ended</div><br/>';
            }

            if(ask1.amounts == 0 && !request.settled && !request.rejected){
                info += '<div>The other offer ended</div><br/>';
            }

            if(ask0.updates > 0 && !request.settled && !request.rejected){
                info += '<div>Your offer changed</div><br/>';
            }

            if(ask1.updates > 0 && !request.settled && !request.rejected){
                info += '<div>The other offer changed</div><br/>';
            }

            if(info != '') {
                out += '<div class="col" style="text-align: center; margin-bottom: 50px; vertical-align: middle; margin-top: -50px;"><div style="margin-top: 50px;">' + info + '</div></div>';
            }

            //out += '<button type="button" class="btn btn-danger mt-3" id="rejectSwapButton'+i+'">Reject</button>';

            let anyAmount = web3.utils.toBN(request.anyAmount);
            let zero      = web3.utils.toBN('0');
            let extraAny = '';
            if(nifAmount.gt(zero)){
                extraAny = _this.formatNumberString(anyAmount.toString(), 18);
                extraAny = '<div style="margin-top: -10px; color: #ffffff; font-size: 2rem;" class="mb-1">+'+extraAny.substring(0, extraAny.length - 10)+' ANY</div>';
            }

            out += '<div class="col">';

            out += extraNif;

            out += await _this.render(
                ask1.erc1155Address[0],
                ask1.id[0],
                ask1.amount[0],
                ask1.pricePerItem[0],
                ask1.tokenAddress,
                ask1.seller,
                ask1.seller,
                ask1.swapMode,
                request.index1,
                hasMore1,
                'request',
                ask1.erc1155Address.length > 1,
                ask1.erc1155Address.length - 1
            );
            out += await _this.render(
                ask1.hrc1155Address[0],
                ask1.id[0],
                ask1.amount[0],
                ask1.pricePerItem[0],
                ask1.tokenAddress,
                ask1.seller,
                ask1.seller,
                ask1.swapMode,
                request.index1,
                hasMore1,
                'request',
                ask1.hrc1155Address.length > 1,
                ask1.hrc1155Address.length - 1
            );

            out += '</div>';
            out += '</div>';

            $('#incomingSwapRequests').append(out);

            // $('[data-toggle="popover"]').popover();
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

            $('.acceptSwapButton').off('click');
            $('.acceptSwapButton').on('click', _this.performSwapAccept);

            await sleep(300);
            nftCount++;
            await waitForDiv($('#incomingSwapRequests'), nftCount);
        }

    }

    this.performSwapAccept = async function(e){

        let swapIndex = $(e.target).data('swapindex');

        let request = await tncLibMarket.getSwapRequest(tncLib.account, swapIndex);
        // "the other"
        let ask1    = await tncLibMarket.getAskBase(request.index1);

        toastr.remove();
        $(this).html('Pending...');
        $(this).prop('disabled', 'disabled');

        let _button = this;

        tncLibMarket.acceptSwap(
            swapIndex,
            function (){
                toastr["info"]('Please wait for the transaction to finish.', "Swapping....");
            },
            function(receipt){
                console.log(receipt);
                toastr.remove();
                $(_button).html('Accept');
                $(_button).prop('disabled', false);
                toastr["success"]('Transaction has been finished.', "Success");
                for(let i = 0; i < ask1.erc1155Address.length; i++){
                    _this.updateRegisteredCollections(ask1.erc1155Address[i]);
                }
                for(let i = 0; i < ask1.hrc1155Address.length; i++){
                    _this.updateRegisteredCollections(ask1.hrc1155Address[i]);
                }
                _alert('The swap has been successful!');
            },
            function(){
                toastr.remove();
                $(_button).prop('disabled', false);
                $(_button).html('Accept');
                toastr["error"]('An error occurred with your swapping transaction.', "Error");
            }
        );
    }

    this.performSwapCancel = async function(e){

        let swapIndex = $(e.target).data('swapindex');
        let seller = $(e.target).data('seller');

        toastr.remove();
        $(this).html('Pending...');
        $(this).prop('disabled', 'disabled');

        let _button = this;

        console.log('CANCELLING SWAP: ', swapIndex, seller);

        tncLibMarket.cancelSwapRequest(
            seller,
            swapIndex,
            function (){
                toastr["info"]('Please wait for the transaction to finish.', "Cancelling....");
            },
            function(receipt){
                console.log(receipt);
                toastr.remove();
                $(_button).html('Cancel');
                $(_button).prop('disabled', false);
                toastr["success"]('Transaction has been finished.', "Success");
                _alert('The swap cancellation has been successful!');
            },
            function(){
                toastr.remove();
                $(_button).prop('disabled', false);
                $(_button).html('Cancel');
                toastr["error"]('An error occurred with your cancelling transaction.', "Error");
            }
        );
    }

    this.performSell = async function(){

        let price = parseFloat($('#nftSellPrice').val().trim());
        let sellToken = $('#nftSellToken2').val().trim();
        let category = parseInt($('#nftSellCategory').val().trim());

        if(isNaN(category) || category < 0){

            _alert('Invalid category');
            return;
        }

        if(isNaN(price) || price <= 0){

            _alert('Please enter a valid price');
            return;
        }

        let decimals = 0;

        try {
            decimals = await tncLib.tokenDecimalsErc20(sellToken);
            decimals = await tncLib.tokenDecimalsHrc20(sellToken);
        }catch(e){
            _alert('Invalid token! Seems not to support the decimals() information.');
            return;
        }

        if(decimals >= 118){

            _alert('Invalid token! Too many decimals (117 max.)');
            return;
        }

        price = web3.utils.toBN(_this.resolveNumberString(""+price, decimals));

        let erc1155 = [];
        let hrc1155 = [];
        let id = [];
        let amount = [];

        $('input[id^="amountToAdd"]').each(function(){

            let _amount = parseInt( $(this).val() );

            if( !isNaN(_amount) && _amount > 0 ){

                erc1155.push( $(this).data('erc1155address') );
                id.push( $(this).data('id') );
                amount.push( _amount );
            }
            if( !isNaN(_amount) && _amount > 0 ){

                hrc1155.push( $(this).data('hrc1155address') );
                id.push( $(this).data('id') );
                amount.push( _amount );
            }
        });

        if(erc1155.length == 0)
        {
            _alert('Please add the amount of NFTs you want to sell.');
            return;
        }
        if(hrc1155.length == 0)
        {
            _alert('Please add the amount of NFTs you want to sell.');
            return;
        }

        if(erc1155.length > 25)
        {
            _alert('You cannot add more than 25 NFTs.');
            return;
        }
        if(hrc1155.length > 25)
        {
            _alert('You cannot add more than 25 NFTs.');
            return;
        }

        toastr.remove();
        $('#nftSellButton').html('Pending Transaction...');
        $('#nftSellButton').prop('disabled', true);

        window.tncLibMarket.sell(
            erc1155,
            hrc1155,
            id,
            amount,
            sellToken,
            price,
            $('input[name="nftMode"]:checked').val(),
            category,
            function () {
                toastr["info"]('Please wait for the transaction to finish.', "Selling NFTs....");
            },
            function (receipt) {
                console.log(receipt);
                toastr.remove();
                $('#nftSellModal').modal('hide');
                _alert("Your offer has been successfully posted.");
                $('#nftSellButton').html('Sell!');
                $('#nftSellButton').prop('disabled', false);
                toastr["success"]('Transaction has been finished.', "Success");
            },
            function () {
                toastr.remove();
                $('#nftSellButton').prop('disabled', false);
                $('#nftSellButton').html('Sell!');
                toastr["error"]('An error occurred with your sell transaction.', "Error");
            });
    }

    this.populateNftsView = async function(e){

        $('#nftsViewContainer').html('');

        let index = $(e.relatedTarget).data('index');

        let ask = await tncLibMarket.getAskBase(index);

        for(let i = 0; i < ask.erc1155Address.length+ask.hrc1155Address,lenght; i++){

            let out = await _this.render(
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
            let out = await _this.render(
                ask.hrc1155Address[i],
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

            // $('[data-toggle="popover"]').popover();
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

    this.loadPage = async function (page){

        $('#offersPage').css('display', 'none');

        if( _this.getUrlParam('ref') != null &&
            localStorage.getItem('marketRef') == null &&
            web3.utils.isAddress(_this.getUrlParam('ref'))
        ){

            console.log("REFFED!");

            localStorage.setItem('marketRef', _this.getUrlParam('ref'));
        }

        switch (page){

            default:

                $('#nftSellButton').on('click', _this.performSell);

                $('#nftBuyButton').on('click', _this.performBuy);
                $('#nftCancelButton').on('click', _this.performCancellation);

                $('#nftSwapButton').on('click', _this.performSwapRequest);

                $('#myoffers').on('click', function(){
                    location.href = 'market.html?address='+tncLib.account;
                });

                $('#nftInteractiveModal').off('hide.bs.modal');
                $('#nftInteractiveModal').on('hide.bs.modal', function(){
                    $('#interactiveBody').html(window.interactiveDefault);
                });

                $('#nftsView').off('show.bs.modal');
                $('#nftsView').on('show.bs.modal', _this.populateNftsView);

                $('#nftSellModal').off('show.bs.modal');
                $('#nftSellModal').on('show.bs.modal', _this.populateSellSelection);

                $('#swapRequestsModal').off('show.bs.modal');
                $('#swapRequestsModal').on('show.bs.modal', _this.swapRequests);
                $('#swapRequestsModal').on('show.bs.modal', _this.swapOtherRequests);

                $('#nftSwapModal').off('show.bs.modal');
                $('#nftSwapModal').on('show.bs.modal', _this.populateSwap);

                $('#withdrawFundsModal').off('show.bs.modal');
                $('#withdrawFundsModal').on('show.bs.modal', _this.populateTokenLookup);

                $('#nftBuyModal').off('show.bs.modal');
                $('#nftBuyModal').on('show.bs.modal', _this.populateBuy);

                $('#nftCancelModal').off('show.bs.modal');
                $('#nftCancelModal').on('show.bs.modal', _this.populateCancellation);

                $('#nftInteractiveModal').off('show.bs.modal');
                $('#nftInteractiveModal').on('show.bs.modal', _this.populateInteractive);

                $('#offersPage').css('display', 'grid');

                let address = '';
                if(web3.utils.isAddress(_this.getUrlParam('address'))){
                    address = _this.getUrlParam('address');
                    $('#marketProfile').text('by ' + address);
                    $('#marketAddress').css('display', 'flex');
                }

                let category = 0;
                if(_this.getUrlParam('category') != null){
                    category = _this.getUrlParam('category');
                    if(category > 0){
                        $('#categoryDropdown').html( $('#cat'+category).html() );
                        $('#cat'+category).addClass('active');
                    }
                }
                else{
                    $('#categoryDropdown').html( 'Categories' );
                }

                await _this.getMarketNfts(address, '', category);

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
        window.tncLibBridgeIn = new TncLibBridge();
        tncLibBridgeIn.account = tncLib.account;

        if(typeof accounts == 'undefined' || accounts.length == 0){

            tncLib.account = '0x0000000000000000000000000000000000000000';
            tncLibMarket.account = '0x0000000000000000000000000000000000000000';
            tncLibBridgeIn.account = '0x0000000000000000000000000000000000000000';
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
