import sphereWorld from "./sphereWorld.ts";
import spheresWorld from "./spheresWorld.ts";
import spheresWorld2 from "./planeWorld.ts";
import patternWorld from "./patternWorld.ts";
import reflectionWorld from "./reflectionWorld.ts";
import refractionWorld from "./refractionWorld.ts";
import cubeWorld from "./cubeWorld.ts";
import hexagonWorld from "./hexagonWorld.ts";

export enum Scene {
    SPHERE_WORLD,
    SPHERES_WORLD,
    PLANE_WORLD,
    PATTERN_WORLD,
    REFLECTION_WORLD,
    REFRACTION_WORLD,
    CUBE_WORLD,
    HEXAGON_WORLD
}

export default function loadScene(name: Scene) {
    switch (name) {
        case Scene.SPHERE_WORLD:
            return sphereWorld();
        case Scene.SPHERES_WORLD:
            return spheresWorld();
        case Scene.PLANE_WORLD:
            return spheresWorld2();
        case Scene.PATTERN_WORLD:
            return patternWorld();
        case Scene.REFLECTION_WORLD:
            return reflectionWorld();
        case Scene.REFRACTION_WORLD:
            return refractionWorld();
        case Scene.CUBE_WORLD:
            return cubeWorld();
        case Scene.HEXAGON_WORLD:
            return hexagonWorld();
        default:
            return sphereWorld();
    }
}