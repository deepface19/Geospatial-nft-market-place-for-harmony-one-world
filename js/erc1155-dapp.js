function TncDapp() {

    const ipfs = window.IpfsHttpClient('ipfs.infura.io', '5001', { protocol: 'https' });
    const _this = this;

    this.myPoolTemplate = Handlebars.compile($('#mypool-template').html());
    this.myNftTemplate = Handlebars.compile($('#mynft-template').html());
    this.noPoolsTemplate = Handlebars.compile($('#no-pools').html());
    this.nextButtonTemplate = Handlebars.compile($('#next-button').html());

    this.lastErc1155Index = -1;
    this.lastNftIndex = -1;

    this.currentBlock = 0;
    this.prevAccounts = [];

    this.prevChainId = '';

    this.populateMyErc1155s = async function (){

        /**
         * NEW ACTION
         */

        _this.clearNewUpdateNft();
        $('#nftNewModal').off('show.bs.modal');
        $('#nftNewModal').on('show.bs.modal', this.newUpdateNft);

        if(_this.lastErc1155Index == -1) {
            $('#myPoolsPage').html('');
        }else{
            $('#loadMore').remove();
        }

        let length = await window.tncLib.getMyErc1155Length();

        let offset = _this.lastErc1155Index > -1 ? _this.lastErc1155Index : length;
        let currentIndex = offset;

        let explorer = 'https://etherscan.io/address/';
        switch(chain_id){
            case '4':
                explorer = 'https://rinkeby.etherscan.io/address/';
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

        for(let i = offset - 1; i >= 0; i--){
            currentIndex = i;
            let pool = await window.tncLib.getMyErc1155(i);
            let _uri = pool.contractURI;

            try {

                console.log("CALLING FETCH URL: ", pool.erc1155);
                fetchUrl(api_url + '1.0/'+chain_id+'/collections/events/URI/erc1155Address/'+pool.erc1155+'/id/0', 5000);

                let data = await $.getJSON(_uri);
                if (typeof data == 'object') {

                    let tmpl = _this.myPoolTemplate({
                        explorer : explorer,
                        image: data.image,
                        name: data.name,
                        description: data.description,
                        url: data.external_link,
                        erc1155: pool.erc1155,
                        hasNfts: true,
                        index: i
                    });

                    $('#myPoolsPage').append(tmpl);

                    $('.btn-clipboard' + i).off('click');
                    $('.btn-clipboard' + i).on('click', function () {

                        $(this).tooltip('enable');
                        let _this2 = this;
                        setTimeout(function () {
                            $(_this2).tooltip('show');
                        }, 100);
                        setTimeout(function () {
                            $(_this2).tooltip('hide');
                        }, 3000);

                    });

                    $('.btn-clipboard' + i).off('mouseover');
                    $('.btn-clipboard' + i).on('mouseover', function () {

                        $(this).tooltip('disable');

                    });

                    $('.manageNftsButton' + i).off('click');
                    $('.manageNftsButton' + i).on('click', function () {
                        console.log('manage nft for contract', $(this).data('contractAddress'));
                        $('#nftErc1155Address').val($(this).data('contractAddress'));
                        $('#nftErc1155CurrName').val($(this).data('contractName'));
                        $('#view-collections').css('display', 'initial');

                        _this.loadPage('myNftsPage');
                    });

                    $('#view-collections').on('click', function(){
                        $('#myPoolsPage').css('display', 'grid');
                        $('#myNftsPage').css('display', 'none');
                        $('#view-collections').css('display', 'none');

                    })

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

            }catch (e){

                console.log('Trouble resolving collection uri: ', _uri);
            }

            let maxPerLoad = 8;
            let currInvertedIndex = (length - 1) - i;

            if( currInvertedIndex % maxPerLoad == maxPerLoad - 1 ){

                _this.lastErc1155Index = i;

                break;
            }
        }

        if(currentIndex > 0){

            $('#loadMore').remove();
            $('#myPoolsPage').append(_this.nextButtonTemplate({}));
            $('#loadMoreButton').off('click');
            $('#loadMoreButton').on('click', function(){
                _this.populateMyErc1155s();
            });
        }

        if( length == 0 ){

            $('#myPoolsPage').html(_this.noPoolsTemplate({}));
        }
    };

    this.populateMyNfts = async function(){

        /**
         * EDIT ACTION
         */
        $('#nftNewModal').off('show.bs.modal');
        $('#nftNewModal').on('show.bs.modal', this.newUpdateNft);

        if(_this.lastNftIndex == -1) {
            $('#myNftsPage').html('');
        }else{
            $('#loadMore').remove();
        }

        let erc1155Address = $('#nftErc1155Address').val();

        let nfts = await window.tncLib.getNftsByUri(erc1155Address);

        let offset = _this.lastNftIndex > -1 ? _this.lastNftIndex : 0;
        let currentIndex = offset;

        if(offset <= 0) {
            $('#myNftsPage').append('<div class="container-fluid" style="grid-column-start: 1; grid-column-end: -1;"><h1 id="nftContractNameTitle"></h1></div>');
            $('#nftContractNameTitle').text($('#nftErc1155CurrName').val());
        }

        for(let i = offset; i < nfts.length; i++){

            currentIndex = i;

            let nft = await window.tncLib.getNft(erc1155Address, nfts[i]);

            try {

                let data = await $.getJSON(nft.uri);

                if (typeof data == 'object') {

                    if(typeof data.animation_url == 'undefined'){
                        data['animation_url'] = '';
                    }

                    if(typeof data.audio_url == 'undefined'){
                        data['audio_url'] = '';
                    }

                    if(typeof data.interactive_url == 'undefined'){
                        data['interactive_url'] = '';
                    }

                    let tmpl = _this.myNftTemplate({
                        image: data.image,
                        audio_url: data.audio_url,
                        animation_url: data.animation_url,
                        interactive_url: data.interactive_url,
                        name: data.name,
                        description: data.description,
                        url: data.external_link,
                        id: nfts[i],
                        erc1155: erc1155Address,
                        supply: nft.supply,
                        maxSupply: nft.maxSupply,
                        balance: nft.balance,
                        attributes: data.attributes
                    });

                    $('#myNftsPage').append(tmpl);

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

                    if(chain_id == '1') {
                        $('.marketRoyaltiesLink').css('display', 'none');
                    }
                }

            }catch (e){

                console.log('Trouble resolving nft uri: ', nft);
            }

            let maxPerLoad = 8;

            if( i % maxPerLoad == maxPerLoad - 1 ){

                _this.lastNftIndex = i + 1;

                break;
            }
        }

        if(currentIndex + 1 < nfts.length){

            $('#loadMore').remove();
            $('#myNftsPage').append(_this.nextButtonTemplate({}));
            $('#loadMoreButton').off('click');
            $('#loadMoreButton').on('click', function(){
                _this.populateMyNfts();
            });
        }

        /**
         * BURN ACTION
         */

        $('#nftBurnModal').off('show.bs.modal');
        $('#nftBurnModal').on('show.bs.modal', function(e){

            $('#nftBurnNftId').val( $(e.relatedTarget).data('nftId') );
        });

        $('#nftBurnButton').off('click');
        $('#nftBurnButton').on('click', function(){

            toastr.remove();

            window.tncLib.burn(
                erc1155Address,
                $('#nftBurnNftId').val(),
                $('#nftBurnAmount').val(),
                function (){
                    toastr["info"]('Please wait for the transaction to finish.', "Burning NFTs....");
                },
                function(receipt){
                    console.log(receipt);
                    toastr.remove();
                    toastr["success"]('Transaction has been finished.', "Success");
                },
                function(){
                    toastr.remove();
                    toastr["error"]('An error occurred with your burn transaction.', "Error");
                });
        });

        /**
         * MINT ACTION
         */
        $('#nftMintModal').off('show.bs.modal');
        $('#nftMintModal').on('show.bs.modal', function(e){

            $('#nftMintNftId').val( $(e.relatedTarget).data('nftId') );
        });

        $('#nftMintButton').off('click');
        $('#nftMintButton').on('click', function(){

            toastr.remove();

            window.tncLib.mint(
                erc1155Address,
                $('#nftMintNftId').val(),
                $('#nftMintAmount').val(),
                function (){
                    toastr["info"]('Please wait for the transaction to finish.', "Minting NFTs....");
                },
                function(receipt){
                    console.log(receipt);
                    toastr.remove();
                    toastr["success"]('Transaction has been finished.', "Success");
                },
                function(){
                    toastr.remove();
                    toastr["error"]('An error occurred with your mint transaction.', "Error");
                });
        });

        /**
         * TRANSFER ACTION
         */

        $('#nftTransferButton').off('click');
        $('#nftTransferButton').on('click', function(){

            toastr.remove();

            window.tncLib.transfer(
                erc1155Address,
                $('#nftTransferNftId').val(),
                $('#nftTransferAmount').val(),
                $('#nftTransferToAddress').val().trim(),
                function (){
                    toastr["info"]('Please wait for the transaction to finish.', "Transferring NFTs....");
                },
                function(receipt){
                    console.log(receipt);
                    toastr.remove();
                    toastr["success"]('Transaction has been finished.', "Success");
                },
                function(){
                    toastr.remove();
                    toastr["error"]('An error occurred with your transfer transaction.', "Error");
                });
        });
    };

    this.clearNewUpdateNft = function(){

        $("#nftForm")[0].reset();
        $("#addedAttributes").html('');
        $('#nftSupplyGroup').css('display', 'block');
        $('#nftMaxSupplyGroup').css('display', 'block');
        $('#nftIsEdit').val(0);
        $('#nftNewModalLabel').html('New NFT');
        $('#nftSubmit').html('Create NFT');
        $('#nftImageUrl').val('');
        $('#nftVideoUrl').val('');
        $('#nftAudioUrl').val('');
        $('#nftInteractiveUrl').val('');
        $('.imageFileDisplay').html('');
        $('.videoFileDisplay').html('');
        $('.audioFileDisplay').html('');
        $('.interactiveFileDisplay').html('');
        $('.submitNewUpdate').prop('disabled', false);
    };

    this.clearNewUpdateCollection = function(){

        $("#contractForm")[0].reset();
        $('#collectionUpdateAddress').val('');
        $('#nftContractModalLabel').html('New Collection');
        $('#erc1155Submit').html('Create');
        $('#collectionIsEdit').val(0);
        $('#collectionTicker').css('display', 'block');
        $('#erc1155ImageUrl').val('');
        $('#feeCollection').css('display', 'block');
        $('.imageFileDisplay').html('');
        $('.submitNewUpdate').prop('disabled', false);
    };

    this.newUpdateCollection = async function(e){

        _this.clearNewUpdateCollection();

        $('.currency').html(getCurrency());

        let fee = await web3.utils.fromWei(await window.tncLib.getPoolFee()+"");
        let nif = await web3.utils.fromWei(await window.tncLib.getPoolMinimumNif());

        $('#nifMinCollection').html(nif);
        $('#ethFeeCollection').html(fee);

        if( $(e.relatedTarget).data('edit') ){

            $('#feeCollection').css('display', 'none');
            $('#collectionTicker').css('display', 'none');
            $('#collectionIsEdit').val($(e.relatedTarget).data('contractAddress'));

            let contractMeta = await window.tncLib.getErc1155Meta($(e.relatedTarget).data('contractAddress'));

            try{

                let data = await $.getJSON(contractMeta.contractURI);

                if (typeof data == 'object') {

                    console.log('edit action for data: ', data);

                    $('#nftContractModalLabel').html('Edit Collection');
                    $('#erc1155Submit').html('Update Collection');
                    $('#erc1155Description').val( data.description );
                    $('#erc1155ExternalUrl').val( data.external_link );
                    $('#erc1155ImageUrl').val( data.image );
                    if(data.image.trim() != "") {
                        $('.imageFileDisplay').html('<img src=' + JSON.stringify(data.image) + ' border="0" width="200"/>');
                    }
                    $('#erc1155Name').val( data.name );
                }
                else{

                    _alert('Contract meta not valid: ' + contractMeta.contractURI);
                }

            }catch(e){

                _alert('Trouble resolving contract uri: ' + contractMeta.contractURI);
            }

            $('#collectionUpdateAddress').val( $(e.relatedTarget).data('contractAddress') );
        }
    };

    this.newUpdateNft = async function(e){

        _this.clearNewUpdateNft();

        if( $(e.relatedTarget).data('edit') ){

            $('#nftSupplyGroup').css('display', 'none');
            $('#nftMaxSupplyGroup').css('display', 'none');
            $("#nftForm")[0].reset();
            $("#addedAttributes").html('');
            $('#nftIsEdit').val($(e.relatedTarget).data('nftId'));

            let nft = await window.tncLib.getNft($(e.relatedTarget).data('contractAddress'), $(e.relatedTarget).data('nftId'));

            try {

                let data = await $.getJSON(nft.uri);

                if (typeof data == 'object') {

                    console.log('edit action for data: ', data);

                    if(typeof data.animation_url == 'undefined'){
                        data['animation_url'] = '';
                    }

                    if(typeof data.audio_url == 'undefined'){
                        data['audio_url'] = '';
                    }

                    if(typeof data.interactive_url == 'undefined'){
                        data['interactive_url'] = '';
                    }
                    else
                    {
                        data.interactive_url = data.interactive_url;
                    }

                    $('#nftNewModalLabel').html('Edit NFT');
                    $('.submitNewUpdate').html('Update NFT');

                    $('#nftDescription').val( data.description );
                    $('#nftExternalUrl').val( data.external_link );
                    $('#nftImageUrl').val( data.image );
                    $('#nftVideoUrl').val( data.animation_url );
                    $('#nftAudioUrl').val( data.audio_url );
                    $('#nftInteractiveUrl').val( data.interactive_url );
                    if(data.image.trim() != "") {
                        $('.imageFileDisplay').html('<img src=' + JSON.stringify(data.image) + ' border="0" width="200"/>');
                    }
                    if(data.animation_url.trim() != "") {
                        let tag = '<video autoplay="autoplay" preload="auto" muted="muted" poster=' + JSON.stringify(data.image) + ' loop="loop" width="400" controls="controls">\n' +
                            '  <source src='+JSON.stringify(data.animation_url)+' type="video/mp4">\n' +
                            '  Videos are not supported by your browser\n' +
                            '</video>';
                        $('.videoFileDisplay').html(tag);
                    }
                    if(data.audio_url.trim() != "") {
                        let tag = '<audio controls="controls" preload="auto" loop="loop">\n' +
                            '  <source src=' + JSON.stringify(data.audio_url) + ' type="audio/mp3">\n' +
                            '  Your browser does not support audio.\n' +
                            '</audio>';
                        $('.audioFileDisplay').html(tag);
                    }
                    if(data.interactive_url.trim() != "") {
                        let tag = '<iframe style="width:100%;height:400px;" src=' + JSON.stringify(data.interactive_url.trim()) + ' sandbox="allow-scripts allow-pointer-lock allow-popups allow-forms"></iframe>';
                        $('.interactiveFileDisplay').html(tag);
                    }

                    $('#nftName').val( data.name );

                    for(let i = 0; i < data.attributes.length; i++){

                        $('#addAttributeKey').val( data.attributes[i].trait_type );
                        $('#addAttributeValue').val( data.attributes[i].value );
                        if(typeof data.attributes[i].display_type != 'undefined') {
                            $('#addDisplayType').val(data.attributes[i].display_type);
                        }else{
                            $('#addDisplayType').val('text');
                        }
                        $('#addAttributeButton').click();
                    }
                }
                else{

                    _alert('NFT not a valid json object: ' + nft.uri);
                }

            }catch (e){

                console.log(e.message);
                _alert('Trouble resolving nft uri: ' + nft.uri);
            }
        }

        console.log('new/edit nft for contract: ', $(e.relatedTarget).data('contractAddress'));
        $('#nftErc1155Address').val( $(e.relatedTarget).data('contractAddress') );
    };

    this.processTransferMultiBatch = async function(){

        let recipients = $('#nftTransferMultiBatchToAddresses').val().replace("\r","").split("\n");
        let collection = $('#nftTransferMultiBatchCollection').val().trim();
        let ids = $('#nftTransferMultiBatchIds').val().replace("\r","").split("\n");
        let amounts = $('#nftTransferMultiBatchAmounts').val().replace("\r","").split("\n");

        if(!web3.utils.isAddress(collection)){
            _alert('Given collection is not a valid address.');
            return;
        }

        if(!await tncLib.isErc1155Supported(collection)){
            _alert('Given address is not a valid collection contract.');
            return;
        }

        if(recipients.length == 0){
            _alert('Please add recipient addresses.');
            return;
        }

        let wrong_recipients = '';
        for(let i = 0; i < recipients.length; i++){

            if(!web3.utils.isAddress(recipients[i])){
                wrong_recipients += recipients[i] + '<br/>';
            }
        }

        if(wrong_recipients != ''){
            _alert('The following addresses are invalid:<br/><br/>' + wrong_recipients);
            return;
        }

        if(ids.length != amounts.length){
            _alert('There must be as many NFT IDs as there are amounts.');
            return;
        }

        for(let i = 0; i < recipients.length; i++){

            recipients[i] = recipients[i].trim();
        }

        let approved = await tncLib.erc1155IsApprovedForAll(tncLib.account, tncLib.multiBatch.options.address, collection);

        if(!approved)
        {

            $('#nftTransferMultiBatchButton').prop('disabled', true);
            $('#nftTransferMultiBatchButton').html('Approve first...');

            toastr.remove();

            tncLib.erc1155SetApprovalForAll(
                tncLib.multiBatch.options.address,
                true,
                collection,
                function () {
                    toastr["info"]('Please wait for the transaction to finish.', "Set approval for all....");
                },
                function (receipt) {
                    console.log(receipt);
                    toastr.remove();
                    $('#nftTransferMultiBatchButton').prop('disabled', false);
                    $('#nftTransferMultiBatchButton').html('Approved! Transfer Now');
                    toastr["success"]('Transaction has been finished.', "Success");
                },
                function (err) {
                    toastr.remove();
                    $('#nftTransferMultiBatchButton').prop('disabled', false);
                    $('#nftTransferMultiBatchButton').html('Transfer');
                    let errMsg = 'An error occurred with your set approval for all transaction.';
                    toastr["error"](errMsg, "Error");
                }
            );
        }
        else
        {

            toastr.remove();
            $('#nftTransferMultiBatchButton').html('Pending Transaction...');
            $('#nftTransferMultiBatchButton').prop('disabled', true);

            window.tncLib.transferMultiBatch(
                collection,
                recipients,
                ids,
                amounts,
                function (){
                    toastr["info"]('Please wait for the transaction to finish.', "Transferring NFTs....");
                },
                function(receipt){
                    console.log(receipt);
                    toastr.remove();
                    $('#nftTransferMultiBatchButton').html('Transfer');
                    $('#nftTransferMultiBatchButton').prop('disabled', false);
                    toastr["success"]('Transaction has been finished.', "Success");
                },
                function(){
                    toastr.remove();
                    $('#nftTransferMultiBatchButton').prop('disabled', false);
                    $('#nftTransferMultiBatchButton').html('Transfer');
                    toastr["error"]('An error occurred with your transfer transaction.', "Error");
                });
        }
    }

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

    this.loadPage = async function (page){

        $('#myPoolsPage').css('display', 'none');
        $('#myNftsPage').css('display', 'none');

        switch (page){

            case 'myNftsPage':

                $('#storeRoyaltiesButton').off('click');
                $('#storeRoyaltiesButton').on('click', _this.performRoyalties);

                $('#royaltiesModal').off('show.bs.modal');
                $('#royaltiesModal').on('show.bs.modal', _this.populateRoyalties);

                $('#nftTransferModal').off('show.bs.modal');
                $('#nftTransferModal').on('show.bs.modal', function(e){

                    $('#nftTransferNftId').val( $(e.relatedTarget).data('nftId') );
                });

                this.lastNftIndex = -1;

                $('#myNftsPage').css({
                    'display': 'grid', 
                    'grid-template-columns': 'repeat(auto-fill, minmax(25rem, 1fr)',
                    'grid-gap': '2rem'
                });

                await _this.populateMyNfts();

                break;

            default:

                _this.lastErc1155Index = -1;

                $('#nftContractModal').off('show.bs.modal');
                $('#nftContractModal').on('show.bs.modal', this.newUpdateCollection);
                $('#nftTransferMultiBatchButton').off('click');
                $('#nftTransferMultiBatchButton').on('click', this.processTransferMultiBatch);
                _this.clearNewUpdateNft();
                $('#myPoolsPage').css('display', 'grid');
                $('#view-collections').css('display', 'none');

                await _this.populateMyErc1155s();

                break;
        }
    }

    this.storeIpfsImage = function(fileElement, urlStorageElement){

        $('.submitNewUpdate').prop('disabled', true);
        let tmp = $('.submitNewUpdate').html();
        $('.submitNewUpdate').html('Uploading Image...');

        let reader = new FileReader();
        reader.onloadend = function () {

            const buf = buffer.Buffer(reader.result);

            ipfs.add(buf, (err, result) => {

                console.log(err, result);

                let ipfsLink = "https://gateway.ipfs.io/ipfs/" + result[0].hash;
                $(urlStorageElement).val(ipfsLink);
                $('.imageFileDisplay').html('<img src=' + JSON.stringify(ipfsLink) + ' border="0" width="200"/>');
                $('.submitNewUpdate').prop('disabled', false);
                $('.submitNewUpdate').html(tmp);

                _this.pin(result[0].hash);
            });
        };

        if (fileElement.files[0]) {
            reader.readAsArrayBuffer(fileElement.files[0]);
        }
    };

    this.storeIpfsVideo = function(fileElement, urlStorageElement){

        $('.submitNewUpdate').prop('disabled', true);
        let tmp = $('.submitNewUpdate').html();
        $('.submitNewUpdate').html('Uploading Video...');

        let reader = new FileReader();
        reader.onloadend = function () {

            const buf = buffer.Buffer(reader.result);

            ipfs.add(buf, (err, result) => {

                console.log(err, result);

                let ipfsLink = "https://gateway.ipfs.io/ipfs/" + result[0].hash;
                $(urlStorageElement).val(ipfsLink);

                let tag = '<video autoplay="autoplay" preload="auto" muted="muted" loop="loop" width="400" controls="controls">\n' +
                    '  <source src='+JSON.stringify(ipfsLink)+' type="video/mp4">\n' +
                    '  Videos are not supported by your browser\n' +
                    '</video>';
                $('.videoFileDisplay').html(tag);

                $('.submitNewUpdate').prop('disabled', false);
                $('.submitNewUpdate').html(tmp);

                _this.pin(result[0].hash);
            });
        };

        if (fileElement.files[0]) {
            reader.readAsArrayBuffer(fileElement.files[0]);
        }
    };

    this.storeIpfsAudio = function(fileElement, urlStorageElement){

        $('.submitNewUpdate').prop('disabled', true);
        let tmp = $('.submitNewUpdate').html();
        $('.submitNewUpdate').html('Uploading Audio File...');

        let reader = new FileReader();
        reader.onloadend = function () {

            const buf = buffer.Buffer(reader.result);

            ipfs.add(buf, (err, result) => {

                console.log(err, result);

                let ipfsLink = "https://gateway.ipfs.io/ipfs/" + result[0].hash;
                $(urlStorageElement).val(ipfsLink);

                let tag = '<audio controls="controls" preload="auto" loop="loop">\n' +
                    '  <source src=' + JSON.stringify(ipfsLink) + ' type="audio/mp3">\n' +
                    '  Your browser does not support audio.\n' +
                    '</audio>';
                $('.audioFileDisplay').html(tag);

                $('.submitNewUpdate').prop('disabled', false);
                $('.submitNewUpdate').html(tmp);

                _this.pin(result[0].hash);
            });
        };

        if (fileElement.files[0]) {
            reader.readAsArrayBuffer(fileElement.files[0]);
        }
    };

    this.storeIpfsInteractive = function(fileElement, urlStorageElement){

        $('.submitNewUpdate').prop('disabled', true);
        let tmp = $('.submitNewUpdate').html();
        $('.submitNewUpdate').html('Uploading Interactive File...');

        let reader = new FileReader();
        reader.onloadend = function () {

            const buf = buffer.Buffer(reader.result);

            ipfs.add(buf, (err, result) => {

                console.log(err, result);

                let ipfsLink = "https://gateway.ipfs.io/ipfs/" + result[0].hash;
                $(urlStorageElement).val(ipfsLink);

                let tag = '<iframe style="width:100%;height:400px;" src=' + JSON.stringify(ipfsLink) + ' sandbox="allow-scripts allow-pointer-lock allow-popups allow-forms"></iframe>';
                $('.interactiveFileDisplay').html(tag);

                $('.submitNewUpdate').prop('disabled', false);
                $('.submitNewUpdate').html(tmp);
            });
        };

        if (fileElement.files[0]) {
            reader.readAsArrayBuffer(fileElement.files[0]);
        }
    };

    this.pin = function(ipfsToken){

        $.getScript("https://ipfs2arweave.com/permapin/" + ipfsToken)
        .done(function( script, textStatus ) {
            console.log( "PINNED!" );
            console.log( textStatus );
        })
        .fail(function( jqxhr, settings, exception ) {
            console.log( jqxhr, settings, exception );
        });
    }

    this.addDeleteAttribute = function(index){

        $('#addedAttributeKey_' + index).remove();
        $('#addedAttributeValue_' + index).remove();
        $('#addedAttributeDisplayType_' + index).remove();
        $('#addedAttributeDelete_' + index).remove();
        $('#addedFormRow_' + index).remove();
    };

    this.startBlockCounter = function(){

        const _this2 = this;

        let startTime = new Date();

        setInterval(async function(){

            const currBlock = await tncLib.getBlock();

            if(parseInt(currBlock) !== parseInt(_this2.currentBlock)){
                const endTime = new Date();
                let timeDiff = endTime - startTime;
                timeDiff /= 1000;
                const seconds = Math.round(timeDiff);
                startTime = new Date(); // restart
            }

            const _endTime = new Date();
            let _timeDiff = _endTime - startTime;
            _timeDiff /= 1000;
            const _seconds = Math.round(_timeDiff);

            if(_seconds > 60 * 5){

                startTime = new Date(); // restart

                console.log("no change in 5 minutes, restarting web3");

                if (window.ethereum) {
                    window.web3 = new Web3(ethereum);
                    try {

                        // Request account access if needed

                        if(typeof ethereum.enable == 'function' && ethereum.enable){

                            await ethereum.enable();
                        }

                        let accounts = [];

                        if(ethereum && typeof ethereum.enable != 'undefined' && ethereum.enable){
                            accounts = await web3.eth.getAccounts();
                            console.log('account classic with ethereum');
                        }
                        else if(ethereum && ( typeof ethereum.enable == 'undefined' || !ethereum.enable ) ){
                            accounts = await window.ethereum.request({
                                method: 'eth_requestAccounts',
                            });
                            console.log('account new with ethereum');
                        }else{
                            accounts = await web3.eth.getAccounts();
                            console.log('account classic without ethereum');
                        }

                        tncLib.account = accounts[0];

                    } catch (error) {
                        console.log(error);
                        _alert('You rejected to use this dapp.');
                    }
                }
                // Legacy dapp browsers...
                else if (window.web3) {
                    if(typeof  window.web3 == 'undefined' || !window.web3) {
                        window.web3 = new Web3(web3.currentProvider);
                    }
                }
            }

            _this.currentBlock = currBlock;

        }, 1000);
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

    $('#addAttributeButton').on('click', async function(){

        let keys = $('input[name="addedAttributesKeys[]"]');
        for(let i = 0; i < keys.length; i++){
            if($(keys[i]).val().trim() == $('#addAttributeKey').val().trim()){
                _alert("The trait exists already");
                return;
            }
        }

        if($('#addAttributeKey').val().trim() === ""){
            _alert("Please enter a trait key");
            return;
        }

        if($('#addAttributeValue').val().trim() === ""){
            _alert("Please enter a trait value");
            return;
        }

        const index = $('input[name="addedAttributes[]"]').length;

        let formRow = document.createElement("div");
        formRow.setAttribute('class', 'form-row');
        formRow.setAttribute('id', 'addedFormRow_'+index);
        let col1 = document.createElement("div");
        col1.setAttribute('class', 'col');
        let col2 = document.createElement("div");
        col2.setAttribute('class', 'col');
        let col3 = document.createElement("div");
        col3.setAttribute('class', 'col');
        let col4 = document.createElement("div");
        col4.setAttribute('class', 'col');

        $('#addedAttributes').append(formRow);
        $(formRow).append(col1);
        $(formRow).append(col2);
        $(formRow).append(col3);
        $(formRow).append(col4);

        let newThing = document.createElement("input");
        newThing.setAttribute('type', 'text');
        newThing.setAttribute('name', 'addedAttributesKeys[]');
        newThing.setAttribute('id', 'addedAttributeKey_'+index);
        newThing.setAttribute('class', 'form-control addedAttributeKey mt-3');
        newThing.setAttribute('autocomplete', 'off');
        newThing.setAttribute('value', $('#addAttributeKey').val().trim());
        $(col1).append(newThing);

        newThing = document.createElement("input");
        newThing.setAttribute('type', 'text');
        newThing.setAttribute('name', 'addedAttributesValues[]');
        newThing.setAttribute('id', 'addedAttributeValue_'+index);
        newThing.setAttribute('class', 'form-control addedAttributeValue mt-3');
        newThing.setAttribute('autocomplete', 'off');
        newThing.setAttribute('value', $('#addAttributeValue').val().trim());
        $(col2).append(newThing);
        $('#addAttributeKey').focus();

        let data = {
            'text': 'Text',
            'number': 'Number',
            'boost_number': 'Boost Number',
            'boost_percentage': 'Boost Percentage',
            'date': 'Date'
        }
        let s = $('<select />');
        for(let val in data) {
            let opt = $('<option />', {value: val, text: data[val]});
            $(opt).prop('selected', val == $('#addDisplayType').val().trim() ? true : false);
            $(opt).appendTo(s);
        }
        $(s).attr('name', "addedAttributesDisplayTypes[]");
        $(s).attr('id', 'addedAttributeDisplayType_'+index);
        $(s).attr('class', 'form-control mt-3');
        $(col3).append($(s).get(0));

        newThing = document.createElement("button");
        newThing.setAttribute('id', 'addedAttributeDelete_'+index);
        newThing.setAttribute('class', 'addedAttributeDelete btn btn-secondary ml-3 mt-3');
        $(newThing).text('delete');
        $(newThing).on('click', function(){
            _this.addDeleteAttribute(parseInt(index));
        });
        $(col4).append(newThing);

        $('#addAttributeKey').val('');
        $('#addAttributeValue').val('');
        $('#addDisplayType').val('text');


    });

    document.getElementById('nftImageFile').onchange = function () {

        _this.storeIpfsImage( document.getElementById('nftImageFile'), document.getElementById('nftImageUrl') );
    };

    document.getElementById('nftAudioFile').onchange = function () {

        _this.storeIpfsAudio( document.getElementById('nftAudioFile'), document.getElementById('nftAudioUrl') );
    };

    document.getElementById('nftVideoFile').onchange = function () {

        _this.storeIpfsVideo( document.getElementById('nftVideoFile'), document.getElementById('nftVideoUrl') );
    };

    document.getElementById('nftInteractiveFile').onchange = function () {

        _this.storeIpfsInteractive( document.getElementById('nftInteractiveFile'), document.getElementById('nftInteractiveUrl') );
    };

    /**
     * loading erc1155 imagefile, ready to get posted
     */
    document.getElementById('erc1155ImageFile').onchange = function () {

        _this.storeIpfsImage( document.getElementById('erc1155ImageFile'), document.getElementById('erc1155ImageUrl') );
    };

    $('#nftSubmit').on('click', async function(){

        if(
            (
                $('#nftIsEdit').val() == '0' && parseInt($('#nftSupply').val().trim()) < 0
            ) ||
            (
                $('#nftIsEdit').val() == '0' && parseInt($('#nftMaxSupply').val().trim()) <= 0
            ) ||
            $('#nftName').val().trim() == ''
        ){
            _alert('Please enter all required fields.');
            return;
        }

        if($('#nftIsEdit').val() == '0' && ( isNaN(parseInt($('#nftSupply').val().trim())) ||
             isNaN(parseInt($('#nftMaxSupply').val().trim()))) ){
            _alert('Supply and Max. Supply must be numeric.');
            return;
        }

        if($('#nftIsEdit').val() == '0' &&
            ( parseInt($('#nftSupply').val().trim()) < 0 || parseInt($('#nftMaxSupply').val().trim()) < parseInt($('#nftSupply').val().trim()))){
            _alert('Supply and Max. Supply must be larger or equal to zero and Max. Supply must equal or larger than Supply.');
            return;
        }

        let name = $('#nftName').val();
        let description = $('#nftDescription').val();
        let imageUrl = $('#nftImageUrl').val();
        let videoUrl = $('#nftVideoUrl').val();
        let audioUrl = $('#nftAudioUrl').val();
        let interactiveUrl = $('#nftInteractiveUrl').val();
        let externalUrl = $('#nftExternalUrl').val();
        let attributes = [];

        let keys = $('input[name="addedAttributesKeys[]"]');
        let values = $('input[name="addedAttributesValues[]"]');
        let types = $('select[name="addedAttributesDisplayTypes[]"]');
        for(let i = 0; i < keys.length; i++){
            if($(types[i]).val().trim() != 'text') {
                attributes.push({trait_type: $(keys[i]).val().trim(), value: $(values[i]).val().trim(), display_type: $(types[i]).val().trim()});
            }else{
                attributes.push({trait_type: $(keys[i]).val().trim(), value: $(values[i]).val().trim()});
            }
        }

        let nftInfo = {
            name : name,
            description : description,
            image : imageUrl,
            animation_url : videoUrl,
            audio_url : audioUrl,
            interactive_url : interactiveUrl,
            external_link : externalUrl,
            attributes: attributes
        };

        console.log(JSON.stringify(nftInfo));

        ipfs.add(buffer.Buffer(JSON.stringify(nftInfo)), async (err, result) => {

            console.log(err, result);

            _this.pin(result[0].hash);

            let nftJsonUrl = "https://gateway.ipfs.io/ipfs/" + result[0].hash;

            if($('#nftIsEdit').val() == '0'){

                toastr.remove();

                await window.tncLib.newNft(
                    $('#nftSupply').val().trim(),
                    $('#nftMaxSupply').val().trim(),
                    nftJsonUrl,
                    $('#nftErc1155Address').val(),
                    function (){
                        toastr["info"]('Please wait for the transaction to finish.', "Creating new NFT....");
                    },
                    function(receipt){
                        console.log(receipt);
                        toastr.remove();
                        toastr["success"]('Transaction has been finished.', "Success");
                        _this.loadPage('');
                    },
                    function(){
                        toastr.remove();
                        toastr["error"]('An error occurred with your new NFT transaction.', "Error");
                    });
            }
            else
            {
                toastr.remove();

                await window.tncLib.updateUri(
                    $('#nftIsEdit').val(),
                    nftJsonUrl,
                    $('#nftErc1155Address').val(),
                    function (){
                        toastr["info"]('Please wait for the transaction to finish.', "Updating NFT....");
                    },
                    function(receipt){
                        console.log(receipt);
                        toastr.remove();
                        toastr["success"]('Transaction has been finished.', "Success");
                    },
                    function(){
                        toastr.remove();
                        toastr["error"]('An error occurred with your NFT Update transaction.', "Error");
                    });
            }
        });
    });

    $('#erc1155Submit').on('click', async function(){

        if(
            (
                $('#collectionIsEdit').val() == '0' && $('#erc1155Ticker').val().trim() == ''
            ) ||
            $('#erc1155Name').val().trim() == ''
        ){
            _alert('Please enter all required fields.');
            return;
        }

        let name = $('#erc1155Name').val();
        let ticker = $('#erc1155Ticker').val();
        let description = $('#erc1155Description').val();
        let imageUrl = $('#erc1155ImageUrl').val();
        let externalUrl = $('#erc1155ExternalUrl').val();

        let contractInfo = {
            name : name,
            description : description,
            image : imageUrl,
            external_link : externalUrl
        };

        ipfs.add(buffer.Buffer(JSON.stringify(contractInfo)), async (err, result) => {

            console.log(err, result);

            let contractJsonUrl = "https://gateway.ipfs.io/ipfs/" + result[0].hash;

            _this.pin(result[0].hash);

            let proxyRegistryAddress = window.tncLib.defaultProxyRegistryAddress;

            toastr.remove();

            if($('#collectionIsEdit').val() == '0'){

                await window.tncLib.newErc1155(
                    name,
                    ticker,
                    contractJsonUrl,
                    proxyRegistryAddress,
                    function (){
                        try{
                            toastr["info"]("Please wait for the transaction to finish.", "Creating new Collection....");
                        }catch(e){
                            console.log(e);
                        }
                    },
                    function(receipt){
                        try{
                            console.log(receipt);
                            toastr.remove();
                            toastr["success"]('Transaction has been finished.', "Success");
                            _this.populateMyErc1155s();
                        }catch(e){
                            console.log(e);
                        }
                    },
                    function(){
                        try{
                            toastr.remove();
                            toastr["error"]('An error occurred with your new Collection transaction. Do you have sufficient funds?', "Error");
                        }catch(e){
                            console.log(e);
                        }
                    }
                );
            }
            else{

                toastr.remove();

                await window.tncLib.setContractURI(
                    $('#collectionIsEdit').val(),
                    contractJsonUrl,
                    function (){
                        try{
                            toastr["info"]("Please wait for the transaction to finish.", "Updating Collection....");
                        }catch(e){
                            console.log(e);
                        }
                    },
                    function(receipt){
                        try{
                            console.log(receipt);
                            toastr.remove();
                            toastr["success"]('Transaction has been finished.', "Success");
                            _this.populateMyErc1155s();
                        }catch(e){
                            console.log(e);
                        }
                    },
                    function(){
                        try{
                            toastr.remove();
                            toastr["error"]('An error occurred with your updated Collection transaction.', "Error");
                        }catch(e){
                            console.log(e);
                        }
                    }
                );
            }
        });
    });

    $(document).ready(async function(){

        $('#myPoolsButton').on('click', function(){
            _this.loadPage('myPools');
        });

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
            let chain = await web3.eth.getChainId();
            let actualChainId = chain.toString(16);
            dapp.prevChainId = actualChainId;
        }
        else if(window.web3){
            dapp.prevChainId = await web3.eth.net.getId();
        }
        if(window.torus){
            $('#torusAddress').css('display', 'inline-block')
            $('#torusAddressPopover').data('content', tncLib.account);
            $('#torusAddressPopover').popover();
            $('#torusAddressPopover').on('click', function(){
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
        //dapp.startBlockCounter();
        dapp.loadPage(''); // default
    });
}
