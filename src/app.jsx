import "./styles.css";
import { useState } from "react";
import { Gina } from "./gina";

var gina = new Gina();

export default function App() {
  const [weight, setWeight] = useState(null);
  const [waterWeight, setWaterWeight] = useState(null);
  const [offset, setOffset] = useState(0);
  const connect = async () => {
    await gina.request();
    await gina.connect();
    let initialWeight;
    gina.startWeightNotifications((evt) => {
      try {
        let weight = evt.currentTarget.value.getUint32(0, true);
        if (!initialWeight) {
          initialWeight = weight;
          setOffset(initialWeight);
        }
        setWeight(weight);
      } catch (err) {
        console.log(err);
        gina.stopWeightNotifications();
      }
    });
  };
  const tare = () => {
    // @todo: wait for weight to stabalise
    setOffset(weight);
  };
  const next = () => {
    const coffeeWeight = scaleWeight(weight, offset);
    setWaterWeight(coffeeWeight * 15);
    tare();
  };
  if (!weight) return <button onClick={connect}>Connect</button>;
  return (
    <div>
      <button onClick={tare}>Tare</button>
      {!waterWeight && <button onClick={next}>Next</button>}
      {<div>Weight: {scaleWeight(weight, offset)}</div>}
      {waterWeight && <div>Water: {waterWeight}</div>}
    </div>
  );
}

function scaleWeight(absWeight, offset) {
  let weight = (absWeight - offset) / 10;
  if (0.3 > weight && weight > -0.3) weight = 0;
  return weight;
}
