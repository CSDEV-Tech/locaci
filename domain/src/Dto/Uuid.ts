import { v4 as uuidv4 } from 'uuid';
import short from 'short-uuid';

export class Uuid {
    private value: string;
    constructor(longVersion?: string) {
        if (longVersion) {
            this.value = longVersion;
        } else {
            this.value = uuidv4();
        }
    }

    toString() {
        return this.value;
    }

    short() {
        return short().fromUUID(this.value).toString();
    }

    static fromShort(shortUUID: string) {
        return new Uuid(short().toUUID(shortUUID));
    }
}
