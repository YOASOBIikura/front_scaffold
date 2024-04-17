import {toRaw} from "vue"
import { BigNumber, ethers } from "ethers";
import {SimpleAccountAPI, PaymasterAPI, HttpRpcClient} from "@account-abstraction/sdk"
import {sendOrderR,getOrderR,getVaultR,getVaultMaxSaltR,getVaultNonceR,getFeeDataR,getAllVaultLengthR} from "@/api/bundler"
import {useAxiosStore} from "@/pinia/modules/axios"


let beneficiary="0x2E4621E682272680AEAB78f48Fc0099CED79e7d6"//bundler受益人
let loopTime=3000 //多长时间循环一次 
let loopCount=10  //循环多少次
async function sendTxToBundler(dest, value, func){
    let axiosStore=useAxiosStore()
    //获取provider 获得signer
    let provider= toRaw(axiosStore.currentProvider)  
    let signer=await provider.getSigner()
    //获取下标index
    // let response= await getVaultMaxSaltR(axiosStore.currentAccount)
    // let maxSalt=response.message.maxSalt.add(BigNumber.from(1))
    let maxSalt=1
    // console.log(response,"maxSalt",maxSalt.toString(),axiosStore.currentAccount)
    //获取vault
    let vaultResponse=  await getVaultR(axiosStore.currentAccount,maxSalt)
    let vault=vaultResponse.message.vault
    console.log(vault,"vault")
    //是否需要初始化vault
    let vaultCode = await provider.getCode(vault)
    console.log(vaultCode,"vaultCode")
    let initCode="0x"
    if (vaultCode == "0x") {
        initCode = `${axiosStore.currentContractData["VaultFactory"]}5fbfb9cf${String(axiosStore.currentAccount).substring(2).padStart(64, "0")}${String(Number(maxSalt)).toString(16).padStart(64, "0")}`
    }
    //获取nonce
    let nonceResponse= await getVaultNonceR(vault)
    let nonce=nonceResponse.message&&nonceResponse.message.nonce 
    console.log(nonce,"nonce")
    //获取费用
    let feeDataResponse=await getFeeDataR()
    let  suggesMaxFeePerGas=feeDataResponse.data.data.suggesMaxFeePerGas
    let  suggesMaxPriorityFeePerGas=feeDataResponse.data.data.suggesMaxFeePerGas
    console.log(feeDataResponse,"feeDataResponse",suggesMaxFeePerGas,suggesMaxPriorityFeePerGas)
    //处理vault要做的事情
    let funcHex = new ethers.utils.Interface(["function executeBatch(address[] dest,uint256[] value,bytes[] func)"])
    let callData= funcHex.encodeFunctionData("executeBatch", [ dest,value, func])
    console.log(callData,"callData")
    var unsignOp = {
        sender: vault,
        nonce: nonce,
        initCode: initCode,
        callData: callData,
        callGasLimit: 5800000,
        verificationGasLimit: 500000,
        maxFeePerGas: parseInt(suggesMaxFeePerGas * 1.5),
        maxPriorityFeePerGas: parseInt(suggesMaxPriorityFeePerGas * 1.1),
        paymasterAndData: axiosStore.currentContractData["VaultPaymaster"],
        preVerificationGas: 4500000,
        signature: ''
     }
    
     let accountAPI = new SimpleAccountAPI({
        provider: provider,
        entryPointAddress: axiosStore.currentContractData["EntryPoint"],
        owner: signer,
        factoryAddress: axiosStore.currentContractData["VaultFactory"],
        index: maxSalt
     }) 
     try{
     var op = await accountAPI.signUserOp(unsignOp)
    }catch(error){
        return {
            status:false,
            message:error.message
        }
    }
     op.sender = await op.sender
     op.maxFeePerGas = Number(await op.maxFeePerGas)
     op.maxPriorityFeePerGas = Number(await op.maxPriorityFeePerGas)
     op.maxFeePerGas = Number(await op.maxFeePerGas)
     op.nonce = Number(await op.nonce)
     op.verificationGasLimit = Number(op.verificationGasLimit)
     op.signature = await op.signature
     console.log(op,"op") 
     //----------------bundler交互------------------------
     let hashResponse= await sendOrderR(axiosStore.currentContractData["EntryPoint"],beneficiary,op)
     console.log(hashResponse,"hashResponse")
     if(!hashResponse.data ||!hashResponse.data.id){
        return {
            status:false,
            message:hashResponse.msg
        }
     }
     let orderId=hashResponse.data.id
     let hash = await getOperationHash(orderId, loopTime, loopCount)
     console.log(hash,"hash")
     let tx = await provider.waitForTransaction(hash)
     if(tx.status==1){
        console.log(tx,"交易成功")
        return {
            status:true,
            message:hash
        }
     }else{
        console.log(tx,"交易失败")
        return {
            status:false,
            message:hash
        }
     }
   
}

/**
 * 
 * @param {*} orderId  订单id
 * @param {*} time   多少时间访问一次
 * @param {*} count  访问多少次
 * @returns 
 */
async function getOperationHash(orderId, time, count) { 
    let currentIndex=1
    let orderResponse=  await getOrderR(orderId)
    if ( orderResponse.data && orderResponse.data.txHash) {
        return orderResponse.data.txHash
    }
    //循环请求 
    return new Promise(resolve=>{
        let timeId= setInterval(async ()=>{
            let  orderResponse=  await getOrderR(orderId)
            if ( orderResponse.data && orderResponse.data.txHash) {
                   clearInterval(timeId);
                   resolve(orderResponse.data.txHash)
            }  
            if(count<=currentIndex){
                  clearInterval(timeId)
            }
            currentIndex++
        },time)  
    })
 }

export {sendTxToBundler}


