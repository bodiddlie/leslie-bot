var Botkit = require('botkit');

var controller = Botkit.slackbot();

controller.hears(['Red Robin', /that guy/], ['direct_message', 'direct_mention', 'mention', 'ambient'], function (bot, message) {
    if (message.text === 'Red Robin') {
        bot.reply(message, 'Yum!');
    } else {
        bot.reply(message, 'Hey, don\'t be that guy.');
    }
});

var port = process.env.PORT || 8080
controller.setupWebserver(port, function (err, webserver) {
    controller.createWebhookEndpoints(webserver);
});

controller.on('slash_command', function (bot, message) {
    switch(message.command) {
        case '/righthand': {
            bot.replyPublic(message, 'I would suggest applying the RIGHT HAND OF FELLOWSHIP!!!');
            break;
        }
    }
});

var bot = controller.spawn({
    token: process.env.SLACK_TOKEN
});

bot.startRTM(function (err, bot, payload) {
    if (err) {
        console.log(err);
        throw new Error('Could not connect to slack!');
    }
});