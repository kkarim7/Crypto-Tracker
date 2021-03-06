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
  IonItem,
  IonToolbar,
  isPlatform,
  IonSpinner,
  IonRefresher,
  IonRefresherContent,
} from "@ionic/react";

import "./Main.css";
import IonCards from "./IonCards";
import SegmentButtons from "./SegmentButtons";
import SearchBarAndList from "./SearchBarAndList";
import PopOver from "./PopOver";
import Plots from "./Plots";
import SearchCardPlots from "./SearchCardPlots";
import { refreshOutline } from "ionicons/icons";

const API_KEY = "ENTER YOUR API KEY HERE";

const Main: React.FC = () => {
  const [searchTicker, setSearchTicker] = useState<string>();
  const [searchTickerData, setSearchTickerData] = useState<any>();
  const [arrayTicker, setArrayTicker] = useState<[]>();
  const [batchTickerData, setBatchTickerData] = useState<[]>();
  const [allTickerData, setAllTickerData] = useState<[]>();
  const [showPopOver, setShowPopOver] = useState<boolean>(false);

  //MANAGE PLOTS STATE
  const [totalMarketCap, setTotalMarketCap] = useState<[]>();
  const [totalVolume, setTotalVolume] = useState<[]>();

  //MANAGE TIME SCALE OF PLOTS
  const [changeDate, setChangeDate] = useState<number>(86400000);

  useEffect(() => {
    axios
      .get("https://api.nomics.com/v1/currencies/ticker?key=" + API_KEY)
      .then((response) => {
        setArrayTicker(
          response.data.filter(
            (t: any) =>
              t.id === "BTC" ||
              t.id === "ETH" ||
              t.id === "XRP" ||
              t.id === "LTC"
          )
        );
        setBatchTickerData(response.data.slice(0, 50));
        setAllTickerData(response.data);
      })
      .catch((error) => {});

    const dateNow = new Date();

    const endDate = dateNow.toJSON();

    const startDate = new Date(dateNow.getTime() - changeDate).toJSON();

    //GET TOTAL VOLUME
    axios
      .get(
        "https://api.nomics.com/v1/volume/history?key=" +
          API_KEY +
          "&start=" +
          startDate +
          "&end=" +
          endDate
      )
      .then((response) => {
        setTotalVolume(response.data);
      })
      .catch((error) => {});

    //GET TOTAL MARKET CAP
    axios
      .get(
        "https://api.nomics.com/v1/market-cap/history?key=" +
          API_KEY +
          "&start=" +
          startDate +
          "&end=" +
          endDate
      )
      .then((response) => {
        setTotalMarketCap(response.data);
      })
      .catch((error) => {});
  }, [changeDate]);

  useEffect(() => {
    if (searchTicker) {
      const foundTicker = allTickerData!.find(
        (ticker: any) => ticker.id === searchTicker
      );
      setSearchTickerData(foundTicker);
    }
  }, [searchTicker, allTickerData]);

  let colSz = "6";
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
            <IonCards
              classColor="primary"
              title={`${ticker.id} (${ticker.name})`}
              content={`$ ${ticker.price}`}
            >
              <img src={ticker.logo_url} alt={ticker.name} />
            </IonCards>
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

  const handleRefresh = (e: CustomEvent<HTMLIonRefresherElement>) => {
    setTimeout(() => {
      e.detail.complete();
    }, 2000);
  };

  return (
    <IonPage className="Main">
      <IonHeader className="ion-text-center">
        <IonToolbar color="primary">
          <IonTitle>Crypto Watch</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={(e: any) => handleRefresh(e)}>
          <IonRefresherContent
            pullingIcon={refreshOutline}
            pullingText="Pull to Refresh"
            refreshingSpinner="circles"
          ></IonRefresherContent>
        </IonRefresher>
        <IonGrid>
          {/* INSERT GRAPH HERE */}
          <Plots totMarkCap={totalMarketCap!} totVol={totalVolume!} />
          <IonRow>
            <IonCol
              offset={isPlatform("android") || isPlatform("ios") ? "0" : "3"}
              size={isPlatform("android") || isPlatform("ios") ? "12" : "6"}
              className="ion-text-center"
            >
              <SegmentButtons
                ionChange={(e) => setChangeDate(+e.detail.value!)}
              />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonItem>
                <SearchBarAndList
                  ticker={searchTicker!}
                  setTicker={(e) =>
                    setSearchTicker(e.detail.value!.toUpperCase())
                  }
                  setPopOver={() => setShowPopOver(true)}
                />
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonCard>
                <PopOver
                  show={showPopOver}
                  setShow={(e) => setShowPopOver(false)}
                  batch={batchTickerData!}
                  setBatch={(e) => setBatchTickerData(e)}
                  itemClick={(crypto) => {
                    setSearchTicker(crypto.id);
                    setSearchTickerData(crypto);
                    setShowPopOver(false);
                  }}
                  apiKey={API_KEY}
                />
              </IonCard>
            </IonCol>
          </IonRow>
          {searchTicker && searchTickerData === undefined && (
            <IonRow>
              <IonCol offset={colSearchOff} size={colSearchSz}>
                <IonCards
                  title="Ticker Not Found"
                  classColor="danger"
                  content="The ticker you have entered is not valid. Please enter a valid
                  ticker."
                ></IonCards>
              </IonCol>
            </IonRow>
          )}
          {searchTicker && searchTickerData !== undefined && (
            <IonRow>
              <IonCol className="ion-text-center" size={colSearchSz}>
                <IonCards
                  classColor="tertiary"
                  title={searchTicker}
                  content={`$ ${searchTickerData!.price}`}
                >
                  <img
                    src={searchTickerData!.logo_url}
                    alt={searchTickerData!.name}
                  />
                </IonCards>
              </IonCol>
              <IonCol size={colSearchSz}>
                <SearchCardPlots Id={searchTicker} apiKey={API_KEY} />
              </IonCol>
            </IonRow>
          )}
          {content}
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default React.memo(Main);
