var whitelist = [
    "http://localhost:3000",
];
var corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            // console.log('origin if = '+whitelist.indexOf(origin))
            callback(null, true);
        } else {
            // console.log('origin else = '+whitelist.indexOf(origin))
            callback(new Error("Not allowed by CORS"));
        }
    },
};

module.exports = corsOptions;