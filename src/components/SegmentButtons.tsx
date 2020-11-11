import React from "react";
import { IonSegment, IonSegmentButton, IonLabel } from "@ionic/react";

const SegmentButtons: React.FC<{ionChange: (e:any) => void}> = (props) => {
  return (
    <IonSegment onIonChange={props.ionChange}>
      <IonSegmentButton value="86400000">
        <IonLabel>1D</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton value="604800000">
        <IonLabel>1W</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton value="2629743000">
        <IonLabel>1M</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton value="31556926000">
        <IonLabel>1Y</IonLabel>
      </IonSegmentButton>
    </IonSegment>
  );
};

export default SegmentButtons;
