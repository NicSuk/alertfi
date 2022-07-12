import { ethers } from 'ethers';
import alertFiDefinitions from './alert-definitions';
import ChainIds from './entities/chainIds';
import * as commonHelpers from './helpers/common-helpers';
import * as providerHelpers from './helpers/provider-helpers';


let lastTelegramMessage: { timestamp: number, message: string } = { timestamp: 0, message: '' };
const alertFiContracts = alertFiDefinitions.map(def => {
    let alertFiContract = {
        contractParam: def.contractParam,
        method: def.method,
        alertValue: def.alertValue,
        name: def.name,
        methodResultProperty: def.methodResultProperty,
        parseResult: def.parseResult,
        compareMethod: def.compareMethod,
        alertType: def.alertType
    };
    switch (def.networkId) {
        case ChainIds.Polygon:
            return {
                ...alertFiContract,
                contract: new ethers.Contract(def.contractAddress, def.contractAbi, providerHelpers.provider_polygon)
            }
        case ChainIds.Optimism:
            return {
                ...alertFiContract,
                contract: new ethers.Contract(def.contractAddress, def.contractAbi, providerHelpers.provider_optimism)
            }
        case ChainIds.Gnosis:
            return {
                ...alertFiContract,
                contract: new ethers.Contract(def.contractAddress, def.contractAbi, providerHelpers.provider_gnosis)
            }
        case ChainIds.Arbitrum:
            return {
                ...alertFiContract,
                contract: new ethers.Contract(def.contractAddress, def.contractAbi, providerHelpers.provider_arbitrum)
            }
    }
})

async function start() {
    for (let alertFiContract of alertFiContracts) {
        if (alertFiContract) {
            let result;
            if (alertFiContract.contractParam) {
                result = await alertFiContract.contract[alertFiContract.method](alertFiContract.contractParam);
            } else {
                result = await alertFiContract.contract[alertFiContract.method]();
            }
            const resultToRead = alertFiContract.methodResultProperty ? result[alertFiContract.methodResultProperty] : result;
            const parseResult = alertFiContract.parseResult || 0;
            commonHelpers.formattedConsoleLog(`${alertFiContract.name}: ${ethers.utils.formatUnits(resultToRead, parseResult)}`);

            const resultBN = ethers.BigNumber.from(resultToRead);
            const alertValueBN = ethers.BigNumber.from(alertFiContract.alertValue);
            const tgMessage = `${ethers.utils.formatUnits(resultToRead, parseResult)}`;
            const now = new Date();
            const nextTelegramMessage = new Date(lastTelegramMessage.timestamp + 5 * 60000);
            if (nextTelegramMessage < now && tgMessage !== lastTelegramMessage.message) {
                switch (alertFiContract.compareMethod) {
                    case 'gte':
                        if (resultBN.gte(alertValueBN)) {
                            providerHelpers.sendTelegramMessage(`${alertFiContract.name}`, tgMessage, alertFiContract.alertType);
                        }
                        break;
                    default:
                        if (resultBN.lte(alertValueBN)) {
                            providerHelpers.sendTelegramMessage(`${alertFiContract.name}`, tgMessage, alertFiContract.alertType);
                        }
                        break;
                }
                lastTelegramMessage.timestamp = now.getTime();
                lastTelegramMessage.message = tgMessage;
            }
        }
    }
    console.log(`----------------`);
    setTimeout(start, 10000);
}

start();