import ethPng from "@/assets/images/token-eth.png"
import usdtPng from "@/assets/images/token-usdt.png"
import usdcPng from "@/assets/images/usdc.png"
import wbtcPng from "@/assets/images/wbtc.png"

let contractData={
    "EntryPoint": "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
    "DiamondCutFacet": "0x462482E07D7b2AfFAD9d934544bfFB24Dbcb019A",
    "DiamondLoupeFacet": "0x0E0C448Ddf771AefBFf1e4AA62978E8EDC8FE40F",
    "OwnershipFacet": "0x2837e9124C53046857172bd517b5557fA3B1Fa97",
    "Diamond": "0x5FfDD96bD604f915520d66C9edDd46dFc1434d71",
    "PlatformFacet": "0xD4B0dcCC6E61E3c52FcC3A577BA75c6AF7DF9101",
    "VaultFacet": "0x8113F1988d18B3785A4d8Cda0E33A8BCa390cd0f",
    "LendFacet": "0x337dA5BF466d3cAd7aAdf775482CEff4B693bB57",
    "PaymasterFacet": "0x71E4C4e2B7b45F73509e0F88109890342eE93c93",
    "VaultPaymaster": "0xe10a54788e39E8Cd9c275Bff5c6A941D48F5d9C7",
    "VaultManageModule": "0xa5Db2700E2CC1E007d9F50261ecb04339d712E3A",
    "TradeModule": "0x5abBc8a4BB1B2a93Bee73f14292c59d47C0012Ab",
    "IssuanceModule": "0x9F408f6c9e52c091549F1550e31e8B5621795bE6",
    "Manager": "0xacEB04e585842F79a596D9866F9F27378fb73b98",
    "OptionModule": "0xb0145B8216aD6a253a6c0001758a8b8Cc2a90556",
    "UniswapV2ExchangeAdapter": "0xAed71826eDbf82897c8d41A898ECd7D8F2c13044",
    "UniswapV3ExchangeAdapter": "0xAE5eB39df913D14EE5B102C16f4EE38Bc0369da0",
    "VaultFactory": "0xCA5738556C2260C43E7b24869c27199e8370b19D",
    "LeverageFacet": "0x2c462313B8ea0cc6EC96C4A05Cd14AE24cf971E7",
    "LeverageModule": "0xB593be092508589bD7a48BfEeEF790Cce1Ef8993",
    "ChainLinkOracleAdapter":"0x35Ce6751A37c8E9b70ec6F7ce106Eda44C36C1E7",
    "PriceOracle":"0x60E974258eFCCEf5E7B9D579F47F600aC0a7064C"
}
let bundlerUrl="https://ethgo-arbitrum.fly.dev"

let remark={
    masterToken:"0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    usdToken:"0x0000000000000000000000000000000000000001",
    ethToken:"0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    priceDecimals:18,
    gasSymbol:"Eth"
}

let optionBusiness={
    underlyingAssets:[{
            name:"ETH",
            img:ethPng,
            address:"0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
            decimals:18,
            isSellPut:true,
            isSellCall:true,
        },
        {
            name:"WBTC",
            img:wbtcPng,
            address:"0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
            decimals:8,
            isSellPut:true,
            isSellCall:true,
        }
    ],//抵押资产
    strikeAssets:[
        {
            name:"USDT",
            img:usdtPng,
            address:"0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
            decimals:6,
            isSellPut:true,
            isSellCall:true,
        },
        {
            name:"USDC",
            img:usdcPng,
            address:"0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
            decimals:6,
            isSellPut:true,
            isSellCall:true,           
        }
    ],//行权资产
    premiumAssets:[
        {
            name:"USDT",
            img:usdtPng,
            address:"0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
            decimals:6,
            isSellPut:true,
            isSellCall:true,
        },
        {
            name:"USDC",
            img:usdcPng,
            address:"0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
            decimals:6,
            isSellPut:true,
            isSellCall:true,          
        }       
    ],//权力金资产
    liquidation:[
        {     
           label:"Cash Settlement",
           value:0
        },
        {
           label:"Asset Delivery",
           value:1 
        }
   ]//清算方式
}



let chainInfo={
    chainId:42161,
    name:"arbitrum",
    currency:"ETH",
    explorerUrl:"https://arbiscan.io/",
    rpcUrl:"https://arbitrum.blockpi.network/v1/rpc/public"
}




let tokens=[
    {
        name:"WBTC",
        address:"0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
        decimals:8,
        img:wbtcPng,
        isGasToken:false,
        isShowAsset:true,
        isAble:true,
        type:1,
        isSellPut:true,
        isSellCall:true,  
    },
    {
    name:"ETH",
    address:"0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    decimals:18,
    img:ethPng,
    isGasToken:true,
    isShowAsset:true,
    isAble:true,
    type:1,
    isSellPut:true,
    isSellCall:true,  
    },
    {
     name:"USDT",
     address:"0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
     decimals:6,
     img:usdtPng,
     isGasToken:false,
     isShowAsset:true,
     isAble:true,
     type:1,
     isSellPut:false,
     isSellCall:false,  
    },
    {
     name:"USDC",
     address:"0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
     decimals:6,
     img:usdcPng,
     isGasToken:false,
     isShowAsset:true,
     isAble:true,
     type:1,
     isSellPut:false,
     isSellCall:false,  
    }

]




const arbitrum={
    contractData:contractData,
    bundlerUrl:bundlerUrl,
    chainInfo:chainInfo,
    tokens:tokens,
    remark:remark,
    optionBusiness:optionBusiness
}



export {arbitrum}