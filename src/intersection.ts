import Sphere from "./sphere.ts";

export default class Intersection {
    constructor(public t: number, public object: Sphere) {}
}