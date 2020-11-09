import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  IonPage,
  IonHeader,
  IonContent,
  IonTitle,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardSubtitle,
  IonLabel,
  IonItem,
  IonToolbar,
  isPlatform,
  IonSpinner,
  IonIcon,
  IonPopover,
  IonButton,
  IonButtons,
  IonList,
  IonSearchbar,
} from "@ionic/react";
import { listOutline } from "ionicons/icons";
import { XYPlot, AreaSeries, ChartLabel, XAxis, YAxis } from "react-vis";

import "./Main.css";

const API_KEY = "ENTER YOUR API KEY";

const Main: React.FC = () => {
  const [searchTicker, setSearchTicker] = useState<string>();
  const [searchTickerData, setSearchTickerData] = useState<any>();
  const [arrayTicker, setArrayTicker] = useState<[]>();
  const [batchTickerData, setBatchTickerData] = useState<[]>();
  const [allTickerData, setAllTickerData] = useState<[]>();
  const [showPopOver, setShowPopOver] = useState<boolean>(false);

  const [totalMarketCap, setTotalMarketCap] = useState<[]>();
  const [totalVolume, setTotalVolume] = useState<[]>();

  useEffect(() => {
    axios
      .get("https://api.nomics.com/v1/currencies/ticker?key=" + API_KEY)
      .then((response) => {
        setArrayTicker(response.data.slice(0, 12));
        setBatchTickerData(response.data.slice(0, 50));
        setAllTickerData(response.data);
      })
      .catch((error) => {});

    // const date = new Date();

    // const endDate = date.toJSON();

    // const startDate = date.getTime() - 604800000;

    // const Day7 = new Date(startDate).toJSON();

    //GET TOTAL MARKET CAP
    axios
      .get(
        "https://api.nomics.com/v1/market-cap/history?key=" +
          API_KEY +
          "&start=2020-10-02T00%3A00%3A00Z&end=2020-10-31T00%3A00%3A00Z"
      )
      .then((response) => {
        setTotalMarketCap(response.data);
      })
      .catch((error) => {});

    //GET TOTAL VOLUME
    axios
      .get(
        "https://api.nomics.com/v1/volume/history?key=" +
          API_KEY +
          "&start=2020-10-02T00%3A00%3A00Z&end=2020-10-31T00%3A00%3A00Z"
      )
      .then((response) => {
        setTotalVolume(response.data);
      })
      .catch((error) => {});
  }, []);

  useEffect(() => {
    if (searchTicker) {
      const foundTicker = allTickerData!.find(
        (ticker: any) => ticker.id === searchTicker
      );
      setSearchTickerData(foundTicker);
    }
  }, [searchTicker, allTickerData]);

  let colSz = "3";
  if (isPlatform("android") || isPlatform("ios")) {
    colSz = "12";
  }

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

  if (arrayTicker) {
    content = (
      <IonRow>
        {arrayTicker.map((ticker: any) => (
          <IonCol key={ticker.id} className="ion-text-center" size={colSz}>
            <IonCard color="primary">
              <img
                className="ion-padding-top"
                src={ticker.logo_url}
                alt={ticker.name}
              />
              <IonCardHeader>
                {ticker.id} ({ticker.name})
              </IonCardHeader>
              <IonCardSubtitle>$ {ticker.price}</IonCardSubtitle>
              <IonCardContent></IonCardContent>
            </IonCard>
          </IonCol>
        ))}
      </IonRow>
    );
  }

  let colSearchSz = "6";
  let colSearchOff = "3";

  if (isPlatform("android") || isPlatform("ios")) {
    colSearchSz = "12";
    colSearchOff = "0";
  }

  const dataMarket: any = [];

  if (totalMarketCap) {
    totalMarketCap.map((market: any) => {
      let x = new Date(market.timestamp).getDate();
      let y = parseInt(market.market_cap) * 0.000000001;
      return dataMarket.push({
        x: x,
        y: y,
      });
    });
  }

  const dataVolume: any = [];

  if (totalVolume) {
    totalVolume.map((market: any) => {
      let x = new Date(market.timestamp).getDate();
      let y = parseInt(market.volume) * 0.00000001;
      return dataVolume.push({
        x: x,
        y: y,
      });
    });
  }

  let plotHeight = 200;
  let plotWidth = 400;

  if (isPlatform("android") || isPlatform("ios")) {
    plotWidth = 325;
  }

  return (
    <IonPage className="Main">
      <IonHeader className="ion-text-center">
        <IonToolbar color="primary">
          <IonTitle>Crypto Watch</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid>
          {/* INSERT GRAPH HERE */}
          <IonRow>
            <IonCol className="ion-text-center">
              <IonCard>
                <IonCardHeader>Total Market Cap</IonCardHeader>
                <IonCardContent className="ion-text-center">
                  <XYPlot height={plotHeight} width={plotWidth}>
                    <YAxis top={0} />
                    <XAxis marginTop={15} tickLabelAngle={15} />
                    <ChartLabel
                      text="X Axis"
                      className="alt-x-label"
                      includeMargin={false}
                      xPercent={0.025}
                      yPercent={1.01}
                    />
                    <ChartLabel
                      text="Y Axis"
                      className="alt-y-label"
                      includeMargin={false}
                      xPercent={0.06}
                      yPercent={0.06}
                      style={{
                        transform: "rotate(-90)",
                        textAnchor: "end",
                      }}
                    />
                    <AreaSeries
                      data={dataMarket}
                      style={{
                        fill: "none",
                      }}
                    />
                  </XYPlot>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol className="ion-text-center">
              <IonCard>
                <IonCardHeader>Total Volume</IonCardHeader>
                <IonCardContent className="ion-text-center">
                  <XYPlot height={plotHeight} width={plotWidth}>
                    <YAxis tickFormat={(d) => `${d}`} top={0} />
                    <XAxis
                      tickFormat={(d) => `${d}`}
                      marginTop={15}
                      tickLabelAngle={15}
                    />
                    <ChartLabel
                      text="X Axis"
                      className="alt-x-label"
                      includeMargin={false}
                      xPercent={0.025}
                      yPercent={1.01}
                    />
                    <ChartLabel
                      text="Y Axis"
                      className="alt-y-label"
                      includeMargin={false}
                      xPercent={0.06}
                      yPercent={0.06}
                      style={{
                        transform: "rotate(-90)",
                        textAnchor: "end",
                      }}
                    />
                    <AreaSeries data={dataVolume} />
                  </XYPlot>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonSearchbar
                  color="primary"
                  placeholder="Search Ticker"
                  value={searchTicker}
                  onIonChange={(e) =>
                    setSearchTicker(e.detail.value!.toUpperCase())
                  }
                ></IonSearchbar>
                <IonButtons className="ion-margin" slot="end">
                  <IonButton onClick={() => setShowPopOver(true)}>
                    <IonIcon
                      color="secondary"
                      slot="icon-only"
                      icon={listOutline}
                    />
                  </IonButton>
                </IonButtons>
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonCard>
                <IonPopover
                  isOpen={showPopOver}
                  onDidDismiss={(e) => setShowPopOver(false)}
                  cssClass="ion-text-center"
                >
                  <p>List of Tickers</p>
                  <IonList>
                    {batchTickerData &&
                      batchTickerData.map((crypto: any) => (
                        <IonItem
                          key={crypto.id}
                          onClick={() => {
                            setSearchTicker(crypto.id);
                            setSearchTickerData(crypto);
                            setShowPopOver(false);
                          }}
                        >
                          <IonLabel>{crypto.id}</IonLabel>
                          <div
                            style={{
                              width: "30px",
                              height: "30px",
                              objectFit: "scale-down",
                            }}
                          >
                            <img src={crypto.logo_url} alt={crypto.name} />
                          </div>
                        </IonItem>
                      ))}
                    <IonButton
                      onClick={() => {
                        axios
                          .get(
                            "https://api.nomics.com/v1/currencies/ticker?key=" +
                              API_KEY
                          )
                          .then((response) => {
                            setBatchTickerData(
                              response.data.slice(
                                0,
                                batchTickerData!.length + 50
                              )
                            );
                          })
                          .catch((error) => {});
                      }}
                    >
                      Load More ...
                    </IonButton>
                    <IonButton onClick={() => setShowPopOver(false)}>
                      Close
                    </IonButton>
                  </IonList>
                </IonPopover>
              </IonCard>
            </IonCol>
          </IonRow>
          {searchTicker && searchTickerData === undefined && (
            <IonRow>
              <IonCol
                className="ion-text-center"
                offset={colSearchOff}
                size={colSearchSz}
              >
                <IonCard color="danger">
                  <IonCardHeader>Ticker Not Found</IonCardHeader>
                  <IonCardContent>
                    The ticker you have entered is not valid. Please enter a
                    valid ticker.
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
          )}
          {searchTicker && searchTickerData !== undefined && (
            <IonRow>
              <IonCol
                className="ion-text-center"
                offset={colSearchOff}
                size={colSearchSz}
              >
                <IonCard color="tertiary">
                  <img
                    className="ion-padding-top"
                    src={searchTickerData!.logo_url}
                    alt={searchTickerData!.name}
                  />
                  <IonCardHeader>{searchTicker}</IonCardHeader>
                  <IonCardSubtitle>$ {searchTickerData!.price}</IonCardSubtitle>
                  <IonCardContent></IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
          )}
          {content}
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Main;
