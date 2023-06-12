export interface Nft {
    model: string
    updateAuthorityAddress: string
    json: Json
    jsonLoaded: boolean
    name: string
    symbol: string
    uri: string
    isMutable: boolean
    primarySaleHappened: boolean
    sellerFeeBasisPoints: number
    editionNonce: number
    creators: Creator[]
    tokenStandard: number
    collection: Collection
    collectionDetails: any
    uses: any
    programmableConfig: any
    address: string
    metadataAddress: string
    mint: Mint
    edition: Edition
  }
  
  export interface Json {
    name: string
    description: string
    image: string
  }
  
  export interface Creator {
    address: string
    verified: boolean
    share: number
  }
  
  export interface Collection {
    verified: boolean
    key: string
    address: string
  }
  
  export interface Mint {
    model: string
    address: string
    mintAuthorityAddress: string
    freezeAuthorityAddress: string
    decimals: number
    supply: Supply
    isWrappedSol: boolean
    currency: Currency2
  }
  
  export interface Supply {
    basisPoints: string
    currency: Currency
  }
  
  export interface Currency {
    symbol: string
    decimals: number
    namespace: string
  }
  
  export interface Currency2 {
    symbol: string
    decimals: number
    namespace: string
  }
  
  export interface Edition {
    model: string
    isOriginal: boolean
    address: string
    supply: string
    maxSupply: string
  }
  