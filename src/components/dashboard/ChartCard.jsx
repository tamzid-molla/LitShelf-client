import React from "react";
import { Pie, Bar, Doughnut } from "react-chartjs-2";

const ChartCard = ({ title, type, data, options, height = "h-64" }) => {
  const renderChart = () => {
    switch (type) {
      case "pie":
        return <Pie data={data} options={options} />;
      case "bar":
        return <Bar data={data} options={options} />;
      case "doughnut":
        return <Doughnut data={data} options={options} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-darkBase-secondary rounded-2xl p-6 shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        {title}
      </h3>
      <div className={height}>
        {renderChart()}
      </div>
    </div>
  );
};

export default ChartCard;
