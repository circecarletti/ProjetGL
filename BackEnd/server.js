//https://orsaymediatheque.herokuapp.com/

const express = require('express');
const cookieParser = require('cookie-parser'); //library for using cookie 
const schedule = require('node-schedule'); //require node shedule for automatic function launch
const userRoutes = require('./routes/user.routes.js');  // a suppr
const resourceRoutes = require('./routes/resource.routes.js'); 
const ObjectId = require('mongoose').Types.ObjectId;

const ResourceModel = require('./models/resource.model');
const MemberModel = require('./models/member.model');

const adultMemberRoutes = require('./routes/adultmember.routes.js'); //routes adultmember
const childMemberRoutes = require('./routes/childmember.routes.js'); //routes childmember
const managerRoutes = require('./routes/manager.routes.js');  //routes manager
const programmerRoutes = require('./routes/programmer.routes.js');  //routes manager

require('dotenv').config({path: './config/.env'});
require('./config/db.js');
const {checkAdultMember, requireAuthAdult} = require('./middleware/authAdult.middleware');
const {checkChildMember, requireAuthChild} = require('./middleware/authChild.middleware');
const {checkManager, requireAuthManager} = require('./middleware/authManager.middleware');
const {checkAuth} = require('./middleware/auth.middleware');

const cors = require('cors');
const app = express();

//use cors to allow api to get use  ALLOW ONLY reinem@github.io
//app.use(cors({origin: process.env.CLIENT_URL}));

//use cors to allow api to get use 
const corsOptions = {
    origin: "*",
    credentials: true,
    'allowedHeaders': ['sessionId', 'Content-Type'],
    'exposedHeaders': ['sessionId'],
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false
}
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());

//routes init
app.get('/', (req, res) => {
    res.json({msg: "Hello on est dans l'api"});
});

//check auth adult member - child member - manager or unkonw return success and statut user 
app.get('/jwtid', checkAuth);

//require authentification for adult
app.get('/jwtidAdult', requireAuthAdult);

//require authentification for child
app.get('/jwtidChild', requireAuthChild);

//require authentification for manager
app.get('/jwtidManager', requireAuthManager);

//routes
//routes user
app.use('/api/users', userRoutes); 

//routes adultmember
app.use('/api/user/adultmember', adultMemberRoutes);

//routes childmember
app.use('/api/user/childmember', childMemberRoutes);

//routes manager
app.use('/api/user/manager', managerRoutes);

//routes resource
app.use('/api/resource', resourceRoutes);

//routes creating a manager
app.use('/api/programmer', programmerRoutes);

//decrement days to loan member automatically every day at 00h00
var decreaseRemainingDays = schedule.scheduleJob({hour: 00, minute: 00}, function(){
    ResourceModel.updateMany({loan: true, loanday: { $gt: 0 }}, {$inc: {loanday: Number(-1)}}, {upsert:true} ,
    function (err) {
        if (err){
            console.log(err)
        }
    });
});

//add penalties (-5 euros to balance and set block at true) to delayed loan member automatically every day at 00h30
var delayPenalties = schedule.scheduleJob({hour: 00, minute: 30 }, async function() {
    const array = await ResourceModel.find({loan: true, loanday: Number(0)}, 'idmember -_id').exec();
    console.log(array);
    let objectIdArray = array.map(a => a.idmember);
    MemberModel.updateMany({_id : {$in: objectIdArray } }, {$set: {block: true}, $inc: {balance : Number(-5)}}, { upsert:true } ,
        function (err) {
            if (err){
            console.log(err);
            }
        });
    }
);
    
//server
app.listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`);
})