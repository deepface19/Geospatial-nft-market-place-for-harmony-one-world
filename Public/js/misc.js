/**
 *
 * THE CONFIG IS NOW TO BE FOUND IN js/config.js!
 *
 * DO NOT EDIT ANYTHING BELOW
 */

//let api_url = 'http://localhost/knots/rest/public/';
let api_url = 'https://api.firebase.cloud/';

$(document).ready(function(){

    if(chain_id != '1'){
        $('.bridgeNav').css('display', 'none');
    }

    if(chain_id != '1'){

        $('#chainSelectionDropdown').html(network);

    }

    if(chain_id == '1'){

        $('#marketNavLink').css('display', 'none');
        $('#marketRoyaltiesLink').css('display', 'none');
        $('#marketSellLink').css('display', 'none');
    }

    if(chain_id == '61' || chain_id == '38') {
        $('#featured').css('display', 'none');
        //$('#genesisFarm').css('display', 'none');
        //$('#xdaiFarm').css('display', 'none');
        $('#getNifUniswap').css('display', 'none');
        $('#mirror').css('display', 'none');
        $('#bscLogo').css('display', 'block');
        $('#paymentDescription').css('display', 'none');
        $('.hideNonEth').css('display', 'none');
        $('.networkStd').html('BEP20');
        $('#shopEthereum').css('display', 'none');
        $('#shopBsc').css('display', 'inline-block');
        $('#shopXdai').css('display', 'none');
    }else if(chain_id == '4d'){
        $('#featured').css('display', 'none');
        //$('#genesisFarm').css('display', 'none');
        //$('#xdaiFarm').css('display', 'none');
        $('#getNifUniswap').css('display', 'none');
        $('#mirror').css('display', 'none');
        $('#bscLogo').html('xDai/POA (Sokol) Testnet');
        $('#bscLogo').css('display', 'block');
        $('#paymentDescription').css('display', 'none');
        $('.hideNonEth').css('display', 'none');
        $('.networkStd').html('ERC20');
    }else if(chain_id == '64'){
        $('#featured').css('display', 'none');
        //$('#genesisFarm').css('display', 'none');
        //$('#xdaiFarm').css('display', 'none');
        $('#getNifUniswap').css('display', 'none');
        $('#mirror').css('display', 'none');
        $('#bscLogo').html('xDai Chain');
        $('#bscLogo').css('display', 'block');
        $('#paymentDescription').css('display', 'none');
        $('.hideNonEth').css('display', 'none');
        $('.networkStd').html('ERC20');
        $('#shopEthereum').css('display', 'none');
        $('#shopBsc').css('display', 'none');
        $('#shopXdai').css('display', 'inline-block');
    }else if(chain_id == '89'){
        $('#featured').css('display', 'none');
        //$('#genesisFarm').css('display', 'none');
        //$('#xdaiFarm').css('display', 'none');
        $('#getNifUniswap').css('display', 'none');
        $('#mirror').css('display', 'none');
        $('#bscLogo').html('Polygon (Matic)');
        $('#bscLogo').css('display', 'block');
        $('#paymentDescription').css('display', 'none');
        $('.hideNonEth').css('display', 'none');
        $('.networkStd').html('ERC20');
    }else if(chain_id == '507'){
        $('#featured').css('display', 'none');
        //$('#genesisFarm').css('display', 'none');
        //$('#xdaiFarm').css('display', 'none');
        $('#getNifUniswap').css('display', 'none');
        $('#mirror').css('display', 'none');
        $('#bscLogo').html('Moonbeam (Alpha)');
        $('#bscLogo').css('display', 'block');
        $('#paymentDescription').css('display', 'none');
        $('.hideNonEth').css('display', 'none');
        $('.networkStd').html('PRC20');
    }else if(chain_id == 'a4ec'){
        $('#featured').css('display', 'none');
        //$('#genesisFarm').css('display', 'none');
        //$('#xdaiFarm').css('display', 'none');
        $('#getNifUniswap').css('display', 'none');
        $('#mirror').css('display', 'none');
        $('#bscLogo').html('CELO');
        $('#bscLogo').css('display', 'block');
        $('#paymentDescription').css('display', 'none');
        $('.hideNonEth').css('display', 'none');
        $('.networkStd').html('CRC20');
    }else if(chain_id == 'a86a'){
        $('#featured').css('display', 'none');
        //$('#genesisFarm').css('display', 'none');
        //$('#xdaiFarm').css('display', 'none');
        $('#getNifUniswap').css('display', 'none');
        $('#mirror').css('display', 'none');
        $('#bscLogo').html('AVALANCHE');
        $('#bscLogo').css('display', 'block');
        $('#paymentDescription').css('display', 'none');
        $('.hideNonEth').css('display', 'none');
        $('.networkStd').html('ARC20');
    }
    else{
        $('.networkStd').html('ERC20');
        $('#linkToBsc').css('display', 'block');
        $('#linkToDai').css('display', 'block');
        $('#linkToMatic').css('display', 'block');
        $('#linkToCelo').css('display', 'block');
        $('#shopEthereum').css('display', 'inline-block');
        $('#shopBsc').css('display', 'none');
        $('#shopXdai').css('display', 'none');
    }

    //Button to display project funding
    // $('#nulsSco').on('click', displayNulsScoInfo);
});

