const fetch = require('node-fetch');

exports.createSandboxAccount = async function createSandboxAccount(lvlup) {
    const url = lvlup.url;
    const path = '/v4/sandbox/account/new';

    const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
    };

    const res = await fetch(`${url}${path}`, options);
    if(res.status !== 200) return {statusCode: res.status, statusText: res.statusText, source: `${url}${path}`};

    let json;
    try {
        json = await res.json();
    } catch {
        return {statusCode: res.status, statusText: res.statusText, source: `${url}${path}`};
    }

    json.statusCode = res.status;
    json.statusText = res.statusText;
    json.source = `${url}${path}`;
    return json;
}