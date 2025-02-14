
import { ethers} from "ethers";
async function switchNetwork(_this,option){
    if( !option.data || !option.data.chainId) {
        throw  new Error("lack field")
    } 
    var netwrok=ethers.utils.hexStripZeros(ethers.utils.hexlify(option.data.chainId)) 
    try {
        await _this.chainBlockSendProvider.request({
          method:"wallet_switchEthereumChain",
          params:[{chainId:netwrok}]
        })
    }catch(error){
        return {
           status: _this.statusFail,
           message:error
        }
    }
    return {
        status:_this.statusSuccess,
        message:"switch success"
    }
}
export {switchNetwork}








