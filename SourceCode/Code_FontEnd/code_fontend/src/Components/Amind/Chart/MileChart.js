// import React from "react";
// import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from "recharts";
// import mileStaticsData from "../../../assets/dummy-data/mileStatics";

// const MileChart = (moneyAweek) => {
//   console.log('money',moneyAweek.moneyAweek)
//   return (
//     <ResponsiveContainer width="100%" height={300}>
//       {moneyAweek.moneyAweek &&  moneyAweek.moneyAweek.map((money,index) => (
//       <BarChart data={money} key={index}>
//         <XAxis dataKey={money.name} stroke="#2884ff" />
//         <Bar dataKey={money.saleStats} stroke="#2884ff" fill="#2884ff" barSize={30} />
//         <Tooltip wrapperClassName="tooltip__style" cursor={false} />
//       </BarChart>
//       ))}
//     </ResponsiveContainer>
//   );
// };

// export default MileChart;
import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, CartesianGrid, YAxis } from "recharts";

const MileChart = ({ moneyAweek }) => {
  console.log('money', moneyAweek);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={moneyAweek}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" stroke="#2884ff" />
        <YAxis />
        <Tooltip wrapperClassName="tooltip__style" cursor={false} />
        <Bar dataKey="saleStats" stroke="#2884ff" fill="#2884ff" barSize={30} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MileChart;
