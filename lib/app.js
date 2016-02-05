import express from 'express';
import slackAPI from 'slack-api';
import config from '../config.json';
const app = express();


app.post('/auth', (req, res) => {
    const {
        client_id, code
    } = req.body;

    if (!client_id || !code)
        return res.json({
            'error': 'INVALID PARMATERS'
        });

    slackAPI.oauth.access({
        client_secret: config.secret,
        code,
        client_id
    }, (err, token) => {
        res.json({
            [err ? 'error' : 'token']: err ? JSON.stringify(err) : token
        });
    });
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        error: err.message || JSON.stringify(err)
    });
});

export default app;