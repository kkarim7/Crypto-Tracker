import React from "react";
import { IonCardHeader, IonCardContent, IonCard } from "@ionic/react";

const IonCards: React.FC<{
  title: string;
  classColor: string;
  content: string;
}> = (props) => {
  return (
    <IonCard color={props.classColor}>
      <IonCardHeader className="ion-text-center">{props.title}</IonCardHeader>
      {props.children}
      <IonCardContent className="ion-text-center">
        {props.content}
      </IonCardContent>
    </IonCard>
  );
};

export default IonCards;
