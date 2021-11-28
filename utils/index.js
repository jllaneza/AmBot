const fetch = require('node-fetch');
const { spreadsheetId } = require('../jsons/config.json');
const { google } = require('googleapis');

async function getStats(address) {
  const response = await fetch(`https://game-api.axie.technology/api/v1/0x${address}`);
  const { in_game_slp: slp, name, mmr } = await response.json() || {};

  return {
    slp,
    name,
    mmr
  };
}

async function getSheetAccounts(index) {
  const auth = new google.auth.GoogleAuth({
    keyFile: 'jsons/credentials.json',
    scopes: 'https://www.googleapis.com/auth/spreadsheets'
  });
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });
  const rows = await sheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: `Accounts!D${index}:F${index}`,
  });
  const [totalSlp = 0, adjustment = 0, share = 0] = rows.data.values[0] || [];

  return {
    totalSlp,
    adjustment,
    share
  };
}

async function updateSlpAccountSheet(index, slp) {
  const auth = new google.auth.GoogleAuth({
    keyFile: 'jsons/credentials.json',
    scopes: 'https://www.googleapis.com/auth/spreadsheets'
  });
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });
  await sheets.spreadsheets.values.update({
    auth,
    spreadsheetId,
    range: `Accounts!D${index}`,
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [[slp]],
    },
  });
}

module.exports = {
  getStats,
  getSheetAccounts,
  updateSlpAccountSheet
};