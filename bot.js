const fs = require('fs');
const Discord = require('discord.js');
const TOKEN = require('./bot-token.json');
const API_KEYS = require('./api-keys.json');
const fireCommand = require('./commands.js');

const client = new Discord.Client();
const token = TOKEN.value;

client.on('ready', () => {
  console.log('I be working, my liege!');
  console.log('Known keys:', API_KEYS);
});

client.on('message', message => {
  const userID = message.author.id;
  const isPM = message.channel.type === 'dm' 
    && userID === message.channel.recipient.id;

  if (isPM) {
    const hadExistingKey = !!API_KEYS[userID];
    API_KEYS[userID] = message.content;
    persistApiKeys();
    message.channel.send(`${hadExistingKey ? 'Edited' : 'Added'} your WaniKani API key!`);
  }
  else {
    const isCommand = message.content.match(/^wk (.*)/);
    if (!isCommand) {
      return;
    }
    if (!API_KEYS[userID]) {
      message.channel.send(`${message.author.username}, duderino, you has no WK API key, PM it to me pls.`);
      return;
    }
    const command = isCommand[1];
    fireCommand(API_KEYS[userID], command)
      .then(response => {
        message.channel.send(response);
      });
  }
});

client.login(token);

function persistApiKeys() {
  fs.writeFile('api-keys.json', JSON.stringify(API_KEYS), function (err) {
    if (err) { 
      console.log(err); 
    } 
    else { 
      console.log('API Keys saved'); 
    }
  });
}