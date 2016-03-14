[
    {
        "label": "Unnamed",
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
                "height": "auto",
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
                "height": "auto",
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
                "height": "auto",
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
                "height": "auto",
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
                "label": "plot_1",
                "left": 406,
                "top": 215,
                "width": "auto",
                "height": "auto",
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
                "height": "auto",
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
            }
        ]
    }
]