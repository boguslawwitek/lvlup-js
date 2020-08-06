const {url, sandboxUrl} = require('./core/config.json');
const {validatingString, validatingUrl, validatingAmount, validatingPorts, validatingProtocol} = require('./core/validations');
const {basicRequest, basicRequestWithoutAuth, basicRequestWithParameter, getVpsState, vpsUdpFilterWhitelist} = require('./core/general');
const {grafanaGetData, getGrafanaListOfMetric, vpsChangeState, createPayment, reportPerformance, userCreatePromoCode, vpsUdpFilteringEnabled, vpsUdpFilterWhitelistAdd, vpsUdpFilterWhitelistDelete, generateProxmox, sandboxAcceptPayment} = require('./core/actions');
const {createSandboxAccount} = require('./core/sandbox');

/**
 * @typedef {Object} status - All methods contain this properties.
 * @property {number} statusCode - Status code of request
 * @property {string} statusText - Status text of request
 * @property {string} source - Source of request
*/

/**
 * @typedef {Object} information
 * @property {string} info - Information about the requested operation.
*/

/**
 * @typedef {Object} list
 * @property {number} count - Count of items
 * @property {object} items - Array of items
*/

/**
 * @typedef {Object} listServices
 * @property {object} services - Array of services
*/

/**
 * @typedef {Object} sandboxAccount
 * @property {number} id - ID of Sandbox Account
 * @property {string} username - Username of Sandbox Account
 * @property {string} password - Password of Sandbox Account
 * @property {string} email - Fake email of Sandbox Account
 * @property {string} apiKey - Api key of Sandbox Account
*/

/**
 * @typedef {Object} userInfo
 * @property {number} uid - User ID
 * @property {string} email - Email address assigned to the account
*/

/**
 * @typedef {Object} walletBalance
 * @property {number} balancePlnInt - Integer account balance
 * @property {string} balancePlnFormatted - Formatted account balance
*/

/**
 * @typedef {Object} promoCodes
 * @property {object} codes - Array of promo codes
*/

/**
 * @typedef {Object} newPromoCode
 * @property {string} code - new promo code
 * @property {string} info - information / error
*/

/**
 * @typedef {Object} paymentLink
 * @property {string} url - Link to payment
 * @property {string} id - ID of payment
*/

/**
 * @typedef {Object} paymentInfo
 * @property {boolean} payed - Is payment done and amount is already in your wallet?
 * @property {string} amountStr - Amount of payment
 * @property {number} amountInt - Amount of payment
 * @property {string} amountWithFeeStr - It's a amount payed, including all bank fees etc, for some payment channels it's equal to AmountStr
 * @property {number} amountWithFeeInt - It's a amount payed, including all bank fees etc, for some payment channels it's equal to AmountInt
*/

/**
 * @typedef {Object} filteringStatus
 * @property {boolean} filteringEnabled - On / Off
 * @property {string} state - status
*/

/**
 * @typedef {Object} filteringWhitelist
 * @property {object} array - Array of whitelist items
 * @property {object} status
*/

/**
 * @typedef {Object} proxmoxAccount
 * @property {string} url - Link to Proxmox
 * @property {string} username - Username of Proxmox Account
 * @property {string} password - Password of Proxmox Account
*/

/**
 * @typedef {Object} vpsStatus
 * @property {string} status - State of VM
 * @property {number} vmUptimeS - VPS uptime in seconds.
 * @property {object} upTime - VPS uptime, exmaple: { days: 22, hours: 9, minutes: 15, seconds: 38 }
*/

