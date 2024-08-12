import Tuple, {black} from "../maths/tuple.ts";
import Ray from "../ray.ts";
import Intersections from "../intersections.ts";
import PointLight from "../light.ts";

export const integrator = (r: Ray, xs: Intersections, light: PointLight): Tuple => {
    let color = black();

    const hit = xs.hit();
    if (hit) {
        const point = r.position(hit.t);
        const normal = hit.object.normalAt(point);
        const eye = r.direction.multiply(-1);
        color = hit.object.material.lighting(light, point, eye, normal);
    }
    return color;
}
