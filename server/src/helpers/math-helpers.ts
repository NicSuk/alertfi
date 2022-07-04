import { BigNumber, ethers } from "ethers";

function substractBigNumber(minuend: { amount: BigNumber, decimals: number }, subtrahend: { amount: BigNumber, decimals: number }) {
    let result, decimals;
    const subtrahendAmount = convertBigNumberDecimals(subtrahend.amount, subtrahend.decimals, minuend.decimals);
    result = minuend.amount.sub(subtrahendAmount);
    decimals = minuend.decimals;
    return { amount: result, decimals };
}

function addBigNumber(addend1: { amount: BigNumber, decimals: number }, addend2: { amount: BigNumber, decimals: number }) {
    let result, decimals;
    if (addend1.decimals > addend2.decimals) {
        const addendAmount = convertBigNumberDecimals(addend2.amount, addend2.decimals, addend1.decimals);
        result = addend1.amount.add(addendAmount);
        decimals = addend1.decimals;
    } else {
        const addendAmount = convertBigNumberDecimals(addend1.amount, addend1.decimals, addend2.decimals);
        result = addendAmount.add(addend2.amount);
        decimals = addend2.decimals;
    }
    return { amount: result, decimals };
}

function convertBigNumberDecimals(amount: BigNumber, amountDecimals: number, newDecimals: number): BigNumber {
    let newAmount = BigNumber.from(0);
    const amountFormatted = ethers.utils.formatUnits(amount, amountDecimals);
    const amountSplitted = amountFormatted.split('.');
    if (amountSplitted.length > 1) {
        if (newDecimals > amountDecimals) {
            amountSplitted[1] = amountSplitted[1].padEnd(newDecimals, '0');
        } else {
            if (amountSplitted[1].length > newDecimals) {
                amountSplitted[1] = amountSplitted[1].substr(0, newDecimals);
            } else {
                amountSplitted[1] = amountSplitted[1].padEnd(newDecimals, '0');
            }
        }
        newAmount = BigNumber.from(amountSplitted.join(''));
        return newAmount;
    } else {
        throw ('Nope');
    }
}

function toFixedTrunc6Digits(number: Number) {
    const match = number.toString().match(/^-?\d+(?:\.\d{0,6})?/);
    if (match && match.length > 0) {
        return Number(match[0]);
    } else {
        throw ('error');
    }
}

export {
    substractBigNumber,
    addBigNumber,
    convertBigNumberDecimals,
    toFixedTrunc6Digits
}