/** Class is representing a API user. */
class LvlupApi {
    /**
    * Create a new instance with API-KEY.
    * 
    * @param {string} apiKey - API key
    * @param {object} [environment] - Startup Arguments Object
    * @param {string} [environment.env=deployment] - Sets enviroment, "deployment" for api.lvlup.pro or "sandbox" for api.sandbox.lvlup.pro
    */
    constructor(apiKey, environment={env: 'deployment'}) {
        if((!(environment.env === 'deployment' || environment.env === 'sandbox')) || typeof environment.env !== 'string') throw new Error('Invalid environment!');

        this.lvlup = {};

        if(environment.env === 'deployment') {
            this.lvlup.env = 'deployment';
            this.lvlup.url = url;
        } else if(environment.env === 'sandbox') {
            console.log('|| LVLUP-JS RUNNING IN SANDBOX ENVIRONMENT! ||');
            this.lvlup.env = 'sandbox';
            this.lvlup.url = sandboxUrl;
        }

        if(validatingString(apiKey)) this.lvlup.apiKey = apiKey;
        else throw new Error('No api key!');
    }
    /**
    * Create temporary test account on sandbox environment
    * Account created this way can be removed automatically after 30 days of creation
    * 
    * @return {Promise<sandboxAccount>}
    */
    sandboxCreateAccount() {
        if(this.lvlup.env !== 'sandbox') {
            return 'This method works only on sandbox API';
        }
        else return createSandboxAccount(this.lvlup);
    }
    /**
    * Emulates successful wallet payment Use this after creating payment to test webhooks
    *
    * @param {string} id - ID of payment
    * @return {Promise<status>}
    */
    sandboxAcceptPayment(id) {
        if(this.lvlup.env !== 'sandbox') {
            return 'This method works only on sandbox API';
        }
        const validParameter = validatingString(id);
        if(validParameter) return sandboxAcceptPayment(this.lvlup, `/v4/sandbox/wallet/up/${validParameter}/ok`);
        else return 'Invalid argument!';
    }
    /**
    * Report bad performance of your game server
    * This endpoint doesn't need auth but must be called from IP which belongs to VPS in lvlup.pro
    *
    * @param {string} description - max length: 255, example: 23% drop (37/164)
    * @return {Promise<status>}
    */
    reportPerformance(description) {
        return reportPerformance(this.lvlup, description);
    }
    /**
    * Respond with "ok" as health check when adding data source to Grafana
    *
    * @return {Promise<status>}
    */
    grafanaPing() {
        return basicRequestWithoutAuth(this.lvlup, `/grafana`);
    }
    /**
    * Fetch selected metrics data.
    * Can respond with table or time series type.
    * 
    * This method is not validated! 
    *
    * @param {object} body - body of request
    * @return {Promise} - More information: {@link https://github.com/simPod/grafana-json-datasource}
    */
    grafanaGetData(body) {
        return grafanaGetData(this.lvlup, body);
    }
    /**
    * List available metrics.
    * Currently "target" parameter is ignored.
    * 
    * This method is not validated! 
    *
    * @param {object} body - body of request
    * @return {Promise} - More information: {@link https://github.com/simPod/grafana-json-datasource}
    */
    grafanaListOfMetrics(body) {
        return getGrafanaListOfMetric(this.lvlup, body);
    }
    /**
    * Show currently logged in user details
    *
    * @return {Promise<userInfo>}
    */
    user() {
        return basicRequest(this.lvlup, `/v4/me`);
    }
    /**
    * Wallet balance 
    * Shows current balance in lvlup.pro wallet Wallet is used to buy or extend services in lvlup.pro
    * 
    * @return {Promise<walletBalance>}
    */
    userWalletBalance() {
        return basicRequest(this.lvlup, `/v4/wallet`);
    }
    /**
    * Shows paginated important actions on account. 
    * This includes login, logout, failed login attempt Each log entry has IP and useragent
    *
    * @return {Promise<list>}
    */
    userAuditLogs() {
        return basicRequest(this.lvlup, `/v4/me/log`);
    }
    /**
    * Show all promo codes assigned to logged in user List also includes approximate payout for prev month and commission in this month so far 
    *
    * @return {Promise<promoCodes>}
    */
    userPromoCodes() {
        return basicRequest(this.lvlup, `/v4/me/referral`);
    }
    /**
    * Create new generic and random promo code 
    *
    * Codes that have name of domain can be created by contacting support via ticket We plan adding endpoint for domain verification to fully automate this process
    * 
    * @return {Promise<newPromoCode>}
    */
    userCreatePromoCode() {
        return userCreatePromoCode(this.lvlup);
    }
    /**
    * Paginated order list
    * 
    * @param {object} queryParameter - limit or afterId or beforeId with integer, example: {limit: 10}
    * @return {Promise<list>}
    */
    getOrders(queryParameter) {
        return basicRequestWithParameter(this.lvlup, queryParameter, `/v4/orders`);
    }
    /**
    * Paginated payments and fees list
    * 
    * @param {object} queryParameter - limit or afterId or beforeId with integer, example: {limit: 10}
    * @return {Promise<list>}
    */
    getPayments(queryParameter) {
        return basicRequestWithParameter(this.lvlup, queryParameter, `/v4/payments`);
    }
    /**
    * Service list
    * Show currently logged in user service list. In this list you can find VPS and domains
    * 
    * @return {Promise<listServices>}
    */
    getServices() {
        return basicRequest(this.lvlup, `/v4/services`);
    }
    /**
    * Create link for payment
    * Allows to top up wallet by any person using link provided in API response URL received from this endpoint will work (allow payments) for up to 7 days of creation
    * 
    * @param {string} amount - For 13,37 PLN wallet top up, provide 13.37 in this field If user selects payment channel with additional fees then it can cost more than specified amount This field is required
    * @param {string} redirectUrl - URL which will be used to redirect user after payment Optional - leave empty to disable
    * @param {string} webhookUrl - URL which will receive POST request when payment is done Optional - leave empty to disable
    * @return {Promise<paymentLink>}
    */
    createPayment(amount, redirectUrl, webhookUrl) {
        const amountValidated = validatingAmount(amount);
        let redirectUrlValidated;
        let webhookUrlValidated;

        if(redirectUrl.length === 0) redirectUrlValidated = true;
        else redirectUrlValidated = validatingUrl(redirectUrl);

        if(webhookUrl.length === 0) webhookUrlValidated = true;
        else webhookUrlValidated = validatingUrl(webhookUrl);

        if(amountValidated && redirectUrlValidated && webhookUrlValidated) return createPayment(this.lvlup, amountValidated, redirectUrlValidated, webhookUrlValidated);
        else return 'Invalid arguments!';
    }
    /**
    * Info about payment
    * Allows you to check if payment by user is already done Even if you receive webhook, you should still call this method to verify
    * 
    * @param {string} id - ID of payment.
    * @return {Promise<paymentInfo>}
    */
    paymentInfo(id) {
        const validParameter = validatingString(id);
        if(validParameter) return basicRequest(this.lvlup, `/v4/wallet/up/${validParameter}`);
        else return 'Invalid argument!';
    }
    /**
    * VPS DDoS list 
    * Paginated list of attacks Data presented by our API is parsed from OVH API every 2 minutes
    * 
    * @param {string} id - ID of VPS.
    * @param {object} queryParameter - limit or afterId or beforeId with integer, example: {limit: 10}
    * @return {Promise<list>}
    */
    vpsAttacksList(id, queryParameter) {
        const validParameter = validatingString(id);
        if(validParameter) return basicRequestWithParameter(this.lvlup, queryParameter, `/v4/services/vps/${validParameter}/attacks`);
        else return 'Invalid argument!';
    }
    /**
    * VPS UDP filter
    * UDP filtering status Data presented by our API is parsed from OVH API almost realtime
    * 
    * @param {string} id - ID of VPS.
    * @return {Promise<filteringStatus>}
    */
    vpsUdpFilter(id) {
        const validId = validatingString(id);
        if(validId) return basicRequest(this.lvlup, `/v4/services/vps/${validId}/filtering`);
        else return 'Invalid argument!';
    }
    /**
    * VPS UDP filter whitelist
    * List rules (exceptions) in UDP filtering whitelist Data presented by our API is parsed from OVH API almost realtime
    * 
    * @param {string} id - ID of VPS.
    * @return {Promise<filteringWhitelist>}
    */
    vpsUdpFilterWhitelist(id) {
        const validId = validatingString(id);
        if(validId) return vpsUdpFilterWhitelist(this.lvlup, `/v4/services/vps/${validId}/filtering/whitelist`);
        else return 'Invalid argument!';
    }
    /**
    * VPS UDP filter ON/OFF
    * Switch UDP filtering status on and off
    * 
    * @param {string} id - ID of VPS.
    * @param {boolean} bool - Set filtering as enabled (true) or disabled (false)
    * @return {Promise<information>}
    */
    vpsUdpFilterSwitch(id, bool) {
        if(typeof bool !== 'boolean') return 'Invalid argument!';
        const validId = validatingString(id);
        if(validId) return vpsUdpFilteringEnabled(this.lvlup, validId, bool);
        else return 'Invalid argument!';
    }
    /**
    * Add rule (exception) to UDP filtering whitelist
    *
    * @param {string} id - ID of VPS.
    * @param {object} ports
    * @param {number} ports.from - Port range from [ 1 .. 65535 ]
    * @param {number} ports.to - Port range to [ 1 .. 65535 ]
    * @param {string} protocol - Enum: "arkSurvivalEvolved" "arma" "gtaMultiTheftAutoSanAndreas" "gtaSanAndreasMultiplayerMod" "hl2Source" "minecraftPocketEdition" "minecraftQuery" "mumble" "rust" "teamspeak2" "teamspeak3" "trackmaniaShootmania" "other"
    * - Game protocol that should be whitelisted Use "other" if game is not listed.
    * @return {Promise<status>}
    */
    vpsUdpFilterWhitelistAdd(id, ports, protocol) {
        const validVpsId = validatingString(id);
        const validPorts = validatingPorts(ports);
        const validProtocol = validatingProtocol(protocol);
        if(validVpsId && validPorts && validProtocol) return vpsUdpFilterWhitelistAdd(this.lvlup, validVpsId, validPorts, validProtocol);
        else return 'Invalid arguments!';
    }
    /**
    * Remove rule (exception) from UDP filtering whitelist
    *
    * @param {string} vpsId - ID of VPS.
    * @param {string} whitelistId - ID of whitelist rule.
    * @return {Promise<status>}
    */
    vpsUdpFilterWhitelistDelete(vpsId, whitelistId) {
        const validVpsId = validatingString(vpsId);
        const validWhitelistId = validatingString(whitelistId);
        if(validVpsId && validWhitelistId) return vpsUdpFilterWhitelistDelete(this.lvlup, validVpsId, validWhitelistId);
        else return 'Invalid arguments!';
    }
    /**
    * Generate Proxmox account login/password
    *
    * @param {string} id - ID of VPS.
    * @return {Promise<proxmoxAccount>}
    */
    vpsGenerateProxmoxAccount(id) {
        const validId = validatingString(id);
        if(validId) return generateProxmox(this.lvlup, validId);
        else return 'Invalid argument!';
    }
    /**
    * VPS State
    * Data presented by API is gathered almost realtime from Proxmox.
    *
    * @param {string} id - ID of VPS.
    * @return {Promise<vpsStatus>}
    */
    vpsState(id) {
        return getVpsState(this.lvlup, id);
    }
    /**
    * Starts your VPS via Proxmox panel.
    *
    * @param {string} id - ID of VPS.
    * @return {Promise<status>}
    */
    vpsStart(id) {
        const validParameter = validatingString(id);
        if(validParameter) return vpsChangeState(this.lvlup, validParameter, 'start');
        else return 'Invalid argument!';
    }
    /**
    * Stops your VPS via Proxmox panel.
    *
    * @param {string} id - ID of VPS.
    * @return {Promise<status>}
    */
    vpsStop(id) {
        const validParameter = validatingString(id);
        if(validParameter) return vpsChangeState(this.lvlup, validParameter,'stop');
        else return 'Invalid argument!';
    }
    /**
    * Check if selected IPv4 is hosted by lvlup.pro This is for partners only. Contact us for details
    * 
    * @param {string} ip - IPv4
    * @return {Promise<status>}
    */
    partner(ip) {
        const validParameter = validatingString(ip);
        if(validParameter) return basicRequest(this.lvlup, '/v4/partner/ip/', validParameter);
        else return 'Invalid argument!';
    }
}

module.exports = LvlupApi;