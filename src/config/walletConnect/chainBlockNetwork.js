// 2. Set chains
const mainnet = {
    chainId: 1,
    name: 'Ethereum',
    currency: 'ETH',
    explorerUrl: 'https://etherscan.io',
    rpcUrl: 'https://cloudflare-eth.com'
}

const goerli={
     chainId:5,
     name:"goerli",
     currency:"Eth",
     explorerUrl:"https://goerli.etherscan.io/",
     rpcUrl:"https://goerli.blockpi.network/v1/rpc/public"
}

const polygon={
    chainId:137,
    name:"polygon",
    currency:"MATIC",
    explorerUrl: 'https://polygonscan.com/',
    rpcUrl:"https://polygon.blockpi.network/v1/rpc/public"
}

const arbitrum={
    chainId:42161,
    name:"arbitrum",
    currency:"ETH",
    explorerUrl:"https://arbiscan.io/",
    rpcUrl:"https://arbitrum.blockpi.network/v1/rpc/public"
}
 

export {mainnet,polygon,arbitrum,goerli}