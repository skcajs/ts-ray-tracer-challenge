import Matrix from "../matrix.ts";
import Material, {material} from "../material.ts";

abstract class Shape {
    transform: Matrix = Matrix.Identity();
    material: Material = material();

    setTransform(t: Matrix) {
        this.transform = t;
    }
}

export default Shape;