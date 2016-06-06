[
    {
        "label": "Plots and ploplots",
        "widgets": [
            {
                "type": "fader",
                "id": "fader_1",
                "linkId": "",
                "label": "auto",
                "unit": "",
                "left": "auto",
                "top": "auto",
                "width": 100,
                "height": 254,
                "horizontal": true,
                "css": "",
                "range": {
                    "min": 0,
                    "max": 1
                },
                "logScale": false,
                "precision": 2,
                "path": "/fader_1",
                "target": [],
                "meter": true,
                "noPip": false,
                "compact": false,
                "color": "auto",
                "snap": false,
                "preArgs": [],
                "alignRight": false
            },
            {
                "type": "fader",
                "id": "fader_1/meter",
                "linkId": "",
                "label": "auto",
                "unit": "",
                "left": "auto",
                "top": "auto",
                "width": 90,
                "height": 253,
                "horizontal": false,
                "css": "",
                "range": {
                    "min": 0,
                    "max": 1
                },
                "logScale": false,
                "precision": 2,
                "path": "/fader_2",
                "target": [],
                "meter": false,
                "noPip": false,
                "compact": false,
                "color": "auto",
                "snap": false,
                "preArgs": [],
                "alignRight": false
            },
            {
                "type": "fader",
                "id": "fader_3",
                "linkId": "",
                "label": "auto",
                "unit": "",
                "left": "auto",
                "top": "auto",
                "width": 90,
                "height": 253,
                "horizontal": false,
                "css": "",
                "range": {
                    "min": 0,
                    "max": 1
                },
                "logScale": false,
                "precision": 2,
                "path": "/fader_3",
                "target": [],
                "meter": false,
                "noPip": false,
                "compact": false,
                "color": "auto",
                "snap": false,
                "preArgs": [],
                "alignRight": false
            },
            {
                "type": "fader",
                "id": "fader_4",
                "linkId": "",
                "label": "auto",
                "unit": "",
                "left": "auto",
                "top": "auto",
                "width": "auto",
                "height": 253,
                "horizontal": false,
                "css": "",
                "range": {
                    "min": 0,
                    "max": 1
                },
                "logScale": false,
                "precision": 2,
                "path": "/fader_4",
                "target": [],
                "meter": false,
                "noPip": false,
                "compact": false,
                "color": "auto",
                "snap": false,
                "preArgs": [],
                "alignRight": false
            },
            {
                "type": "plot",
                "id": "plot_1",
                "label": "plot (faders)",
                "left": 400,
                "top": 122,
                "width": 200,
                "height": 131,
                "css": "",
                "points": [
                    [
                        0,
                        "fader_1"
                    ],
                    [
                        0.25,
                        "fader_2"
                    ],
                    [
                        0.75,
                        "fader_3"
                    ],
                    [
                        1,
                        "fader_4"
                    ]
                ],
                "rangeX": {
                    "min": 0,
                    "max": 1
                },
                "rangeY": {
                    "min": 0,
                    "max": 1
                },
                "logScaleX": false,
                "logScaleY": false,
                "path": "/plot_1",
                "color": "auto",
                "preArgs": []
            },
            {
                "type": "visualizer",
                "left": 400,
                "top": 0,
                "width": "auto",
                "height": 122,
                "css": "",
                "id": "visualizer_(fader_1)",
                "widgetId": "fader_1",
                "duration": 1,
                "range": {
                    "min": 0,
                    "max": 1
                },
                "logScale": false,
                "label": "visualizer (fader1)",
                "path": "/visualizer_(fader_1)",
                "color": "auto",
                "preArgs": []
            },
            {
                "type": "rgb",
                "id": "rgb_1",
                "linkId": "",
                "label": "auto",
                "left": 0,
                "top": 254,
                "width": "auto",
                "height": "auto",
                "css": "",
                "precision": 0,
                "path": "/rgb_1",
                "split": false,
                "target": [],
                "snap": false,
                "preArgs": []
            },
            {
                "type": "plot",
                "left": 200,
                "top": 253,
                "width": 400,
                "height": 251,
                "css": "",
                "points": "rgb_1",
                "rangeX": {
                    "min": 0,
                    "max": 1
                },
                "rangeY": {
                    "min": 0,
                    "max": 255
                },
                "logScaleX": false,
                "logScaleY": false,
                "id": "plot_2",
                "label": "plot_2 (rgb)",
                "path": "/plot_2",
                "color": "auto",
                "preArgs": []
            },
            {
                "type": "meter",
                "top": 547,
                "left": 93,
                "id": "meter_1",
                "label": "auto",
                "unit": "",
                "width": 411,
                "height": 220,
                "horizontal": false,
                "color": "auto",
                "css": "",
                "range": {
                    "min": 0,
                    "max": 1
                },
                "logScale": false,
                "path": "/meter_1",
                "preArgs": []
            },
            {
                "type": "fader",
                "id": "fader_1",
                "linkId": "",
                "label": "auto",
                "unit": "",
                "left": "auto",
                "top": "auto",
                "width": 100,
                "height": 254,
                "horizontal": true,
                "css": "",
                "range": {
                    "min": 0,
                    "max": 1
                },
                "logScale": false,
                "precision": 2,
                "path": "/fader_1",
                "target": [],
                "meter": true,
                "noPip": false,
                "compact": true,
                "color": "auto",
                "snap": false,
                "preArgs": [],
                "alignRight": false
            }
        ]
    },
    {
        "label": "Multifader plot !",
        "widgets": [
            {
                "type": "multifader",
                "id": "multifader_1",
                "strips": 10,
                "label": "auto",
                "unit": "",
                "left": 0,
                "top": 0,
                "width": 557,
                "height": 228,
                "range": {
                    "min": 0,
                    "max": 1
                },
                "precision": 2,
                "path": "/multifader_1",
                "target": [],
                "logScale": false,
                "css": "",
                "color": "auto",
                "compact": false,
                "preArgs": []
            },
            {
                "type": "plot",
                "id": "plot_3",
                "label": "plot (multifader)",
                "left": 0,
                "top": 228,
                "width": 557,
                "height": 220,
                "points": "multifader_1",
                "rangeX": {
                    "min": 0,
                    "max": 1
                },
                "rangeY": {
                    "min": 0,
                    "max": 1
                },
                "logScaleX": false,
                "logScaleY": false,
                "path": "/plot_3",
                "css": "z-index:1",
                "color": "auto",
                "preArgs": []
            },
            {
                "type": "multitoggle",
                "id": "multitoggle_1",
                "label": "auto",
                "left": 557,
                "top": 0,
                "width": 209,
                "height": 229,
                "css": "",
                "precision": 2,
                "path": "/multifader_2",
                "target": [],
                "matrix": [
                    2,
                    2
                ],
                "on": 1,
                "off": 0,
                "color": "auto",
                "preArgs": []
            },
            {
                "type": "plot",
                "left": 557,
                "top": 228,
                "width": 209,
                "height": 220,
                "css": "",
                "label": "plot (toggles)",
                "points": "multitoggle_1",
                "rangeX": {
                    "min": 0,
                    "max": 1
                },
                "rangeY": {
                    "min": 0,
                    "max": 1
                },
                "logScaleX": false,
                "logScaleY": false,
                "id": "plot_4",
                "path": "/plot_4",
                "color": "auto",
                "preArgs": []
            }
        ]
    },
    {
        "label": "Hacking",
        "widgets": [
            {
                "type": "multifader",
                "strips": 10,
                "unit": "",
                "left": 6,
                "top": 17,
                "width": 564,
                "height": 267,
                "css": "z-index:8;opacity:0",
                "range": {
                    "min": 0,
                    "max": 1
                },
                "precision": 2,
                "target": [],
                "logScale": false,
                "id": "multifader_2",
                "label": "auto",
                "path": "/multifader_2",
                "color": "auto",
                "compact": false,
                "preArgs": []
            },
            {
                "type": "plot",
                "left": 16,
                "top": 41,
                "width": 541,
                "height": 220,
                "points": "multifader_2",
                "rangeX": {
                    "min": 0,
                    "max": 1
                },
                "rangeY": {
                    "min": 0,
                    "max": 1
                },
                "logScaleX": false,
                "logScaleY": false,
                "css": "z-index:1",
                "label": "There is a transparent multifader above this plot, just touch it... incredible, isn't it ?",
                "path": "/plot_6",
                "id": "plot_7",
                "color": "auto",
                "preArgs": []
            }
        ]
    }
]