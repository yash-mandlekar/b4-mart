import React, { useEffect } from "react";
import ApexCharts from "apexcharts";

export default function BarChart({ data, categories }) {
  var options = {
    chart: {
      width: 500,
      type: "bar",
    },
    series: [
      {
        name: "sales",
        data: data,
      },
    ],
    xaxis: {
      categories: categories,
    },
  };
  useEffect(() => {
    var chart = new ApexCharts(document.querySelector("#chart"), options);
    chart.render();
  }, []);
  return <div id="chart"></div>;
}
