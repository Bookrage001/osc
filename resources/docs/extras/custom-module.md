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
- `setInterval`: `function(function, delay)`


`sendOsc` and `receiveOsc` expect arguments formatted as follow:

- `address`: `string`
- `args`: `array` of `{type:"OSC_TYPE_LETTER", value:VALUE}` `objects`
- `host`: `string` ip address, valid hostname or `midi`
- `port`: `integer` port number or `string` midi device name
