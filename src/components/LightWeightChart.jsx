import React from 'react';
import { useEffect, useRef } from 'react';
import { createChart, LineSeries } from 'lightweight-charts';

const LightWeightChart = ({historicalData}) => {
    const containerRef = useRef(null);
    const chartRef = useRef(null);
    const seriesRef = useRef(null);

    useEffect(
      ()=>{
        if(!containerRef.current) return;

        chartRef.current = createChart(containerRef.current, {
          height: 300,
          layout : {
            background: {color: "transparent"},
            textColor: "#f9f9fa",
          },
          grid:{
            vertLines: {visible: false},
            horzLines: {color: "#191933"},
          },
          timeScale: {
            borderVisible : false,
            handleScroll: {
              vertTouchDrag: false,
            },
          },
          rightPriceScale: {
            visible: "true",
            borderVisible: "false",
            minimumWidth: 48,
          },
        })
        
        const tooltip = document.createElement("div");
        tooltip.style.position = "absolute";
        tooltip.style.display = "none";
        tooltip.style.padding = "8px 8px";
        tooltip.style.background = "#060614";
        tooltip.style.color = "#f9f9fa";
        tooltip.style.fontSize = "12px";
        tooltip.style.borderRadius = "4px";
        tooltip.style.pointerEvents = "none";
        tooltip.style.zIndex = "999";
        tooltip.style.top = "0";
        tooltip.style.left = "0";
        containerRef.current.appendChild(tooltip);

        seriesRef.current = chartRef.current.addSeries(LineSeries,
          {color: "#8547f5",
            lineWidth: 2,
          }
        ); 
        
        chartRef.current.subscribeCrosshairMove(
          (param) => {
            if(!param.point || !param.time){
              tooltip.style.display = "none";
              return;
            }

            const data = param.seriesData.get(seriesRef.current);

            if(!data){
              tooltip.style.display = "none";
              return;
            }

            const price = data.value ?? data.close;

            tooltip.style.display = "block";
            tooltip.textContent = price.toFixed(2);
            tooltip.style.left = param.point.x + 30 + 'px';
            tooltip.style.top = param.point.y - 50 + 'px';
          }
        );

        return ()=> {
         
          chartRef.current.remove();
        }
      },
      []
    );

    useEffect(()=>{

      if(!historicalData?.prices || !seriesRef.current){
        return;
      }

      const formattedData = historicalData.prices.map(
        ([time, price])=> {
          return {
            time: time / 1000,
            value: price
          }
        }
      ).sort((a,b)=> a.time - b.time);

      seriesRef.current.setData(formattedData);
      chartRef.current.timeScale().fitContent();
    }, [historicalData]);

  return (
    <div ref={containerRef} style={{ position: "relative",
    width: "100%",
    height: "300px",
    overflow: "hidden"
    }}/>
  )
}

export default LightWeightChart;