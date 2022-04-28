export class Gina {
  constructor() {
    this.device = null;
    this.onDisconnected = this.onDisconnected.bind(this);
  }

  request() {
    let options = {
      filters: [
        {
          namePrefix: "GINA",
        },
      ],
      optionalServices: ["91341521-bac2-42d9-bbb3-942f7a10976c"],
    };
    return navigator.bluetooth.requestDevice(options).then((device) => {
      this.device = device;
      this.device.addEventListener(
        "gattserverdisconnected",
        this.onDisconnected
      );
    });
  }

  connect() {
    if (!this.device) {
      return Promise.reject("Device is not connected.");
    }
    return this.device.gatt.connect();
  }

  readWeight() {
    return this.device.gatt
      .getPrimaryService("91341521-bac2-42d9-bbb3-942f7a10976c")
      .then((service) =>
        service.getCharacteristic("91341522-bac2-42d9-bbb3-942f7a10976c")
      )
      .then((characteristic) => characteristic.readValue());
  }

  startWeightNotifications(listener) {
    return this.device.gatt
      .getPrimaryService("91341521-bac2-42d9-bbb3-942f7a10976c")
      .then((service) =>
        service.getCharacteristic("91341522-bac2-42d9-bbb3-942f7a10976c")
      )
      .then((characteristic) => characteristic.startNotifications())
      .then((characteristic) =>
        characteristic.addEventListener("characteristicvaluechanged", listener)
      );
  }

  stopWeightNotifications(listener) {
    return this.device.gatt
      .getPrimaryService("91341521-bac2-42d9-bbb3-942f7a10976c")
      .then((service) =>
        service.getCharacteristic("91341522-bac2-42d9-bbb3-942f7a10976c")
      )
      .then((characteristic) => characteristic.stopNotifications())
      .then((characteristic) =>
        characteristic.removeEventListener(
          "characteristicvaluechanged",
          listener
        )
      );
  }

  disconnect() {
    if (!this.device) {
      return Promise.reject("Device is not connected.");
    }
    return this.device.gatt.disconnect();
  }

  onDisconnected() {
    console.log("Device is disconnected.");
  }
}