if(typeof marked != 'undefined') {
    marked.setOptions({
        renderer: new marked.Renderer(),
        pedantic: false,
        gfm: true,
        breaks: false,
        smartLists: true,
        smartypants: false,
        xhtml: true
    });
}

function _alert(msg){
    $('#alertModal .modal-body').html(msg);
    $('#alertModal').modal('show');
};

function displayNulsScoInfo(){

    _alert("Project capital funding is brokered by <a href=\"https://www.nuls.io/\" target=\"_blank\">NULS'</a> <a href=\"https://nuls.medium.com/nuls-2-0-project-nerve-network-bridges-into-the-larger-bitcoin-and-ethereum-universe-5a54bf0138e6\" target=\"_blank\">SCO</a> platform (Staked Coin Output) and highly recommended by the Unifty project.<br /><br />\n" +
        "As an entrepreneur, you may issue your own token on the NULS blockchain and the POCM platform will automatically introduce your project to investors.<br /><br />\n" +
        "Investors will stake on your token and you receive $NULS rewards as capital.<br /><br />\n" +
        "Additionally, your token will be listed on NULS' Nerve Network DEX (Decentralized Exchange) once completed.<br /><br />\n" +
        "A NULS token bridge will be available soon, enabling you to use your token with our services such as the Farm Builder.<br /><br />\n" +
        "\n" +
        "<button style=\"cursor: pointer;\" type=\"button\" class\"btn btn-secondary\" onclick=\"window.location.href='https://pocm.nuls.io/pocm';\">Get Project Funding</button><br/><br/>\n" +
        "\n" +
        "Disclaimer: Our support for NULS' project funding is not a paid promotion. We are planning to build native NULS chain support for Unifty. Once completed, tokens created on NULS' SCO platform will be directly usable with our platform and won't need any bridging.\n" +
        "\n" +
        "\n" +
        "\n");

}

function getCurrency(){
    if(chain_id == '61' || chain_id == '38') {
        return 'BNB';
    } else
    if(chain_id == '4d') {
        return 'SPOA';
    }
    if(chain_id == '64') {
        return 'xDai';
    }
    if(chain_id == '89') {
        return 'MATIC';
    }
    if(chain_id == '507') {
        return 'DEV';
    }
    if(chain_id == 'a4ec') {
        return 'CELO';
    }
    if(chain_id == 'a86a') {
        return 'AVAX';
    }
    return 'ETH';
}

async function fetchWithTimeout(resource, options) {
    const { timeout = 8000 } = options;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(resource, {
        ...options,
        signal: controller.signal
    });
    clearTimeout(id);

    return response;
}

async function fetchUrl(url, timeout) {
    try {
        const response = await fetchWithTimeout(url, {
            timeout: timeout
        });
        return await response.text();
    } catch (error) {
        console.log("FetchUrl Timeout: ", url);
        return false;
    }
}

function getTimestamp(){
    return Math.round((new Date()).getTime() / 1000);
}

