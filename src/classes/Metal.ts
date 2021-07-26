export default class Metal {
    static format(keys: number | undefined | null, ref: number | undefined | null, sep: string = ", ") : string {
        let str = [];
        if (keys) str.push(keys + " key" + (keys > 1 ? 's' : 0));
        if (ref) str.push(ref + " ref");
        return str.join(sep);
    }

    static multiplyKeys(keys: number, rate: number) {
        return Metal.multiply(rate, keys);
    }

    static multiply(ref: number, times: number) {
        let x = Array(times).fill(ref);
        return Metal.sum(...x);
    }

    static sum(...ref: number[]) {
        let total = ref.filter(x => !isNaN(x)).map(Metal.toScrap).reduce((a, b) => a + b, 0);
        if (Math.trunc(total) === total)
            return total;
        return Number((total / 9).toFixed(2));
    }

    static toScrap(ref: number) {
        return Math.ceil(ref / 9);
    }
}
