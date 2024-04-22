import {toRaw} from "vue"
import { BigNumber, ethers } from "ethers";
import {SimpleAccountAPI} from "@account-abstraction/sdk"
import {sendOrderR,getOrderR,getVaultNonceR,getFeeDataR} from "@/api/bundler"
import {useAxiosStore} from "@/pinia/modules/axios"


let beneficiary="0x2E4621E682272680AEAB78f48Fc0099CED79e7d6"//bundler受益人
let loopTime=3000 //多长时间循环一次 
let loopCount=10  //循环多少次

async function sendTxToBundler(vault,salt,data){
    //处理数据
    let dest=[]
    let value=[]
    let func=[]
    data?.forEach(item=>{
         dest.push(item.target)
         value.push(item.value)
         func.push(item.callData)
  
    })   
    let axiosStore=useAxiosStore()
    //获取provider 获得signer
    let provider= toRaw(axiosStore.currentProvider)  
    let signer=await provider.getSigner()
    //-------------------
    //获取下标index
    // let response= await getVaultMaxSaltR(axiosStore.currentAccount)
    // let maxSalt=response.message.maxSalt.add(BigNumber.from(1))
    // let maxSalt=1
    // console.log(response,"maxSalt",maxSalt.toString(),axiosStore.currentAccount)
    //获取vault
    // let vaultResponse=  await getVaultR(axiosStore.currentAccount,maxSalt)
    // let vault=vaultResponse.message.vault
    // console.log(vault,"vault")

    //-----------------------------------
    //是否需要初始化vault
    let vaultCode = await provider.getCode(vault)
    console.log(vaultCode,"vaultCode")
    let initCode="0x"
    if (vaultCode == "0x") {
        initCode = `${axiosStore.currentContractData["VaultFactory"]}5fbfb9cf${String(axiosStore.currentAccount).substring(2).padStart(64, "0")}${(Number(salt)).toString(16).padStart(64, "0")}`
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
    //-----预估gasLimit-----
    let callGasLimit;
    let gasPriceRate=await getMainGasPriceRate(axiosStore.chainId);
    try {
        if(initCode=="0x"){
            let esGasLimit = await provider.estimateGas({
                from:axiosStore.currentContractData["EntryPoint"],
                to:  vault, //已存在vault地址
                data: callData
            });
            let GasLimit = esGasLimit.mul(parseInt(gasPriceRate.toString())) ;
            callGasLimit =parseInt(GasLimit.toNumber()*gasPriceRate);
        }else{
            callGasLimit = parseInt((2500000 * gasPriceRate).toString());
        }
    } catch (e) {
        console.log("预估gas 失败：", e);
        callGasLimit = parseInt((2500000 * gasPriceRate).toString());
    }
    //-------
    var unsignOp = {
        sender: vault,
        nonce: nonce,
        initCode: initCode,
        callData: callData,
        callGasLimit: callGasLimit, 
        verificationGasLimit: 500000,
        maxFeePerGas: parseInt(suggesMaxFeePerGas * 1.5),
        maxPriorityFeePerGas: parseInt(suggesMaxPriorityFeePerGas * 1.1),
        paymasterAndData: axiosStore.currentContractData["VaultPaymaster"],
        preVerificationGas: 4500000,
        signature: ''
     }
     console.log("unsignOp",unsignOp)
    
     let accountAPI = new SimpleAccountAPI({
        provider: provider,
        entryPointAddress: axiosStore.currentContractData["EntryPoint"],
        owner: signer,
        factoryAddress: axiosStore.currentContractData["VaultFactory"],
        index: salt
     }) 
     try{
     var op = await accountAPI.signUserOp(unsignOp)
     op.sender = await op.sender
     op.maxFeePerGas = Number(await op.maxFeePerGas)
     op.maxPriorityFeePerGas = Number(await op.maxPriorityFeePerGas)
     op.maxFeePerGas = Number(await op.maxFeePerGas)
     op.nonce = Number(await op.nonce)
     op.verificationGasLimit = Number(op.verificationGasLimit)
     op.signature = await op.signature
    }catch(error){
        return {
            status:false,
            message:error.message
        }
    }

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
     return hash;
   
}

async function getBundlerTxResult(hash){
    console.log(hash,"hash")
    const tx = await provider.waitForTransaction(hash,5)
    console.log("交易",tx)
    if(tx.status === 1){
      console.log("交易成功: ", tx)
      const resp = await parseLogForBundler(hash)
      return {
        status: resp,
        message: hash
      }
    } else {
      console.log("交易失败: ", tx)
      return {
        status: false,
        message: hash
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

/**
 * 获取主网的gasPrice倍率
 * 在arbitrum 是L2 网络需要根据L1 的gas去浮动gasLimit
 * 所以此方法为计算L1 网络gasPrice并计算出合适的系数作为L2网络的gasLimit系数
 */
 async function getMainGasPriceRate(chainId) {
    if(chainId !== 42161){
        return 1;
    }
    // -- 获取主网gasPrice
    let mainRpcUrl = "https://ethereum.blockpi.network/v1/rpc/c8f16dd083f31f39453253c58718d2636d808e6e";
    const customProvider = new ethers.providers.JsonRpcProvider(mainRpcUrl);
    let gasprice = await customProvider.send('eth_gasPrice', []);
    let gaspriceRate = ethers.BigNumber.from(gasprice).div(20 * 10 ** 9).toNumber();
    if(gaspriceRate < 1){
        gaspriceRate = 1;
    }
    return gaspriceRate;
}

//解析日志 看看bundler内部交易是否正确
async function parseLogForBundler(txHash){
    let result = false
    let provider= toRaw(axiosStore.currentProvider)  
    let receipt = await provider.getTransactionReceipt(txHash);
    let funcHex = new ethers.utils.Interface(["event UserOperationEvent(bytes32 indexed userOpHash, address indexed sender, address indexed paymaster, uint256 nonce, bool success, uint256 actualGasCost, uint256 actualGasUsed)"])
    if (receipt.logs.length > 0) {
      for (let i=0; i<receipt.logs.length; i++) {
        try {
          const parsedLog = funcHex.parseLog(receipt.logs[i]);
          console.log(parsedLog,"日志解析"); 
          result=parsedLog.args.success
        } catch(e) {
        }
      }
    }
    console.log("解析完毕",result)
    return result
  }


export {sendTxToBundler,getBundlerTxResult}


