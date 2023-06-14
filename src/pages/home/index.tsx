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
import { callDefaultMint, callMint, callMintCollection, callUpdateDefaultMint, callUpdateMint, checkToken, checkingEmail, getAllNft, getBalance } from "../../services/api";
import Hidden from "../../components/Hidden";
import { Nft } from "../../models/Nft";
const clientId: string = process.env.REACT_APP_CLIENT_ID!;
const chainType: string = process.env.REACT_APP_CHAIN_TYPE!;
const rpcTarget: string = process.env.REACT_APP_RPC_TARGET!;
const web3authNetwork: any = process.env.REACT_APP_WEB3AUTH_NETWORK!;
const appLogo: any = process.env.REACT_APP_APP_LOGO!;


function Home() {

  const [status, setStatus] = useState<string>("Loading");
  const [state, setState] = useState<Number>(0);
  const [email, setEmail] = useState<string>("");
  const [balance, setBalance] = useState<string>("");
  const [file, setFile] = useState<File>();
  const [uri, setUri] = useState<string>("");
  const [myNfts, setMyNfts] = useState<Nft[]>([]);
  const [minAddress, setMintAddress] = useState<string>("");
  const [fileName, setNameFile] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("");
  const [explorerUri, setExplorerUri] = useState<string>("");
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(
    null
  );
  const [description, setDescription] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [collectionMint, setcollectionMint] = useState<string>("");
  useEffect(() => {
    const init = async () => {
      try {
        const web3auth = new Web3Auth({
          clientId,
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.SOLANA,
            chainId: chainType, // Please use 0x1 for Mainnet, 0x2 for Testnet, 0x3 for Devnet
            rpcTarget: rpcTarget, // This is the public RPC we have added, please pass on your own endpoint while creating an app
          },
          uiConfig: {
            theme: 'dark',
            // loginMethodsOrder:['email_passwordless','google'],
            appLogo: appLogo
          },
          web3AuthNetwork: web3authNetwork,
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
        setWeb3auth(web3auth);
        if (web3auth.provider) {
          setProvider(web3auth.provider);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (web3auth) {
      login();
    }
  }, [web3auth, provider]);

  useEffect(() => {
    if (provider) {
      checkEmail();
    }
  }, [provider]);

  useEffect(() => {
    if (userName != "" && userRole != "") {
      handleGetAllNft();
      handleGetBalance();
    }
  }, [userName, userRole]);
  const login = async () => {
    console.log("login>>>");
    if (!web3auth) {
      console.log("web3auth not initialized yet  for login");
      return;
    }
    console.log("start connect login");
    const web3authProvider = await web3auth.connect();
    console.log("set provider", web3authProvider);
    setProvider(web3authProvider);
  };
  const checkEmail = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    setUserName("");
    setUserRole("");
    const user = await web3auth.getUserInfo();
    if (user) {
      console.log(user.email);
      setEmail(user.email!);
      setStatus("Checking...");
      setState(1);
      await checkingEmail(user.email!, setStateAuthorize)
    }
  }

  const setStateAuthorize = async (name: string, role: string) => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    console.log("result of checking email:", name);
    console.log("result of checking email:", role);
    if (name != "") {

      setState(2);
      setUserName(name);
      setUserRole(role);
      setStatus("Authorized:");

    } else {
      setState(0);
      setUserName("");
      setUserRole("");
      setStatus("No Authorize");

      // await web3auth.logout();
      // setProvider(null);
    }
  }
  const getInfo = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const user = await web3auth.getUserInfo();
    console.log(user);
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
    setMyNfts([]);
    setUserRole("");
  };
  const handleGetBalance = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const privateKey = await rpc.getPrivateKey();
    await getBalance(privateKey, setBalanceCallBack);
  }
  const setBalanceCallBack = (balance: string) => {
    console.log("Balance is:", balance);
    setBalance("balance is:" + balance)
  }
  const handleCheckToken = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const user = await getInfo();
    await checkToken(user?.idToken!);
  };
  const handleGetAllNft = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet handle get all nft");
      return;
    }
    const user = await getInfo();
    const rpc = new RPC(provider!);
    const privateKey = await rpc.getPrivateKey();
    await getAllNft(user?.idToken!, privateKey, setNfts);
  };
  const setNfts = (nfts: Nft[]) => {
    console.log(">>>>>>>");
    setMyNfts(nfts);
    console.log(nfts);
    console.log(typeof (nfts.length));
    const c = 0;
    if (nfts.length == c) {
      defaultMint(userName, userRole);
    } else {
      const firstNft = nfts[c];
      if (firstNft.json.role == userRole) {
        setStatus("");
        setUserRole(firstNft.json.role);
        console.log(firstNft);
      } else {
        handleUpdateMint(firstNft);
      }
    }
  }
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
  const handleCollectionMintChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setcollectionMint(e.target.value)
  }
  const handleMintAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Mint>>>>" + e.target.value);
    setMintAddress(e.target.value)

  }

  const defaultMint = async (name: string, role: string) => {
    const user = await getInfo();
    const rpc = new RPC(provider!);
    const privateKey = await rpc.getPrivateKey();
    console.log(userName);
    setName(userName);
    setStatus("start mint");
    setDescription("init token for user");
    await callDefaultMint(user?.idToken!, privateKey, "init token for user", name, role, successDefaultMint);
  }
  const successDefaultMint = async () => {
    setStatus("end mint");
    await handleGetAllNft();
  }

  const mint = async () => {
    const user = await getInfo();
    const rpc = new RPC(provider!);
    const privateKey = await rpc.getPrivateKey();
    console.log(privateKey);
    await callMint(user?.idToken!, privateKey, file!, fileName, description, name, collectionMint, successMint);
  }
  const mintCollection = async () => {
    const user = await getInfo();
    const rpc = new RPC(provider!);
    const privateKey = await rpc.getPrivateKey();
    console.log(privateKey);
    await callMintCollection(user?.idToken!, privateKey, file!, fileName, description, name, collectionMint, successMint);
  }
  const uMint = async () => {
    const user = await getInfo();
    const rpc = new RPC(provider!);
    const privateKey = await rpc.getPrivateKey();
    console.log(privateKey);
    await callUpdateMint(user?.idToken!, privateKey, file!, fileName, description, name, minAddress, updateMint);
  }


  const handleUpdateMint = async (mynft: Nft) => {
    const user = await getInfo();
    const rpc = new RPC(provider!);
    const privateKey = await rpc.getPrivateKey();
    console.log(privateKey);
    setStatus("start update token ");
    await callUpdateDefaultMint(privateKey, "init token for user", userName, userRole, mynft.address, callBackUpdateMint);
  }

  const successMint = async (data: any) => {
    console.log("success", data.data);
    // setExplorerUri(data.data.explorer_uri);
    // setUri(data.data.nft.json.image)
    // setMintAddress(data.data.nft.address)
  }
  const callBackUpdateMint = async (data: any) => {
    setStatus("end update token ");
    await handleGetAllNft();
  }
  const updateMint = async (data: any) => {
  }
  const unloggedInView = (
    <Hidden><Button label={"Login"} handleClick={() => { login() }} /></Hidden>
  );
  const hiddenButton = (
    <div>
      <Button label={"Get Account"} handleClick={() => { getAccounts() }} />
      <Button label={"Get Private Key"} handleClick={() => { getPrivateKey() }} />
      <Button label={"LogOut"} handleClick={() => { logout() }} />
      <Button label={"Check Token"} handleClick={() => { handleCheckToken() }} />
      <Button label={"Puplic Key"} handleClick={() => { getPublicKey() }} />
      <input type="file" onChange={saveFile} />
      <label>Description</label>
      <input type="text" onChange={handleDescriptionChange} />
      <label>Name</label>
      <input type="text" onChange={handleNameChange} />
      {/* <Button label="mint Collection" handleClick={() => { mintCollection() }} /> */}
      {/* <label>collection mint</label> */}
      <input type="text" onChange={handleCollectionMintChange} />
      <Button label="mint" handleClick={() => { mint() }} />
      <p>{explorerUri}</p>
      <img src={uri} />

      <input type="text" onChange={handleMintAddress} />
      <Button label={"Update Mint"} handleClick={() => { uMint() }} />
    </div>
  );
  const loggedInView = (
    <div>
      <p>{status + ' ' + userName + ":" + userRole}</p>
      <p>{balance}</p>
      {/* <Button label={"Check Email"} handleClick={() => { checkEmail() }} /> */}
      <Button label={"LogOut"} handleClick={() => { logout() }} />
      {/* <Button label={"Get Private Key"} handleClick={() => { getPrivateKey() }} /> */}
      {/* <Button label={"Get All NFT"} handleClick={() => { handleGetAllNft() }} /> */}

      {/*  
      <input type="file" onChange={saveFile} />
      <label>Description</label>
      <input type="text" onChange={handleDescriptionChange} />
      <label>Name</label>
      <input type="text" onChange={handleNameChange} /> 
      <Button label="mint Collection" handleClick={() => { mintCollection() }} />
      <label>collection mint</label> 
       <input type="text" onChange={handleCollectionMintChange} /> 
     <Button label="mint" handleClick={() => { mint() }} /> */}



    </div>
  );
  const handleUserRoleButton = () => {
    const resultButton = [];
    if (userRole == "guest") {
      resultButton.push(
        <Button label="guest button one" handleClick={() => { }} />
      );
      resultButton.push(
        <Button label="guest button two" handleClick={() => { }} />
      );
    } else if (userRole == "admin") {
      resultButton.push(
        <Button label="Admin button one" handleClick={() => { }} />
      );
      resultButton.push(
        <Button label="Admin button two" handleClick={() => { }} />
      );
    } else if (userRole == "cd") {
      resultButton.push(
        <Button label="CD button one" handleClick={() => { }} />
      );
      resultButton.push(
        <Button label="CD button two" handleClick={() => { }} />
      );
    } else if (userRole == "creator") {
      resultButton.push(
        <Button label="Creator button one" handleClick={() => { }} />
      );
      resultButton.push(
        <Button label="Creator button two" handleClick={() => { }} />
      );
    }
    return resultButton;
  }
  let resultView;
  console.log(provider, state);
  if (provider) {
    if (state == 1) {
      resultView = <p>{status}</p>
    } else {
      resultView = loggedInView;
    }
  } else {
    resultView = unloggedInView;
  }
  const resultButtonRole = handleUserRoleButton();
  return (
    <div className="App">
      {resultButtonRole}
      {resultView}

      {myNfts.map((nft, index) => {

        return (
          <div>
            <a className="nft_box" target="_blank" href={'https://explorer.solana.com/address/' + nft.address + '?cluster=devnet'}>
              <img src={nft.json.image} />
              <div className="nft_info_box">
                <p>Name:{nft.json.name}</p>
                <p>Description:{nft.json.description}</p>
              </div>
            </a>
          </div>
        )
      })
      }
    </div>
  );
}

export default Home;