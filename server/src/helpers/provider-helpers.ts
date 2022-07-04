import 'dotenv/config';
import { ethers } from 'ethers';
import { Telegraf } from 'telegraf'

const botToken = process.env.BOT_TOKEN as string;
const bot = new Telegraf(botToken);
const chatId = '-526667557';

const providerPolygon = process.env.PROVIDER_POLYGON as string;
let provider_polygon = ethers.providers.getDefaultProvider(providerPolygon);

const providerOptimism = process.env.PROVIDER_OPTIMISM as string;
let provider_optimism = ethers.providers.getDefaultProvider(providerOptimism);

const providerGnosis = process.env.PROVIDER_GNOSIS as string;
let provider_gnosis = ethers.providers.getDefaultProvider(providerGnosis);

setInterval(() => {
    provider_polygon = ethers.providers.getDefaultProvider(providerPolygon);
    provider_optimism = ethers.providers.getDefaultProvider(providerOptimism);
    provider_gnosis = ethers.providers.getDefaultProvider(providerGnosis);
}, 2 * 1000 * 60);

const sendTelegramMessage = (message: string) => {
    bot.telegram.sendMessage(chatId, message);
}

export {
    provider_polygon,
    provider_optimism,
    provider_gnosis,
    sendTelegramMessage
};