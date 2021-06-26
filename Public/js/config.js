// The name of the network/chain the dapps are supported to run on
let network = 'Harmony (ONEs)';

// the chain id of the network as hex value without leading 0x
let chain_id = '1666600000';

// set to true to hide the sell button in the wallet.
// useful if you want to use a custom marketplace and prevent confusion
// as the sell button is solely meant for the built-in marketplace, not for custom marketplaces
let disable_sell_button = false;

// set to true to hide the royalties button in the wallet and collection manager.
// useful if you want to use a custom marketplace and prevent confusion
// as the royalties button is solely meant for the built-in marketplace, not for custom marketplaces
let disable_royalties_button = false;

// recommended block lists for adult collections on the marketplace
// remove the switch below to display all offers from these collections in the public marketplace
// add more items of any collection you want to block
let blocked_collections = [];

switch(chain_id){
    // Harmony (ONEs)
    case '1666600000':
        blocked_collections = [
            "0x601c54655927E15f897480Bf0964085892Ec2d4F".toLowerCase(), // haremtoken
            "0x0E015FaeEb2701D0b96eB2008cAdBF30A3C7A3de".toLowerCase(), // mcthot
            "0x2a254f0179786a43c9b449CBe6aA2Dce77e1561D".toLowerCase() // Cold Truth Culture NFTs NSFW Collection
        ];
        break;
    // Harmony (ONEs)
    case '1666600000':
        blocked_collections = [
            "0x34F16273C250d30C9de5356f54c08C5E7f22de5d".toLowerCase(), // cumrocket
            "0x436B4B0D583A80742C968B9390B384B1BD00346f".toLowerCase(), // cumrocket 2
            "0x99303072453868da39EA02Bc8892d7f6c18ca657".toLowerCase(), // cumrocket 3
            "0x803Ab90866494262c56e30CEb1F86aAd2e36Be64".toLowerCase(), // unknown
            "0x8B94C8aB3c6C293eC5386706735D103C2f145eC0".toLowerCase(), // tight milena
            "0xCBC27b95130A7EBF834DEd352fbD4F715A3f6e59".toLowerCase(), // EDEN KAIN
            "0xcbd86C3693F8F948bc0C7118C3Ff96F66f317Caa".toLowerCase(), // EDEN KAIN 2
            "0xc7921109FB1Bea0c19fCfB5288E700D606AE6B59".toLowerCase(), // animated art
            "0x3C6C221EeF17bEa444d4B531A878b4373D3edeFC".toLowerCase(), // haremtoken
            "0xD8A6d085DfDB9498a263563f91Cc26bE57EFE4b6".toLowerCase(), // Blackie
            //"0x11F5780B54FCfF12fe791eafa34A60F770442d98".toLowerCase(), // anime token
            "0x48d76436F7596DDE45bDD384C375B71Cde3F0208".toLowerCase(), // oppai
            "0x306d4e3Add799686c48FF51DE01DC4f6F122EfF5".toLowerCase(), // appai 2
            "0x59a713632989883b29D544B98Ef3D090A1Ea540B".toLowerCase(),  // rylieeeeb
            "0xDCe4d2AE85ef0E7db7923Cb0AA3307e8bF708BA7".toLowerCase(), // eden kain 3
            "0x339798Ab5b634f6EC3e733ade5d321685847aaa7".toLowerCase(), // eve
            "0x6ff76253235003970ee0224fa97F440166E1dC12".toLowerCase(), // crypto autistic portfolio
            "0x9dE954246AAC2166f7EC14FaAFFAe94bcc463336".toLowerCase(), // cumrocket 4
            "0x1040c4B3BB1Be9d7024499F6AFd0E9aba9d4dab0".toLowerCase(), // eden kain 3
            "0x082ccbFB8446Bc536eF43a1a1a456DEC5f79800C".toLowerCase(), // sophie's feet
            "0x53617d52F6c38235E485D40d053BE024E32aFbc4".toLowerCase(), // awesome colletion
            "0x8D7d1ec378F5FfE9CC3AEB20916e3bEc75B4727B".toLowerCase(), // defi hefi
            "0xb6Df30c5676C0C617F23c5299D168a4c456cc59A".toLowerCase(), // peekaboo
            "0x513C78ab6f5B0b1D5946478fc0cfA9a5C342E103".toLowerCase(), // waterpark
            "0x9180bD8693c27263191b6BB5698b20f2f6C75DdB".toLowerCase(), // KMO Girls
            "0x6d0E3482C91b3B6FF6caBB39197ED8685ff1780c".toLowerCase(), // first tape
            "0xE696830c4B9F06F7f4355a515Bef4d10914f0c99".toLowerCase(), // lucky enough
            "0xb6CD5031AF55d33C6EE25e9391f41E8f1BBEAfb5".toLowerCase(), // xxxnifty
            "0xFbFf3b578D87a115fe4a53cD2AfbA70ef206310f".toLowerCase(), // NSFW coin
            "0x3bfB2AA30F34D22749e3232f790D2CCCe811E081".toLowerCase(), // started stone kitten
            "0x65502D27b7120b2b212fc9852d9B7453a8BF09e4".toLowerCase(), // fun in the wood
            "0xC319187aa298ADA4c9123647fAC1a8664627f5Fa".toLowerCase(), // mycoll
            "0x374B2fb632d7F26cDdE7A1bFC138422C5C9E2148".toLowerCase() // skyhigh
        ];
        break;
    // add further chain specific as desired...
}