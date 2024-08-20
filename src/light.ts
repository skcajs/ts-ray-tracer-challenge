import Tuple from "./tuple.ts";

export default class Light {
    constructor(public position: Tuple, public intensity: Tuple) {
    }
}

export const pointLight = (position: Tuple, intensity: Tuple) => {
    return new Light(position, intensity);
}