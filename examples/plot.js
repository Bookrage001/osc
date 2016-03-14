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
                "logScaleY": false
            },
            {
                "type": "visualizer",
                "left": 406,
                "top": 7,
                "width": "auto",
                "height": 122,
                "css": "",
                "id": "visualizer_(fader_1)",
                "curve": "fader_1",
                "duration": 1,
                "range": {
                    "min": 0,
                    "max": 1
                },
                "logScale": false,
                "label": "visualizer (fader1)"
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
                "label": "plot_2 (rgb)"
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
                "width": 552,
                "height": 228,
                "css": "",
                "range": {
                    "min": 0,
                    "max": 1
                },
                "precision": 2,
                "path": "/multifader_1",
                "target": [],
                "logScale": false
            },
            {
                "type": "plot",
                "id": "plot_3",
                "label": "plot (multifader)",
                "left": 0,
                "top": 228,
                "width": 552,
                "height": 220,
                "css": "",
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
                "logScaleY": false
            }
        ]
    }
]