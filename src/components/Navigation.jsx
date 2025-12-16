import React from 'react';
import { RiCopperCoinFill } from "react-icons/ri";
import { useCoinContext } from '../context/CoinContext';
import { Link } from 'react-router-dom';

import { IoIosArrowDropdownCircle } from "react-icons/io";



const Navigation = () => {

  const { currency, setCurrency } = useCoinContext();

  const handleCurrency = (e) => {
    
    switch(e.target.value) {
      case "usd": {
        setCurrency(
          { name: "usd",
            symbol: "$"
          }
        );
        break;
        }

        case "eur": {
        setCurrency(
          { name: "eur",
            symbol: "€",
          }
        );
        break;
        }

        case "inr": {
        setCurrency(
          { name: "inr",
            symbol: "₹",
          }
        );
        break;
        }

        default: {
          setCurrency({name:"usd", symbol:"$"});
          break;
        }
      
    }

  }

  return (
    <nav className="relative flex max-sm:flex-col max-sm:gap-y-10 max-sm:items-center flex-row justify-between items-center max-w-360 py-10 px-10 sm:px-12 md:px-16 lg:px-20 xl:px-25 m-auto">

        <div className="absolute h-50 -top-[190%] left-0 right-0 opacity-40 blur-xl rounded-full bg-white mix-blend-plus-lighter" ></div>

        <div className="absolute h-250 -top-[800%] left-0 right-0 opacity-30 blur-2xl rounded-full bg-accent-50" ></div>

        <Link to={`/`} href="#" className="relative flex gap-x-2 items-center"><RiCopperCoinFill className="size-8"/><p className="font-semibold tracking-tight text-xl">cryptoWtch</p></Link>

        <div className="bg-primary-100 rounded-lg pr-4">
          <select
          id="currencySelect"
          className="rounded-lg bg-primary-100 text-lg max-sm:px-10 sm:px-5 py-2 mr-2 focus:outline-none cursor-pointer"
          onChange={handleCurrency}
          >
            <option value="usd">USD</option>
            <option value="eur">EUR</option>
            <option value="inr">INR</option>
          </select>
        </div>
                  
    </nav>
  )
}

export default Navigation;