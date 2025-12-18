import React, { useEffect, useState } from 'react';

import { IoSearch } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { useCoinContext } from '../context/CoinContext';
import Loader from './Loader';

const Home = () => {

  const {allCoins, currency, setAllCoins, loading, setLoading} = useCoinContext();
  const [displayCoins, setDisplayCoins] = useState([]);
  const [input, setInput] = useState("");
  //const [loading, setLoading] = useState(false);


  //----------------------------------------

  const handleInput = async (e) => {

    const value = e.target.value.toLowerCase();
    setInput(value);

      if (value === ""){
      setDisplayCoins(allCoins);
      return;
    }

    const filteredCoins = allCoins.filter(
      (item) => item.id.toLowerCase().startsWith(value) || item.symbol.toLowerCase().startsWith(value)
    );

    if(filteredCoins.length > 0){
      setDisplayCoins(filteredCoins);
      return;
    }

    if(value.length < 3){
      return;
    }

    setLoading(true);

    try{
        const url = `https://api.coingecko.com/api/v3/search?query=${value}`;
        const options = {method: 'GET', headers: {'x-cg-demo-api-key': "CG-N9UaqezFGhXAL2H1ZK37nSTP"}};    

        const searchRes = await fetch(url, options);

        if(!searchRes.ok){
          throw new Error(`API Error: ${searchRes.status}`);
        }

        const searchData = await searchRes.json();

        if(searchData.coins.length === 0){
          return;
        }

        const coinIds = (searchData.coins.map(coin => coin.id).join(","));

        const detailUrl = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency.name}&ids=${coinIds}&price_change_percentage=24h`;

        const detailRes = await fetch(detailUrl, options);
        if(!detailRes.ok){
          throw new Error ("Details fetch error");
        }

        const detailData = await detailRes.json();   
        if(detailData.length === 0){
          return;
        }

        setDisplayCoins(detailData); 
        console.log(detailData);
    }

    catch(err){
      console.error("Search error", err);
    }

    finally {
      setLoading(false);
    }
    
  }

  //------------------------------------------------
           

  useEffect(
    () => setDisplayCoins(allCoins)
    , [allCoins]);

    
    const marketCapConversion = (value) => {

      const oneBillion = 1_000_000_000;
      const oneMillion = 1_000_000;

      if(!value){
        return "";
      }

      if(value >= oneBillion){
        return (`${(value / oneBillion).toFixed(2)} B`);
      }
      if(value >= oneMillion){
        return (`${(value / oneMillion).toFixed(2)} M`);
      }
       if(value < oneMillion){
        return (`${(value/1000).toFixed(2)} K`);
       }
        
    }

  return (
    <section className="max-w-360 max-sm:py-0 max-sm:px-4 sm:p-12 md:p-16 lg:p-20 xl:p-25 mx-auto">
      
      <div className="flex flex-col items-center max-sm:gap-y-8 sm:gap-y-12">
        
        <div className="relative flex justify-center gap-x-15 mb-0 md:mb-10 bg-primary-100/25 px-8 py-3 rounded-xl max-sm:text-sm font-light text-primary-75 inset-shadow-accent-50/20 inset-shadow-xs">
          <div className="absolute -top-0.5 h-2 w-25 rounded-full blur-sm bg-accent-50/40 mix-blend-plus-lighter"/>
          <p>Buy</p>
          <p>Sell</p>
          <p>Trade</p>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl/normal text-center font-semibold tracking-tight">Simplify Your Cryptocurrency Journey</h1>

        <p className="max-md:hidden text-center text-lg/9 font-light max-w-150 text-primary-75">Cryptocurrency can feel overwhelming, but it doesn't have to be.<br/>Track prices, explore coins, with our easy-to-use dashboard.</p>

        <form className="flex items-center justify-between border-2 border-primary-50 rounded-full px-2 py-1">

          <input type="search" placeholder="Search crypto..." className="placeholder:font-light placeholder:text-base placeholder:text-primary-75/35 sm:px-12 max-sm:px-8 sm:py-4
           max-sm:py-3 rounded-full outline-none" required onChange={handleInput} value={input} list="coinList"/>
          <datalist id="coinList">
            {allCoins.map(
              (item, i)=>(
                <option key={i} value={item.name} />
              )
            )}
          </datalist>
          
        </form>
      </div>


      <div className="">
        {loading ? <Loader />
        : (<div className="max-w-4xl mx-auto max-sm:my-10 sm:my-16">

        <div className="max-sm:hidden bg-primary-100 grid grid-cols-[0.5fr_2fr_1fr_1fr_1.5fr] max-md:grid-cols-[1.5fr_1fr_0.8fr_0.8fr] max-sm:px-3 max-sm:py-3 max-md:px-6 md:px-10 max-md:py-5 md:py-5 rounded-tl-2xl rounded-tr-2xl max-md:text-base md:text-lg max-md:gap-x-1 font-medium tracking-tight">
          <p className="text-left max-md:hidden">#</p>
          <p>Coins</p>
          <p>Price</p>
          <p className="text-center">24H Change</p>
          <p className="max-sm:text-center sm:text-right">Market Cap</p>
        </div>
        
        <ul>
          {displayCoins.slice(0, 10).map(
            (item, i)=>(
              <Link to={`/coin/${item.id}`} key={i}
              className="group relative mt-4 bg-primary-100/40 hover:bg-primary-100/70 grid grid-cols-[0.5fr_2fr_1fr_1fr_1.5fr] max-sm:grid-cols-2 max-sm:gap-y-3  max-sm:gap-x-2 max-md:grid-cols-[1.5fr_1fr_0.8fr_0.8fr] items-center max-sm:px-3 max-sm:py-8 max-md:px-6 md:px-10 max-md:py-3 md:py-4 text-base max-md:font-light md:font-normal max-sm:first:rounded-t-2xl last:rounded-b-2xl cursor-pointer">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-accent-50 to-transparent opacity-15 group-hover:opacity-30"/>
                <p className="max-md:hidden">{item.market_cap_rank}</p>
                <div className="flex items-center max-sm:font-medium">
                  <img src={item.image} alt={`${item.name}-image`} className="max-sm:size-6 sm:size-9 max-sm:mr-2 sm:mr-3"/>
                  <p>{`${item.name}`}<span className="max-sm:hidden sm:inline-block">{`-${item.symbol}`}</span></p></div>
                <p>{`${currency.symbol} ${item.current_price}`}</p>
                <p className={`text-center max-sm:text-left ${item.price_change_percentage_24h < 0 ? "text-red-400" : "text-green-400"}`}>
                  { item.price_change_percentage_24h !== null ? item.price_change_percentage_24h.toFixed(2) : "-"}%
                  <span className="sm:hidden text-sm text-primary-50 font-light"> (24h Change)</span>
                  </p>
                <p className="text-right max-sm:text-left">{`${currency.symbol} ${marketCapConversion(item.market_cap)}`} <span className="sm:hidden text-sm font-light">(M cap)</span></p>                
              </Link>
            )
          )
          
          }
        </ul>

      </div>)}

      </div>
      
      
    </section>
  )
}

export default Home;