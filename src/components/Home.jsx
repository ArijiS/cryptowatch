import React, { useEffect, useState } from 'react';

import { IoSearch } from "react-icons/io5";
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
      (item) => item.name.toLowerCase().startsWith(value) || item.symbol.toLowerCase().startsWith(value)
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
       
        return (`${Math.round(value)} K`);
    }

  return (
    <section className="max-w-360 px-25 py-25 mx-auto">
      
      <div className="flex flex-col items-center gap-y-12">
        
        <div className="relative flex justify-center gap-x-15 mb-10 bg-primary-100/25 px-8 py-3 rounded-xl font-light text-primary-75 inset-shadow-accent-50/20 inset-shadow-xs">
          <div className="absolute -top-0.5 h-2 w-20 rounded-full blur-sm bg-accent-50/40 mix-blend-plus-lighter"/>
          <p>Buy</p>
          <p>Sell</p>
          <p>Trade</p>
        </div>

        <h1 className="text-6xl text-center font-semibold tracking-tight">Simplify Your Cryptocurrency Journey</h1>

        <p className="text-center text-lg/9 font-light max-w-150 text-primary-75">Cryptocurrency can feel overwhelming, but it doesn't have to be.<br/>Track prices, explore coins, with our easy-to-use dashboard.</p>

        <form className="flex items-center justify-between border-2 border-primary-50 rounded-full px-2 py-1">

          <input type="search" placeholder="Search crypto..." className="placeholder:font-light placeholder:text-base placeholder:text-primary-75/35 px-12 py-4
           rounded-full outline-none" required onChange={handleInput} value={input} list="coinList"/>
          <datalist id="coinList">
            {allCoins.map(
              (item, i)=>(
                <option key={i} value={item.name} />
              )
            )}
          </datalist>
          <button type="submit" className="cursor-pointer group p-0">

            <div className="size-12 bg-primary-50 rounded-full flex items-center justify-center inset-shadow-accent-100 inset-shadow-sm group-hover:bg-accent-50 group-hover:inset-shadow-sm group-hover:inset-shadow-primary-100 group-hover:scale-95 transition-properties">
              <IoSearch className="size-8 fill-primary-200 group-hover:fill-primary-50 transition-properties"/>
            </div>
            
          </button>

        </form>
      </div>


      <div className="">
        {loading ? <Loader />
        : (<div className="max-w-4xl mx-auto mt-16">

        <div className="bg-primary-100 grid grid-cols-[0.5fr_2fr_1fr_1fr_1.5fr] px-10 py-5 rounded-tl-2xl rounded-tr-2xl text-lg font-medium tracking-tight">
          <p className="text-left">#</p>
          <p>Coins</p>
          <p>Price</p>
          <p className="text-center">24H Change</p>
          <p className="text-right">Market Cap</p>
        </div>
        
        <ul>
          {displayCoins.slice(0, 10).map(
            (item, i)=>(
              <li key={i}
              className="group relative mt-4 bg-primary-100/40 hover:bg-primary-100/70 grid grid-cols-[0.5fr_2fr_1fr_1fr_1.5fr] items-center px-10 py-4 text-base font-normal last:rounded-br-2xl last:rounded-bl-2xl cursor-pointer">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-accent-50 to-transparent opacity-15 group-hover:opacity-30"/>
                <p>{item.market_cap_rank}</p>
                <p className="flex gap-x-3 items-center">
                  <img src={item.image} alt={`${item.name}-image`} className="size-9"/>
                  {`${item.name}-${item.symbol}`}</p>
                <p>{`${currency.symbol} ${item.current_price}`}</p>
                <p className={`text-center ${item.price_change_percentage_24h < 0 ? "text-red-400" : "text-green-400"}`}>
                  { item.price_change_percentage_24h !== null ? item.price_change_percentage_24h.toFixed(3) : ""}
                  </p>
                <p className="text-right">{`${currency.symbol} ${marketCapConversion(item.market_cap)}`}</p>
              </li>
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