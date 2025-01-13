import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register Pie chart components
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data }) => {
  // Group data by 'Model' and sum 'Electric Range'
  const groupData = () => {
    return data.reduce((acc, row) => {
      const model = row.Model;
      const range = row["Electric Range"];
      
      if (!acc[model]) {
        acc[model] = 0;
      }
      
      acc[model] += range;
      return acc;
    }, {});
  };

  // Prepare data for Pie chart
  const preparePieChartData = () => {
    if (!data.length) return null;

    // Grouped data by Model
    const groupedData = groupData();
    const labels = Object.keys(groupedData);
    const values = Object.values(groupedData);

    return {
      labels,
      datasets: [
        {
          label: "Electric Range",
          data: values,
          backgroundColor: [
            "rgba(255, 99, 132, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 206, 86, 0.6)",
            "rgba(75, 192, 192, 0.6)",
            "rgba(153, 102, 255, 0.6)",
            "rgba(255, 159, 64, 0.6)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const pieChartData = preparePieChartData();

  return (
    <div>
      <h2>Pie Chart: Electric Range by Vehicle Model</h2>
      {pieChartData ? (
        <Pie data={pieChartData} />
      ) : (
        <p>No data available for Pie Chart</p>
      )}
    </div>
  );
};

export default PieChart;
