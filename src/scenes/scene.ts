import sphereWorld from "./sphereWorld.ts";
import spheresWorld from "./spheres.ts";
import spheresWorld2 from "./spheres2.ts";
import patternWorld from "./patternWorld.ts";

export default function loadScene(name: string) {
    switch (name) {
        case "sphere":
            return sphereWorld();
        case "spheres":
            return spheresWorld();
        case "spheres2":
            return spheresWorld2();
        case "pattern":
            return patternWorld();
        default:
            return sphereWorld();
    }
}