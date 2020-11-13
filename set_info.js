(function(){

  class Custom {

    constructor() {
      this.thedevice = null;
      this.gattserve = null;
      this.getCharacteristic = null;
      this.custom_service = null;
      this.custom_character = null;
      this.getcharwrite = null;
      this.getcharwrite_rp = null;
      this.getcharnotify = null;
      this.getcharindicate = null;

      this.onDisconnected = this.onDisconnected.bind(this);
    }
  
    /**
     * @requires
     * Scan the nearby Bluetooth and click the connection
     */
    request(ble_service,ble_character,option) {
      this.custom_service = ble_service;
      this.custom_character = ble_character;

      return navigator.bluetooth.requestDevice(option)
      .then(device => {
        this.thedevice = device;
        log('Name:             ' + device.name);
        log('Id:               ' + device.id);
        log('Connected:        ' + device.gatt.connected);
        device.addEventListener('gattserverdisconnected', this.onDisconnected)
        return device.gatt.connect();
      })
      .then(server => {
        log('Getting Service...');
        this.gattserve = server;
        return server.getPrimaryService(ble_service);
      })
      .then(services => {
        log('Getting Characteristic...');
        log('service UUID:       \n' + "          > " + services.uuid);
        return services.getCharacteristic(ble_character);
      })
      .then(characteristic => {
        this.getCharacteristic = characteristic;
        this.getcharwrite = characteristic.properties.write;
        this.getcharwrite_rp = characteristic.properties.writeWithoutResponse;
        this.getcharnotify = characteristic.properties.notify;
        this.getcharindicate = characteristic.properties.indicate;
        log('Characteristic UUID:\n' + "          > " + characteristic.uuid);
        log('Broadcast:            ' + characteristic.properties.broadcast);
        log('Read:                 ' + characteristic.properties.read);
        log('Write w/o response:   ' + characteristic.properties.writeWithoutResponse);
        log('Write:                ' + characteristic.properties.write);
        log('Notify:               ' + characteristic.properties.notify);
        log('Indicate:             ' + characteristic.properties.indicate);
        log('Signed Write:         ' + characteristic.properties.authenticatedSignedWrites);
        log('Queued Write:         ' + characteristic.properties.reliableWrite);
        log('Writable Auxiliaries: ' + characteristic.properties.writableAuxiliaries);
      });
    }
  
    /**
     * @disconnect
     * Disconnect from the device
     */
    disconnect() {
      if (!this.thedevice) {
        return;
      }
      log('Disconnecting from Bluetooth Device...');
      if (this.thedevice.gatt.connected) {
        this.thedevice.gatt.disconnect();
        this.gattserve.disconnect();
      } else {
        log('> Bluetooth Device is already disconnected');
      }
    }
    /**
     * @onDisconnected
     * Bluetooth device disconnect execution function
     */
    onDisconnected() {
        log('Device is disconnected.');
    }

/*
    log('Getting Characteristics...');
    console.log(services);
    console.log(this.gattserve);
    //console.log(this.gattserve.getPrimaryService());
    let queue = Promise.resolve();
    this.gattserve.getPrimaryService().forEach(service => {
      queue = queue.then(_ => service.getCharacteristics().then(characteristics => {
        log('> Service: ' + service.uuid);
        characteristics.forEach(characteristic => {
          log('>> Characteristic: ' + characteristic.uuid + ' ' +
              this.getSupportedProperties(characteristic));
        });
      }));
    });
    return queue;
    getSupportedProperties(characteristic) {
      let supportedProperties = [];
      for (const p in characteristic.properties) {
        if (characteristic.properties[p] === true) {
          supportedProperties.push(p.toUpperCase());
        }
      }
      return '[' + supportedProperties.join(', ') + ']';
    }
*/
  }
  window.user_custom = new Custom();
})();