function splitNChars(txt, num) {
    let theText = Base64.encode(txt);
    var result = [];
    for (var i = 0; i < theText.length; i += num) {
        result.push(web3.utils.asciiToHex(theText.substr(i, num)));
    }
    return result;
}

Handlebars.registerHelper('breaklines', function(text) {
    text = Handlebars.Utils.escapeExpression(text);
    text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
    return new Handlebars.SafeString(text);
});

Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

Handlebars.registerHelper('ifNotEquals', function(arg1, arg2, options) {
    return (arg1 != arg2) ? options.fn(this) : options.inverse(this);
});

Handlebars.registerHelper('eq', function () {
    const args = Array.prototype.slice.call(arguments, 0, -1);
    return args.every(function (expression) {
        return args[0] === expression;
    });
});

Handlebars.registerHelper('mod0', function (value, res) {

    this.index = res.data.index;
    const _this = this;
    const args = Array.prototype.slice.call(arguments, 0, -1);
    return args.every(function (expression) {
        return _this.index % expression === 0;
    });
});

Handlebars.registerHelper('mod1', function (value, res) {

    this.index = res.data.index;
    const _this = this;
    const args = Array.prototype.slice.call(arguments, 0, -1);
    return args.every(function (expression) {
        return _this.index % expression === 1;
    });
});

Handlebars.registerHelper('mod2', function (value, res) {

    this.index = res.data.index;
    const _this = this;
    const args = Array.prototype.slice.call(arguments, 0, -1);
    return args.every(function (expression) {
        return _this.index % expression === 2;
    });
});

Handlebars.registerHelper('mod3', function (value, res) {

    this.index = res.data.index;
    const _this = this;
    const args = Array.prototype.slice.call(arguments, 0, -1);
    return args.every(function (expression) {
        return _this.index % expression === 3;
    });
});

Handlebars.registerHelper('mod4', function (value, res) {

    this.index = res.data.index;
    const _this = this;
    const args = Array.prototype.slice.call(arguments, 0, -1);
    return args.every(function (expression) {
        return _this.index % expression === 4;
    });
});

Handlebars.registerHelper("markdown", function(md, options) {
    md = Handlebars.Utils.escapeExpression(md);
    md = md.replace(/(\r\n|\n|\r)/gm, '<br>');
    if(typeof marked == 'undefined'){
        return new Handlebars.SafeString(md);
    }
    return new Handlebars.SafeString(marked(md));
});

Handlebars.registerHelper("markdownNoBr", function(md, options) {
    if(typeof marked == 'undefined'){
        return new Handlebars.SafeString(md);
    }
    return new Handlebars.SafeString(marked(md));
});

$(function () {
    'use strict'

    $('[data-toggle="offcanvas"]').on('click', function () {
        $('.offcanvas-collapse').toggleClass('open')
    })
})

const promisify = (inner) =>
    new Promise((resolve, reject) =>
        inner((err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        })
    );

function getUrlParam(param_name) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get(param_name);
}

function errorPopup(errorMsg, message, err){
  _alert("<div class=\"modalErrorDiv\"><div class=\"imageContainer\"><img src=\"assets/img/icons/report_problem_black_48.svg\"></div><div><h3>" + errorMsg + "!" + "</h3><h4>Please clear your browser cache and try again. If that doesn't help, then please follow the steps below.</h4></div></div>" + 
  "<div class=\"modalDivider\"></div>" + 
  "<div class=\"modalErrorDiv\"><div class=\"imageContainer\"><a id=\"errorCopy\" href=\"javascript:void(0);\"><img src=\"assets/img/icons/content_copy_black_24dp.svg\"></a></div><p>" + message + "</p></div>" + 
  "<div class=\"modalDivider\"></div>" + 
  "<div style=\"overflow: auto;\"><p>" + err + "</p></div>");

  $("#errorCopy").on("click", function () {
    navigator.clipboard
      .writeText(err)
      .then(() => {
        console.log("Text copied to clipboard: ", err)
      })
      .catch((err) => {
        console.log("Something went wrong with clipboard copy: ", err);
      });
  });

  return;
}