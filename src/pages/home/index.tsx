import Button from "../../components/Button";

import '../../assets/css/main.css';
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, SafeEventEmitterProvider, WALLET_ADAPTERS } from "@web3auth/base";
import { useEffect, useState } from "react";
import { SolflareAdapter } from "@web3auth/solflare-adapter";
import { SlopeAdapter } from "@web3auth/slope-adapter";
import { SolanaWalletConnectorPlugin } from "@web3auth/solana-wallet-connector-plugin";
import RPC from "../../utils/solanaRPC";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import Api from "../../services/api";
const clientId =
  "BEssGOFZDUSOPpzXZvdSQ02nXBQUCA13EQ7pIIdPfnichG55JR8kU0pU5zRGo-xJuza0SUl5Gx9e2PXOuvMz1og"; // get from https://dashboard.web3auth.io


function Home() {

  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(
    null
  );
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
  const getPublicKey = async () => {
    // const user=await getInfo();
    // const base64Url = user?.idToken!.split(".")[1];
    // const base64 = base64Url?.replace("-", "+").replace("_", "/");
    // const parsedToken = JSON.parse(window.atob(base64!))
    // console.log(base64Url);
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
      <Button label={"Puplic Key"} handleClick={() => { getPublicKey() }} />
    </div>
  );
  return (
    <div className="App">
      {provider ? loggedInView : unloggedInView}
    </div>
  );
}

export default Home;
