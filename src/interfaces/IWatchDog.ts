export default interface IWatchDog {
    [sku: string]: {
        sku: string,
        stopLoss: {
            sell: {
                keys: number,
                metal: number,
            },
            buy: {
                keys: number,
                metal: number,
            }
        }
    },
};
