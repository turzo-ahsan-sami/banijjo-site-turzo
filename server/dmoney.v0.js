const express = require('express')
const router = express.Router()
const fetch = require('node-fetch')
const { query } = require('../db_config')


const {
    dmoneyBaseUrl,
    dmoneyHeaders,
    dmoneySampleBody,
} = require('./dmoneyHelpers')

// test
router.get('/', async (req, res) => {
    res.send('dmoney api')
})

// Sample
router.post('/sample', async (req, res) => {

    const url = dmoneyBaseUrl()
    const headers = dmoneyHeaders()
    const body = dmoneySampleBody()

    fetch(`${url}/sample`, {
            method : 'POST',
            crossDomain : true,
            headers : { headers },
            body : JSON.stringify(body)
    })
    .then(res => {
        return res.json();
    })
    .then(data => {
        return res.send(data);
    })
    .catch(err => {
        console.log(err);
    })
});

module.exports = router