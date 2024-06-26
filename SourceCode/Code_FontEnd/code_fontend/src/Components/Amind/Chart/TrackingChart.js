import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import trackingData from "../../../assets/dummy-data/trackingData";

const TrackingChart = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={trackingData}>
        <CartesianGrid strokeDasharray="0" stroke="#b7ffe913" />
        <XAxis dataKey="name" stroke="#ddd" />
        <Line
          type="monotone"
          dataKey="pv"
          stroke="#e1424e"
          strokeWidth={2}
          activeDot={{ r: 8 }}
        />
        <Tooltip wrapperClassName="tooltip__style" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TrackingChart;
