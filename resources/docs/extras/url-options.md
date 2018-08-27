# URL Options

Client specific options can be set by adding query parameters to the server's url. One must prepend the url with a question mark (`?`) followed by `parameter=value` pairs separated with ampersands (`&`).


| Option | Value | Default | Description |
|----|----|----|----|
| hdpi | 1 / 0 | 0 | enable high resolution canvas |
| forceHdpi | number | 0 | force canvas scaling (ignore `hdpi`) |
| doubletab | number | 375 | sets the double tap/click time thershold in milliseconds |
| zoom | number | 1 | sets the initial zoom |
| framerate | number | 60 | limit canvas drawing framerate |
| lang | string | *system_default* | use a different language than the default if available (2-letters code such as "en") |

Example:

`http://server-ip:port?hdpi=1`


!!! note ""
    When using the built-in client, url options can be set through the `--url-options` switch.

    Example: `open-stage-control --url-options zoom=2 doubletap=200`
