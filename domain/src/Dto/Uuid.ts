import { v4 as uuidv4 } from 'uuid';
import short from 'short-uuid';

export class Uuid {
    #value: string;
    constructor(longVersion?: string) {
        if (longVersion) {
            this.#value = longVersion;
        } else {
            this.#value = uuidv4();
        }
    }

    toString() {
        return this.#value;
    }

    short() {
        return short().fromUUID(this.#value);
    }
}
