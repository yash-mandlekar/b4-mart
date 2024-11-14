import React, { useEffect, useRef } from "react";
import ApexCharts from "apexcharts";

const PieChart = ({ pieseries, label }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = new ApexCharts(chartRef.current, {
      series: pieseries,
      chart: {
        type: "pie",
        width: 550,
      },
      labels: label,
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    });

    chart.render();

    return () => {
      chart.destroy();
    };
  }, []);

  return <div ref={chartRef}></div>;
};

export default PieChart;
