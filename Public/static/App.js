import './App.css';
import { BridgeDapp } from "./js/bridge-dapp";
import { DappInit } from "./js/dapp-init";
import { CollectibleDapp } from "./js/collectible-dapp";
import { CollectiblesDapp } from './jscollectibles-dapp';
import { ManagerDapp } from "./js/manager-dapp";
import { MarketDapp } from "./js/market-dapp";
import 'bootstrap.bundle.js';
import 'bootstrap.bundle.min.js';
import 'bootstrap.bundle.js.map';
import 'bootstrap.bundle.min.js.map';
import 'bootstrap.js';
import 'bootstrap.js.map';
import 'bootstrap.min.js';
import 'bootstrap.min.js.map';
import 'bridgeInABI.js';
import 'bridgeOutABI.js';
import 'buffer.js';
import 'erc20ABI.js';
import 'erc1155-dapp.js';
import 'erc1155ABI.js';
import 'handlebars.js';
import 'HRC20ABI.js';
import 'HRC1155-dapp.js';
import 'HRC1155ABI.js';
import 'ipfs.js';
import 'jquery.js';
import 'lib-bridge.js';
import 'lib-legacy.js';
import 'lib-market.js';
import 'lib.js';
import 'marketABI.js';
import 'marketWrapABI.js';
import 'multiBatchABI.js';
import 'themeDefault.js';
import 'themeSwitch.js';
import 'web3.js';
import 'web3.min.js.map';
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
import "../../web/hmy.js";
import "../../web/init.js";
import "../../web/userWallet.js";
import "./web/index.html";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

function App() {

  return (
    <Router>
      <div>
        <TopBar />
        <Switch>
          <Route path="/NftMarket">
            <MarketDapp />
          </Route>
          <Route path="/YourWallet">
            <CollectiblesDapp />
          </Route>
          <Route path="/CollectionManager">
            <ManagerDapp/>
          </Route>
          <Route path="/NftBridge">
            <BridgeDapp />
          </Route>
        </Switch>
      </div>
    </Router>

  );
  }
function App(firebaseapp) {
  const db = firebaseApp.database();
  const taskRef = db.ref ('tasks');
  const listTask = qs ('#listTask');
  const btnAdd   = qs('#btnAdd');
  const txtValue = qs('#txtValue');

  let task = [];
  tasksRef.on('child_added',snap => {
    const task = {id: snap.key, ...snap.val() };
    tasks = [...task, task];
    const li = listItem(task);
    listTask.appendChild(li);
  });

  btnAdd.addEventListener('click', click => {
  const name = txtValue.value;
  tasksRef.push({ name });
  });
}
let config = {
  apiKey: "AIzaSyCw4puzn50u9ytrhZsHX3eK_kKk5n9jyZg",
  authDomain: "geospatial-nft-market-place.web.app",
  databaseURL: "https://geospatial-nft-market-place-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "geospatial-nft-market-place",
  storageBucket: "geospatial-nft-market-place.appspot.com",
  messagingSenderId: "211981458262",
  appId: "1:211981458262:web:b3d7f40d3da7ce354614f7"
};

if (location.hostname === 'localhost') {
  config = {
    databaseURL: 'http://loclahost:9000?ns=emulatorui'
  }
}
App(firebase.initializeApp(config));