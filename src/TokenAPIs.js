const axios = require('axios');
const endpoints = require('./endpoints.json');

class TokenAPIs {
    static getTokenByPolicyMuesliswap(policyID) {
        return new Promise((res, rej) => {
            axios({
                method: 'GET', //Kind of weird but their website makes a post request without parameters to get the data
                url: endpoints.muesliswap,
                responseType: 'json'
            })
            .then((response) => {
                response.data.forEach((token) => {
                    if (token.token === policyID) {
                        res(token);
                    }
                });

                rej('Token not found');
            })
            .catch((err) => {
                rej(err);
            })
        });
    }

    static getPoolPM() {
        return new Promise((res, rej) => {
            axios({
                method: 'GET',
                url: endpoints.pool,
                responseType: 'json'
            })
            .then((response) => {
                res(response.data);
            })
            .catch((err) => {
                rej(err);
            })
        });
    }
}

module.exports = TokenAPIs;