const TelegramBot = require("node-telegram-bot-api");
const NewsApi = require("newsapi");
const express = require('express');
require('dotenv').config();

const token = "process.env.BOT_TOKEN"; //Telegram Bot Token
const Api_Key = "process.env.API_KEY"; //Api News Key dari newsapi.org

const bot = new TelegramBot(token, { polling: true });

// Definisikan prefix global
let prefix = "!";

// Fungsi untuk membuat regex command dengan prefix
const createCommandRegex = (command) => new RegExp(`^${prefix}${command}$`);

// Command regex
const sayHi = createCommandRegex("halo");
const gempa = createCommandRegex("gempa");
const beritaIndo = createCommandRegex("beritaIndo");
const beritaJpn = createCommandRegex("beritaJpn");
const beritaUs = createCommandRegex("beritaUs");
const commands = createCommandRegex("commands");

// SayHi start
bot.onText(sayHi, (callback) => {
  bot.sendMessage(callback.from.id, "Halo juga!");
});
// SayHi End

// gempa start
bot.onText(gempa, async (callback) => {
  const BMKG_ENDPOINT = "https://data.bmkg.go.id/DataMKG/TEWS/";

  const apiCall = await fetch(BMKG_ENDPOINT + "autogempa.json");
  const {
    Infogempa: {
      gempa: { Jam, Magnitude, Tanggal, Wilayah, Potensi, Kedalaman, Shakemap },
    },
  } = await apiCall.json();
  const BMKGImage = BMKG_ENDPOINT + Shakemap;

  const resultText = `
  Waktu ${Tanggal} | ${Jam}
  Besaran: ${Magnitude} SR
  Wilayah: ${Wilayah}
  Kedalaman: ${Kedalaman}
  Potensi: ${Potensi}
  `;

  bot.sendPhoto(callback.from.id, BMKGImage, {
    caption: resultText,
  });
});
// gempa End

// BeritaIndo start
bot.onText(beritaIndo, async (callback) => {
  const NEWS_API_ENDPOINT = `https://newsapi.org/v2/top-headlines?country=id&apiKey=${Api_Key}`;

  const response = await fetch(NEWS_API_ENDPOINT);
  const { articles } = await response.json();

  const topArticle = articles[0];
  const { title, description, url } = topArticle;

  const newsText = `
    Berita Terbaru:
    ${title}
    ${description}
    Baca lebih lanjut: ${url}
  `;

  bot.sendMessage(callback.from.id, newsText);
});
// BeritaIndo End

// BeritaJpn start
bot.onText(beritaJpn, async (callback) => {
  const NEWS_API_ENDPOINT = `https://newsapi.org/v2/top-headlines?country=jp&apiKey=${Api_Key}`;

  const response = await fetch(NEWS_API_ENDPOINT);
  const { articles } = await response.json();

  const topArticle = articles[0];
  const { title, description, url } = topArticle;

  const newsText = `
    Berita Terbaru:
    ${title}
    ${description}
    Baca lebih lanjut: ${url}
  `;

  bot.sendMessage(callback.from.id, newsText);
});

// BeritaJpn End

// BeritaUs Start
bot.onText(beritaUs, async (callback) => {
  const NEWS_API_ENDPOINT = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${Api_Key}`;

  const response = await fetch(NEWS_API_ENDPOINT);
  const { articles } = await response.json();

  const topArticle = articles[0];
  const { title, description, url } = topArticle;

  const newsText = `
    Berita Terbaru:
    ${title}
    ${description}
    Baca lebih lanjut: ${url}
  `;

  bot.sendMessage(callback.from.id, newsText);
});
// BeritaUs End

// commands Start
bot.onText(commands, (callback) => {
  const commandList = [
    { text: `${prefix}halo`, description: "Menampilkan sapaan" },
    {
      text: `${prefix}gempa`,
      description: "Menampilkan informasi gempa terkini",
    },
    {
      text: `${prefix}beritaIndo`,
      description: "Menampilkan berita terbaru dari Indonesia",
    },
    {
      text: `${prefix}beritaJpn`,
      description: "Menampilkan berita terbaru dari Jepang",
    },
    {
      text: `${prefix}beritaUs`,
      description: "Menampilkan berita terbaru dari Amerika Serikat",
    },
  ];

  const keyboard = {
    reply_markup: {
      inline_keyboard: commandList.map((command) => [
        { text: command.text, callback_data: command.text },
      ]),
    },
  };

  bot.sendMessage(callback.from.id, "Daftar Perintah yang tersedia:", keyboard);
});
// commands End
