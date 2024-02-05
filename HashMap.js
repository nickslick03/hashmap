class HashMap {

    #buckets = [];
    #length;
    #loadFactor;

    static #hash(key) {
        let hashCode = 0;
        const primeNumber = 31;
        for (let i = 0; i < key.length; i++) {
            hashCode = primeNumber * hashCode + key.charCodeAt(i);
        }
        return hashCode;
    }

    constructor(length, loadFactor = .75) {
        this.#length = length;
        this.#loadFactor = loadFactor;
    }

    get length() {
        return this.#length;
    }

    #isPastLoadFactor() {
        const currLoad = this.#buckets.reduce((prev, curr) => curr !== undefined ? prev + 1 : prev, 0) / this.#length;
        return currLoad > this.#loadFactor;
    }

    #resize() {
        const entryList = this.entries();
        this.#buckets = [];
        this.#length += 16;
        entryList.forEach(entry => this.set(entry[0], entry[1]));
    }

    set(key, value) {
        const hashedKey = HashMap.#hash(key);
        this.#buckets[hashedKey % this.#length] = {
            key,
            hashedKey,
            value
        };
        if (this.#isPastLoadFactor()) this.#resize();
    }

    get(key) {
        const hashedKey = HashMap.#hash(key);
        const node = this.#buckets[hashedKey % this.#length];
        if (node == undefined || node.hashedKey !== hashedKey) 
            return null;
        return node.value;
    }

    remove(key) {
        const hashedKey = HashMap.#hash(key);
        const index = hashedKey % this.#length;
        if (this.#buckets[index] == undefined
            || this.#buckets[index].hashedKey !== hashedKey) 
            return false;
        this.#buckets.splice(index, 1);
        return true;
    }

    clear() {
        this.#buckets = [];
    }

    keys() {
        return this.#buckets
            .filter(node => node !== undefined)
            .map(({key}) => key);
    }

    values() {
        return this.#buckets
            .filter(node => node !== undefined)
            .map(({value}) => value);
    }

    entries() {
        return this.#buckets
            .filter(node => node !== undefined)
            .map(({key, value}) => [key, value]);
    }
}

const h = new HashMap(16);

[...'abcdefghijklmnopqrstuvwxyz'].forEach((char, index) => {
    h.set(char, index);
    console.log({
        length: h.length,
        entries: h.entries(),
    })
});

console.log(h.get('z'), h.get('u'))
