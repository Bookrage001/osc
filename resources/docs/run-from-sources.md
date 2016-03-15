## Run from sources

Running the app from the sources slightly differs from using built binaries : instead of running a binary, we'll launch the app with npm.

**Requirements**
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

```bash
$ sudo apt-get install npm  # install nodejs & npm
$ sudo npm install -g npm   # update npm
```


**Download**
 ```bash
$ git clone https://github.com/jean-emmanuel/open-stage-control
$ cd open-stage-control/
$ npm install --save-dev
 ```

**Run**
  ```bash
$ npm start [ -- options]

# A double hyphen ("--") is used here to tell npm that the following options are to be given to the app.
```
