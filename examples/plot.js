[
    {
        "label": "Plots and ploplots",
        "widgets": [
            {
                "type": "fader",
                "id": "fader_1",
                "linkId": "",
                "label": "fader_1",
                "unit": "",
                "left": "auto",
                "top": "auto",
                "width": "auto",
                "height": 254,
                "horizontal": false,
                "css": "",
                "absolute": false,
                "range": {
                    "min": 0,
                    "max": 1
                },
                "logScale": false,
                "precision": 2,
                "path": "/fader_1",
                "target": []
            },
            {
                "type": "fader",
                "id": "fader_2",
                "linkId": "",
                "label": "fader_2",
                "unit": "",
                "left": "auto",
                "top": "auto",
                "width": "auto",
                "height": 253,
                "horizontal": false,
                "css": "",
                "absolute": false,
                "range": {
                    "min": 0,
                    "max": 1
                },
                "logScale": false,
                "precision": 2,
                "path": "/fader_2",
                "target": []
            },
            {
                "type": "fader",
                "id": "fader_3",
                "linkId": "",
                "label": "fader_3",
                "unit": "",
                "left": "auto",
                "top": "auto",
                "width": "auto",
                "height": 253,
                "horizontal": false,
                "css": "",
                "absolute": false,
                "range": {
                    "min": 0,
                    "max": 1
                },
                "logScale": false,
                "precision": 2,
                "path": "/fader_3",
                "target": []
            },
            {
                "type": "fader",
                "id": "fader_4",
                "linkId": "",
                "label": "fader_4",
                "unit": "",
                "left": "auto",
                "top": "auto",
                "width": "auto",
                "height": 256,
                "horizontal": false,
                "css": "",
                "absolute": false,
                "range": {
                    "min": 0,
                    "max": 1
                },
                "logScale": false,
                "precision": 2,
                "path": "/fader_4",
                "target": []
            },
            {
                "type": "plot",
                "id": "plot_1",
                "label": "plot (faders)",
                "left": 406,
                "top": 129,
                "width": "auto",
                "height": 124,
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
                "path": "/plot_1"
            },
            {
                "type": "visualizer",
                "left": 406,
                "top": 7,
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
                "path": "/visualizer_(fader_1)"
            },
            {
                "type": "rgb",
                "id": "rgb_1",
                "linkId": "",
                "label": "rgb_1",
                "left": 6,
                "top": 261,
                "width": "auto",
                "height": "auto",
                "css": "",
                "absolute": false,
                "precision": 0,
                "path": "/rgb_1",
                "split": false,
                "target": []
            },
            {
                "type": "plot",
                "left": 213,
                "top": 263,
                "width": 191,
                "height": 248,
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
                "path": "/plot_2"
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
                "label": "multifader_1",
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
                "css": ""
            },
            {
                "type": "plot",
                "id": "plot_3",
                "label": "plot (multifader)",
                "left": 0,
                "top": 228,
                "width": 553,
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
                "css": "z-index:1"
            },
            {
                "type": "multitoggle",
                "id": "multitoggle_1",
                "label": "mutlitoggle_1",
                "left": 552,
                "top": 0,
                "width": 209,
                "height": 228,
                "css": "",
                "precision": 2,
                "path": "/multifader_2",
                "target": [],
                "matrix": [
                    2,
                    2
                ],
                "on": 1,
                "off": 0
            },
            {
                "type": "plot",
                "left": 552,
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
                "path": "/plot_4"
            }
        ]
    },
    {
        "label": "Another plot",
        "widgets": [
            {
                "type": "plot",
                "id": "plot_5",
                "left": "auto",
                "top": "auto",
                "width": 612,
                "height": 309,
                "css": "",
                "rangeX": {
                    "min": 0,
                    "max": 5
                },
                "rangeY": {
                    "min": 0,
                    "max": 5
                },
                "logScaleX": false,
                "logScaleY": false,
                "path": "/plot_5",
                "label": "plot_5",
                "points": []
            },
            {
                "type": "visualizer",
                "id": "visualizer_1",
                "label": "visualizer_1",
                "left": "auto",
                "top": "auto",
                "width": "auto",
                "height": "auto",
                "css": "",
                "widgetId": "",
                "duration": 1,
                "range": {
                    "min": 0,
                    "max": 1
                },
                "logScale": false,
                "path": "/visualizer_1"
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
                "left": 0,
                "top": 0,
                "width": 569,
                "height": 300,
                "css": "z-index:8;opacity:0",
                "range": {
                    "min": 0,
                    "max": 1
                },
                "precision": 2,
                "target": [],
                "logScale": false,
                "id": "multifader_2",
                "label": "multifader_2",
                "path": "/multifader_2"
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
                "id": "plot_7"
            }
        ]
    }
]
