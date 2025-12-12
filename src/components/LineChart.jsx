import React, { useMemo, useState } from 'react';
import Chart from 'react-google-charts';

const LineChart = ( {historicalData} ) => {

  const chartData = useMemo(
    ()=>{
      if(!historicalData?.prices) return null;

      return [["Date", "Price"],
      ...historicalData.prices.map(
        (item)=> {
          return [new Date(item[0]).toLocaleDateString("en-US", {month: "short", day: "numeric"}), item[1]]
        }
      )]
    },
    [historicalData]
  );

  return (
    <div className="rounded-2xl overflow-hidden">
      <Chart
    chartType = "LineChart"
    data = {chartData}
    height = "300px"
    legendToggle
    />
    </div>
    
  )
}

export default LineChart;