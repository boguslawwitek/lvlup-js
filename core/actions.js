const fetch = require('node-fetch');

exports.sandboxAcceptPayment = async function sandboxAcceptPayment(lvlup, path) {
    const url = lvlup.url;

    const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${lvlup.apiKey}`
        },
    };

    const res = await fetch(`${url}${path}`, options);
    if(res.status !== 200) return {statusCode: res.status, statusText: res.statusText, source: `${url}${path}`};

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

exports.reportPerformance = async function reportPerformance(lvlup, description) {
    if(!description || description.length > 255) {
        console.log('Worng argument!');
        return;
    }
    const url = lvlup.url;
    const path = '/v4/report/performance';

    const body = {description};

    const options = {
        method: 'POST',
        body:    JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
    };

    const res = await fetch(`${url}${path}`, options);
    if(res.status === 401) return {info: `This endpoint doesn't need auth but must be called from IP which belongs to VPS in lvlup.pro!`, statusCode: res.status, statusText: res.statusText, source: `${url}${path}`};
    if(res.status !== 200) return {statusCode: res.status, statusText: res.statusText, source: `${url}${path}`};

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

exports.grafanaGetData = async function grafanaGetData(lvlup, object) {
    if(!object) {
        console.log('No body!');
        return;
    }

    const url = lvlup.url;
    const path = `/grafana/query`;

    const options = {
        method: 'POST',
        body:    JSON.stringify(object),
        headers: {
          'Content-Type': 'application/json'
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

exports.getGrafanaListOfMetric = async function getGrafanaListOfMetric(lvlup, object) {
    if(!object) {
        console.log('No body!');
        return;
    }

    const url = lvlup.url;
    const path = `/grafana/search`;

    const options = {
        method: 'POST',
        body:    JSON.stringify(object),
        headers: {
          'Content-Type': 'application/json'
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

exports.userCreatePromoCode = async function userCreatePromoCode(lvlup) {
    const url = lvlup.url;
    const path = `/v4/me/referral/generic`;

    const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${lvlup.apiKey}`
        },
    };

    const res = await fetch(`${url}${path}`, options);
    if(res.status === 403) return {info: `You have at least one promo code already!`, statusCode: res.status, statusText: res.statusText, source: `${url}${path}`};
    else if(res.status !== 200) return {statusCode: res.status, statusText: res.statusText, source: `${url}${path}`};

    let json;
    try {
        json = await res.json();
    } catch {
        return {statusCode: res.status, statusText: res.statusText, source: `${url}${path}`};
    }

    json.info = `New promo code generated: ${json.code}`;
    json.statusCode = res.status;
    json.statusText = res.statusText;
    json.source = `${url}${path}`;
    return json;
}

exports.vpsChangeState = async function vpsChangeState(lvlup, vpsId, string) {
    const url = lvlup.url;

    let path;
    let info;
    if(string === 'start') {
        path = `/v4/services/vps/${vpsId}/start`;
        info = `start VPS`;
    }
    if(string === 'stop') {
        path = `/v4/services/vps/${vpsId}/stop`;
        info = `stop VPS`;
    }

    const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${lvlup.apiKey}`
        },
    };

    const res = await fetch(`${url}${path}`, options);
    return {statusCode: res.status, statusText: res.statusText, source: `${url}${path}`};
}

exports.createPayment = async function createPayment(lvlup, amount, redirectUrl, webhookUrl) {
    if(typeof redirectUrl === 'boolean' && redirectUrl === true) redirectUrl = '';
    if(typeof webhookUrl === 'boolean' && webhookUrl === true) webhookUrl = '';

    const url = lvlup.url;

    const path = '/v4/wallet/up';
    const body = {amount, redirectUrl, webhookUrl};

    const options = {
        method: 'POST',
        body:    JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${lvlup.apiKey}`
        },
    };

    const res = await fetch(`${url}${path}`, options);
    if(res.status !== 200) return {statusCode: res.status, statusText: res.statusText, source: `${url}${path}`};

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

exports.vpsUdpFilteringEnabled = async function vpsUdpFilteringEnabled(lvlup, vpsId, bool) {
    const url = lvlup.url;
    const path = `/v4/services/vps/${vpsId}/filtering`;

    const body = {filteringEnabled: bool};

    const options = {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${lvlup.apiKey}`
        },
    };

    const res = await fetch(`${url}${path}`, options);
    if(res.status === 400) return {info: `It's probably already turned ${bool ? 'on' : 'off'}!`, statusCode: res.status, statusText: res.statusText, source: `${url}${path}`};
    else if(res.status !== 200) return {statusCode: res.status, statusText: res.statusText, source: `${url}${path}`};

    return {info: 'Done!', statusCode: res.status, statusText: res.statusText, source: `${url}${path}`};
}

exports.vpsUdpFilterWhitelistAdd = async function vpsUdpFilterWhitelistAdd(lvlup, vpsId, ports, protocol) {
    const path = `/v4/services/vps/${vpsId}/filtering/whitelist`;
    const url = lvlup.url;

    const body = {ports, protocol};

    const options = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${lvlup.apiKey}`
        },
    };

    const res = await fetch(`${url}${path}`, options);
    if(res.status !== 200) return {statusCode: res.status, statusText: res.statusText, source: `${url}${path}`};

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

exports.vpsUdpFilterWhitelistDelete = async function vpsUdpFilterWhitelistDelete(lvlup, vpsId, whitelistId) {
    const path = `/v4/services/vps/${vpsId}/filtering/whitelist/${whitelistId}`;
    const url = lvlup.url;

    const options = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${lvlup.apiKey}`
        },
    };

    const res = await fetch(`${url}${path}`, options);
    if(res.status !== 200) return {statusCode: res.status, statusText: res.statusText, source: `${url}${path}`};

    try {
        json = await res.json();
    } catch {
        return {statusCode: res.status, statusText: res.statusText, source: `${url}${path}`};
    }

    json.info = 'Done!';
    json.statusCode = res.status;
    json.statusText = res.statusText;
    json.source = `${url}${path}`;
    return json;
}

exports.generateProxmox = async function generateProxmox(lvlup, vpsId) {
    const path = `/v4/services/vps/${vpsId}/proxmox`;
    const url = lvlup.url;

    const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${lvlup.apiKey}`
        },
    };

    const res = await fetch(`${url}${path}`, options);
    if(res.status !== 200) return {statusCode: res.status, statusText: res.statusText, source: `${url}${path}`};

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