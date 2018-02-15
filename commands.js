const fetch = require('node-fetch');

const commands = {
  me: key => {
    return fetch(`https://www.wanikani.com/api/user/${key}/user-information`)
      .then(response => response.json())
      .then(response => response.user_information)
      .then(info => `You are **${info.username}** of sect ${info.title}, level **${info.level}**.`);
  },
  pending: key => {
    return fetch(`https://www.wanikani.com/api/user/${key}/study-queue`)
      .then(response => response.json())
      .then(response => response.requested_information)
      .then(info => `You have **${info.reviews_available}** reviews and **${info.lessons_available}** lessons pending.`);
  },
  critical: key => {
    return fetch(`https://www.wanikani.com/api/user/${key}/critical-items`)
      .then(response => response.json())
      .then(response => response.requested_information)
      .then(criticals => criticals.map(item => item.character))
      .then(items => `Critical items: ${items.join(', ')}. Boohoo.`);
  },
  help: () => Promise.resolve(
    `List of available commands (with aliases):
**me (m, info)** - basic WK info
**pending (p)** - number of pending reviews and lessons
**critical (crit)** - list items in critical state`
  )
};

const aliases = {
  m: 'me',
  info: 'me',
  p: 'pending',
  crit: 'critical'
};

const fireCommand = (key, command) => {
  if (!commands[command]) {
    command = aliases[command];
  }
  if (!commands[command]) {
    return Promise.resolve(`I don't get it. What are you trying to do?
Type \`wk help\` to see available commands.`);
  }
  return commands[command](key);
};

module.exports = fireCommand;