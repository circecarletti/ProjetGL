const mongoose = require('mongoose');

mongoose
    .connect("mongodb+srv://" + process.env.DB_USER_PASS + "@gla.qt6kv.mongodb.net/gla",
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        }
    )
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log("Failed to connect to MongoDB", err));