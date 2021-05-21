const jwt = require('jsonwebtoken');

//require auth manager, adult member or childmember 
module.exports.requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if(token) { 
        //verify token cookie 
        console.log(token)
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            console.log(decodedToken)
            if(err) {
                console.log(err);
            } else if(!(decodedToken.statut === 'manager' || decodedToken.statut === 'adultmember' || decodedToken.statut === 'childmember')) {
                console.log(err);
            } else {
                console.log(decodedToken.id);
                next();
            }
        });
    } else {
        console.log('No token');
    }
};
