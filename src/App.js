import React, {useEffect} from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';

// Constants
const TWITTER_HANDLE = 'thefemiayodeji';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  const checkIfWalletIsConnected = async () => {
    try{
      const {solana} = window;
      if(solana){
        if(solana.isPhantom){
          console.log("Phantom wallet found!");
          const response = await solana.connect({ onlyIfTrusted: true});
          console.log("Connected with Public Key:", response.publicKey.toString());
        }
      } else {
        alert("Solana object not found! Get a Phantom Wallet 👻")
      }
    } catch(error){
      console.log(error);
    }
  }

  const connectWallet = async () => {};

  const renderNotConnectedContainer = () => (
    <button 
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  )

  useEffect(() => {
    const onLoad =  async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad)
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header">GIF Portal</p>
          <p className="sub-text">
            View your GIF collection in the metaverse ✨
          </p>
          {renderNotConnectedContainer()}
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
