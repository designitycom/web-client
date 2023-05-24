import Button from "../../components/Button";

import '../../assets/css/main.css';
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, SafeEventEmitterProvider, WALLET_ADAPTERS } from "@web3auth/base";
import React, { useEffect, useState } from "react";
import { SolflareAdapter } from "@web3auth/solflare-adapter";
import { SlopeAdapter } from "@web3auth/slope-adapter";
import { SolanaWalletConnectorPlugin } from "@web3auth/solana-wallet-connector-plugin";
import RPC from "../../utils/solanaRPC";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import Api from "../../services/api";
const clientId =
  "BEssGOFZDUSOPpzXZvdSQ02nXBQUCA13EQ7pIIdPfnichG55JR8kU0pU5zRGo-xJuza0SUl5Gx9e2PXOuvMz1og"; // get from https://dashboard.web3auth.io


function Home() {

  const [file, setFile] = useState<File>();
  const [uri, setUri] = useState<string>("");
  const [minAddress, setMintAddress] = useState<string>("");
  const [fileName, setNameFile] = useState<string>("");
  const [explorerUri, setExplorerUri] = useState<string>("");
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(
    null
  );
  const [description, setDescription] = useState<string>("");
  const [name, setName] = useState<string>("");
  useEffect(() => {
    const init = async () => {
      try {
        const web3auth = new Web3Auth({
          clientId,
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.SOLANA,
            chainId: "0x3", // Please use 0x1 for Mainnet, 0x2 for Testnet, 0x3 for Devnet
            rpcTarget: "https://api.devnet.solana.com", // This is the public RPC we have added, please pass on your own endpoint while creating an app
          },
          uiConfig: {
            theme: 'dark',
            // loginMethodsOrder:['email_passwordless','google'],
            appLogo: 'https://global-uploads.webflow.com/61cdf3c5e0b8155f19e0105b/61d33553e398cf5f9cc90bf7_webclip.png'
          },
          web3AuthNetwork: "testnet",
        });

        // adding solana wallet connector plugin

        const torusPlugin = new SolanaWalletConnectorPlugin({
          torusWalletOpts: {},
          walletInitOptions: {
            whiteLabel: {
              name: "Whitelabel Demo",
              theme: { isDark: true, colors: { torusBrand1: "#00a8ff" } },
              logoDark: "https://web3auth.io/images/w3a-L-Favicon-1.svg",
              logoLight: "https://web3auth.io/images/w3a-D-Favicon-1.svg",
              topupHide: true,
              defaultLanguage: "en",
            },
            enableLogging: true,
          },
        });
        await web3auth.addPlugin(torusPlugin);

        const solflareAdapter = new SolflareAdapter({
          clientId,
        });
        const openloginAdapter = new OpenloginAdapter({
          adapterSettings: {
            clientId, //Optional - Provide only if you haven't provided it in the Web3Auth Instantiation Code
            network: "testnet", // Optional - Provide only if you haven't provided it in the Web3Auth Instantiation Code
            uxMode: "popup",
            whiteLabel: {
              name: "Designity",
              logoLight: "https://global-uploads.webflow.com/61cdf3c5e0b8155f19e0105b/61d33553e398cf5f9cc90bf7_webclip.png",
              logoDark: "https://global-uploads.webflow.com/61cdf3c5e0b8155f19e0105b/61d33553e398cf5f9cc90bf7_webclip.png",
              defaultLanguage: "en",
              dark: true, // whether to enable dark mode. defaultValue: false
            },
          },
        });
        web3auth.configureAdapter(openloginAdapter);

        const slopeAdapter = new SlopeAdapter({
          clientId,
        });
        web3auth.configureAdapter(slopeAdapter);

        setWeb3auth(web3auth);

        await web3auth.initModal({
          modalConfig: {
            [WALLET_ADAPTERS.OPENLOGIN]: {
              label: "designity",
              // showOnModal:false,
              loginMethods: {
                'email_passwordless': {
                  name: "aaa",
                  showOnModal: true

                },
                google: {
                  name: 'google',
                  showOnModal: false
                },
                facebook: {
                  name: 'facebook',
                  showOnModal: false
                },
                twitter: {
                  name: 'twitter',
                  showOnModal: false
                },
                reddit: {
                  name: 'reddit',
                  showOnModal: false
                },
                discord: {
                  name: 'discord',
                  showOnModal: false
                },
                twitch: {
                  name: 'twitch',
                  showOnModal: false
                }
              }
            }
          }
        });
        if (web3auth.provider) {
          setProvider(web3auth.provider);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const login = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider);
  };
  const getInfo = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const user = await web3auth.getUserInfo();
    console.log(user.idToken);
    return user;
  }

  const getAccounts = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const address = await rpc.getAccounts();
    console.log(address);
  };

  const getPrivateKey = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const privateKey = await rpc.getPrivateKey();
    console.log(privateKey);
  };

  const logout = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    await web3auth.logout();
    setProvider(null);
  };
  const checkToken = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const user = await getInfo();
    const api = new Api();
    await api.checkToken(user?.idToken!);
  };
  const getAllNft = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const user = await getInfo();
    const api = new Api();
    const rpc = new RPC(provider!);
    const privateKey = await rpc.getPrivateKey();
    await api.getAllNft(user?.idToken!,privateKey);
  };
  const getPublicKey = async () => {
    // const user=await getInfo();
    // const base64Url = user?.idToken!.split(".")[1];
    // const base64 = base64Url?.replace("-", "+").replace("_", "/");
    // const parsedToken = JSON.parse(window.atob(base64!))
    // console.log(base64Url);
  }
  const saveFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files![0]);
    setNameFile(e.target.files![0].name);
    console.log(e.target.files![0].name);
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value)
  }
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }
  const handleMintAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Mint>>>>"+e.target.value);
    setMintAddress(e.target.value)
    
  }

  const mint = async () => {
    const user = await getInfo();
    const rpc = new RPC(provider!);
    const privateKey = await rpc.getPrivateKey();
    const api = new Api();
    console.log(privateKey);
    await api.callMint(user?.idToken!, privateKey, file!, fileName, description, name,successMint);
  }
  const uMint = async () => {
    const user = await getInfo();
    const rpc = new RPC(provider!);
    const privateKey = await rpc.getPrivateKey();
    const api = new Api();
    console.log(privateKey);
    await api.callUpdateMint(user?.idToken!, privateKey, file!, fileName, description, name,minAddress,updateMint);
  }

  const successMint=async(data:any)=>{
    console.log("success",data.data);
    setExplorerUri(data.data.explorer_uri);
    setUri(data.data.nft.json.image)
    setMintAddress(data.data.nft.address)
  }
  const updateMint=async(data:any)=>{
  }
  const unloggedInView = (

    <Button label={"Login"} handleClick={() => { console.log('bbb'); login() }} />
  );
  const loggedInView = (
    <div>
      <Button label={"Get Info"} handleClick={() => { getInfo() }} />
      <Button label={"Get Account"} handleClick={() => { getAccounts() }} />
      <Button label={"Get Private Key"} handleClick={() => { getPrivateKey() }} />
      <Button label={"LogOut"} handleClick={() => { logout() }} />
      <Button label={"Check Token"} handleClick={() => { checkToken() }} />
      <Button label={"Get All NFT"} handleClick={() => { getAllNft() }} />
      <Button label={"Puplic Key"} handleClick={() => { getPublicKey() }} />
      <input type="file" onChange={saveFile} />
      <label>Description</label>
      <input type="text" onChange={handleDescriptionChange} />
      <label>Name</label>
      <input type="text" onChange={handleNameChange} />
      <Button label="mint" handleClick={() => { mint() }} />
      <p>{explorerUri}</p>
      <img src={uri}/>

      <input type="text" onChange={handleMintAddress} />
      <Button label={"Update Mint"} handleClick={() => { uMint() }} />

    </div>
  );
  return (
    <div className="App">
      {provider ? loggedInView : unloggedInView}
    </div>
  );
}

export default Home;
