import { useAxiosStore } from "@/pinia/modules/axios";
//---------call------------
//取得call订单
function getWriterCallOrderApi(_writer){
    return  useAxiosStore().axios({
        mode:"chainBlockCall", 
        target:"@Diamond",
        loop:5,
        method:"getWriterCallOrder",
        data:{
          param:{
             "address":_writer
          },
          returnsType:{
              "tuple:callOrder":{
                "uint256:1": "orderID",
                "address:2": "optionHolder",
                "address:3": "optionWriter",
                "address:4": "optionHolderWallet",
                "address:5": "underlyingAsset",
                "uint256:6": "underlyingAmount",
                "address:7": "optionPremiumAsset",
                "uint256:8": "optionPremiumAmount",
                "uint256:9": "optionPremiumMinAmount",
                "uint256:10": "xFeeAmount",
                "uint256:11": "strikeNotionalMinAmount",
                "uint256:12": "strikeNotionalAmount",
                "uint256:13": "expirationDate",
                "uint256:14": "platformFeeAmount",
                "uint256:15": "index",
                "uint256:16": "underlyingAssetType",
                "uint256:17": "underlyingNftID",
                "uint256:18": "liquidateType"
              }
          }         
    }});
}
function getHolderCallOrderApi(_holder){
    return  useAxiosStore().axios({
        mode:"chainBlockCall", 
        target:"@Diamond",
        loop:5,
        method:"getHolderCallOrder",
        data:{
          param:{
             "address":_holder
          },
          returnsType:{
            "address[]":"callOrderAddrList"
          }         
    }}); 
}
//签712call订单
function sign712CallOrderApi(chainId,OptionPutModule,callOrder){
    return useAxiosStore().axios({
        mode:"sign712",
        data:{
           domain:{
            name: "jasperVault",
			version: "2.0.0",
			chainId: chainId,
            verifyingContract:OptionPutModule
           },
           primaryType:"CallOrder",
           types:{ 
            EIP712Domain:[
             {name:'name', type:'string'},
             {name:'version', type:'string'},
             {name:'chainId',type :'uint256'},
             { name : 'verifyingContract' , type : 'address'}],
             CallOrder:[
                {type:"uint256", name:"orderID"},
                {type:"address", name:"optionHolder"},
                {type:"address", name:"optionWriter"},
                {type:"address", name:"optionHolderWallet"},
                {type:"address", name:"underlyingAsset"},
                {type:"uint256", name:"underlyingAmount"},
                {type:"address", name:"optionPremiumAsset"},
                {type:"uint256", name:"optionPremiumAmount"},
                {type:"uint256", name:"optionPremiumMinAmount"},
                {type:"uint256", name:"xFeeAmount"},
                {type:"uint256", name:"strikeNotionalMinAmount"},
                {type:"uint256", name:"strikeNotionalAmount"},
                {type:"uint256", name:"expirationDate"},
                {type:"uint256", name:"platformFeeAmount"},
                {type:"uint256", name:"index"},
                {type:"uint256", name:"underlyingAssetType"},
                {type:"uint256", name:"underlyingNftID"},
                {type:"uint256", name:"liquidateType"}
            ]
           },
           message:callOrder
        }
     })
}
//清算call
function liquidateCallOrderApi(){

}


//------put--------
//取得put订单
function getHolderPutOrderApi(_holder){
    return  useAxiosStore().axios({
        mode:"chainBlockCall", 
        target:"@Diamond",
        loop:5,
        method:"getHolderPutOrder",
        data:{
          param:{
             "address":_holder
          },
          returnsType:{
            "tuple:putOrder":{
                "uint256:1": "orderID",
                "address:2": "optionWriter",
                "address:3": "optionHolder",
                "address:4": "recipientAddress",
                "address:5": "underlyingAsset",
                "uint256:6": "underlyingAmount",
                "address:7": "receiveAsset",
                "uint256:8": "receiveMinAmount",
                "uint256:9": "receiveAmount",
                "uint256:10": "expirationDate",
                "uint256:11": "platformFeeAmount",
                "uint256:12": "index",
                "uint256:13": "optionPremiumAmount",
                "uint256:14": "underlyingAssetType",
                "uint256:15": "underlyingNftID"
             }  
          }         
    }});
}

//取得writer订单
function getWriterPutOrderApi(_writer){
    return  useAxiosStore().axios({
        mode:"chainBlockCall", 
        target:"@Diamond",
        loop:5,
        method:"getWriterPutOrder",
        data:{
          param:{
             "address":_writer
          },
          returnsType:{
            "address[]":"putOrderAddrList"
          }         
    }}); 
}
//签712put订单
function sign712PutOrderApi(chainId,OptionPutModule,putOrder){
    return useAxiosStore().axios({
        mode:"sign712",
        data:{
           domain:{
            name: "jasperVault",
			version: "2.0.0",
			chainId: chainId,
            verifyingContract:OptionPutModule
           },
           primaryType:"PutOrder",
           types:{ 
            EIP712Domain:[
             {name:'name', type:'string'},
             {name:'version', type:'string'},
             {name:'chainId',type :'uint256'},
             { name : 'verifyingContract' , type : 'address'}],
             PutOrder:[
                {type:"uint256", name:"orderID"},
                {type:"address", name:"optionWriter"},
                {type:"address", name:"optionHolder"},
                {type:"address", name:"recipientAddress"},
                {type:"address", name:"underlyingAsset"},
                {type:"uint256", name:"underlyingAmount"},
                {type:"address", name:"receiveAsset"},
                {type:"uint256", name:"receiveMinAmount"},
                {type:"uint256", name:"receiveAmount"},
                {type:"uint256", name:"expirationDate"},
                {type:"uint256", name:"platformFeeAmount"},
                {type:"uint256", name:"index"},
                {type:"uint256", name:"optionPremiumAmount"},
                {type:"uint256", name:"underlyingAssetType"},
                {type:"uint256", name:"underlyingNftID"}
            ]
           },
           message:putOrder
        }
     })
}

//清算put订单
function liquidatePutOrderApi(){

}

export {getWriterCallOrderApi,getHolderCallOrderApi,getHolderPutOrderApi,getWriterPutOrderApi,sign712CallOrderApi,sign712PutOrderApi}