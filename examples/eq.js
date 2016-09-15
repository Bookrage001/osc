[
    {
        "label": "Unnamed",
        "widgets": [
            {
                "type": "panel",
                "top": 0,
                "left": 0,
                "id": "panel_1",
                "label": "Equalizer",
                "width": 600,
                "height": 620,
                "scroll": false,
                "color": "auto",
                "css": "",
                "widgets": [
                    {
                        "type": "eq",
                        "top": 0,
                        "left": 0,
                        "id": "eq_1",
                        "label": false,
                        "width": "100%",
                        "height": 210,
                        "color": "auto",
                        "css": "",
                        "filters": [
                            {
                                "type": "highpass",
                                "freq": "eq_freq_1",
                                "q": "eq_q_1",
                                "on": "eq_on_1"
                            },
                            {
                                "type": "lowshelf",
                                "freq": "eq_freq_2",
                                "gain": "eq_gain_2",
                                "on": "eq_on_2"
                            },
                            {
                                "type": "eq_type_3",
                                "freq": "eq_freq_3",
                                "q": "eq_q_3",
                                "gain": "eq_gain_3",
                                "on": "eq_on_3"
                            },
                            {
                                "type": "eq_type_4",
                                "freq": "eq_freq_4",
                                "q": "eq_q_4",
                                "gain": "eq_gain_4",
                                "on": "eq_on_4"
                            },
                            {
                                "type": "highshelf",
                                "freq": "eq_freq_5",
                                "gain": "eq_gain_5",
                                "on": "eq_on_5"
                            },
                            {
                                "type": "lowpass",
                                "freq": "eq_freq_6",
                                "q": "eq_q_6",
                                "on": "eq_on_6"
                            }
                        ],
                        "rangeY": {
                            "min": -20,
                            "max": 20
                        },
                        "logScaleX": true,
                        "path": "/eq_1",
                        "preArgs": [],
                        "resolution": 512
                    },
                    {
                        "id": "Band 1",
                        "type": "strip",
                        "label": "Highpass",
                        "widgets": [
                            {
                                "id": "eq_on_1",
                                "type": "toggle",
                                "label": "ON",
                                "target": [
                                    "SCSon:6671"
                                ],
                                "path": "/strip/MxKicks/4-band%20parametric%20filter/Section%201/unscaled1",
                                "width": "auto",
                                "height": 50,
                                "color": "auto",
                                "css": "",
                                "precision": 2,
                                "preArgs": [],
                                "linkId": "",
                                "on": 1,
                                "off": 0
                            },
                            {
                                "id": "eq_freq_1",
                                "label": "Frequency",
                                "type": "fader",
                                "range": {
                                    "min": 20,
                                    "max": 22050
                                },
                                "target": [
                                    "SCSon:6671"
                                ],
                                "path": "/strip/MxKicks/4-band%20parametric%20filter/Frequency%201/unscaled",
                                "unit": "Hz",
                                "width": "auto",
                                "height": 70,
                                "color": "auto",
                                "noPip": false,
                                "compact": true,
                                "css": "",
                                "snap": false,
                                "logScale": false,
                                "precision": 2,
                                "preArgs": [],
                                "linkId": "",
                                "alignRight": false,
                                "horizontal": true,
                                "meter": false
                            },
                            {
                                "id": "eq_q_1",
                                "label": "Q",
                                "type": "fader",
                                "range": {
                                    "min": 0.125,
                                    "max": 8
                                },
                                "target": [
                                    "SCSon:6671"
                                ],
                                "path": "/strip/MxKicks/4-band%20parametric%20filter/Bandwidth%201/unscaled1",
                                "unit": "",
                                "width": "auto",
                                "height": 70,
                                "color": "auto",
                                "noPip": false,
                                "compact": true,
                                "css": "",
                                "snap": false,
                                "logScale": false,
                                "precision": 2,
                                "preArgs": [],
                                "linkId": "",
                                "alignRight": false,
                                "horizontal": true,
                                "meter": false
                            }
                        ],
                        "left": 0,
                        "top": 210,
                        "width": "auto",
                        "height": 375,
                        "horizontal": false,
                        "color": "auto",
                        "css": ""
                    },
                    {
                        "id": "Band 2",
                        "type": "strip",
                        "label": "Lowshelf",
                        "widgets": [
                            {
                                "id": "eq_on_2",
                                "type": "toggle",
                                "label": "ON",
                                "target": [
                                    "SCSon:6671"
                                ],
                                "path": "/strip/MxKicks/4-band%20parametric%20filter/Section%201/unscaled1",
                                "width": "auto",
                                "height": 50,
                                "color": "auto",
                                "css": "",
                                "precision": 2,
                                "preArgs": [],
                                "on": 1,
                                "off": 0,
                                "linkId": ""
                            },
                            {
                                "id": "eq_freq_2",
                                "label": "Frequency",
                                "type": "fader",
                                "range": {
                                    "min": 20,
                                    "max": 22050
                                },
                                "target": [
                                    "SCSon:6671"
                                ],
                                "path": "/strip/MxKicks/4-band%20parametric%20filter/Frequency%201/unscaled1",
                                "unit": "Hz",
                                "width": "auto",
                                "height": 70,
                                "color": "auto",
                                "noPip": false,
                                "compact": true,
                                "css": "",
                                "snap": false,
                                "logScale": false,
                                "precision": 2,
                                "preArgs": [],
                                "alignRight": false,
                                "horizontal": true,
                                "meter": false,
                                "linkId": ""
                            },
                            {
                                "id": "eq_q_2",
                                "label": "Q",
                                "type": "fader",
                                "range": {
                                    "min": 0.125,
                                    "max": 8
                                },
                                "target": [
                                    "SCSon:6671"
                                ],
                                "path": "/strip/MxKicks/4-band%20parametric%20filter/Bandwidth%201/unscaled2",
                                "unit": "",
                                "width": "auto",
                                "height": 70,
                                "color": "auto",
                                "noPip": false,
                                "compact": true,
                                "css": "",
                                "snap": false,
                                "logScale": false,
                                "precision": 2,
                                "preArgs": [],
                                "alignRight": false,
                                "horizontal": true,
                                "meter": false,
                                "linkId": ""
                            },
                            {
                                "id": "eq_gain_2",
                                "label": "Gain",
                                "type": "fader",
                                "range": {
                                    "min": -20,
                                    "max": 20
                                },
                                "target": [
                                    "SCSon:6671"
                                ],
                                "path": "/strip/MxKicks/4-band%20parametric%20filter/Gain%201/unscaled2",
                                "unit": "dB",
                                "height": 70,
                                "color": "auto",
                                "noPip": false,
                                "compact": true,
                                "css": "",
                                "snap": false,
                                "logScale": false,
                                "precision": 2,
                                "preArgs": [],
                                "alignRight": false,
                                "horizontal": true,
                                "meter": false,
                                "linkId": "",
                                "width": "auto"
                            }
                        ],
                        "left": 100,
                        "top": 210,
                        "width": "auto",
                        "height": 375,
                        "horizontal": false,
                        "color": "auto",
                        "css": ""
                    },
                    {
                        "id": "Band 3",
                        "type": "strip",
                        "label": "auto",
                        "widgets": [
                            {
                                "id": "eq_on_3",
                                "type": "toggle",
                                "label": "ON",
                                "target": [
                                    "SCSon:6671"
                                ],
                                "path": "/strip/MxKicks/4-band%20parametric%20filter/Section%201/unscaled1",
                                "width": "auto",
                                "height": 50,
                                "color": "auto",
                                "css": "",
                                "precision": 2,
                                "preArgs": [],
                                "on": 1,
                                "off": 0,
                                "linkId": ""
                            },
                            {
                                "id": "eq_freq_3",
                                "label": "Frequency",
                                "type": "fader",
                                "range": {
                                    "min": 20,
                                    "max": 22050
                                },
                                "target": [
                                    "SCSon:6671"
                                ],
                                "path": "/strip/MxKicks/4-band%20parametric%20filter/Frequency%201/unscaled2",
                                "unit": "Hz",
                                "width": "auto",
                                "height": 70,
                                "color": "auto",
                                "noPip": false,
                                "compact": true,
                                "css": "",
                                "snap": false,
                                "logScale": false,
                                "precision": 2,
                                "preArgs": [],
                                "alignRight": false,
                                "horizontal": true,
                                "meter": false,
                                "linkId": ""
                            },
                            {
                                "id": "eq_q_3",
                                "label": "Q",
                                "type": "fader",
                                "range": {
                                    "min": 0.125,
                                    "max": 8
                                },
                                "target": [
                                    "SCSon:6671"
                                ],
                                "path": "/strip/MxKicks/4-band%20parametric%20filter/Bandwidth%201/unscaled3",
                                "unit": "",
                                "width": "auto",
                                "height": 70,
                                "color": "auto",
                                "noPip": false,
                                "compact": true,
                                "css": "",
                                "snap": false,
                                "logScale": false,
                                "precision": 2,
                                "preArgs": [],
                                "alignRight": false,
                                "horizontal": true,
                                "meter": false,
                                "linkId": ""
                            },
                            {
                                "id": "eq_gain_3",
                                "label": "Gain",
                                "type": "fader",
                                "range": {
                                    "min": -20,
                                    "max": 20
                                },
                                "target": [
                                    "SCSon:6671"
                                ],
                                "path": "/strip/MxKicks/4-band%20parametric%20filter/Gain%201/unscaled3",
                                "unit": "dB",
                                "height": 70,
                                "color": "auto",
                                "noPip": false,
                                "compact": true,
                                "css": "",
                                "snap": false,
                                "logScale": false,
                                "precision": 2,
                                "preArgs": [],
                                "alignRight": false,
                                "horizontal": true,
                                "meter": false,
                                "linkId": "",
                                "width": "auto"
                            },
                            {
                                "type": "switch",
                                "id": "eq_type_3",
                                "label": "Mode",
                                "width": "auto",
                                "height": 79,
                                "horizontal": true,
                                "color": "auto",
                                "css": "",
                                "precision": 2,
                                "path": "/fader_3",
                                "preArgs": [],
                                "target": [],
                                "values": {
                                    "notch": "notch",
                                    "peak": "peak"
                                },
                                "linkId": ""
                            }
                        ],
                        "left": 200,
                        "top": 210,
                        "width": "auto",
                        "height": 375,
                        "horizontal": false,
                        "color": "auto",
                        "css": ""
                    },
                    {
                        "id": "Band 4",
                        "type": "strip",
                        "label": "auto",
                        "widgets": [
                            {
                                "id": "eq_on_4",
                                "type": "toggle",
                                "label": "ON",
                                "target": [
                                    "SCSon:6671"
                                ],
                                "path": "/strip/MxKicks/4-band%20parametric%20filter/Section%201/unscaled1",
                                "width": "auto",
                                "height": 50,
                                "color": "auto",
                                "css": "",
                                "precision": 2,
                                "preArgs": [],
                                "on": 1,
                                "off": 0,
                                "linkId": ""
                            },
                            {
                                "id": "eq_freq_4",
                                "label": "Frequency",
                                "type": "fader",
                                "range": {
                                    "min": 20,
                                    "max": 22050
                                },
                                "target": [
                                    "SCSon:6671"
                                ],
                                "path": "/strip/MxKicks/4-band%20parametric%20filter/Frequency%201/unscaled3",
                                "unit": "Hz",
                                "width": "auto",
                                "height": 70,
                                "color": "auto",
                                "noPip": false,
                                "compact": true,
                                "css": "",
                                "snap": false,
                                "logScale": false,
                                "precision": 2,
                                "preArgs": [],
                                "alignRight": false,
                                "horizontal": true,
                                "meter": false,
                                "linkId": ""
                            },
                            {
                                "id": "eq_q_4",
                                "label": "Q",
                                "type": "fader",
                                "range": {
                                    "min": 0.125,
                                    "max": 8
                                },
                                "target": [
                                    "SCSon:6671"
                                ],
                                "path": "/strip/MxKicks/4-band%20parametric%20filter/Bandwidth%201/unscaled4",
                                "unit": "",
                                "width": "auto",
                                "height": 70,
                                "color": "auto",
                                "noPip": false,
                                "compact": true,
                                "css": "",
                                "snap": false,
                                "logScale": false,
                                "precision": 2,
                                "preArgs": [],
                                "alignRight": false,
                                "horizontal": true,
                                "meter": false,
                                "linkId": ""
                            },
                            {
                                "id": "eq_gain_4",
                                "label": "Gain",
                                "type": "fader",
                                "range": {
                                    "min": -20,
                                    "max": 20
                                },
                                "target": [
                                    "SCSon:6671"
                                ],
                                "path": "/strip/MxKicks/4-band%20parametric%20filter/Gain%201/unscaled4",
                                "unit": "dB",
                                "height": 70,
                                "color": "auto",
                                "noPip": false,
                                "compact": true,
                                "css": "",
                                "snap": false,
                                "logScale": false,
                                "precision": 2,
                                "preArgs": [],
                                "alignRight": false,
                                "horizontal": true,
                                "meter": false,
                                "linkId": "",
                                "width": "auto"
                            },
                            {
                                "type": "switch",
                                "id": "eq_type_4",
                                "label": "Mode",
                                "width": "auto",
                                "height": 79,
                                "horizontal": true,
                                "color": "auto",
                                "css": "",
                                "precision": 2,
                                "path": "/fader_4",
                                "preArgs": [],
                                "target": [],
                                "values": {
                                    "notch": "notch",
                                    "peak": "peak"
                                },
                                "linkId": ""
                            }
                        ],
                        "left": 300,
                        "top": 210,
                        "width": "auto",
                        "height": 375,
                        "horizontal": false,
                        "color": "auto",
                        "css": ""
                    },
                    {
                        "id": "Band 5",
                        "type": "strip",
                        "label": "Highshelf",
                        "widgets": [
                            {
                                "id": "eq_on_5",
                                "type": "toggle",
                                "label": "ON",
                                "target": [
                                    "SCSon:6671"
                                ],
                                "path": "/strip/MxKicks/4-band%20parametric%20filter/Section%201/unscaled1",
                                "width": "auto",
                                "height": 50,
                                "color": "auto",
                                "css": "",
                                "precision": 2,
                                "preArgs": [],
                                "on": 1,
                                "off": 0,
                                "linkId": ""
                            },
                            {
                                "id": "eq_freq_5",
                                "label": "Frequency",
                                "type": "fader",
                                "range": {
                                    "min": 10000,
                                    "max": 22050
                                },
                                "target": [
                                    "SCSon:6671"
                                ],
                                "path": "/strip/MxKicks/4-band%20parametric%20filter/Frequency%201/unscaled4",
                                "unit": "Hz",
                                "width": "auto",
                                "height": 70,
                                "color": "auto",
                                "noPip": false,
                                "compact": true,
                                "css": "",
                                "snap": false,
                                "logScale": false,
                                "precision": 2,
                                "preArgs": [],
                                "alignRight": false,
                                "horizontal": true,
                                "meter": false,
                                "linkId": ""
                            },
                            {
                                "id": "eq_q_5",
                                "label": "Q",
                                "type": "fader",
                                "range": {
                                    "min": 0.125,
                                    "max": 8
                                },
                                "target": [
                                    "SCSon:6671"
                                ],
                                "path": "/strip/MxKicks/4-band%20parametric%20filter/Bandwidth%201/unscaled5",
                                "unit": "",
                                "width": "auto",
                                "height": 70,
                                "color": "auto",
                                "noPip": false,
                                "compact": true,
                                "css": "",
                                "snap": false,
                                "logScale": false,
                                "precision": 2,
                                "preArgs": [],
                                "alignRight": false,
                                "horizontal": true,
                                "meter": false,
                                "linkId": ""
                            },
                            {
                                "id": "eq_gain_5",
                                "label": "Gain",
                                "type": "fader",
                                "range": {
                                    "min": -20,
                                    "max": 20
                                },
                                "target": [
                                    "SCSon:6671"
                                ],
                                "path": "/strip/MxKicks/4-band%20parametric%20filter/Gain%201/unscaled5",
                                "unit": "dB",
                                "height": 70,
                                "color": "auto",
                                "noPip": false,
                                "compact": true,
                                "css": "",
                                "snap": false,
                                "logScale": false,
                                "precision": 2,
                                "preArgs": [],
                                "alignRight": false,
                                "horizontal": true,
                                "meter": false,
                                "linkId": "",
                                "width": "auto"
                            }
                        ],
                        "left": 400,
                        "top": 210,
                        "width": "auto",
                        "height": 375,
                        "horizontal": false,
                        "color": "auto",
                        "css": ""
                    },
                    {
                        "id": "Band 6",
                        "type": "strip",
                        "label": "Lowpass",
                        "widgets": [
                            {
                                "id": "eq_on_6",
                                "type": "toggle",
                                "label": "ON",
                                "target": [
                                    "SCSon:6671"
                                ],
                                "path": "/strip/MxKicks/4-band%20parametric%20filter/Section%201/unscaled1",
                                "width": "auto",
                                "height": 50,
                                "color": "auto",
                                "css": "",
                                "precision": 2,
                                "preArgs": [],
                                "on": 1,
                                "off": 0,
                                "linkId": ""
                            },
                            {
                                "id": "eq_freq_6",
                                "label": "Frequency",
                                "type": "fader",
                                "range": {
                                    "min": 10000,
                                    "max": 22050
                                },
                                "target": [
                                    "SCSon:6671"
                                ],
                                "path": "/strip/MxKicks/4-band%20parametric%20filter/Frequency%201/unscaled5",
                                "unit": "Hz",
                                "width": "auto",
                                "height": 70,
                                "color": "auto",
                                "noPip": false,
                                "compact": true,
                                "css": "",
                                "snap": false,
                                "logScale": false,
                                "precision": 2,
                                "preArgs": [],
                                "alignRight": false,
                                "horizontal": true,
                                "meter": false,
                                "linkId": ""
                            },
                            {
                                "id": "eq_q_6",
                                "label": "Q",
                                "type": "fader",
                                "range": {
                                    "min": 0.125,
                                    "max": 8
                                },
                                "target": [
                                    "SCSon:6671"
                                ],
                                "path": "/strip/MxKicks/4-band%20parametric%20filter/Bandwidth%201/unscaled6",
                                "unit": "",
                                "width": "auto",
                                "height": 70,
                                "color": "auto",
                                "noPip": false,
                                "compact": true,
                                "css": "",
                                "snap": false,
                                "logScale": false,
                                "precision": 2,
                                "preArgs": [],
                                "alignRight": false,
                                "horizontal": true,
                                "meter": false,
                                "linkId": ""
                            }
                        ],
                        "left": 500,
                        "top": 210,
                        "width": "auto",
                        "height": 375,
                        "horizontal": false,
                        "color": "auto",
                        "css": ""
                    }
                ],
                "tabs": []
            }
        ]
    }
]