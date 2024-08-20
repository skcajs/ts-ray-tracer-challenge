import Spheres from "./spheres.ts";
import Spheres2 from "./spheres2.ts";

export default function loadScene(name: string) {
    switch (name) {
        case "spheres":
            return Spheres();
        case "spheres2":
            return Spheres2();
        default:
            return Spheres();
    }
}