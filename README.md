# You Smile You Lose

We show you funny videos. If you smile, you lose!

 [https://smilelose.socialcase.fr/](https://smilelose.socialcase.fr)

## Install

``` bash
npm install
```

## Configuration

### SSL

In order to load models and to launch camera locally, you'll need to install a self-signed certificate.

``` bash
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365
```

When a passphrase is asked just type : **default**

### Loading model URL

In localhost, you need to set the configuration of your local URL for the models to load: see **loadModels function** in **src/js/app.js**

You will also need to configure webpack dev server in https: https://webpack.js.org/configuration/dev-server/#devserverhttps

## Launch

### Dev

``` bash
npm run dev
```

### Prod

``` bash
npm run build
```

*Project was inspired by [yousmileyoulose](https://github.com/jesuisundev/yousmileyoulose)*
