import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCoinContext } from '../context/CoinContext'; 
import LineChart from './LineChart';
import Loader from "./Loader";
import { RxExternalLink } from "react-icons/rx";

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
          <div className="max-w-4xl mx-auto mt-16 flex flex-col gap-y-10 items-center justify-center">
            <div className="flex flex-col items-center justify-center gap-y-8 bg-primary-100 w-full rounded-2xl p-10">
              <img src={coinData.image?.large} alt={coinData.name} className="size-25"/>
              <h1 className="text-5xl font-medium tracking-tight">{`${coinData.name} - (${coinData.symbol})`}</h1>
              <a href={coinData.links?.homepage[0]} className="flex items-center gap-x-2 text-lg font-light tracking-tight" target="_blank">{`${coinData.name}-Official Website`}<RxExternalLink className="size-5" strokeWidth= {0.5}/>
              </a>
            </div>

            <div className= "bg-primary-100 w-full px-10 py-6 rounded-2xl"> {/* chart component*/}
              < LineChart historicalData = {historicalData}/>
            </div>

          </div>
        )
      }
    </section>

  )
}

export default Coin;