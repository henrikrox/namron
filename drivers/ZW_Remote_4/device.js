'use strict';

const Homey = require('homey');

const ZwaveDevice = require('homey-meshdriver').ZwaveDevice;
let lastKey = null;

module.exports = class ZW_Remote_8 extends ZwaveDevice {
	async onMeshInit() {

		// enable debugging
		this.enableDebug();

		// print the node's info to the console
		this.printNode();

		// supported scenes and their reported attribute numbers (all based on reported data)
		this.buttonMap = {
			1: {
				button: 'All-I',
			},
			2: {
				button: 'All-O',
			},
			3: {
				button: 'Group1-I',
			},
			4: {
				button: 'Group1-O',
			},
			5: {
				button: 'Group2-I',
			},
			6: {
				button: 'Group2-O',
			},
			7: {
				button: 'Group3-I',
			},
			8: {
				button: 'Group3-O',
			},
			9: {
				button: 'Group4-I',
			},
			10: {
				button: 'Group4-O',
			},
			11: {
				button: 'Scene-1',
			},
			12: {
				button: 'Scene-2',
			},

		};

		this.sceneMap = {
			'Key Pressed 1 time': {
				scene: 'Key Pressed 1 time'
			},
			'Key Held Down': {
				scene: 'Key Held Down'
			},
			'Key Released': {
				scene: 'Key Released'
			},
		};

		// register device capabilities
		this.registerCapability('alarm_battery', 'BATTERY');
		this.registerCapability('measure_battery', 'BATTERY');

		// register a report listener (SDK2 style not yet operational)
		this.registerReportListener('CENTRAL_SCENE', 'CENTRAL_SCENE_NOTIFICATION', (report) => {
			if (report.hasOwnProperty('Properties1') &&
				report.Properties1.hasOwnProperty('Key Attributes') &&
				report.hasOwnProperty('Scene Number') &&
				report.hasOwnProperty('Sequence Number')) {

				const remoteValue = {
					button: this.buttonMap[report['Scene Number'].toString()].button,
					scene: this.sceneMap[report.Properties1['Key Attributes'].toString()].scene,
				};

				this.log('Triggering sequence:', report['Sequence Number'], 'remoteValue', remoteValue);

				// Trigger the trigger card with 2 autocomplete options
				Homey.app.triggerWallController_scene.trigger(this, null, remoteValue);
				// Trigger the trigger card with tokens
				Homey.app.triggerWallController_button.trigger(this, remoteValue, null);
			}
		});

	}

	onSceneAutocomplete(query, args, callback) {
		let resultArray = [];
		for (let sceneID in this.sceneMap) {
			resultArray.push({
				id: this.sceneMap[sceneID].scene,
				name: Homey.__(this.sceneMap[sceneID].scene),
			});
		}
		// filter for query
		resultArray = resultArray.filter(result => {
			return result.name.toLowerCase().indexOf(query.toLowerCase()) > -1;
		});
		this.log(resultArray);
		return Promise.resolve(resultArray);
	}

	onButtonAutocomplete(query, args, callback) {
		let resultArray = [];
		for (let sceneID in this.buttonMap) {
			resultArray.push({
				id: this.buttonMap[sceneID].button,
				name: Homey.__(this.buttonMap[sceneID].button),
			});
		}

		// filter for query
		resultArray = resultArray.filter(result => {
			return result.name.toLowerCase().indexOf(query.toLowerCase()) > -1;
		});
		this.log(resultArray);
		return Promise.resolve(resultArray);
	}

}
