import React from "react";
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
import {
  isPlatform,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
} from "@ionic/react";

const Plots: React.FC<{ totMarkCap: []; totVol: [] }> = (props) => {

  let plotHeight = 200;
  let colSz = "6";

  if (isPlatform("android") || isPlatform("ios")) {
    colSz = "12";
    plotHeight = 150;
  }

  const dataMarket: any = [];

  if (props.totMarkCap) {
    props.totMarkCap.map((market: any) => {
      let x = new Date(market.timestamp).getTime();
      let y = parseInt(market.market_cap) * 0.00000000001;
      return dataMarket.push({
        x: x,
        y: y,
      });
    });
  }

  const dataVolume: any = [];

  if (props.totVol) {
    props.totVol.map((market: any) => {
      let x = new Date(market.timestamp).getTime();
      let y = parseInt(market.volume) * 0.000000001;
      return dataVolume.push({
        x: x,
        y: y,
      });
    });
  }

  return (
    <IonRow>
      <IonCol size={colSz}>
        <IonCard color="clear">
          <IonCardHeader className="ion-text-center">
            Total Market CAP
          </IonCardHeader>
          <div style={{ height: "100%", width: "95%" }}>
            <ResponsiveContainer height={plotHeight} width="100%">
              <AreaChart
                data={dataMarket}
                margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
              >
                <Line type="monotone" dataKey="y" stroke="#3880ff" />
                <CartesianGrid stroke="#ccc" strokeDasharray="4 4" />
                <XAxis />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="y"
                  stroke="#3880ff"
                  fill="#3880ff"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </IonCard>
      </IonCol>
      <IonCol size={colSz}>
        <IonCard color="clear">
          <IonCardHeader className="ion-text-center">
            Total Volume
          </IonCardHeader>
          <div style={{ height: "100%", width: "95%" }}>
            <ResponsiveContainer height={plotHeight} width="100%">
              <AreaChart
                data={dataVolume}
                margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
              >
                <Line type="monotone" dataKey="y" stroke="#3880ff" />
                <CartesianGrid stroke="#ccc" strokeDasharray="4 4" />
                <XAxis />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="y"
                  stroke="#3880ff"
                  fill="#3880ff"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </IonCard>
      </IonCol>
    </IonRow>
  );
};

export default Plots;
