const { WebClient } = require('@slack/web-api');

if (!process.env.SLACK_TOKEN) {
    return;
}

const web = new WebClient(process.env.SLACK_TOKEN);

const toChannel = function (message, channel) {
    (async () => {
        try {
            await web.chat.postMessage({
                channel: '#' + channel,
                text: message,
            });
        } catch (error) {
            console.log("Error posting to Slack:" + error);
        }
    })();
};

module.exports = toChannel;
