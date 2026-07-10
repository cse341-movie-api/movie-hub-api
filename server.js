// require('dotenv').config();

// const express = require('express');
// const app = express();
// const mongodb = require('./db/connect');
// const port = process.env.PORT || 8080;
// const cors = require('cors');
// const passport = require('passport');
// require('./config/passport');

// app.use(cors());
// app.use(express.json());
// app.use(passport.initialize());
// app.use('/', require('./routes/index.js'));

// app.use((err, req, res, next) => {
//     console.error("System error stack trace: ", err.stack);

//     res.status(500).json({
//         message: "An internal server error occurred.",
//         error: err.message
//     });
// });

// mongodb.connectToDatabase((err) => {
//     if (err) {
//         console.log(err);
//     } else {
//         if (process.env.NODE_ENV === 'test') {
//             app.listen(port, () => {
//                 console.log(`app listening on http://localhost:${port}`);
//             });
//         }
//     }
// });

// module.exports = app;

require('dotenv').config();

const express = require('express');
const app = express();
const mongodb = require('./db/connect');
const port = process.env.PORT || 8080;
const cors = require('cors');
const passport = require('passport');
require('./config/passport');

app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use('/', require('./routes/index.js'));

app.use((err, req, res, next) => {
    console.error("System error stack trace: ", err.stack);

    res.status(500).json({
        message: "An internal server error occurred.",
        error: err.message
    });
});

if (process.env.NODE_ENV === 'test') {
    console.log("Testing environment detected: bypassing live database connection.");
} else {
    mongodb.connectToDatabase((err) => {
        if (err) {
            console.log(err);
        } else {
            app.listen(port, () => {
                console.log(`app listening on http://localhost:${port}`);
            });
        }
    });
}

module.exports = app;