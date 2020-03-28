'use strict';

const { ZwaveDevice } = require('homey-meshdriver');

module.exports = class ZW_InWallSwitch extends ZwaveDevice {
    onMeshInit() {

        // enable debugging
        this.enableDebug();

        // print the node's info to the console
        this.printNode();

        this.registerCapability('onoff', 'SWITCH_BINARY');
    }
}
