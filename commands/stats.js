const { MessageEmbed } = require('discord.js');
const { getStats, getSheetAccounts, updateSlpAccountSheet } = require('../utils');
const { accounts } = require('../jsons/config.json');

module.exports = async (message) => {
  const { content, channel, author } = message;
  const [_, ...tag] = content.split(' ');
  const authorTag = tag && tag.length ? tag.join(' ') : '';

  let { address, rowIndex } = accounts[author.tag] || {};

  if (author.tag === 'xine#1333' && authorTag) {
    const data = accounts[authorTag] || {};
    address = data.address;
    rowIndex = data.rowIndex;
  }

  if (!address) {
    return;
  }
  try {
    const { totalSlp, adjustment, share } = await getSheetAccounts(rowIndex);
    let { slp: currentSlp, name, mmr } = await getStats(address);

    const actualSlp = +currentSlp + +adjustment;
    const dailySlp = totalSlp == 0 ? +currentSlp : +currentSlp - +totalSlp;
    const shareInSlp = +actualSlp * +share;
    const embed = new MessageEmbed()
      .setColor('#0099ff')
      .setAuthor(name)
      .addFields(
        { name: 'SLP Today', value: `${dailySlp}`, inline: true },
        { name: 'Total SLP', value: `${actualSlp}`, inline: true },
        { name: 'MMR', value: `${mmr}`, inline: true }
      )
      .addFields(
        { name: 'Share %', value: `${+share * 100}%`, inline: true },
        { name: 'Share SLP', value: `${shareInSlp}`, inline: true }
      );
    channel.send({ embeds: [embed] });

    // do not write on excel if not successful
    if (currentSlp == totalSlp) {
      const errorEmbed = new MessageEmbed()
        .setColor('#ff0000')
        .setTitle('Something went wrong! Ay AmBot!');
      channel.send({ embeds: [errorEmbed] });
      return;
    }
    // update the spreadsheet with the updated slp
    await updateSlpAccountSheet(rowIndex, currentSlp);
  } catch(err) {
    const errorEmbed = new MessageEmbed()
      .setColor('#ff0000')
      .setTitle('Something went wrong! Ay AmBot!');
    channel.send({ embeds: [errorEmbed] });
    console.error(err);
  }
}