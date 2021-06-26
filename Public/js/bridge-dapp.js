function TncDapp() {

    const _this = this;
    this.bridgedTemplate = Handlebars.compile($('#bridged-template').html());
    this.noBridgedTemplate = Handlebars.compile($('#no-bridged').html());
    this.prevAccounts = [];
    this.prevChainId = '';

    this.getBridgedNfts = async function(){

        let nftCount = 0;

        let uniftyverse = tncLibBridgeOut.uniftyverseAddress;
        let length = await tncLibBridgeOut.getJobsLength();

        for (let i = 0; i < length; i++) {

            let job = await tncLibBridgeOut.getJob(i);
            let nftId = await tncLibBridgeOut.getBridgedId(job._srcChainId, job._srcAddress, job._srcId);

            _this.render(uniftyverse, nftId, tncLib.account, job, i, job._srcUri);
            await sleep(300);
            nftCount++;
            await waitForPaging('bridgedPage', nftCount);
        }

        if(nftCount == 0){

            $('#bridgedPage').append(_this.noBridgedTemplate({}));
        }
    };

    this.render = async function(erc1155, id, address, job, index, srcUri){

        let nft = await window.tncLib.getForeignNft(erc1155, address, id);

        if(nft.uri == ''){
            nft.uri = srcUri;
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
            data_interactive_url = data_interactive_url + "?erc1155Address="+erc1155+"&id="+id+"&chain_id="+chain_id
        }
        let tmpl = _this.bridgedTemplate({
            jobid : this.hexToInt(job._jobId),
            srcChainid : this.hexToInt(job._srcChainId),
            srcCollection : job._srcAddress,
            srcId : this.hexToInt(job._srcId),
            checkOpenSea : chain_id == '1' || chain_id == '4' ? 'Check on OpenSea' : 'Open Details',
            image: data_image,
            animation_url: data_animation_url,
            audio_url: data_audio_url,
            interactive_url: data_interactive_url,
            name: data_name,
            description: data_description,
            url: data_link,
            attributes: data_attributes,
            id: id,
            index: index,
            erc1155: erc1155,
            supply: nft.supply,
            maxSupply: nft.maxSupply,
            amount: job._srcAmount,
            traitsHide : traits_hide,
            owns: address == tncLib.account ? 'You Own' : 'Owns',
            options: address == tncLib.account ? 'true' : '',
            collectionName : meta.name != 'n/a' ? '<div class="text-truncate" style="font-size: 1.4rem !important;">' + meta.name + '</div>' : '<div class="text-truncate" style="font-size: 1.4rem !important;">' + erc1155 + '</div>',
            opensea : chain_id == '1' || chain_id == '4' ? 'https://opensea.io/assets/'+erc1155+'/'+id : 'collectible.html?collection=' +  erc1155 + '&id=' + id
        });

        $('#bridgedPage').append(tmpl);

        $('#redeemButton'+index).on('click', async function(){

            let fee = await tncLibBridgeOut.getONEFee();
            let balance = web3.utils.toBN( web3.utils.toWei( ""+await tncLib.balanceOfErc20(tncLib.nif.options.address, tncLib.account) , 'ether') );

            if(balance.lt(fee)){
                _alert('Insufficient ONE funds for fees. Required: ' + _this.formatNumberString(fee.toString(),18) + " NIF");
                return;
            }

            let allowance = web3.utils.toBN( await tncLib.allowanceErc20Raw(
                tncLib.nif.options.address,
                tncLib.account,
                tncLibBridgeOut.ethOut.options.address
            ) );
           
            if(
                allowance.lt(fee)
            ){

                $(this).prop('disabled', true);
                $(this).html('Approve first!');

                let _button = this;

                await window.tncLib.approveErc20(
                    tncLib.nif.options.address,
                    fee.toString(),
                    tncLibBridgeOut.ethOut.options.address,
                    function () {
                        toastr["info"]('Please wait for the transaction to finish.', "Approve....");
                    },
                    function (receipt) {
                        console.log(receipt);
                        toastr.remove();
                        toastr["success"]('Transaction has been finished.', "Success");
                        $(_button).prop('disabled', false);
                        $(_button).html('Redeem Now!');
                    },
                    function () {
                        toastr.remove();
                        toastr["error"]('An error occurred with your approval transaction.', "Error");
                        $(_button).prop('disabled', false);
                        $(_button).html('Redeem');
                    });
               }
            else {

                toastr.remove();
                $(this).html('Pending Transaction...');
                $(this).prop('disabled', 'disabled');

                let _button = this;

                tncLibBridgeOut.redeem(
                    index,
                    function (){
                        toastr["info"]('Please wait for the transaction to finish.', "Redeeming....");
                    },
                    function(receipt){
                        console.log(receipt);
                        toastr.remove();
                        $(_button).html('Redeem');
                        $(_button).prop('disabled', false);
                        toastr["success"]('Transaction has been finished.', "Success");
                        $('#bridgedPage').html('');
                        _this.loadPage('');
                    },
                    function(){
                        toastr.remove();
                        $(_button).prop('disabled', false);
                        $(_button).html('Redeem');
                        toastr["error"]('An error occurred with your redemption transaction.', "Error");
                    }
                );
            }
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
    };

    this.performFunds = async function(){

        let funds = $('#fundsAmount').val().trim();

        if(funds == '' || parseFloat(funds) <= 0){

            _alert('Please enter a positive amount of funds in ETH');
            return;
        }

        toastr.remove();
        $(this).html('Pending Transaction...');
        $(this).prop('disabled', 'disabled');

        let _button = this;

        tncLibBridgeOut.depositFunds(
            funds,
            function (){
                toastr["info"]('Please wait for the transaction to finish.', "Depositing....");
            },
            function(receipt){
                console.log(receipt);
                toastr.remove();
                $(_button).html('Deposit');
                $(_button).prop('disabled', false);
                toastr["success"]('Transaction has been finished.', "Success");
                $('#bridgedPage').html('');
                _this.loadPage('');
            },
            function(){
                toastr.remove();
                $(_button).prop('disabled', false);
                $(_button).html('Deposit');
                toastr["error"]('An error occurred with your deposit transaction.', "Error");
            }
        );

    }

    this.performWithdrawFunds = async function(){

        toastr.remove();
        $(this).html('Pending Transaction...');
        $(this).prop('disabled', 'disabled');

        let _button = this;

        tncLibBridgeOut.withdrawFunds(
            function (){
                toastr["info"]('Please wait for the transaction to finish.', "Withdrawing....");
            },
            function(receipt){
                console.log(receipt);
                toastr.remove();
                $(_button).html('Withdraw');
                $(_button).prop('disabled', false);
                toastr["success"]('Transaction has been finished.', "Success");
                $('#bridgedPage').html('');
                _this.loadPage('');
            },
            function(){
                toastr.remove();
                $(_button).prop('disabled', false);
                $(_button).html('Withdraw');
                toastr["error"]('An Withdraw occurred with your withdrawal transaction.', "Error");
            }
        );
    }

    this.performRestore = async function(){

        let jobId = $('#jobId').val().trim();

        if(jobId == '' || parseInt(jobId) <= 0){

            _alert('Please enter a valid Job ID.');
            return;
        }

        toastr.remove();
        $(this).html('Pending Transaction...');
        $(this).prop('disabled', 'disabled');

        let _button = this;

        tncLibBridgeOut.cancelRestore(
            jobId,
            function (){
                toastr["info"]('Please wait for the transaction to finish.', "Cancel Restore....");
            },
            function(receipt){
                console.log(receipt);
                toastr.remove();
                $(_button).html('Restore');
                $(_button).prop('disabled', false);
                toastr["success"]('Transaction has been finished.', "Success");
                $('#bridgedPage').html('');
                _this.loadPage('');
            },
            function(){
                toastr.remove();
                _alert('Your restore cancellation request failed. Either the NFT has been redeemed already or the 2-hour grace-time did not expire yet.');
                $(_button).html('Restore Error');
                $(_button).prop('disabled', false);
                setTimeout(function(){
                    $(_button).html('Restore');
                }, 3000);
                toastr["error"]('An Withdraw occurred with your restore cancellation transaction.', "Error");
            }
        );
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

    this.loadPage = async function (page){

        $('#bridgedPage').css('display', 'none');

        switch (page){

            default:

                $('#gasFunds').html(_this.formatNumberString(await tncLibBridgeOut.getGasFunds(tncLib.account), 18));

                setInterval(async function(){

                    $('#gasFunds').html(_this.formatNumberString(await tncLibBridgeOut.getGasFunds(tncLib.account), 18));

                }, 20000);

                $('#restoreCancelButton').on('click', _this.performRestore);
                $('#depositFundsButton').on('click', _this.performFunds);
                $('#withdrawFundsButton').on('click', _this.performWithdrawFunds);

                $('#nftInteractiveModal').off('hide.bs.modal');
                $('#nftInteractiveModal').on('hide.bs.modal', function(){
                    $('#interactiveBody').html(window.interactiveDefault);
                });

                $('#nftInteractiveModal').off('show.bs.modal');
                $('#nftInteractiveModal').on('show.bs.modal', _this.populateInteractive);

                $('#bridgedPage').css('display', 'grid');

                await _this.getBridgedNfts();

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

    this.hexToInt = function (hex) {
        return parseInt(hex.replace('0x','').replace(/\b0+/g, ''));
    }

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
        window.tncLibBridgeOut = new TncLibBridge();
        tncLibBridgeOut.account = tncLib.account;

        if(typeof accounts == 'undefined' || accounts.length == 0){

            tncLib.account = '0x0000000000000000000000000000000000000000';
            tncLibBridgeOut.account = '0x0000000000000000000000000000000000000000';
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
