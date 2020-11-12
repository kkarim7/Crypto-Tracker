import React from "react";
import axios from "axios";
import {
  IonPopover,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
} from "@ionic/react";

const API_KEY = "ENTER YOUR API KEY HERE";

const PopOver: React.FC<{
  show: boolean;
  setShow: (e: any) => void;
  batch: Array<any>;
  setBatch: (e: any) => void;
  itemClick: (c: any) => void;
}> = (props) => {
  return (
    <IonPopover
      isOpen={props.show}
      onDidDismiss={props.setShow}
      cssClass="ion-text-center"
    >
      <p>List of Tickers</p>
      <IonList>
        {props.batch &&
          props.batch.map((crypto: any) => (
            <IonItem
              style={{ cursor: "pointer" }}
              key={crypto.id}
              onClick={() => props.itemClick(crypto)}
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
              .get("https://api.nomics.com/v1/currencies/ticker?key=" + API_KEY)
              .then((response) => {
                props.setBatch(
                  response.data.slice(0, props.batch!.length + 50)
                );
              })
              .catch((error) => {});
          }}
        >
          Load More ...
        </IonButton>
        <IonButton onClick={props.setShow}>Close</IonButton>
      </IonList>
    </IonPopover>
  );
};

export default PopOver;
