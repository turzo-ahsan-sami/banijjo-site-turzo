const { query } = require("../db_config")

const api_key = "asdasdasd"
const api_secret = "asdasdasd"
const user_id = "asdasdasd"

const sandbox = true
const sandbox_url = ""
const production_url = ""

module.exports.dmoneyBaseUrl = () => {
    return sandbox ? sandbox_url : production_url
}

module.exports.dmoneyHeaders = () => {
    return {
        'API_KEY' : api_key,
        'API_SECRET' : api_secret,
        'USER_ID' : user_id,
        'Content-Type' : 'application/json'
    }
}

module.exports.dmoneySampleBody = (req) => {
    return {
        "param" : req.body.param,
        "param2" : req.body.param2,
        "param3" : req.body.param3 
    }
}



