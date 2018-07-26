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
- `sendOsc`: `function({address, args, host, port})`
- `receiveOsc`: `function({address, args, host, port})`
- `setTimeout`: `function(function, delay)`
- `clearTimeout`: `function(timeout)`
- `setInterval`: `function(function, delay)`
- `clearInterval`: `function(interval)`
- `settings.read`: `function(name)`, see [settings.js](https://github.com/jean-emmanuel/open-stage-control/blob/master/app/main/settings.js#L125-L162) for available options
- `app`: an [event emitter](https://nodejs.org/api/events.html#events_class_eventemitter) for monitoring the events sent by the different clients. Event names can be found in [callbacks.js](https://github.com/jean-emmanuel/open-stage-control/blob/master/app/main/callbacks.js), callbacks are called with 2 arguments: `data` (object) and `clientId` (string)


`sendOsc` and `receiveOsc` expect arguments formatted as follow:

- `address`: `string`
- `args`: `array` of `{type:"OSC_TYPE_LETTER", value:VALUE}` `objects`
- `host`: `string` ip address, valid hostname or `midi`
- `port`: `integer` port number or `string` midi device name
