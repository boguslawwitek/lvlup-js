# LVLUP-JS

**A very simple JavaScript library for [api.lvlup.pro/v4](https://api.lvlup.pro/v4) and [api.sandbox.lvlup.pro/v4](https://api.sandbox.lvlup.pro/v4).**

------

## Installation
```plain
npm i lvlup-js -S
```

## Example #1 (Production) 
```javascript
const LvlupApi = require('lvlup-js');
const lvlup = new LvlupApi('API-KEY');

(async () => {
    const linkForPayment = await lvlup.createPayment('32', 'https://example.site/redirect', 'https://example.site/webhook');
    console.log(linkForPayment);
})()
```

## Example #2 (Sandbox)
```javascript
const LvlupApi = require('lvlup-js');
const lvlup = new LvlupApi('API-KEY', {env: 'sandbox'});

(async () => {
    const linkForPayment = await lvlup.createPayment('32', 'https://example.site/redirect', 'https://example.site/webhook');
    console.log(linkForPayment);
})()
```

## License
[MIT](https://github.com/boguslawwitek/lvlup-js/blob/master/LICENSE)

## Links
[LVLUP-JS Documentation](https://bwitek.dev/lvlup-js)<br>
[GitHub Repository](https://github.com/boguslawwitek/lvlup-js)<br>
[npm package](https://www.npmjs.com/package/lvlup-js)

## Author
Bogusław Witek