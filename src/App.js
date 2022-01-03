import React, {useEffect, useState} from 'react';
import appLogo from './assets/gif-logo.png';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';
import {Connection, PublicKey, clusterApiUrl} from '@solana/web3.js';
import {Program, Provider, web3} from '@project-serum/anchor';
import idl from './idl.json';
import kp from './keypair.json';

const {SystemProgram, Keypair} = web3;
const arr = Object.values(kp._keypair.secretKey);
const secret = new Uint8Array(arr);
let baseAccount = web3.Keypair.fromSecretKey(secret);
const programID = new PublicKey(idl.metadata.address);
const network = clusterApiUrl('devnet');
const opts = {
  preflightCommitment: "processed"
}

// Constants
const TWITTER_HANDLE = 'thefemiayodeji';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
/*
https://www.thegoandroid.com/wp-content/uploads/2018/03/tenor_1.gif
https://www.wired.com/wp-content/uploads/2015/03/855.gif
https://c.tenor.com/RZ-JjR2lSxEAAAAC/michael-jackson.gif
https://c.tenor.com/fvwSYPUsrEEAAAAS/sour-gross.gif
*/

const App = () => {
  
  const TEST_GIFS = [
    'https://i.giphy.com/media/eIG0HfouRQJQr1wBzz/giphy.webp',
    'https://media3.giphy.com/media/L71a8LW2UrKwPaWNYM/giphy.gif?cid=ecf05e47rr9qizx2msjucl1xyvuu47d7kf25tqt2lvo024uo&rid=giphy.gif&ct=g',
    'https://media4.giphy.com/media/AeFmQjHMtEySooOc8K/giphy.gif?cid=ecf05e47qdzhdma2y3ugn32lkgi972z9mpfzocjj6z1ro4ec&rid=giphy.gif&ct=g',
    'https://i.giphy.com/media/PAqjdPkJLDsmBRSYUp/giphy.webp'
  ]

  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [gifList, setGifList] = useState([]);

  const checkIfWalletIsConnected = async () => {
    try{
      const {solana} = window;
      if(solana){
        if(solana.isPhantom){
          console.log("Phantom wallet found!");
          const response = await solana.connect({ onlyIfTrusted: true});
          console.log("Connected with Public Key:", response.publicKey.toString());
          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert("Solana object not found! Get a Phantom Wallet 👻")
      }
    } catch(error){
      console.log(error);
    }
  }

  const connectWallet = async () => {
    const {solana} = window;
    if(solana){
      const response = await solana.connect();
      console.log("Connected with Public Key:", response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };

  const getGifList = async() => {
    try{
      const provider = getProvider();
      const program =  new Program(idl, programID, provider);
      const account = await program.account.baseAccount.fetch(baseAccount.publicKey);

      console.log("Got the account", account)
      setGifList(account.gifList)
    } catch(error){
      console.log("Error in getGifList: ", error);
      setGifList(null);
    }
  }

  const sendGif = async () => {
    if(inputValue.length === 0){
      console.log("No gif link given!");
      return;
    }
    setInputValue('');      
    console.log("Gif link:", inputValue);
    try{
      const provider =  getProvider();
      const program = new Program(idl, programID, provider);

      await program.rpc.addGif(inputValue, {
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
        },
      });
      console.log("GIF successfully sent to program", inputValue);
      await getGifList();
    } catch (error) {
      console.log("Error sending GIF:", error);
    }
  }

  const onInputChange = (event) => {
     const {value} = event.target;
     setInputValue(value);
   }

   const getProvider = () => {
     const connection = new Connection(network, opts.preflightCommitment);
     const provider = new Provider(
       connection, window.solana, opts.preflightCommitment,
     );
     return provider;
   }

   const createGifAccount = async () => {
     try{
       const provider = getProvider();
       const program = new Program(idl, programID, provider);
       console.log("ping");
       await program.rpc.startStuffOff({
         accounts: {
           baseAccount: baseAccount.publicKey,
           user: provider.wallet.publicKey,
           systemProgram: SystemProgram.programId,
         },
         signers: [baseAccount]
       });
       console.log("Created a new BaseAccount w/ address:", baseAccount.publicKey.toString());
       await getGifList();
     } catch(error){
       console.log("Error creating BaseAccount account: ", error);
     }
   }

  const renderNotConnectedContainer = () => (
    <button 
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );

  const renderConnectedContainer = () => {
    if(gifList === null){
      return (
        <div className="connected-container">
          <button className="cta-button submit-gif-button" onClick={createGifAccount}>
            Do One-Time Initialization For GIF Program Account
          </button>
        </div>        
      )
    } else {
      return (
        <div className="connected-container">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              sendGif();
            }}
          >
            <input type="text" placeholder="Enter gif link!"
              value={inputValue}
              onChange={onInputChange}
            />
            <button type="submit" className="cta-button submit-gif-button">Submit</button>
          </form>
          <div className="gif-grid">
            {
              gifList.map((item, index) => (
                <div className="gif-item" key={index}>
                  <img src={item.gifLink} />
                  <p className="gif-user">{item.userAddress.toString()}</p>
                  <>{console.log(item)}</>
                </div>
              ))
            }
          </div>
        </div>
      );
    }      
  };

  useEffect(() => {
    const onLoad =  async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad)
  }, []);

  useEffect(() => {
    if(walletAddress){
      console.log("Fetching GIF list...");
      getGifList();
    }
  }, [walletAddress]);

  return (
    <div className="App">
      <div className={walletAddress ? "authed-container" : "container"}>
        <div className="header-container">
          <p className="header">
            <img alt="GIF" className="app-logo" src={appLogo} />
            Portal
          </p>
          <p className="sub-text">
            View your GIF collection in the metaverse ✨
          </p>
        </div>
        <div className="gif-container">
          {!walletAddress && renderNotConnectedContainer()}
          {walletAddress && renderConnectedContainer()}
        </div>
        <div className="footer-container">
          <span className="footer-text">Built by </span>
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >
            {`@${TWITTER_HANDLE}`}
          </a>
          <span  className="footer-text">All Rights Licensed</span>
        </div>
      </div>
    </div>
  );
};

export default App;
