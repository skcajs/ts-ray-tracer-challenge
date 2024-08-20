import sphereWorld from "./sphere.ts";
import spheresWorld from "./spheres.ts";
import spheresWorld2 from "./spheres2.ts";

export default function loadScene(name: string) {
    switch (name) {
        case "sphere":
            return sphereWorld();
        case "spheres":
            return spheresWorld();
        case "spheres2":
            return spheresWorld2();
        default:
            return sphereWorld();
    }
}