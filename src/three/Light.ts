import THREE, { HemisphereLight } from 'three'
import { BFObject } from '../types';
import uuid from 'uuid';

export default class Light implements BFObject {

    id: string = uuid.v4();
    hemiLight: HemisphereLight;

    constructor() {
        this.hemiLight = new HemisphereLight(0xeeeeff, 0x777788, 0.75);
        this.hemiLight.position.set(0.5, 1, 0.75);
        // TODO: if there are more lights - add methods to iterate over and add them all
    }

    get() {
        return this.hemiLight;
    }
}
