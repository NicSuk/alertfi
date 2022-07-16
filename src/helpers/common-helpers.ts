const getCurrentFormattedDate = (): string => {
    var currentdate = new Date();
    return currentdate.getDate().toString().padStart(2, '0') + "-"
        + (currentdate.getMonth() + 1).toString().padStart(2, '0') + "-"
        + currentdate.getFullYear() + " "
        + currentdate.getHours().toString().padStart(2, '0') + ":"
        + currentdate.getMinutes().toString().padStart(2, '0') + ":"
        + currentdate.getSeconds().toString().padStart(2, '0');
}

const formattedConsoleLog = (message: string) => {
    console.log(`${getCurrentFormattedDate()} || ${message}`);
}

export {
    getCurrentFormattedDate,
    formattedConsoleLog
};