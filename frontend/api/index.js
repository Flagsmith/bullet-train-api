require('dotenv').config();

const exphbs = require('express-handlebars');
const express = require('express');
const spm = require('./middleware/single-page-middleware');
const bodyParser = require('body-parser');

const app = express();

const SLACK_TOKEN = process.env.SLACK_TOKEN;
const slackClient = SLACK_TOKEN && require('./slack-client');
const E2E_SLACK_CHANNEL_NAME = process.env.E2E_SLACK_CHANNEL_NAME;
const postToSlack = process.env.VERCEL_ENV === 'production';

const isDev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 8080;

app.get('/config/project-overrides', (req, res) => {

    const getVariable = ({ name, value }) => {
        if (!value || value === 'undefined') {
            if (typeof value === 'boolean') {
                return `    ${name}: false,
                `;
            }
            return '';
        }

        if (typeof value !== 'string') {
            return `    ${name}: ${value},
            `;
        }

        return `    ${name}: '${value}',
        `;
    };
    const envToBool = (name, defaultVal) => {
        const envVar = `${process.env[name]}`;
        if (envVar === 'undefined') {
            return defaultVal;
        }
        return envVar === 'true' || envVar === '1';
    };
    let sha = '';
    /*
    todo: fix?
    if (fs.existsSync(path.join(__dirname, 'CI_COMMIT_SHA'))) {
        sha = fs.readFileSync(path.join(__dirname, 'CI_COMMIT_SHA'));
    }
    */

    const values = [
        { name: 'preventSignup', value: envToBool('PREVENT_SIGNUP', false) ||  !envToBool('ALLOW_SIGNUPS', true) }, // todo:  deprecate ALLOW_SIGNUPS
        { name: 'superUserCreateOnly', value: envToBool('ONLY_SUPERUSERS_CAN_CREATE_ORGANISATIONS', false) },
        { name: 'flagsmith', value: process.env.FLAGSMITH_ON_FLAGSMITH_API_KEY },
        { name: 'heap', value: process.env.HEAP_API_KEY },
        { name: 'ga', value: process.env.GOOGLE_ANALYTICS_API_KEY },
        { name: 'crispChat', value: process.env.CRISP_WEBSITE_ID },
        { name: 'sha', value: sha },
        { name: 'mixpanel', value: process.env.MIXPANEL_API_KEY },
        { name: 'sentry', value: process.env.SENTRY_API_KEY },
        { name: 'api', value: process.env.FLAGSMITH_PROXY_API_URL ? '/api/v1/' : process.env.FLAGSMITH_API_URL },
        { name: 'maintenance', value: envToBool('ENABLE_MAINTENANCE_MODE', false) },
        { name: 'flagsmithClientAPI', value: process.env.FLAGSMITH_ON_FLAGSMITH_API_URL },
        { name: 'disableInflux', value: !envToBool('ENABLE_INFLUXDB_FEATURES', true) },
        { name: 'flagsmithAnalytics', value: envToBool('ENABLE_FLAG_EVALUATION_ANALYTICS', true) },
        { name: 'amplitude', value: process.env.AMPLITUDE_API_KEY },
        { name: 'delighted', value: process.env.DELIGHTED_API_KEY },
        { name: 'capterraKey', value: process.env.CAPTERRA_API_KEY },
    ];
    const output = values.map(getVariable).join('');

    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    res.setHeader('content-type', 'application/javascript');
    res.send(`window.projectOverrides = {
        ${output}
    };
    `);
});

if (isDev) { // Serve files from src directory and use webpack-dev-server
    console.log('Enabled Webpack Hot Reloading');
    const webpackMiddleware = require('./middleware/webpack-middleware');
    webpackMiddleware(app);
    app.set('views', 'web/');
    app.use(express.static('web'));
}

if (process.env.VERCEL) {
    var hbs = exphbs.create({
        defaultLayout: 'index',
        layoutsDir:  "handlebars",
    });
    app.set('views', 'handlebars');
} else {
    var hbs = exphbs.create({
        defaultLayout: 'index',
        layoutsDir:  "web",
    });
    app.set('views', 'web');
}
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.get('/robots.txt', (req, res) => {
    res.send('User-agent: *\r\nDisallow: /');
});

app.use(bodyParser.json());
app.use(spm);

app.post('/api/event', (req, res) => {
    res.json({ });
    try {
        const body = req.body;
        console.log("body:" + JSON.stringify(body));

        console.log(body.tag)
        const channel = body.tag ? `infra_${body.tag.replace(/ /g, '').toLowerCase()}` : process.env.EVENTS_SLACK_CHANNEL;
        console.log("channel:" + channel);

        console.log("postToSlack:" + postToSlack);
        if (process.env.SLACK_TOKEN && channel && postToSlack && !body.event.includes('Bullet Train')) {
            const match = body.event.match(/([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})/);
            let url = '';
            if (match && match[0]) {
                const urlMatch = match[0].split('@')[1];
                url = ` https://www.similarweb.com/website/${urlMatch}`;
            }
            slackClient(body.event + url, channel);
        }
    } catch (e) {
        console.log("Error posting to from /api/event:" + e);
    }
});

// Catch all to render index template
app.get('/', (req, res) => {
    var linkedin = process.env.LINKEDIN || "";
    return res.render('index', {
        isDev,
        linkedin,
    });
});

app.listen(port, () => {
    console.log(`Server listening on: ${port}`);
    if (!isDev && process.send) {
        process.send({ done: true });
    }
});

module.exports = app;
