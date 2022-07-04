import { ethers } from 'ethers';
import alertFiDefinitions from './alert-definitions';
import ChainIds from './entities/chainIds';
import * as providerHelpers from './helpers/provider-helpers';

const alertFiContracts = alertFiDefinitions.map(def => {
    switch (def.networkId) {
        case ChainIds.Polygon:
            return {
                contract: new ethers.Contract(def.contractAddress, def.contractAbi, providerHelpers.provider_polygon),
                contractParam: def.contractParam,
                method: def.method,
                alertValue: def.alertValue,
                name: def.name,
                methodResultProperty: def.methodResultProperty,
                parseResult: def.parseResult
            }
        case ChainIds.Optimism:
            return {
                contract: new ethers.Contract(def.contractAddress, def.contractAbi, providerHelpers.provider_optimism),
                contractParam: def.contractParam,
                method: def.method,
                alertValue: def.alertValue,
                name: def.name,
                methodResultProperty: def.methodResultProperty,
                parseResult: def.parseResult
            }
        case ChainIds.Gnosis:
            return {
                contract: new ethers.Contract(def.contractAddress, def.contractAbi, providerHelpers.provider_gnosis),
                contractParam: def.contractParam,
                method: def.method,
                alertValue: def.alertValue,
                name: def.name,
                methodResultProperty: def.methodResultProperty,
                parseResult: def.parseResult
            }
    }
})

async function start() {
    for (let alertFiContract of alertFiContracts) {
        if (alertFiContract) {
            const result = await alertFiContract.contract[alertFiContract.method](alertFiContract.contractParam);
            const resultToRead = alertFiContract.methodResultProperty ? result[alertFiContract.methodResultProperty] : result;
            const parseResult = alertFiContract.parseResult || 0;
            console.log(`${alertFiContract.name}: ${ethers.utils.formatUnits(resultToRead, parseResult)}`);
            
            const resultBN = ethers.BigNumber.from(resultToRead);
            const alertValueBN =  ethers.BigNumber.from(alertFiContract.alertValue)
            if (resultBN.lte(alertValueBN)) {
                providerHelpers.sendTelegramMessage(`${alertFiContract.name}: ${ethers.utils.formatUnits(resultToRead, parseResult)}`)
            }
        }
    }
    console.log(`----------------`);
    setTimeout(start, 10000);
}

start();