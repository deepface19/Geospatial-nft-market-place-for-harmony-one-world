import './HRC1155.sol';
import './IHRC165.sol';

function TncDapp() {

    //const ipfs = window.IpfsHttpClient('ipfs.infura.io', '5001', { protocol: 'https' });
    const _this = this;
    this.collectibleTemplate = Handlebars.compile($('#collectible-template').html());
    this.noCollectibleTemplate = Handlebars.compile($('#no-collectibles').html());
    this.prevAccounts = [];
    this.prevChainId = '';

    this.getWalletNfts = async function(address){

        let nftCount = 0;
        let collections = [];

        // nftsverse
        if(chain_id == '1') {
            let verse = tncLibBridgeIn.uniftyverse.options.address;
            collections.push(verse);
            let nfts = await tncLib.getNftsByAddress(address, verse);
            for (let i = 0; i < nfts.length; i++) {
                if (await tncLib.balanceof(verse, address, nfts[i]) > 0) {
                    _this.render(verse, nfts[i], address);
                    await sleep(300);
                    nftCount++;
                    await waitForPaging('collectiblesPage', nftCount);
                }
            }
        }

        // my nfts collections
        let length = await tncLib.getErc1155Length(address);
        let length = await tncLib.getHrc1155Length(address);

        for(let i = length - 1; i >= 0; i--){
            let myCollection = await tncLib.getErc1155(address, i);
            collections.push(myCollection.erc1155);
            let nfts = await tncLib.getNftsByAddress(address, myCollection.erc1155);
            for(let j = 0; j < nfts.length; j++){
                if(await tncLib.balanceof(myCollection.erc1155, address, nfts[j]) > 0) {
                    _this.render(myCollection.erc1155, nfts[j], address);
                    await sleep(300);
                    nftCount++;
                    await waitForPaging('collectiblesPage', nftCount);
                }
            }
        }
        for(let i = length - 1; i >= 0; i--){
            let myCollection = await tncLib.getHrc1155(address, i);
            collections.push(myCollection.hrc1155);
            let nfts = await tncLib.getNftsByAddress(address, myCollection.hrc1155);
            for(let j = 0; j < nfts.length; j++){
                if(await tncLib.balanceof(myCollection.hrc1155, address, nfts[j]) > 0) {
                    _this.render(myCollection.hrc1155, nfts[j], address);
                    await sleep(300);
                    nftCount++;
                    await waitForPaging('collectiblesPage', nftCount);
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
                    _this.render(rarible, nfts[i], address);
                    await sleep(300);
                    nftCount++;
                    await waitForPaging('collectiblesPage', nftCount);
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
                    _this.render(custom, nfts[j], address);
                    await sleep(300);
                    nftCount++;
                    await waitForPaging('collectiblesPage', nftCount);
                }
            }
        }

        if(nftCount == 0){

            $('#collectiblesPage').append(_this.noCollectibleTemplate({}));
        }
    };

    this.render = async function(erc1155, id, address){

        fetchUrl(api_url + '1.0/'+chain_id+'/collections/events/URI/erc1155Address/'+erc1155+'/id/0', 5000);

        let nft = await window.tncLib.getForeignNft(erc1155, address, id);

    this.render = async function(hrc1155, id, address){

            fetchUrl(api_url + '1.0/'+chain_id+'/collections/events/URI/hrc1155Address/'+erc1155+'/id/0', 5000);
    
            let nft = await window.tncLib.getForeignNft(hrc1155, address, id);
    }
        // new opensea json uri pattern
        if(nft.uri.includes("api.opensea.io") ){

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

        console.log(nft.uri);

        try {

            let data = await $.getJSON(nft.uri.replace('ipfs://','https://gateway.ipfs.io/ipfs/').replace('/ipfs/ipfs/', '/ipfs/'));

            if (typeof data == 'object') {

                console.log('IMAGE: ', data.image);

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
            }catch (e){
                console.log(e);
            }

        }

        let traits_hide = '';
        if(data_attributes.length == 0){
            traits_hide = 'style="visibility:hidden;"';
        }

        let meta = await tncLib.getErc1155Meta(erc1155);
        let meta = await tncLib.getErc1155Meta(erc1155);

        let srcInfo = [0,0,0];
        let bridgeBack = false;

        if( chain_id == '1' && erc1155.toLowerCase() == tncLibBridgeIn.uniftyverseAddress.toLowerCase()){

            srcInfo = await tncLibBridgeIn.in_getSourceInfo(id);
            srcInfo[2] = _this.hexToInt(srcInfo[2]);
            srcInfo[1] = _this.hexToInt(srcInfo[1]);
            bridgeBack = true;

        }

        if(data_interactive_url != ''){
            data_interactive_url = data_interactive_url + "?erc1155Address="+erc1155+"&id="+id+"&chain_id="+chain_id;
        }

        let tmpl = _this.collectibleTemplate({
            srcChainid : srcInfo[2],
            srcCollection : srcInfo[0],
            srcId : srcInfo[1],
            bridgeOn : chain_id == '64' ? chain_id : '',
            bridgeOnBack : bridgeBack ? chain_id : '',
            checkOpenSea : chain_id == '1' || chain_id == '4' ? 'Check on OpenSea' : 'Open Details',
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
            traitsHide : bridgeBack ? '' : traits_hide,
            owns: address == tncLib.account ? 'You Own' : 'Owns',
            options: address == tncLib.account ? 'true' : '',
            collectionName : meta.name != 'n/a' ? '<div class="text-truncate" style="font-size: 1.4rem !important;">' + meta.name + '</div>' : '<div class="text-truncate" style="font-size: 1.4rem !important;">' + erc1155 + '</div>',
            opensea : chain_id == '1' || chain_id == '4' ? 'https://opensea.io/assets/'+erc1155+'/'+id : 'collectible.html?collection=' +  erc1155 + '&id=' + id
        });


        if(data_interactive_url != ''){
            data_interactive_url = data_interactive_url + "?hrc1155Address="+hrc1155+"&id="+id+"&chain_id="+chain_id;
        }
        
        let tmpl = _this.collectibleTemplate({
            srcChainid : srcInfo[2],
            srcCollection : srcInfo[0],
            srcId : srcInfo[1],
            bridgeOn : chain_id == '1666600000' ? chain_id : '',
            bridgeOnBack : bridgeBack ? chain_id : '',
            checkOpenSea : chain_id == '1' || chain_id == '4' ? 'Check on Davinci' : 'Open Details',
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
            traitsHide : bridgeBack ? '' : traits_hide,
            owns: address == tncLib.account ? 'You Own' : 'Owns',
            options: address == tncLib.account ? 'true' : '',
            collectionName : meta.name != 'n/a' ? '<div class="text-truncate" style="font-size: 1.4rem !important;">' + meta.name + '</div>' : '<div class="text-truncate" style="font-size: 1.4rem !important;">' + hrc1155 + '</div>',
            davinci : chain_id == '1' || chain_id == '4' ? 'https://davinci.gallery/'+hrc1155+'/'+id : 'collectible.html?collection=' +  hrc1155 + '&id=' + id
        });


        $('#collectiblesPage').append(tmpl);

        if(chain_id == '1') {
            $('.marketSellLink').css('display', 'none');
        }

        $('.btn-clipboard' + erc1155 + id).off('click');
        $('.btn-clipboard' + erc1155 + id).on('click', function () {

            $(this).tooltip('enable');
            let _this2 = this;
            setTimeout(function () {
                $(_this2).tooltip('show');
            }, 100);
            setTimeout(function () {
                $(_this2).tooltip('hide');
            }, 3000);

        });

        $('.btn-clipboard' + hrc1155 + id).off('click');
        $('.btn-clipboard' + hrc1155 + id).on('click', function () {

            $(this).tooltip('enable');
            let _this2 = this;
            setTimeout(function () {
                $(_this2).tooltip('show');
            }, 100);
            setTimeout(function () {
                $(_this2).tooltip('hide');
            }, 3000);

        });

        $('.btn-clipboard' + erc1155 + id).off('mouseover');
        $('.btn-clipboard' + erc1155 + id).on('mouseover', function () {

            $(this).tooltip('disable');

        });

        $('.btn-clipboard' + hrc1155 + id).off('mouseover');
        $('.btn-clipboard' + hrc1155 + id).on('mouseover', function () {

            $(this).tooltip('disable');

        });

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

        setTimeout(async function () {

            let owner = await tncLib.erc1155Owner(erc1155);
            if(owner){

                $('#nftRoyaltiesModalButton' + erc1155 + id).css('display', 'flex');
            }

        }, 100);
        
        setTimeout(async function () {

            let owner = await tncLib.hrc1155Owner(hrc1155);
            if(owner){

                $('#nftRoyaltiesModalButton' + hrc1155 + id).css('display', 'flex');
            }

        }, 100);

    };

    this.truncate = function(str, n){
        return (str.length > n) ? str.substr(0, n-1) + '&hellip;' : str;
    }

    this.hexToInt = function (hex) {
        return parseInt(hex.replace('0x','').replace(/\b0+/g, ''));
    }

    this.populateRegisterCollections = async function(){

        let registered = '';
        let collectionAddresses = [];

        if(localStorage.getItem('collectionAddresses'+chain_id)){
            collectionAddresses = JSON.parse(localStorage.getItem('collectionAddresses'+chain_id));
        }

        for(let i = 0; i < collectionAddresses.length; i++){

            registered += '<div>' + collectionAddresses[i] + '</div>';
        }

        if(collectionAddresses.length > 0) {
            $('#registeredCollections').html('<div>Registered Collections:</div>' + registered);
        }
    };

    this.registerCollection = async function(){

        let address = $('#collectionAddress').val().trim();

        if(!web3.utils.isAddress(address)){
            _alert('Given address is not a valid address.');
            return;
        }

        if(!await tncLib.isErc1155Supported(address)){
            _alert('Given address is not a valid collection contract.');
            return;
        }
        if(!await tncLib.isHrc1155Supported(address)){
            _alert('Given address is not a valid collection contract.');
            return;
        }
        let collectionAddresses = [];

        if(localStorage.getItem('collectionAddresses'+chain_id)){
            collectionAddresses = JSON.parse(localStorage.getItem('collectionAddresses'+chain_id));
        }

        if(!collectionAddresses.includes(address)) {
            collectionAddresses.push(address);
            localStorage.setItem('collectionAddresses'+chain_id, JSON.stringify(collectionAddresses));
            _alert('Collection has been registered. Reloading...');
            setTimeout(function(){
                location.reload();
            }, 3000);
        }else{
            _alert('Given address has been registered already.');
        }
    };

    this.populateTransfer = async function(e){

        let erc1155 = $(e.relatedTarget).data('contractAddress');
        let id = $(e.relatedTarget).data('id');

        $('#nftTransferErc1155Address').val(erc1155);
        $('#nftTransferNftId').val(id);
    };

    this.populateTransfer = async function(e){

        let hrc1155 = $(e.relatedTarget).data('contractAddress');
        let id = $(e.relatedTarget).data('id');

        $('#nftTransferHrc1155Address').val(hrc1155);
        $('#nftTransferNftId').val(id);
    };

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

    this.populateSell = async function(e){

        let erc1155 = $(e.relatedTarget).data('contractAddress');
        let id = $(e.relatedTarget).data('id');

        $('#nftSellButton').html('Sell!');
        $('#nftSellButton').prop('disabled', false);

        $("#nftSellToken").html('');

        let hrc1155 = $(e.relatedTarget).data('contractAddress');
        let id = $(e.relatedTarget).data('id');
    
        $('#nftSellButton').html('Sell!');
        $('#nftSellButton').prop('disabled', false);
    
        $("#nftSellToken").html('');
        
        switch(chain_id){
            case '64': // xDai

                var o = new Option("HNY", "get_address");
                $(o).html("HNY");
                $("#nftSellToken").append(o);

                var o2 = new Option("ONE (Harmony)", "get_address");
                $(o2).html("ONE (Harmony)");
                $("#nftSellToken").append(o2);

                var o3 = new Option("COLD", "get_address");
                $(o3).html("COLD");
                $("#nftSellToken").append(o3);

                var o4 = new Option("wxDai (Wrapped xDai)", "get_address");
                $(o4).html("wxDai (Wrapped xDai)");
                $("#nftSellToken").append(o4);

                var o6 = new Option("WETH (Wrapped Ether)", "get_address");
                $(o6).html("WETH (Wrapped Ether)");
                $("#nftSellToken").append(o6);

                var o5 = new Option("AGVE (Agave Token)", "get_address");
                $(o5).html("AGVE (Agave Token)");
                $("#nftSellToken").append(o5);

                var o7 = new Option("USDC", "get_address");
                $(o7).html("USDC");
                $("#nftSellToken").append(o7);

                break;
            case '4d': // xDai (SPOA) Testnet
                var o = new Option("ONE (Harmony)", "get_address");
                $(o).html("ONE (Harmony)");
                $("#nftSellToken").append(o);
                console.log($("#nftSellToken").html());
                break;
            case '507': // xDai (SPOA) Testnet
                var o = new Option("ONE (Harmony)", "get_address");
                $(o).html("ONE (Harmony)");
                $("#nftSellToken").append(o);
                console.log($("#nftSellToken").html());
                break;
            case 'a4ec': // CELO


                var o = new Option("CELO (token)", "get_address");
                $(o).html("CELO (token)");
                $("#nftSellToken").append(o);
                console.log($("#nftSellToken").html());

                var o2 = new Option("CUSD", "get_address");
                $(o2).html("CUSD");
                $("#nftSellToken").append(o2);
                console.log($("#nftSellToken").html());

                break;
            case 'a86a': // AVALANCHE

                var o = new Option("WAVAX (Wrapped AVAX)", "get_address");
                $(o).html("WAVAX (Wrapped AVAX)");
                $("#nftSellToken").append(o);
                console.log($("#nftSellToken").html());

                break;
            case '38': // BSC MAINNET


                var o2 = new Option("ONE (Harmony)", "get_address");
                $(o2).html("ONE (Harmony)");
                $("#nftSellToken").append(o2);

                var o = new Option("WBNB (Wrapped BNB)", "get_address");
                $(o).html("WBNB (Wrapped BNB)");
                $("#nftSellToken").append(o);

                var o3 = new Option("CAKE", "get_address");
                $(o3).html("CAKE");
                $("#nftSellToken").append(o3);

                var o4 = new Option("BUSD", "get_address");
                $(o4).html("BUSD");
                $("#nftSellToken").append(o4);

                var o5 = new Option("ETH", "get_address");
                $(o5).html("ETH");
                $("#nftSellToken").append(o5);

                var o6 = new Option("TETHER", "get_address");
                $(o6).html("TETHER");
                $("#nftSellToken").append(o6);

                var o7 = new Option("BDT (Block Duelers)", "get_address");
                $(o7).html("BDT (Block Duelers)");
                $("#nftSellToken").append(o7);

                var o8 = new Option("DC (Duelers Credits)", "get_address");
                $(o8).html("DC (Duelers Credits)");
                $("#nftSellToken").append(o8);

                break;
            case '89': // Matic Mainnet
                var o = new Option("wMatic (Wrapped Matic)", "get_address");
                $(o).html("Matic (Wrapped)");
                $("#nftSellToken").append(o);

                break;
            case '61': // BSC TESTNET
                var o = new Option("ONE (Harmony)", "get_address");
                $(o).html("ONE (Harmony)");
                $("#nftSellToken").append(o);
                break;
            case '4': // ETHEREUM TESTNET
                var o = new Option("ONE (Harmony)", "get_address");
                $(o).html("ONE (Harmony)");
                $("#nftSellToken").append(o);
                break;
            default: // ETHEREUM MAINNET
                var o = new Option("ONE (Harmony)", "get_address");
                $(o).html("ONE (Harmony)");
                $("#nftSellToken").append(o);
                var o2 = new Option("WETH (Wrapped Ether)", "get_address");
                $(o2).html("WETH (Wrapped Ether)");
                $("#nftSellToken").append(o2);
        }

        var o = new Option("Custom...", "custom");
        $(o).html("Custom...");
        $("#nftSellToken").append(o);

        $('#nftSellErc1155Address').val(erc1155);
        $('#nftSellNftId').val(id);
        $('#nftSellAmount').val("1");
        $('#nftSellPricePerItem').val("");

        $('#nftSellHrc1155Address').val(hrc1155);
        $('#nftSellNftId').val(id);
        $('#nftSellAmount').val("1");
        $('#nftSellPricePerItem').val("");
        //$('input[name="nftMode"]:checked').val('0');

        $('#nftSellToken').off('change');
        $('#nftSellToken').on('change', function(){
            if($(this).val() == 'custom'){
                $('#nftSellCustomTokenAddressWrapper').css('display', 'block');
            }else{
                $('#nftSellCustomTokenAddressWrapper').css('display', 'none');
            }
        });

        $('#nftSellCustomTokenAddress').off('change');
        $('#nftSellCustomTokenAddress').on('change', async function(){

            let token = $(this).val().trim();
            if(await web3.utils.isAddress(token)){
                try {
                    let symbol = await tncLib.tokenSymbolErc20(token);
                    $('#nftSellCustomTokenAddressInfo').text('Selected token: ' + symbol);
                }catch (e){
                    $('#nftSellCustomTokenAddressInfo').text('No valid token!');
                }
            }
            else{
                $('#nftSellCustomTokenAddressInfo').text('Invalid token address!');
            }

        });

        $('#sellAddMax').off('click');
        $('#sellAddMax').on('click', async function(){
            let balance = await tncLib.balanceof(erc1155, tncLib.account, id);
            $('#nftSellAmount').val(balance);
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

        let balance = await tncLib.balanceof(hrc1155, tncLib.account, id);
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
            hrc1155,
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

    this.populateBridging = async function(e){

        let contractAddress = $(e.relatedTarget).data('contractAddress');
        let id = $(e.relatedTarget).data('id');

        $('#bridgeErc1155Address').val(contractAddress);
        $('#bridgeNftId').val(id);
        $('#bridgeHrc1155Address').val(contractAddress);
        $('#bridgeNftId').val(id);

    }

    this.populateBackBridging = async function(e){

        let contractAddress = $(e.relatedTarget).data('contractAddress');
        let id = $(e.relatedTarget).data('id');

        $('#bridgeBackErc1155Address').val(contractAddress);
        $('#bridgeBackNftId').val(id);
        $('#bridgeBackHrc1155Address').val(contractAddress);
        $('#bridgeBackNftId').val(id);
    }

    this.cancelJob = async function(){

        let jobId = $('#jobId').val().trim();

        if(jobId == '' || parseInt(jobId) <= 0){

            _alert('Please enter a valid Job ID.');
            return;
        }

        toastr.remove();
        $(this).html('Pending Transaction...');
        $(this).prop('disabled', 'disabled');

        let _button = this;

        tncLibBridgeIn.in_cancelJob(
            jobId,
            function (){
                toastr["info"]('Please wait for the transaction to finish.', "Cancelling....");
            },
            function(receipt){
                console.log(receipt);
                toastr.remove();
                $(_button).html('Cancel');
                $(_button).prop('disabled', false);
                toastr["success"]('Transaction has been finished.', "Success");
                $('#bridgedPage').html('');
                _this.loadPage('');
            },
            function(){
                toastr.remove();
                _alert('Your job cancellation request failed. Either the NFT has been redeemed already or the 2-hour grace-time did not expire yet.');
                $(_button).html('Cancel Error');
                $(_button).prop('disabled', false);
                setTimeout(function(){
                    $(_button).html('Cancel');
                }, 3000);
                toastr["error"]('An occurred with your job cancellation transaction.', "Error");
            }
        );
    }

    this.performBridging = async function(e){

        let contractAddress = $('#bridgeErc1155Address').val();
        let id = $('#bridgeNftId').val();
        let amount = $('#bridgeAmount').val().trim();
        let contractAddress = $('#bridgeHrc1155Address').val();
        let id = $('#bridgeNftId').val();
        let amount = $('#bridgeAmount').val().trim();

        if(amount == '' || parseInt(amount) <= 0){

            _alert('Please enter a valid amount of NFTs to bridge.');
            return;
        }

        if(parseInt(amount) > await tncLib.balanceof(contractAddress, tncLib.account, id)){

            _alert('Not enough NFTs to perform bridging.');
            return;
        }

        toastr.remove();

        let _button = this;

        let approved = await tncLib.erc1155IsApprovedForAll(tncLib.account, tncLibBridgeIn.chainIn.options.address, contractAddress);

        if(approved) {

            $(_button).html('Pending Transaction...');
            $(_button).prop('disabled', true);

            tncLibBridgeIn.in_performBridging(
                contractAddress,
                id,
                amount,
                function () {
                    toastr["info"]('Please wait for the transaction to finish.', "Bridging....");
                },
                function (receipt) {
                    _alert("Please backup this Job ID for reference:<br/><br/><h2>#" + receipt.events.Bridge.returnValues._jobId + '</h2>You can track the state of your Job by checking our <a href="https://discord.com/rdCmBpe" target="_blank">Discord</a> logs using your Job ID.');
                    console.log(receipt);
                    toastr.remove();
                    $(_button).html('Bridge');
                    $(_button).prop('disabled', false);
                    toastr["success"]('Transaction has been finished.', "Success");
                },
                function (e) {
                    console.log(e);
                    toastr.remove();
                    $(_button).prop('disabled', false);
                    $(_button).html('Bridge');
                    toastr["error"]('An error occurred with your bridging transaction.', "Error");
                }
            );

        }else{

            $(_button).prop('disabled', true);
            $(_button).html('Approve first...');

            tncLib.erc1155SetApprovalForAll(
                tncLibBridgeIn.chainIn.options.address,
                true,
                contractAddress,
                function () {
                    toastr["info"]('Please wait for the transaction to finish.', "Set approval for all....");
                },
                function (receipt) {
                    console.log(receipt);
                    toastr.remove();
                    $(_button).prop('disabled', false);
                    $(_button).html('Approved! Bridge Now');
                    toastr["success"]('Transaction has been finished.', "Success");
                },
                function (err) {
                    toastr.remove();
                    $(_button).prop('disabled', false);
                    $(_button).html('Bridge');
                    let errMsg = 'An error occurred with your set approval for all transaction.';
                    toastr["error"](errMsg, "Error");
                }
            );
            tncLib.hrc1155SetApprovalForAll(
                tncLibBridgeIn.chainIn.options.address,
                true,
                contractAddress,
                function () {
                    toastr["info"]('Please wait for the transaction to finish.', "Set approval for all....");
                },
                function (receipt) {
                    console.log(receipt);
                    toastr.remove();
                    $(_button).prop('disabled', false);
                    $(_button).html('Approved! Bridge Now');
                    toastr["success"]('Transaction has been finished.', "Success");
                },
                function (err) {
                    toastr.remove();
                    $(_button).prop('disabled', false);
                    $(_button).html('Bridge');
                    let errMsg = 'An error occurred with your set approval for all transaction.';
                    toastr["error"](errMsg, "Error");
                }
            );
        }
    }

    this.performBackBridging = async function(e){

        let contractAddress = $('#bridgeBackErc1155Address').val();
        let id = $('#bridgeBackNftId').val();
        let amount = $('#bridgeBackAmount').val().trim();
        let contractAddress = $('#bridgeBackHrc1155Address').val();
        let id = $('#bridgeBackNftId').val();
        let amount = $('#bridgeBackAmount').val().trim();

        if(amount == '' || parseInt(amount) <= 0){

            _alert('Please enter a valid amount of NFTs to bridge.');
            return;
        }

        if(parseInt(amount) > await tncLib.balanceof(contractAddress, tncLib.account, id)){

            _alert('Not enough NFTs to perform bridging.');
            return;
        }

        toastr.remove();

        let _button = this;

        let approved = await tncLib.erc1155IsApprovedForAll(tncLib.account, tncLibBridgeIn.ethOut.options.address, contractAddress);
        let approved = await tncLib.hrc1155IsApprovedForAll(tncLib.account, tncLibBridgeIn.ethOut.options.address, contractAddress);

        if(approved) {

            $(_button).html('Pending Transaction...');
            $(_button).prop('disabled', true);

            tncLibBridgeIn.performBackBridging(
                id,
                amount,
                function () {
                    toastr["info"]('Please wait for the transaction to finish.', "Bridging....");
                },
                function (receipt) {
                    _alert("Please backup this Job ID for reference:<br/><br/><h2>#" + receipt.events.Restore.returnValues._jobId + '</h2><br/></br>You can track the state of your Job by checking our <a href="https://discord.gg/5ZBTgnAd9s" target="_blank">Discord</a> logs using your Job ID.');
                    console.log(receipt);
                    toastr.remove();
                    $(_button).html('Bridge');
                    $(_button).prop('disabled', false);
                    toastr["success"]('Transaction has been finished.', "Success");
                },
                function () {
                    toastr.remove();
                    $(_button).prop('disabled', false);
                    $(_button).html('Bridge');
                    toastr["error"]('An error occurred with your bridging transaction.', "Error");
                }
            );

        }else{

            $(_button).prop('disabled', true);
            $(_button).html('Approve first...');

            tncLib.erc1155SetApprovalForAll(
                tncLibBridgeIn.ethOut.options.address,
                true,
                contractAddress,
                function () {
                    toastr["info"]('Please wait for the transaction to finish.', "Set approval for all....");
                },
                function (receipt) {
                    console.log(receipt);
                    toastr.remove();
                    $(_button).prop('disabled', false);
                    $(_button).html('Approved! Bridge Now');
                    toastr["success"]('Transaction has been finished.', "Success");
                },
                function (err) {
                    toastr.remove();
                    $(_button).prop('disabled', false);
                    $(_button).html('Bridge');
                    let errMsg = 'An error occurred with your set approval for all transaction.';
                    toastr["error"](errMsg, "Error");
                }
            );
        }
    }

    this.sell = async function(){

        let erc1155 = $('#nftSellErc1155Address').val();
        let id = $('#nftSellNftId').val();
        let amount = parseInt($('#nftSellAmount').val().trim()) || 0;
        let sellToken = $('#nftSellToken').val().trim();
        let pricePerItem = parseFloat($('#nftSellPricePerItem').val().trim()) || 0;
        let category = parseInt($('#nftSellCategory').val().trim());
        
        let erc1155 = $('#nftSellHrc1155Address').val();
        let id = $('#nftSellNftId').val();
        let amount = parseInt($('#nftSellAmount').val().trim()) || 0;
        let sellToken = $('#nftSellToken').val().trim();
        let pricePerItem = parseFloat($('#nftSellPricePerItem').val().trim()) || 0;
        let category = parseInt($('#nftSellCategory').val().trim());

        if(isNaN(category) || category < 0){

            _alert('Invalid category');
            return;
        }

        if(sellToken == 'custom'){

            try {
                sellToken = $('#nftSellCustomTokenAddress').val().trim();
                await tncLib.tokenSymbolErc20(sellToken);
            }catch (e){
                _alert('Invalid token! Please use a proper token address.');
                return;
            }
        }

        let decimals = 0;

        try {
            decimals = await tncLib.tokenDecimalsErc20(sellToken);
        }catch(e){
            _alert('Invalid token! Seems not to support the decimals() information.');
            return;
        }

        try {
            decimals = await tncLib.tokenDecimalsHrc20(sellToken);
        }catch(e){
            _alert('Invalid token! Seems not to support the decimals() information.');
            return;
        }

        if(decimals >= 118){

            _alert('Invalid token! Too many decimals (117 max.)');
            return;
        }

        if(pricePerItem <= 0){
            _alert('Please enter a valid price per item.');
            return;
        }

        /*
        let _pricePerItem = web3.utils.toBN(pricePerItem);
        let comp = web3.utils.toBN('1000');
        if(_pricePerItem.lt(comp)){
            _alert('Price per item too low.');
            return;
        }*/

        //pricePerItem = _this.resolveNumberString(""+pricePerItem, decimals);
        let itemPrice = web3.utils.toBN(_this.resolveNumberString(""+pricePerItem, decimals));
        let itemAmount = web3.utils.toBN(amount);
        let finalPrice = itemPrice.mul(itemAmount).toString();

        if(amount <= 0){
            _alert('Please enter a valid amount to sell.');
            return;
        }

        let balance = await tncLib.balanceof(erc1155, tncLib.account, id);
        if(balance < amount){
            _alert('Insufficient balance. You own ' + balance + ' items of this NFT.');
            return;
        }

        /*
        if(await tncLibMarket.saleExists(tncLib.account, erc1155, id)){
            _alert('Item is already on sale. Please edit the amounts or price for the existing sell order.');
            return;
        }*/
          /*
        if(await tncLibMarket.saleExists(tncLib.account, hrc1155, id)){
            _alert('Item is already on sale. Please edit the amounts or price for the existing sell order.');
            return;
        }*/
        let approved = await tncLib.erc1155IsApprovedForAll(tncLib.account, tncLibMarket.market.options.address, erc1155);
        let approved = await tncLib.hrc1155IsApprovedForAll(tncLib.account, tncLibMarket.market.options.address, hrc1155);

        if(approved) {

            toastr.remove();
            $('#nftSellButton').html('Pending Transaction...');
            $('#nftSellButton').prop('disabled', true);

            window.tncLibMarket.sell(
                [erc1155],
                [id],
                [itemAmount],
                sellToken,
                finalPrice,
                $('input[name="nftMode"]:checked').val(),
                category,
                [hrc1155],
                [id],
                [itemAmount],
                sellToken,
                finalPrice,
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

        }else{

            $('#nftSellButton').prop('disabled', true);
            $('#nftSellButton').html('Approve first...');

            toastr.remove();

            tncLib.erc1155SetApprovalForAll(
                tncLibMarket.market.options.address,
                true,
                erc1155,
                function () {
                    toastr["info"]('Please wait for the transaction to finish.', "Set approval for all....");
                },
                function (receipt) {
                    console.log(receipt);
                    toastr.remove();
                    $('#nftSellButton').prop('disabled', false);
                    $('#nftSellButton').html('Sell Now!');
                    toastr["success"]('Transaction has been finished.', "Success");
                    _alert('Approval succeeded! Now please close this window and click "Sell Now!" to complete the sell order.');
                },
                function (err) {
                    toastr.remove();
                    $('#nftSellButton').prop('disabled', false);
                    $('#nftSellButton').html('Sell!');
                    let errMsg = 'An error occurred with your set approval for all transaction.';
                    toastr["error"](errMsg, "Error");
                }
            );
            tncLib.hrc1155SetApprovalForAll(
                tncLibMarket.market.options.address,
                true,
                erc1155,
                function () {
                    toastr["info"]('Please wait for the transaction to finish.', "Set approval for all....");
                },
                function (receipt) {
                    console.log(receipt);
                    toastr.remove();
                    $('#nftSellButton').prop('disabled', false);
                    $('#nftSellButton').html('Sell Now!');
                    toastr["success"]('Transaction has been finished.', "Success");
                    _alert('Approval succeeded! Now please close this window and click "Sell Now!" to complete the sell order.');
                },
                function (err) {
                    toastr.remove();
                    $('#nftSellButton').prop('disabled', false);
                    $('#nftSellButton').html('Sell!');
                    let errMsg = 'An error occurred with your set approval for all transaction.';
                    toastr["error"](errMsg, "Error");
                }
            );
        }

    };

    this.loadPage = async function (page){

        $('#collectiblesPage').css('display', 'none');

        switch (page){

            default:

                switch(chain_id){

                    case '64':
                        $('#cancelBridgeModalButton').css('display', 'block');
                        break;
                }

                $('#bridgeAddMax').on('click', async function(){

                    $('#bridgeAmount').val(await tncLib.balanceof($('#bridgeErc1155Address').val(), tncLib.account, $('#bridgeNftId').val()));

                });

                $('#bridgeBackAddMax').on('click', async function(){

                    $('#bridgeBackAmount').val(await tncLib.balanceof($('#bridgeBackErc1155Address').val(), tncLib.account, $('#bridgeBackNftId').val()));

                });

                $('#storeRoyaltiesButton').off('click');
                $('#storeRoyaltiesButton').on('click', _this.performRoyalties);

                $('#royaltiesModal').off('show.bs.modal');
                $('#royaltiesModal').on('show.bs.modal', _this.populateRoyalties);

                $('#cancelButton').on('click', _this.cancelJob);
                $('#bridgeButton').on('click', _this.performBridging);
                $('#bridgeBackButton').on('click', _this.performBackBridging);
                $('#addCollectionButton').on('click', _this.registerCollection);
                $('#nftTransferButton').on('click', _this.transfer);
                $('#nftSellButton').on('click', _this.sell);

                $('#nftInteractiveModal').off('hide.bs.modal');
                $('#nftInteractiveModal').on('hide.bs.modal', function(){
                    $('#interactiveBody').html(window.interactiveDefault);
                });

                $('#bridgeModal').off('show.bs.modal');
                $('#bridgeModal').on('show.bs.modal', _this.populateBridging);

                $('#bridgeBackModal').off('show.bs.modal');
                $('#bridgeBackModal').on('show.bs.modal', _this.populateBackBridging);

                $('#nftInteractiveModal').off('show.bs.modal');
                $('#nftInteractiveModal').on('show.bs.modal', _this.populateInteractive);

                $('#nftSellModal').off('show.bs.modal');
                $('#nftSellModal').on('show.bs.modal', _this.populateSell);

                $('#addCollectionModal').off('show.bs.modal');
                $('#addCollectionModal').on('show.bs.modal', _this.populateRegisterCollections);

                $('#nftTransferModal').off('show.bs.modal');
                $('#nftTransferModal').on('show.bs.modal', _this.populateTransfer);

                $('#collectiblesPage').css('display', 'grid');

                let address = tncLib.account;
                if(web3.utils.isAddress(_this.getUrlParam('address'))){
                    address = _this.getUrlParam('address');
                }

                if(address.toLowerCase() == tncLib.account.toLowerCase()){
                    $('#walletOptions').css('display', 'flex');
                }else{
                    $('#foreignWalletInfo').css('display', 'flex');
                    $('#walletAddress').text(address);
                }

                if(web3.utils.isAddress(_this.getUrlParam('register'))){
                    $('#collectionAddress').val(_this.getUrlParam('register'));
                    $('#addCollectionModalButton').click();
                }

                await _this.getWalletNfts(address);

                break;
        }
    };

    this.performRoyalties = async function(){

        let perc = parseFloat($('#nftRoyalties').val().trim());

        if(isNaN(perc) || perc < 0){

            _alert('Invalid royalties');
            return;

        }

        perc = _this.resolveNumberString(""+(perc.toFixed(2)), 2);

        toastr.remove();
        $('#storeRoyaltiesButton').html('Pending Transaction...');
        $('#storeRoyaltiesButton').prop('disabled', true);

        window.tncLibMarket.setRoyalties(
            $('#nftRoyaltiesErc1155Address').val(),
            $('#nftRoyaltiesId').val(),
            perc,
            function (){
                toastr["info"]('Please wait for the transaction to finish.', "Setting royalties....");
            },
            function(receipt){
                console.log(receipt);
                toastr.remove();
                $('#storeRoyaltiesButton').html('Set Royalties');
                $('#storeRoyaltiesButton').prop('disabled', false);
                toastr["success"]('Transaction has been finished.', "Success");
            },
            function(){
                toastr.remove();
                $('#storeRoyaltiesButton').prop('disabled', false);
                $('#storeRoyaltiesButton').html('Set Royalties');
                toastr["error"]('An error occurred with your royalties transaction.', "Error");
            });
    }

    this.populateRoyalties = async function(e){

        $('#nftRoyaltiesErc1155Address').val( $(e.relatedTarget).data('contractAddress') );
        $('#nftRoyaltiesId').val( $(e.relatedTarget).data('nftId') );

        $('#nftRoyalties').val(_this.formatNumberString(await tncLibMarket.getRoyalties($(e.relatedTarget).data('contractAddress'), $(e.relatedTarget).data('nftId')), 2));
    }

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
