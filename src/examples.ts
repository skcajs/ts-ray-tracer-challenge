import Canvas from "./canvas.ts";
import {colour, point} from "./maths/tuple.ts";
import {translation} from "./maths/transformations.ts";

const Examples = (canvas: Canvas) => {
    const clock = () => {
        for (let i = 0; i < 12; ++i) {
            const radius = 200;
            const angle = (2 * Math.PI / 12) * i;
            let point = point(0, 0, 0);
            const t = translation(radius * Math.cos(angle), radius * Math.sin(angle), 0);
            point = t.multiplyTuple(point);
            canvas.drawPixel(point.x, point.y, colour(1, 0, 1), 4);
        }
    }

    return {
        clock,
    }
}

export default Examples;