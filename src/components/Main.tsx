import React, { useState, useEffect, useRef } from "react";
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
  IonInput,
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
} from "@ionic/react";
import { menuOutline } from "ionicons/icons";
import "./Main.css";

const API_KEY = "ENTER YOUR API KEY HERE";

const Main: React.FC = () => {
  const [searchTicker, setSearchTicker] = useState<string>();
  const [searchTickerData, setSearchTickerData] = useState<any>();
  const [arrayTicker, setArrayTicker] = useState<[]>();
  const [allTickerData, setAllTickerData] = useState<[]>();
  const [showPopOver, setShowPopOver] = useState<boolean>(false);

  const searchCryptoRef = useRef<HTMLIonInputElement>(null);

  useEffect(() => {
    axios
      .get("https://api.nomics.com/v1/currencies/ticker?key=" + API_KEY)
      .then((response) => {
        setArrayTicker(response.data.slice(0, 12));
        setAllTickerData(response.data.slice(0, 50));

        if (searchTicker) {
          const foundTicker = response.data.find(
            (ticker: any) => ticker.id === searchTicker
          );
          setSearchTickerData(foundTicker);
        }

        console.log(response.data);
      })
      .catch((error) => {});
  }, [searchTicker]);

  const search = (event: CustomEvent) => {
    if (event.detail.value !== undefined) {
      const ticker: string = event.detail.value;
      const tickerSearch = ticker.toUpperCase();
      setSearchTicker(tickerSearch);
    }
    return;
  };

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

  return (
    <IonPage className="Main">
      <IonHeader className="ion-text-center">
        <IonToolbar color="primary">
          <IonTitle>Crypto Watch</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonCard>
                <IonItem color="primary">
                  <IonLabel position="floating">
                    <h2>Search Tickers</h2>
                  </IonLabel>
                  <IonInput
                    type="text"
                    ref={searchCryptoRef}
                    value={searchTicker}
                    onIonChange={search}
                  />
                  <IonButtons slot="end">
                    <IonButton onClick={() => setShowPopOver(true)}>
                      <IonIcon
                        color="secondary"
                        slot="icon-only"
                        icon={menuOutline}
                      />
                    </IonButton>
                  </IonButtons>
                </IonItem>
                <IonPopover
                  isOpen={showPopOver}
                  onDidDismiss={(e) => setShowPopOver(false)}
                  cssClass="ion-text-center"
                >
                  <p>List of Tickers</p>
                  <IonList>
                    {allTickerData &&
                      allTickerData.map((crypto: any) => (
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
                            setAllTickerData(
                              response.data.slice(0, allTickerData!.length + 50)
                            );
                          })
                          .catch((error) => {});
                      }}
                    >
                      Load More ...
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
