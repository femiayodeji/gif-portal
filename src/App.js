import React, {useEffect, useState} from 'react';
import appLogo from './assets/gif-logo.png';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';

// Constants
const TWITTER_HANDLE = 'thefemiayodeji';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  
  const TEST_GIFS = [
    'https://i.giphy.com/media/eIG0HfouRQJQr1wBzz/giphy.webp',
    'https://media3.giphy.com/media/L71a8LW2UrKwPaWNYM/giphy.gif?cid=ecf05e47rr9qizx2msjucl1xyvuu47d7kf25tqt2lvo024uo&rid=giphy.gif&ct=g',
    'https://media4.giphy.com/media/AeFmQjHMtEySooOc8K/giphy.gif?cid=ecf05e47qdzhdma2y3ugn32lkgi972z9mpfzocjj6z1ro4ec&rid=giphy.gif&ct=g',
    'https://i.giphy.com/media/PAqjdPkJLDsmBRSYUp/giphy.webp'
  ]

  const [walletAddress, setWalletAddress] = useState(null);

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

  const renderNotConnectedContainer = () => (
    <button 
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );

  const renderConnectedContainer = () => (
    <div className="connected-container">
      <form
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <input type="text" placeholder="Enter gif link!" />
        <button type="submit" className="cta-button submit-gif-button">Submit</button>
      </form>
      <div className="gif-grid">
        {
          TEST_GIFS.map(gif => (
            <div className="gif-item" key={gif}>
              <img src={gif} alt={gif} />
            </div>
          ))
        }
      </div>
    </div>
  );

  useEffect(() => {
    const onLoad =  async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad)
  }, []);

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
