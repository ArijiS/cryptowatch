export const marketCapConversion = (value) => {

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
        return (`${Math.round(value)} K`);
       }
    }