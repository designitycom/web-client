import Button from "../../components/Button";

import '../../assets/css/main.css';
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from "@web3auth/base";
import { useEffect, useState } from "react";
import { SolflareAdapter } from "@web3auth/solflare-adapter";
import { SlopeAdapter } from "@web3auth/slope-adapter";
import { SolanaWalletConnectorPlugin } from "@web3auth/solana-wallet-connector-plugin";
const clientId =
  "BKw8hgIPDMl3p6bcYYlZgdXSoIrLyJivtoZWcld40wsN-AM-XUAOkiI-ATvQGJu9x6kRVx3aGtdKQg3EMhM_BrE"; // get from https://dashboard.web3auth.io


function Home() {
  
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(
    null
  );


  const login = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider);
  };
  
  return (
    <div className="App">
        <Button label={"Login"} handleClick={()=>{console.log('bbb');login()}}/>
    </div>
  );
}

export default Home;
