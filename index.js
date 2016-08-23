var Botkit = require('botkit');
var axios = require('axios');
var _ = require('lodash');

var phrases = require('./leslie-phrases.json');

var controller = Botkit.slackbot();

controller.hears(Object.keys(phrases), ['direct_message', 'direct_mention', 'mention', 'ambient'], function (bot, message) {
    bot.reply(message, phrases[message.match[0].toLowerCase()]);
});

controller.hears('name', ['direct_message', 'direct_mention', 'mention'], function (bot, message) {
  axios.get('http://api.randomuser.me/?inc=name')
    .then(res => res.data)
    .then(data => data.results)
    .then(results => {
      let name = _.capitalize(results[0].name.first);
      bot.reply(message, `Right now, my name is ${name}. :)`)
    });
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

var token = process.env.SLACK_TOKEN || require('./token.json').token;

var bot = controller.spawn({
    token,
    retry: Infinity
});

bot.startRTM(function (err) {
    if (err) {
        console.log(err);
        throw new Error('Could not connect to slack!');
    }
});