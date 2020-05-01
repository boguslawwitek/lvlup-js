const fetch = require('node-fetch');

exports.basicRequest = async function basicRequest(lvlup, address, optional) {
    const url = lvlup.url;

    const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${lvlup.apiKey}`
        },
    };

    let path;
    if(optional) path = `${address}${optional}`;
    else path = `${address}`;
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

exports.vpsUdpFilterWhitelist = async function vpsUdpFilterWhitelist(lvlup, address, optional) {
    let resObject = {};
    const url = lvlup.url;

    const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${lvlup.apiKey}`
        },
    };

    let path;
    if(optional) path = `${address}${optional}`;
    else path = `${address}`;
    const res = await fetch(`${url}${path}`, options);
    if(res.status !== 200) return {statusCode: res.status, statusText: res.statusText, source: `${url}${path}`};

    let json;
    try {
        json = await res.json();
    } catch {
        return {statusCode: res.status, statusText: res.statusText, source: `${url}${path}`};
    }

    resObject.array = json;
    resObject.status = {statusCode: res.status, statusText: res.statusText, source: `${url}${path}`};

    return resObject;
} 

exports.basicRequestWithoutAuth = async function basicRequestWithoutAuth(lvlup, address, optional) {
    const url = lvlup.url;

    const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
    };

    if(optional) path = `${address}${optional}`;
    else path = `${address}`;
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

exports.basicRequestWithParameter = async function basicRequestWithParameter(lvlup, parameter, address) {
    const url = lvlup.url;
    let path = address;

    if(parameter && typeof parameter !== 'object') {
        console.log('Invalid argument!');
        return;
    } else if(parameter) {
        const length = Object.keys(parameter).length;
        if(length !== 1) return;
        let option;
        if(parameter.hasOwnProperty('limit')) option = 'limit';
        else if(parameter.hasOwnProperty('afterId')) option = 'afterId';
        else if(parameter.hasOwnProperty('beforeId')) option = 'beforeId';
        else {
            console.log('Invalid argument!');
            return;
        }
        if(!(Number.isInteger(parameter[option]) && parameter[option] > -1)) {
            console.log('limit or afterId or beforeId must be a positive number!');
            return;
        }

        path = `${path}?${option}=${parameter[option]}`;
    }

    const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${lvlup.apiKey}`
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

exports.getVpsState = async function getVpsState(lvlup, vpsId) {
    const url = lvlup.url;

    if(!vpsId) {
        console.log('Invalid argument!');
        return;
    } else if(typeof vpsId !== 'string') {
        console.log('Invalid argument!');
        return;
    }

    const path = `/v4/services/vps/${vpsId}/stats`;

    const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${lvlup.apiKey}`
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

    let totalSeconds = json.vmUptimeS;
    days = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;
    hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    minutes = Math.floor(totalSeconds / 60);
    seconds = totalSeconds % 60;

    json.statusCode = res.status;
    json.statusText = res.statusText;
    json.source = `${url}${path}`;
    json.upTime = {days, hours, minutes, seconds};

    return json;
}