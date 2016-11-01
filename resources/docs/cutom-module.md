# Custom module

Using the `-c / --custom-module` command-line switch, users can load a javascript file to tune the way Open Stage Control behaves regarding osc.

It must be of the following form:

```js
(function(){

    // Do whatever you want, initialize some variables, declare some functions, ...

    return {
        oscInFilter:function(data){
            // Filter incomming osc messages

            var {address, args, host, port} = data

            // do what you want

            // return data if you want the message to be processed
            return data

        },
        oscOutFilter:function(data){
            // Filter outgoing osc messages

            // same as oscInFilter

            // return data if you want the message to be and sent
            return data
        }
    }

})()

```

The module is executed in a restricted context, only a few globals are available :

- `console`: `object`
- `sendOsc`: `function({address, args, host, port})`
- `receiveOsc`: `function({address, args, host, port})`
