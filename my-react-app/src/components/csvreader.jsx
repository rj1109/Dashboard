import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import PieChart from "./piechart";
// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CsvReader = () => {
  const [csvData, setCsvData] = useState([]);
  const [error, setError] = useState("");

  // Group and aggregate CSV data by Model
  const groupCsvData = (data) => {
    const groupedData = data.reduce((acc, curr) => {
      const model = curr.Model;

      // If the model does not exist in the accumulator, create it
      if (!acc[model]) {
        acc[model] = { ...curr, count: 1 };
      } else {
        // Accumulate the electric range for the same model
        acc[model]["Electric Range"] += curr["Electric Range"];
        acc[model].count += 1;
      }
      return acc;
    }, {});

    // After grouping, calculate the average electric range for each model
    return Object.values(groupedData).map((item) => ({
      Model: item.Model,
      "Electric Range": item["Electric Range"] / item.count, // Average electric range
    }));
  };

  useEffect(() => {
    const fetchCSV = async () => {
      try {
        const response = await fetch("/file.csv");
        if (!response.ok) throw new Error("Failed to fetch the CSV file");

        const text = await response.text();
        Papa.parse(text, {
          complete: (result) => {
            const groupedData = groupCsvData(result.data); // Group the data
            setCsvData(groupedData);
            setError("");
          },
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true,
        });
      } catch (err) {
        setError("Error fetching or parsing CSV file: " + err.message);
      }
    };

    fetchCSV();
  }, []);

  const prepareChartData = () => {
    if (!csvData.length) return null;

    const labels = csvData.map((row) => row.Model);
    const data = csvData.map((row) => row["Electric Range"]);

    return {
      labels,
      datasets: [
        {
          label: "Average Electric Range",
          data,
          backgroundColor: "rgba(75, 192, 192, 0.5)",
          borderColor: "rgb(75, 192, 192)",
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <div className="csv-reader-container">
      <h1>CSV Data Visualization</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {csvData.length > 0 && (
        <div>
          <div className="chart">
            <h3>Average Electric Range by Vehicle Model</h3>
            <Bar data={prepareChartData()} />
          </div>
          <div className="data-pie-container">
            <div className="table-container">
              <h3>CSV Data:</h3>
              <table border="1">
                <thead>
                  <tr>
                    <th>Model</th>
                    <th>Average Electric Range</th>
                  </tr>
                </thead>
                <tbody>
                  {csvData.map((row, index) => (
                    <tr key={index}>
                      <td>{row.Model}</td>
                      <td>{row["Electric Range"]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="pie-chart-container">
              <h3>Pie Chart</h3>
              <PieChart data={csvData} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CsvReader;
