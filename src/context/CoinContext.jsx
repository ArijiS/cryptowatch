
import { useContext, createContext, useState, useEffect } from "react";

const CoinContext = createContext();

 const CoinContextProvider = ({children}) => {

        const [allCoins, setAllCoins] = useState([]);
    const [currency, setCurrency] = useState({
        name: "usd",
        symbol: "$",
    });

    const [loading, setLoading] = useState(false);

    const contextValue = {
        allCoins, currency, setCurrency, setAllCoins, loading, setLoading
    };


    useEffect(
        ()=> {
            const fetchAllCoins = async () => {
            const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency.name}&price_change_percentage=24h`;
            const options = {method: 'GET', headers: {'x-cg-demo-api-key': "CG-N9UaqezFGhXAL2H1ZK37nSTP"}};

        setLoading(true);

        try{
            const res = await fetch(url, options);

            if(!res.ok){
                throw new Error(`API error: ${res.status}`);    
            }

            const data = await res.json();
            setAllCoins(data);
            }

        catch(error){
            console.error("Fetch error:", error);
        }
        finally{
            setLoading(false);
        }
    }
        fetchAllCoins();
        } ,[currency]
    );


    return (
        <CoinContext.Provider value={contextValue} >
            {children}
        </CoinContext.Provider>
    );

}

const useCoinContext = () => {
    return useContext(CoinContext);
}




export { useCoinContext, CoinContextProvider };