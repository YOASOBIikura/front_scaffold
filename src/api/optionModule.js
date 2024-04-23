import { useAxiosStore } from "@/pinia/modules/axios";

function  setSigatureLockApi(_vault,_orderType,_underlyingAsset,_timestamp){
    return  useAxiosStore().axios({
        mode:"chainBlockSend", 
        target:"@OptionModule",
        method:"setSigatureLock",
        data:{
          param:{
             "address:1":_vault,
             "uint8:2":_orderType,
             "address:3":_underlyingAsset,
             "uint256:4":_timestamp
          },  
    }});
}

//签712订单
function sign712OrderApi(chainId,OptionPutModule,signatureInfo){
    return useAxiosStore().axios({
        mode:"sign712",
        data:{
           domain:{
            name: "jasperVault",
			version: "2.0.0",
			chainId: chainId,
            verifyingContract:OptionPutModule
           },
           primaryType:"Signature",
           types:{ 
            EIP712Domain:[
             {name:'name', type:'string'},
             {name:'version', type:'string'},
             {name:'chainId',type :'uint256'},
             { name : 'verifyingContract' , type : 'address'}],
             Signature:[
                {type:"uint8", name:"orderType"},
                {type:"address",name:"underlyingAsset"},
                {type:"uint8", name:"underlyingAssetType"},
                {type:"uint256", name:"underlyingNftID"},
                {type:"uint256", name:"expirationDate"},
                {type:"uint256", name:"total"},
                {type:"uint256", name:"timestamp"},
                {type:"uint8[]", name:"liquidateModes"},
                {type:"address[]", name:"strikeAssets"},
                {type:"uint256[]", name:"strikeAmounts"},
                {type:"address[]", name:"premiumAssets"},
                {type:"uint256[]", name:"premiumFees"}
            ]
           },
           message:signatureInfo
        }
     })
}









export {setSigatureLockApi,sign712OrderApi}
