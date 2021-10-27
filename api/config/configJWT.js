require('dotenv').config()
const jwt = require('jsonwebtoken');

var validate_token_list = []

function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    // console.log('this is verifyToken')
    // console.log(bearerHeader)
    // console.log(typeof bearerHeader)
    // Check if bearer is undefind
    if(typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
}

// Verifile token in list
function verifyTokenInList(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    // console.log('this is verifyTokenInList')
    // console.log(bearerHeader)

    if(typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken_check = bearer[1];
        for (let i = 0; i < validate_token_list.length; i++) {
            if (bearerToken_check === validate_token_list[i]) {
                next();
                break;
            }
            else {
                if (validate_token_list.length === (i + 1)) {
                    res.sendStatus(403);
                }
            }
        }
    } else {
        res.sendStatus(403);
    }
}

// push token to validate token list
function pushTokenToValidateList(token) {
    validate_token_list.push(token);
    // console.log(validate_token_list)
}

// delete token in validate token list
function deleteTokenInValidateTokenList(token) {
    // console.log('this is delete token in validate list function')
    const index = validate_token_list.indexOf(token);
    if (index > -1) {
        validate_token_list.splice(index, 1);
        // console.log(`delete this token = ${token}`);
        // console.log(validate_token_list)
    }
}

function verifyJWT(token) {
    return new Promise(function (resolve, reject){
        jwt.verify(token, process.env.secretkey, async (err, data) => {
            if (err) {
                deleteTokenInValidateTokenList(token.toString());
                resolve(data)
            }
            else {
                resolve(data);
            }
        });
    });
}

module.exports = {
    verifyToken, 
    verifyTokenInList,
    pushTokenToValidateList,
    deleteTokenInValidateTokenList,
    verifyJWT
}