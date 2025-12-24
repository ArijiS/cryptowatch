import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCoinContext } from '../context/CoinContext'; 
import { marketCapConversion } from '../utils/marketCapConversion';
import LineChart from './LineChart';
import LightWeightChart from './LightWeightChart';
import Loader from "./Loader";
import { RxExternalLink } from "react-icons/rx";
import { BiLinkExternal } from "react-icons/bi";

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

        const historicalUrl = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency.name}&days=30&precision=2`;
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

    <section className="max-w-360 max-sm:px-4 sm:px-12 md:p-16 lg:px-20 xl:px-25 max-sm:py-0 sm:py-0 md:py-4 lg:py-6 xl:py-10 mx-auto">
      {
        (loading || !coinData || !historicalData) ? <Loader /> : (
          <div className="w-full xl:max-w-5xl mx-auto py-10 md:my-12 lg:my-14 xl:my-16 flex flex-col gap-y-6 items-center justify-center">
            <div className="relative flex flex-col items-center justify-center gap-y-2 md:gap-y-3 lg:gap-y-5 bg-primary-100/40 w-full rounded-2xl p-4 lg:p-6">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-accent-50 to-transparent opacity-30"/>
              <img src={coinData.image?.large} alt={coinData.name} className="size-10 lg:size-15"/>
              <h1 className="text-xl md:text-2xl lg:text-4xl font-medium tracking-tight">{`${coinData.name} - (${coinData.symbol})`}</h1>
              <a href={coinData.links?.homepage[0]} className="flex items-center gap-x-2 text-sm/relaxed md:text-lg font-light tracking-tight" target="_blank">{`${coinData.name}-Official Website`}<RxExternalLink className="size-5" strokeWidth= {0.5}/>
              </a>
            </div>

            <div className= "bg-primary-100/40 w-full p-6 rounded-2xl"> {/* chart component*/}
              < LightWeightChart historicalData = {historicalData} />
            </div>

            <div className= "grid max-md:grid-cols-4 max-md:grid-rows-6 md:grid-cols-6 md:grid-rows-5 gap-2 lg:gap-5 w-full [&>*]:rounded-2xl [&>*]:sm:p-4 [&>*]:max-sm:px-4 [&>*]:max-sm:py-2"> {/* Info grid layout */}

              <div className="bg-primary-100/40 col-span-2 row-span-2 flex flex-col justify-between max-md:items-center max-md:col-span-2 max-md:row-start-2 max-md:row-end-3">
                <p className="w-fit text-sm md:text-lg lg:text-xl xl:text-2xl text-left sm:font-normal max-md:font-medium tracking-wide px-4 py-1 border-accent-50/60 border-2 rounded-xl">Market Rank</p>
                <p className={`${coinData.market_cap_rank < 100 ? "lg:text-9xl/27 md:text-7xl" : "lg:text-6xl md:text-4xl"} text-2xl sm:text-3xl md:font-medium`}>{coinData.market_cap_rank}</p>
              </div>

              <div className="bg-primary-100/40 col-span-2 row-span-2 flex flex-col max-md:gap-y-2 justify-between max-md:items-center max-md:col-span-full max-md:row-start-1 max-md:row-end-2">
                <p className="w-fit text-sm md:text-lg lg:text-xl xl:text-2xl font-normal tracking-wide px-4 py-1 border-accent-50/60 border-2 rounded-xl">Current Price</p>
                <p className={`${coinData.market_data.current_price[currency.name].toString().length > 6 ? "lg:text-4xl" : "lg:text-6xl lg:tracking-tight"} text-4xl max-md:font-normal tracking-normal`}>
                  {`${currency.symbol} ${coinData.market_data.current_price[currency.name]}`}</p>
              </div>
              
              <div className="bg-primary-100/40 col-span-2 row-span-2 flex flex-col justify-between max-md:items-center max-md:col-start-3 max-md:col-end-5 max-md:row-start-2 max-md:row-end-3">
                <p className="w-fit text-sm md:text-lg lg:text-xl xl:text-2xl tracking-wide px-4 py-1 border-accent-50/60 border-2 rounded-xl">Market Cap</p>
                <p className="text-2xl sm:text-xl md:text-3xl lg:text-4xl lg:font-medium font-normal">{`${currency.symbol} ${marketCapConversion(coinData.market_data.market_cap[currency.name])}`}</p>
              </div>

              <div className="bg-primary-100/40 col-span-2 row-span-2 flex flex-col justify-between max-md:items-center max-md:col-span-2 max-md:row-start-3 max-md:row-end-4">
                <p className="w-fit text-sm md:text-lg lg:text-xl xl:text-2xl tracking-wide px-4 py-1 border-accent-50/60 border-2 rounded-xl">24H Return</p>
                <p className={`${coinData.market_data.price_change_percentage_24h < 1 ? "text-red-400" : "text-green-400"} text-xl tracking-normal md:text-3xl lg:text-5xl font-medium md:tracking-tighter`}>
                  {`${coinData.market_data.price_change_percentage_24h.toFixed(2)} %`}</p>
              </div>

              <div className="bg-primary-100/40 col-span-2 row-span-2 flex flex-col justify-between max-md:items-center max-md:col-span-2 max-md:row-start-4 max-md:row-end-5">
                <p className="w-fit text-sm md:text-lg lg:text-xl xl:text-2xl tracking-wide px-4 py-1 border-accent-50/60 border-2 rounded-xl">1Y Return</p>
                <p className={`${coinData.market_data.price_change_percentage_1y < 1 ? "text-red-400" : "text-green-400"} text-xl tracking-normal md:text-3xl lg:text-5xl font-medium md:tracking-tighter`}>
                  {`${coinData.market_data.price_change_percentage_1y.toFixed(2)} %`}</p>
              </div>

              <div className="col-span-2 row-span-2 flex flex-col gap-y-2 lg:gap-y-4 [&>*]:p-4 [&>*]:max-sm:py-2 [&>*]:max-sm:px-4 [&>*]:rounded-2xl [&>*]:flex [&>*]:flex-col [&>*]:justify-between [&>*]:items-center p-0! max-md:items-center max-md:col-start-3 max-md:col-end-5 max-md:row-span-2 
              ">
                <div className="bg-green-950/40 h-1/2 w-full">
                  <p className="text-green-400 text-sm md:text-lg lg:text-xl xl:text-2xl font-medium tracking-wide px-4 py-1 max-md:border-green-400 max-md:border-2 max-md:rounded-xl">24H High</p>
                  <p className="text-xl font-normal md:font-medium tracking-normal md:tracking-wide">{`${currency.symbol} ${coinData.market_data.high_24h[currency.name]}`}</p>
                </div>
                <div className="bg-red-950/30 h-1/2 w-full">
                  <p className="text-red-400 text-sm md:text-lg lg:text-xl xl:text-2xl font-medium tracking-wide px-4 py-1 max-md:border-red-400 max-md:border-2 max-md:rounded-xl">24H Low</p>
                  <p className="text-xl font-normal md:font-medium tracking-normal md:tracking-wide">{`${currency.symbol} ${coinData.market_data.low_24h[currency.name]}`}</p>
                </div>
              </div>

              <div className="col-span-2 row-span-1 flex gap-2 lg:gap-4 !p-0 [&>*]:p-4 [&>*]max-sm::py-2 [&>*]:max-sm:px-4 [&>*]:flex [&>*]:gap-x-2 [&>*]:lg:gap-x-3 [&>*]:items-center [&>*]:justify-center [&>*]:rounded-2xl max-md:col-span-full max-md:row-span-1">
                <div className="bg-primary-100/40 w-full flex max-md:flex-row flex-col gap-y-1 lg:flex-row">
                  <FaRegThumbsUp className="fill-green-400 size-5"/>
                  <p className="text-green-400 text-lg font-medium">{`${coinData.sentiment_votes_up_percentage} %`}</p>
                </div>
                <div className="bg-primary-100/40 w-full flex max-md:flex-row flex-col gap-y-1 lg:flex-row">
                  <FaRegThumbsDown className="fill-red-400 size-5"/>
                  <p className="text-red-400 text-lg font-medium">{`${coinData.sentiment_votes_down_percentage} %`}</p>
                </div>                
              </div>

              <div className="col-span-2 row-span-1 flex gap-2 lg:gap-x-4 p-0! [&>*]:rounded-2xl [&>*]:p-4 [&>*]:max-sm:py-2 [&>*]:max-sm:px-4 [&>*]:flex [&>*]:items-center [&>*]:justify-center">

                {
                  coinData.links.subreddit_url ? (
                    <a href={coinData.links.subreddit_url} target="_blank" className="cursor-pointer bg-primary-100/40 hover:bg-primary-100/80 w-full relative" rel="noopener noreferrer">
                      <BiLinkExternal className="size-4 lg:size-6 stroke-accent-50 absolute top-2 right-2" strokeWidth= {0.5}/>
                      <FaReddit className="size-6 sm:size-10"/>
                    </a>
                  ) : (
                    <div className="cursor-not-allowed bg-primary-100/40 text-primary-50/40 w-1/2">
                      <p className="text-lg font-medium">N/A</p>
                    </div>
                  )
                }

                {
                  coinData.links.repos_url.github.length > 0 ? (
                    <a href={coinData.links.repos_url.github[0]} target="_blank" rel="noopener noreferrer"
                className={`${coinData.links.repos_url.github.length > 0 ? "cursor-pointer" : "cursor-not-allowed"} bg-primary-100/40 hover:bg-primary-100/80 w-full relative`}>
                      <BiLinkExternal className="size-4 lg:size-6 stroke-accent-50 absolute top-2 right-2" strokeWidth= {0.5}/>
                      <FaGithub className="size-6 sm:size-10"/> 
                    </a> 
                  ) :
                  
                  (
                    <div className="cursor-not-allowed bg-primary-100/40 text-primary-50/40 w-1/2">
                      <p className="text-lg font-medium">N/A</p>
                    </div>
                  )
                }
                               
              </div>

              <div className={`${coinData.links.whitepaper != "" ? "cursor-pointer hover:bg-primary-100/80" : "cursor-not-allowed text-primary-50/40"} col-span-2 row-span-1 flex justify-center items-center bg-primary-100/40 relative`}>
                {coinData.links.whitepaper ?
                (<>
                <BiLinkExternal className="size-4 lg:size-6 stroke-accent-50 absolute top-2 right-2" strokeWidth= {0.5}/>
                <a href={coinData.links.whitepaper} target="_blank" rel="noopener noreferrer" className="flex items-center gap-x-2">
                    <p className="max-sm:text-base max-sm:font-normal text-lg font-medium">Whitepaper(PDF)</p>                                        
                  </a>
                  </>) :
                  
                  (
                  <div className="flex items-center">
                    <p className="max-sm:text-base max-sm:font-normal text-lg font-medium text-center">Whitepaper N/A</p>                    
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