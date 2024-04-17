
import { ethers} from "ethers";
async function switchNetwork(_this,option){
    if( !option.data || !option.data.chainId) {
        throw  new Error("lack field")
    } 
    var netwrok=ethers.utils.hexStripZeros(ethers.utils.hexlify(option.data.chainId)) 
    let status=_this.statusSuccess;
    try {
        await _this.chainBlockSendProvider.request({
          method:"wallet_switchEthereumChain",
          params:[{chainId:netwrok}]
        })
    }catch(error){
        status=_this.statusFail
    }
    return {
        status:status        
    }
}
export {switchNetwork}








