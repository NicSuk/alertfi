
export enum TelegramAlertTypes {
	WARNING,
	URGENT,
	INFO,
	CONFIRM
}

export enum ChainIds {
	MATIC = '137',
	BSC = '56',
	FTM = '250',
	MILK = '2001',
	OPTIMISM = '10',
	GNOSIS = '100'
}

export interface AlertFiDefinition {
    method: string;
    alertType: TelegramAlertTypes;
    name: string;
    alertValue: string | number;
    contractAddress: string;
    contractAbi: any;
    networkId: number;
    parseResult?: number; // Parse the result with X decimals
    compareMethod?: 'gte' | 'lte';
    contractParam?: string | number; // Parameter needed on the contract call
    methodResultProperty?: string; // Property to read from the contract call
}