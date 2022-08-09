import { Image, Uuid } from '../../src';

export function generateImage(defaultValue?: Partial<Image>): Image {
    return {
        id: new Uuid(),
        path: new Uuid().short(),
        ...defaultValue
    };
}
