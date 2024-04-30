import {useAxiosStore} from "@/pinia/modules/axios"
import { ethers } from "ethers"
//设置module
function setVaultModule(_vault,_modules,_status){
    let axiosStore=useAxiosStore()
    let funcHex = new ethers.utils.Interface(["function setVaultModule(address _vault,address[] memory _modules,bool[] memory _status)"])
    let callData= funcHex.encodeFunctionData("setVaultModule", [ _vault,_modules, _status]) 
    let value=0
    let target=axiosStore.currentContractData["VaultManageModule"]
    
    return {
        target,
        value,
        callData
    }
}

// setVaultType
function setVaultType(_vault,_vaultType){
    let axiosStore=useAxiosStore()
    let funcHex = new ethers.utils.Interface(["function setVaultType(address _vault,uint256 _vaultType)"])
    let callData= funcHex.encodeFunctionData("setVaultType", [_vault,_vaultType]) 
    let value=0
    let target=axiosStore.currentContractData["VaultManageModule"]
    return {
        target,
        value,
        callData
    }
}

function setVaultMasterToken(_vault,_masterToken){
    let axiosStore=useAxiosStore()
    let funcHex = new ethers.utils.Interface(["function setVaultMasterToken(address _vault,address _masterToken)"])
    let callData= funcHex.encodeFunctionData("setVaultMasterToken", [ _vault,_masterToken]) 
    let value=0
    let target=axiosStore.currentContractData["VaultManageModule"]
    return {
        target,
        value,
        callData
    }
}


function setVaultProtocol(_vault,_protocols,_status){
    let axiosStore=useAxiosStore()
    let funcHex = new ethers.utils.Interface(["function setVaultProtocol(address _vault,address[] memory _protocols,bool[] memory _status)"])
    let callData= funcHex.encodeFunctionData("setVaultProtocol", [ _vault,_protocols,_status]) 
    let value=0
    let target=axiosStore.currentContractData["VaultManageModule"]
    return {
        target,
        value,
        callData
    }
}

function setVaultTokens(_vault,_tokens,_types){
    let axiosStore=useAxiosStore()
    let funcHex = new ethers.utils.Interface(["function setVaultTokens(address _vault,address[] memory _tokens,uint256[] memory _types)"])
    let callData= funcHex.encodeFunctionData("setVaultTokens", [ _vault,_tokens,_types]) 
    let value=0
    let target=axiosStore.currentContractData["VaultManageModule"]
    return {
        target,
        value,
        callData
    }
}

export {setVaultModule,setVaultType,setVaultMasterToken,setVaultProtocol,setVaultTokens}