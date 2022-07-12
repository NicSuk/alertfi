import 'dotenv/config';
import { ethers } from 'ethers';
import { Telegraf } from 'telegraf'
import { TelegramAlertTypes } from '../entities/common.entities';

const botToken = process.env.BOT_TOKEN as string;
const bot = new Telegraf(botToken);
const infoChatId = '-1001668116222';
const urgentChatId = '-1001617100685';
const warnChatId = '-1001619416848';
const confirmChatId = '-1001502801995';

const providerPolygon = process.env.PROVIDER_POLYGON as string;
let provider_polygon = ethers.providers.getDefaultProvider(providerPolygon);

const providerOptimism = process.env.PROVIDER_OPTIMISM as string;
let provider_optimism = ethers.providers.getDefaultProvider(providerOptimism);

const providerGnosis = process.env.PROVIDER_GNOSIS as string;
let provider_gnosis = ethers.providers.getDefaultProvider(providerGnosis);

const providerArbitrum = process.env.PROVIDER_ARBITRUM as string;
let provider_arbitrum = ethers.providers.getDefaultProvider(providerArbitrum);

setInterval(() => {
    provider_polygon = ethers.providers.getDefaultProvider(providerPolygon);
    provider_optimism = ethers.providers.getDefaultProvider(providerOptimism);
    provider_gnosis = ethers.providers.getDefaultProvider(providerGnosis);
	provider_arbitrum = ethers.providers.getDefaultProvider(providerArbitrum);
}, 2 * 1000 * 60);

const sendTelegramMessage = (title: string, message: string, alertType: TelegramAlertTypes = TelegramAlertTypes.INFO) => {
	switch (alertType) {
		case TelegramAlertTypes.CONFIRM:
			bot.telegram.sendMessage(confirmChatId, `[${title}]\r\n${message}`);
			break;
		case TelegramAlertTypes.INFO:
			bot.telegram.sendMessage(infoChatId, `[${title}]\r\n${message}`);
			break;
		case TelegramAlertTypes.URGENT:
			bot.telegram.sendMessage(urgentChatId, `[${title}]\r\n${message}`);
			break;
		case TelegramAlertTypes.WARNING:
			bot.telegram.sendMessage(warnChatId, `[${title}]\r\n${message}`);
			break;
	}
};

export {
    provider_polygon,
    provider_optimism,
    provider_gnosis,
	provider_arbitrum,
    sendTelegramMessage
};