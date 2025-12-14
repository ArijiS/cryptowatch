import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCoinContext } from '../context/CoinContext'; 
import { marketCapConversion } from '../utils/marketCapConversion';
import LineChart from './LineChart';
import Loader from "./Loader";
import { RxExternalLink } from "react-icons/rx";

import { FaRegThumbsUp } from "react-icons/fa";
import { FaRegThumbsDown } from "react-icons/fa";

import { FaReddit } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";

import { FaFilePdf } from "react-icons/fa6";
import { IoIosCloudDownload } from "react-icons/io";

const Coin = () => {
  const {coinId} = useParams(); 
  const {currency, setLoading, loading} = useCoinContext();
  const [coinData, setCoinData] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);


    useEffect(
      ()=>{
          const fetchCoinData =  async () => {

        setLoading(true);

        try{
          
        const url = `https://api.coingecko.com/api/v3/coins/${coinId}`;
        const options = {method: 'GET', headers: {'x-cg-demo-api-key': "CG-N9UaqezFGhXAL2H1ZK37nSTP"}, body: undefined};
        const coinDataRes = await fetch(url, options);

        if(!coinDataRes.ok){
          throw new Error(`API Error: ${coinDataRes.status}`);
        }

        const historicalUrl = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency.name}&days=7&precision=2`;
        const historicalDataRes = await fetch(historicalUrl, options);

        if(!historicalDataRes.ok){
          throw new Error(`Historical fetch error: ${historicalDataRes.status}`);
        }

        const coinDetailsData = await coinDataRes.json();
        
        const coinHistoricalData = await historicalDataRes.json();
        
        setCoinData(coinDetailsData);
        setHistoricalData(coinHistoricalData);

      }

      catch(err){
        console.error("search error: ", err);
      }

      finally{
        setLoading(false);
      }};
      fetchCoinData()} , [currency, coinId]
    );

   

  return (

    <section className="max-w-360 px-25 py-10 mx-auto">
      {
        (loading || !coinData || !historicalData) ? <Loader /> : (
          <div className="max-w-4xl mx-auto my-16 flex flex-col gap-y-6 items-center justify-center">
            <div className="relative flex flex-col items-center justify-center gap-y-4 bg-primary-100 w-full rounded-2xl p-6">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-accent-50 to-transparent opacity-55"/>
              <img src={coinData.image?.large} alt={coinData.name} className="size-15"/>
              <h1 className="text-4xl font-medium tracking-tight">{`${coinData.name} - (${coinData.symbol})`}</h1>
              <a href={coinData.links?.homepage[0]} className="flex items-center gap-x-2 text-lg font-light tracking-tight" target="_blank">{`${coinData.name}-Official Website`}<RxExternalLink className="size-5" strokeWidth= {0.5}/>
              </a>
            </div>

            <div className= "bg-primary-100 w-full p-6 rounded-2xl"> {/* chart component*/}
              < LineChart historicalData = {historicalData}/>
            </div>

            <div className= "grid grid-cols-6 grid-rows-5 gap-5 w-full [&>*]:rounded-2xl [&>*]:p-4"> {/* Info grid layout */}

              <div className="bg-primary-100 col-span-2 row-span-2 flex flex-col justify-between">
                <p className="w-fit text-2xl text-left font-normal tracking-wide px-4 py-1 border-accent-50/60 border-2 rounded-xl">Market Rank</p>
                <p className={`${coinData.market_cap_rank < 100 ? "text-9xl/27 font-medium" : "text-6xl tracking-wide"}`}>{coinData.market_cap_rank}</p>
              </div>

              <div className="bg-primary-100 col-span-2 row-span-2 flex flex-col justify-between">
                <p className="w-fit text-2xl font-normal tracking-wide px-4 py-1 border-accent-50/60 border-2 rounded-xl">Current Price</p>
                <p className={`${coinData.market_data.current_price[currency.name].toString().length > 7 ? "text-3xl font-medium" : "text-6xl font-medium"}`}>
                  {`${currency.symbol} ${coinData.market_data.current_price[currency.name]}`}</p>
              </div>
              
              <div className="bg-primary-100 col-span-2 row-span-2 flex flex-col justify-between">
                <p className="w-fit text-2xl tracking-wide px-4 py-1 border-accent-50/60 border-2 rounded-xl">Market Cap</p>
                <p className="text-5xl font-medium">{`${currency.symbol} ${marketCapConversion(coinData.market_data.market_cap[currency.name])}`}</p>
              </div>

              <div className="bg-primary-100 col-span-2 row-span-2 flex flex-col justify-between">
                <p className="w-fit text-2xl tracking-wide px-4 py-1 border-accent-50/60 border-2 rounded-xl">24H Movement</p>
                <p className={`${coinData.market_data.price_change_percentage_24h < 1 ? "text-red-400" : "text-green-400"} text-6xl font-medium`}>
                  {`${coinData.market_data.price_change_percentage_24h.toFixed(2)} %`}</p>
              </div>

              <div className="bg-primary-100 col-span-2 row-span-2 flex flex-col justify-between">
                <p className="w-fit text-2xl tracking-wide px-4 py-1 border-accent-50/60 border-2 rounded-xl">1Y Return</p>
                <p className={`${coinData.market_data.price_change_percentage_1y < 1 ? "text-red-400" : "text-green-400"} text-6xl font-medium`}>
                  {`${coinData.market_data.price_change_percentage_1y.toFixed(2)} %`}</p>
              </div>

              <div className="col-span-2 row-span-2 flex flex-col gap-y-4 [&>*]:p-4 [&>*]:rounded-2xl [&>*]:flex [&>*]:flex-col [&>*]:gap-y-2 p-0!">
                <div className="bg-green-950/50">
                  <p className="text-green-400 text-lg font-medium tracking-wide">24H High</p>
                  <p className="text-lg font-medium">{`${currency.symbol} ${coinData.market_data.high_24h[currency.name]}`}</p>
                </div>
                <div className="bg-red-950/40">
                  <p className="text-red-400 text-lg font-medium tracking-wide">24H Low</p>
                  <p className="text-lg font-medium">{`${currency.symbol} ${coinData.market_data.low_24h[currency.name]}`}</p>
                </div>
              </div>

              <div className="col-span-2 row-span-1 flex gap-4 !p-0 [&>*]:p-4 [&>*]:flex [&>*]:gap-x-3 [&>*]:items-center [&>*]:justify-center [&>*]:rounded-2xl">
                <div className="bg-primary-100 w-full">
                  <FaRegThumbsUp className="fill-green-400 size-5"/>
                  <p className="text-green-400 text-lg font-medium">{`${coinData.sentiment_votes_up_percentage} %`}</p>
                </div>
                <div className="bg-primary-100 w-full">
                  <FaRegThumbsDown className="fill-red-400 size-5"/>
                  <p className="text-red-400 text-lg font-medium">{`${coinData.sentiment_votes_down_percentage} %`}</p>
                </div>                
              </div>

              <div className="col-span-2 row-span-1 flex gap-x-4 p-0! [&>*]:rounded-2xl [&>*]:p-4 [&>*]:flex [&>*]:items-center [&>*]:justify-center">
                <a href={coinData.links.subreddit_url} target="_blank" className={`${coinData.links.subreddit_url ? "cursor-pointer" : "cursor-not-allowed"} bg-primary-100 w-full`} rel="noopener noreferrer">
                  <FaReddit className="size-10"/>
                </a>
                <a href={coinData.links.repos_url.github[0]} target="_blank" rel="noopener noreferrer"
                className={`${coinData.links.repos_url.github.length > 0 ? "cursor-pointer" : "cursor-not-allowed"} bg-primary-100 w-full`}>
                 <FaGithub className="size-10"/> 
                </a>
              </div>

              <div className={`${coinData.links.whitepaper != "" ? "cursor-pointer" : "cursor-not-allowed opacity-40"} col-span-2 row-span-1 flex justify-center items-center bg-primary-100`}>
                {coinData.links.whitepaper ?
                (<a href={coinData.links.whitepaper} target="_blank" rel="noopener noreferrer" className="flex items-center gap-x-2">
                    <p className="text-lg font-medium">Whitepaper (PDF)</p>
                    <RxExternalLink className="size-6 stroke-accent-50" strokeWidth= {0.5} />
                  </a>) :
                  
                  (
                  <div className="flex items-center">
                    <p className="text-lg font-medium">Whitepaper Not Available</p>                    
                  </div>
                  )}          
                  
              </div>

              

            </div>

          </div>
        )
      }
    </section>

  )
}

export default Coin;