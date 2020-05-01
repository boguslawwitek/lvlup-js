exports.validatingString = function validatingString(parameter) {
    if(!parameter) {
        console.log('Invalid argument!');
        return false;
    }

    if(typeof parameter !== 'string') {
        console.log('Invalid argument!');
        return false;
    }

    parameter = parameter.replace(/\s/g, '');
    if(parameter.length < 1) {
        console.log('Invalid argument!');
        return false;
    }

    return parameter;
}

exports.validatingUrl = function validatingUrl(parameter) {
    if(!parameter) {
        console.log('Invalid Url!');
        return false;
    }

    if(typeof parameter !== 'string') {
        console.log('Invalid Url!');
        return false;
    }

    parameter = parameter.replace(/\s/g, '');
    if(parameter.length < 8) {
        console.log('Invalid Url!');
        return false;
    }

    if(!(parameter.startsWith('http://') || parameter.startsWith('https://'))) {
        console.log('Invalid Url!');
        return false;
    }

    const dot = parameter.indexOf('.');
    if(dot < 1) {
        console.log('Invalid Url!');
        return false;
    }

    return parameter;
}

exports.validatingAmount = function validatingAmount(parameter) {
    if(!parameter) {
        console.log('Invalid Amount!');
        return false;
    }

    if(typeof parameter !== 'string') {
        console.log('Invalid Amount!');
        return false;
    }

    const number = Number(parameter);
    if(!Number.isFinite(number)) {
        console.log('Invalid Amount!');
        return false;
    }

    if(number < 1.00) {
        console.log('Invalid Amount!');
        return false;
    }

    if(!validateTwoDecimalPlaces(number)) {
        console.log('Invalid Amount!');
        return false;
    }

    const amount = parameter.toString();

    return amount;
}

function validateTwoDecimalPlaces(decimalValue) { 
    var rx = new RegExp(/\d+\.\d\d(?!\d)/);
    if(rx.test(decimalValue)) { 
       return true; 
    }
    else { 
       return false; 
    } 
}

exports.validatingPorts = function validatingPorts(ports) {
    if(typeof ports !== 'object') {
        console.log('Invalid Ports!');
        return false;
    }

    const size = Object.keys(ports).length;
    if(size !== 2) {
        console.log('Invalid Ports!');
        return false;
    }

    if(!(ports.hasOwnProperty('from') && ports.hasOwnProperty('to'))) {
        console.log('Invalid Ports!');
        return false;
    }

    if(typeof ports.from !== 'number' && typeof ports.to !== 'number') {
        console.log('Invalid Ports!');
        return false;
    }
    
    if(!(Number.isInteger(ports.from) && Number.isInteger(ports.to))) {
        console.log('Invalid Ports!');
        return false;
    }

    if((ports.from < 1 || ports.from > 65535) || (ports.to < 1 || ports.to > 65535)) {
        console.log('Invalid Ports! Range: 1-65535');
        return false;
    }

    if(ports.from > ports.to) {
        console.log('Invalid Ports! (ports.from cannot be greater than ports.to)');
        return false;
    }

    return ports;
}

exports.validatingProtocol = function validatingProtocol(protocol) {
    const protocols = ["arkSurvivalEvolved", "arma", "gtaMultiTheftAutoSanAndreas", "gtaSanAndreasMultiplayerMod", "hl2Source", "minecraftPocketEdition", "minecraftQuery", "mumble", "rust", "teamspeak2", "teamspeak3", "trackmaniaShootmania", "other"];
    const check = protocols.find(val => val === protocol);

    if(typeof protocol !== 'string') {
        console.log('Protocol must be a string!');
        return false;
    } else if(!check) {
        console.log('Use "other" if game is not listed!');
        return false;
    }

    return protocol;
} 