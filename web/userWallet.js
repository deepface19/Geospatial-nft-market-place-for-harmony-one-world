import  {hmy}  from './init';

class userStore {
     
    constructor (stores) {
        this.isOneWallet = window.onewallet && window.onewallet.isOneWallet;
        this.onewallet = window.onewallet;
    }

    async signin(){
        const getAccount = await this.onewallet.getAccount();
        console.log("slkdfjds")
        console.log(getAccount)

        this.address = getAccount.address;
        this.isAuthorized = true;
    }

      signTransaction(txn) {
        console.log("asjdnasljkndlask")
        if (this.isOneWallet) {
          return this.onewallet.signTransaction(txn);
        }
      }

      attachToContract(contract) {
        if(this.onewallet){
          contract.wallet.signTransaction = async (tx)=>{
            tx.from = this.address;
            const signTx = await this.signTransaction(tx);
            console.log(signTx);
            return signTx;
          }
        }
        return contract
      }
}

export default userStore

