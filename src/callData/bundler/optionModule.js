import { ethers } from "ethers"
import {useAxiosStore} from "@/pinia/modules/axios"

function setSigatureLock(_vault,_orderType,_underlyingAsset,_timestamp) {
    let axiosStore=useAxiosStore()
    let funcHex = new ethers.utils.Interface(["function setSigatureLock(address _vault,uint8 _orderType,address _underlyingAsset,uint256 _timestamp) external"])
    let callData= funcHex.encodeFunctionData("setSigatureLock", [ _vault,_orderType, _underlyingAsset,_timestamp]) 
    let value=0
    let target=axiosStore.currentContractData["OptionModule"]
    return {
        target,
        value,
        callData
    }
}


function submitOptionOrder(_info,_writerSignature) {
    let axiosStore=useAxiosStore()
    let signatureHex="(uint16 orderType,address underlyingAsset,uint8 underlyingAssetType,uint256 underlyingNftID,uint256 expirationDate,uint256 total,uint256 timestamp,uint8[] liquidateModes,address[] strikeAssets,uint256[] strikeAmounts,address[] premiumAssets,uint256[] premiumFees)"
    let iface=`(uint16 strikeSelect,address holder,uint16 liquidateSelect,address writer,address recipient,uint16 premiumSelet,uint256 underlyingAmount,${signatureHex} signature) _info,bytes _writerSignature`
    let method=`function submitOptionOrder(${iface}) external`
    let funcHex = new ethers.utils.Interface([method])
    let callData= funcHex.encodeFunctionData("submitOptionOrder", [ _info,_writerSignature]) 
    let value=0
    let target=axiosStore.currentContractData["OptionModule"]
    return {
        target,
        value,
        callData
    } 
}

/**
 * 
    function liquidateOption(uint8 _orderType,uint64 _orderID,uint8 _type,uint256 _incomeAmount,uint256 _slippage) external
 * 
 */

function liquidateOption(_orderType,_orderID,_type,_incomeAmount,_slippage) {
        let axiosStore=useAxiosStore()
        let funcHex = new ethers.utils.Interface([" function liquidateOption(uint8 _orderType,uint64 _orderID,uint8 _type,uint256 _incomeAmount,uint256 _slippage) external"])
        let callData= funcHex.encodeFunctionData("liquidateOption", [ _orderType,_orderID, _type,_incomeAmount,_slippage]) 
        let value=0
        let target=axiosStore.currentContractData["OptionService"]
        return {
            target,
            value,
            callData
        }
}



export {setSigatureLock,submitOptionOrder,liquidateOption}
