const axios = require('axios');
const { setupCache } = require('axios-cache-interceptor');

// Set Cache TTL to 1 minute
const CACHE_OPTIONS = {cache: {ttl: 1000 * 60}};

module.exports = {
    http: setupCache(axios, CACHE_OPTIONS)
};