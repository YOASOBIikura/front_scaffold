let contractData={
    "EntryPoint": "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
    "DiamondCutFacet": "0xB8B8f2393a44F67227a2D50ec9453abbbCd1DB6e",
    "DiamondLoupeFacet": "0x9476251331d3ECc37950e292b434d064E6720D26",
    "OwnershipFacet": "0xCA5738556C2260C43E7b24869c27199e8370b19D",
    "Diamond": "0x886A340739a7Dd48889e8baB57457c3dEE31b30b",
    "PlatformFacet": "0xF82C9B1e58208153594e4C049ac415732ADA2537",
    "VaultFacet": "0x5917730CBA30D5c9cE8e30cF218eAd99140AdD2C",
    "LendFacet": "0x64b496EAD483A0dC0b6f1828BF5BDa6Abc9B9c46",
    "PaymasterFacet": "0x6979140Faf3323287064855aAc7C7c2174Eb9acA",
    "VaultPaymaster": "0x84D8f6e066C3Dff154F3E662a84485E13B41D791",
    "VaultManageModule": "0xE53a40106eB2d255f989f122B6389D94797DbA15",
    "TradeModule": "0xaFaf0FB89B71692733a92B0F8e87403716FF6A9D",
    "IssuanceModule": "0xB593be092508589bD7a48BfEeEF790Cce1Ef8993",
    "Manager": "0x113f67ce46D91E37d5206bec264f4054592EFe09",
    "LendModule": "0xDC66a4E0c00F2ae4F858c2a4804FAF648EBC66C5",
    "UniswapV2ExchangeAdapter": "0x97a024aAe0EA50BDAB056c388cDD97Ef480558ad",
    "UniswapV3ExchangeAdapter": "0x74c842E10f7E99aEeEd3284A076Dee12A7958585",
    "VaultFactory": "0x27f29709042d55433CDad490b406b9c181E8f315",
    "LeverageFacet":"0x3020EAD5e2569e3dD3Db89F5E3fc3D780C14CA49",
    "LeverageModule":"0x549aFcAe6E94dC7e5DD5B0F639A5F7ad78e997cD"
}
let bundlerUrl="https://ethgo-polygon.fly.dev"

let chainInfo={
    chainId:137,
    name:"polygon",
    currency:"MATIC",
    explorerUrl: 'https://polygonscan.com/',
    rpcUrl:"https://polygon.blockpi.network/v1/rpc/public"
}


const polygon={
    contractData:contractData,
    bundlerUrl:bundlerUrl,
    chainInfo:chainInfo
}




export {polygon}
