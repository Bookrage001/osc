# Custom module

Using the `-c / --custom-module` command-line switch, users can load a javascript file to tune the way Open Stage Control behaves regarding osc.

It must be of the following form:

```js
(function(){

    // Do whatever you want, initialize some variables, declare some functions, ...

    return {
        init: function(){
            // this will be executed once when the osc server starts
        },
        oscInFilter:function(data){
            // Filter incomming osc messages

            var {address, args, host, port} = data

            // do what you want

            // address = string
            // args = array of {value, type} objects
            // host = string
            // port = integer

            // return data if you want the message to be processed
            return {address, args, host, port}

        },
        oscOutFilter:function(data){
            // Filter outgoing osc messages

            var {address, args, host, port} = data

            // same as oscInFilter

            // return data if you want the message to be and sent
            return {address, args, host, port}
        }
    }

})()

```

The module is executed in a restricted context, only a few globals are available :

- `console`: `object`
- `sendOsc`: `function({host, port, address, args})`
- `receiveOsc`: `function({host, port, address, args})`
- `send`: `function(host, port, address, arg1, arg2, ...)`
- `receive`: `function(host, port, address, arg1, arg2, ...)`
- `setTimeout`: `function(function, delay)`
- `clearTimeout`: `function(timeout)`
- `setInterval`: `function(function, delay)`
- `clearInterval`: `function(interval)`
- `settings.read`: `function(name)`, see [settings.js](https://github.com/jean-emmanuel/open-stage-control/blob/master/src/server/settings.js#L55-L103) for available options
- `app`: an [event emitter](https://nodejs.org/api/events.html#events_class_eventemitter) for monitoring the events sent by the different clients. Event names can be found in [callbacks.js](https://github.com/jean-emmanuel/open-stage-control/blob/master/src/server/callbacks.js), callbacks are called with 2 arguments: `data` (object) and `client` (object: `{address, id}`)
- `options`: `array` containing the extra options passed to `--custom-module` after the filename


`sendOsc` and `receiveOsc` expect arguments formatted as follow:

- `address`: `string`
- `args`: `array` of `{type: "OSC_TYPE_LETTER", value: VALUE}` `objects`
- `host`: `string` ip address, valid hostname or `midi`
- `port`: `integer` port number or `string` midi device name

`send` and `receive` are shorthands for `sendOsc` and `receiveOsc` that don't require args to be formatted as object (numbers are casted to floats by default):

```js
// calling
send('127.0.0.1', 5555, '/test' 1, 2, {type: 'i', value: 3})

// equals
sendOsc({
    host: '127.0.0.1',
    port: 5555,
    address: '/test',
    args: [
        {type: 'f', value: 1},
        {type: 'f', value: 2},
        {type: 'i', value: 3},
    ]
})
```
