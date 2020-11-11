import React from "react";
import {
  XYPlot,
  AreaSeries,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  LineMarkSeries,
} from "react-vis";
import { isPlatform, IonRow, IonCol } from "@ionic/react";
import IonCards from "./IonCards";

const Plots: React.FC<{ totMarkCap: []; totVol: [] }> = (props) => {
  let plotHeight = 200;
  let plotWidth = 450;

  if (isPlatform("android") || isPlatform("ios")) {
    plotWidth = 350;
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
      let y = parseInt(market.volume) * 0.0000000001;
      return dataVolume.push({
        x: x,
        y: y,
      });
    });
  }

  return (
      <IonRow>
        <IonCol className="ion-text-center">
          <IonCards title="Total Market CAP" classColor="clear" content="">
            <XYPlot height={plotHeight} width={plotWidth}>
              <VerticalGridLines style={{ stroke: "orchid", opacity: "25%" }} />
              <HorizontalGridLines
                style={{ stroke: "orchid", opacity: "25%" }}
              />
              <YAxis tickFormat={(d) => ""} left={18} top={0} />
              <XAxis
                marginTop={15}
                tickFormat={(d) => ""}
                tickLabelAngle={15}
              />
              <AreaSeries
                data={dataMarket}
                style={{
                  stroke: "#3880ff",
                  fill: "#3880ff",
                  opacity: "70%",
                }}
              />
              <LineMarkSeries
                data={dataMarket}
                style={{
                  stroke: "darkgreen",
                  fill: "none",
                  opacity: "70%",
                }}
              />
            </XYPlot>
          </IonCards>
        </IonCol>
        <IonCol className="ion-text-center">
          <IonCards title="Total Volume" classColor="clear" content="">
            <XYPlot height={plotHeight} width={plotWidth}>
              <VerticalGridLines style={{ stroke: "orchid", opacity: "25%" }} />
              <HorizontalGridLines
                style={{ stroke: "orchid", opacity: "25%" }}
              />
              <YAxis tickFormat={(d) => ""} left={10} top={0} />
              <XAxis
                tickFormat={(d) => ""}
                marginTop={15}
                tickLabelAngle={15}
              />
              <AreaSeries
                data={dataVolume}
                style={{
                  stroke: "#3880ff",
                  fill: "#3880ff",
                  opacity: "70%",
                }}
              />
            </XYPlot>
          </IonCards>
        </IonCol>
      </IonRow>
  );
};

export default Plots;
