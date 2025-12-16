import React, { useMemo, useState } from 'react';
import Chart from 'react-google-charts';

const LineChart = ( {historicalData} ) => {

    const chartData = useMemo(
    ()=>{
      if(!historicalData?.prices) return null;

      return [["Date", "Price"],
      ...historicalData.prices.map(
        (item)=> {
          return [new Date(item[0]), item[1]]
        }
      )]
    },
    [historicalData]
  );

  const ticks = useMemo(
    ()=>{
      if(!historicalData?.prices) return undefined;

      return Array.from(
        new Set(
          historicalData.prices.map(
            item => new Date(item[0]).toDateString()
          )
        )
      ).map(date => new Date(date))
    },
    [historicalData]
  );

  const options = {
    backgroundColor : "transparent",    
    chartArea: {
      width: "90%",
      height: "78%",
      left: 65,
      top: 30,
    },
    colors: ["#8b5cf6"],
    lineWidth: 1.5,
    curveType: "function",
    legend:{
      position: "none",
    },
    focusTarget: "category",
    pointSize: 0,
    tooltip: {
    textStyle: {
      color: "#060614",
      fontSize: 13,
    },   
  },
    hAxis: {
      ticks,
      format: "MMM d",
      textStyle: {
        color: "#f9f9fa",
        fontSize: 12,
      },
      gridlines: {
        color: "none",
      },
      
    },
    vAxis: {
      textStyle: {
        color: "#f9f9fa",
      },
      gridlines:{
        color: "#191933",
      }
    },
  };

  return (
    <div className="rounded-2xl overflow-hidden">
      {chartData && (
        <Chart
          key={chartData.length}
          chartType = "LineChart"
          data = {chartData}
          options = {options}
          height = "300px"
    
        />
      )}
      
    </div>
    
  )
}

export default LineChart;