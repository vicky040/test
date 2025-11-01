import { useState, useEffect } from 'react';
import './Home.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Home() {

    const BaseUrl = 'https://precious-cynthy-cryptoo-083d74eb.koyeb.app/';

    const [activeTab, setActiveTab] = useState('home');
    const navigate = useNavigate();

    const [cryptoData, setCryptoData] = useState([]);
    const [marketData, setMarketData] = useState([]);
    const [usdtVal, setusdtVal] = useState([]);
    const [telegramLink, setTelegramLink] = useState("");

    useEffect(() => {
        axios.get(`${BaseUrl}/api/v1/settings/telegram`)
        .then(res => {setTelegramLink(res.data.telegramLink)});
    }, []);

    useEffect(() => {
        axios.get(`${BaseUrl}/api/v1/user/cryptos`, {withCredentials: true})
        .then(res => {
            const rpe = res.data.find(c => c.name === "RPE");
            if (rpe) setusdtVal(rpe.price);

            // Filter out RPE for marketData
            const filteredData = res.data.filter(c => c.name !== "RPE");
            setCryptoData(filteredData.slice(0, 3)); // first 3 for small cards
            setMarketData(filteredData);
        })
        .catch(err => console.error(err))
    }, []);


    const buttons = [
        { id: 'deposit', label: 'Deposit', icon: '💳', address: "/deposit"},
        { id: 'withdraw', label: 'Withdraw', icon: '⏸️', address: "/withdraw" },
        { id: 'transfer', label: 'Internal Transfer', icon: '📊', address: "/coming-soon" },
        { id: 'upgrade', label: 'Membership Upgrade', icon: '💎', address: "/membership" },
    ];

    const navItems = [
        { id: 'home', label: 'Home', icon: '🏠', address: '/home' },
        { id: 'trade', label: 'Trade', icon: '📈', address: '/trade' },
        { id: 'transfer', label: 'Transfer', icon: '🔄', address: '/coming-soon' },
        { id: 'account', label: 'My Account', icon: '👤', address: '/my-account' },
    ];


    

  return (
    <>
    <div className="container">
        <header className="header">
            <button className="menu-btn">
                <span></span>
                <span></span>
                <span></span>
            </button>
            <h1 className="header-title">1 USDT = ₹{usdtVal}</h1>
            <a
            href={telegramLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transition-all duration-300"
            >
                <img src="telegram.png" alt="" className='telegram-logo'/>
            </a>
            
        </header>


        <div className="hero-section">
            <div className="crypto-visual">
                <div className="cube">
                <div className="cube-face front"></div>
                <div className="cube-face back"></div>
                <div className="cube-face right"></div>
                <div className="cube-face left"></div>
                <div className="cube-face top"></div>
                <div className="cube-face bottom"></div>
                </div>
                <div className="glow"></div>
                <div className="particles">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                </div>
            </div>
        </div>


        <div className="action-buttons">
            {buttons.map((button) => (
                <button key={button.id} className="action-btn" onClick={() => {navigate(button?.address)}}>
                <span className="action-icon">{button.icon}</span>
                <span className="action-label">{button.label}</span>
                </button>
            ))}
        </div>

        
        <div className="price-cards">
            {cryptoData.map((crypto) => (
                <div key={crypto.symbol} className="price-card">
                <div className="crypto-symbol">{crypto.symbol}</div>
                <div className="crypto-price">{crypto.price}</div>
                <div className={`crypto-change ${crypto.isNegative ? 'negative' : 'positive'}`}>
                    {crypto.change}
                </div>
                </div>
            ))}
        </div>


        <div className="market-list">
            <div className="market-header">
                <h3 className="market-title">USDT Market</h3>
                <div className="market-columns">
                <span>Currency</span>
                <span>Latest Price</span>
                <span>24h Change</span>
                </div>
            </div>
            <div className="market-items">
                {marketData.map((item) => (
                <div key={item.symbol} className="market-item">
                    <div className="currency-info">
                    <div className="currency-icon" style={{ backgroundColor: item.color }}>
                        {item.icon}
                    </div>
                    <span className="currency-symbol">{item.symbol}</span>
                    </div>
                    <div className="price-info">
                    <span className="latest-price">{item.price}</span>
                    </div>
                    <div className="change-info">
                    <span className={`price-change ${item.isNegative ? 'negative' : item.change === '0%' ? 'neutral' : 'positive'}`}>
                        {item.change}
                    </span>
                    </div>
                </div>
                ))}
            </div>
        </div>
    </div>


    <nav className="bottom-nav">
      <div className="nav-items">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => {setActiveTab(item.id); navigate(item.address)}}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>

    </>
  )
}

export default Home