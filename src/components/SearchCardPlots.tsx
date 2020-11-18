import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  AreaChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
} from "recharts";
import { IonSpinner } from "@ionic/react";
import SegmentButtons from "./SegmentButtons";

const SearchCardPlots: React.FC<{ Id: string; apiKey: string }> = (props) => {
  const [plotDataTime, setPlotDataTime] = useState<[]>();

  //MANAGE TIME SCALE OF PLOTS
  const [changeDate, setChangeDate] = useState<number>(86400000);

  useEffect(() => {
    const date = new Date();

    const endDate = date.toJSON();

    const sDate = date.getTime() - changeDate;

    const startDate = new Date(sDate).toJSON();

    axios
      .get(
        "https://api.nomics.com/v1/currencies/sparkline?key=" +
          props.apiKey +
          "&ids=" +
          props.Id +
          "&start=" +
          startDate +
          "&end=" +
          endDate
      )
      .then((response) => {
        setPlotDataTime(response.data);
      })
      .catch((error) => {});
  }, [props.Id, changeDate, props.apiKey]);

  let plotHeight = 200;

  const data: any = [];

  if (plotDataTime) {
    plotDataTime.map((ticker: any) => {
      let x = ticker.timestamps.map((x: any) => x);
      let y = ticker.prices.map((y: any) => y);
      for (let obj in x) {
        data.push({ x: x[obj], y: y[obj] });
      }
      return data.push({ x: x, y: y });
    });
  }

  data.pop();

  const PlotCustomTooltip = (e: any) => {
    if (e.active && e.payload != null && e.payload[0] != null) {
      let day = e.payload[0].payload["x"];
      let convert = new Date(day).getTime();
      let display = new Date(convert);
      return (
        <div
          style={{
            border: "0.5px solid lightgrey",
            padding: "1px 10px",
            backgroundColor: "white",
          }}
          className="custom-tooltip"
        >
          <p>
            {display.getDate()}{" "}
            {display.toLocaleString("default", { month: "short" })}{" "}
            {display.toLocaleTimeString()}
          </p>
          <p>${parseFloat(e.payload[0].payload["y"]).toFixed(4)}</p>
        </div>
      );
    } else {
      return "";
    }
  };

  let content = (
    <div
      style={{
        textAlign: "center",
        margin: "auto",
        marginTop: "35px",
        paddingTop: "35px",
        width: "100px",
        height: "100px",
      }}
    >
      <IonSpinner style={{ transform: "scale(3)" }} name="circles" />
    </div>
  );

  if (plotDataTime) {
    content = (
      <ResponsiveContainer height={plotHeight} width="100%">
        <AreaChart
          data={data}
          margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
        >
          <Line type="monotone" dataKey="y" stroke="#5260ff" />
          <CartesianGrid stroke="#ccc" strokeDasharray="4 4" />
          <XAxis />
          <YAxis />
          <Tooltip content={(e: any) => PlotCustomTooltip(e)} />
          <Area type="monotone" dataKey="y" stroke="#5260ff" fill="#5260ff" />
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  return (
    <div style={{ height: "100%", width: "95%" }}>
      {content}
      <div style={{ width: "100%", marginLeft: "25px" }}>
        <SegmentButtons ionChange={(e) => setChangeDate(+e.detail.value!)} />
      </div>
    </div>
  );
};

export default SearchCardPlots;
