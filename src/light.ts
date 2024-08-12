import Tuple from "./maths/tuple.ts";

export default class PointLight {
    constructor(public position: Tuple, public intensity: Tuple) {
    }
}