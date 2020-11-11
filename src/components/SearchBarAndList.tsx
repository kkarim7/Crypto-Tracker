import React from "react";
import { IonSearchbar, IonButtons, IonButton, IonIcon } from "@ionic/react";
import { listOutline } from "ionicons/icons";

const SearchBarAndList: React.FC<{
  ticker: string;
  setTicker: (e: any) => void;
  setPopOver: () => void;
}> = (props) => {
  return (
    <React.Fragment>
      <IonSearchbar
        color="primary"
        placeholder="Search Ticker"
        value={props.ticker}
        onIonChange={props.setTicker}
      />
      <IonButtons className="ion-margin" slot="end">
        <IonButton onClick={props.setPopOver}>
          <IonIcon color="secondary" slot="icon-only" icon={listOutline} />
        </IonButton>
      </IonButtons>
    </React.Fragment>
  );
};

export default SearchBarAndList;
