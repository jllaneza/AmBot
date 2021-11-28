const { MessageEmbed } = require('discord.js');

module.exports = async (message) => {
  const { content, channel } = message;
  const [question, ...options] = content.split('|');
  const alphabet = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯', '🇰', '🇱',
    '🇲', '🇳', '🇴', '🇵', '🇶', '🇷', '🇸', '🇹', '🇺', '🇻', '🇼', '🇽', '🇾', '🇿'];

  message.delete();

  const finalOptions = options.map((option, index) => {
    return `${alphabet[index]} - ${option}`;
  });
  const embed = new MessageEmbed();
  embed
    .setTitle(question.replace('poll ', ''))
    .setDescription(finalOptions.join('\n'))
    .setColor('#0099ff');

  await channel.send({ embeds: [embed] }).then(msg => {
    options.forEach((_, index) => {
      msg.react(alphabet[index]);
    });
  });
}