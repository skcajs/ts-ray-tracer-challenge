import {rotation, scaling, shearing, Transformation, translation} from "./transformations.ts";

export default class Tuple implements Transformation {
    constructor(public x: number = 0, public y: number = 0, public z: number = 0, public w: number = 0) {
    }

    add(other: Tuple): Tuple {
        return new Tuple(this.x + other.x, this.y + other.y, this.z + other.z, this.w + other.w);
    }

    subtract(other: Tuple): Tuple {
        return new Tuple(this.x - other.x, this.y - other.y, this.z - other.z, this.w - other.w);
    }

    multiply(other: number): Tuple {
        return new Tuple(this.x * other, this.y * other, this.z * other, this.w * other);
    }

    multiplyTuple(other: Tuple): Tuple {
        return new Tuple(this.x * other.x, this.y * other.y, this.z * other.z, this.w * other.w);
    }

    divide(other: number): Tuple {
        return new Tuple(this.x / other, this.y / other, this.z / other, this.w / other);
    }

    magnitude(): number {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2) + Math.pow(this.w, 2));
    }

    normalize(): Tuple {
        return new Tuple(this.x / this.magnitude(), this.y / this.magnitude(), this.z / this.magnitude(), this.w / this.magnitude());
    }

    dot(other: Tuple): number {
        return this.x * other.x + this.y * other.y + this.z * other.z + other.w * other.w * other.w;
    }

    cross(other: Tuple): Tuple {
        return new Tuple(this.y * other.z - this.z * other.y,
            this.z * other.x - this.x * other.z,
            this.x * other.y - this.y * other.x);
    }

    rotate(axis: number, angle: number): Tuple {
        return rotation(axis, angle).multiplyTuple(this);
    }

    scale(tx: number, ty: number, tz: number): Tuple {
        return scaling(tx, ty, tz).multiplyTuple(this);
    }

    shear(xy: number, xz: number, yx: number, yz: number, zx: number, zy: number): Tuple {
        return shearing(xy, xz, yx, yz, zx, zy).multiplyTuple(this);
    }

    translate(tx: number, ty: number, tz: number): Tuple {
        return translation(tx, ty, tz).multiplyTuple(this);
    }

    reflect(normal: Tuple): Tuple {
        return this.subtract(normal.multiply(2).multiply(this.dot(normal)));
    }

    /* Colour Specific functions */

    get r(): number {
        return this.x;
    }

    get g(): number {
        return this.y;
    }

    get b(): number {
        return this.z;
    }

    get a(): number {
        return this.w;
    }

    data(): number[] {
        return [
            this.x * 255,
            this.y * 255,
            this.z * 255,
            this.w * 255,
        ]
    }
}

export function point(x: number, y: number, z: number): Tuple {
    return new Tuple(x, y, z, 1);
}

export function vector(x: number, y: number, z: number): Tuple {
    return new Tuple(x, y, z, 0);
}

export function unitVector(x: number, y: number, z: number): Tuple {
    return new Tuple(x, y, z, 0).normalize();
}

export function colour(r: number, g: number, b: number, a: number = 1.0): Tuple {
    return new Tuple(r, g, b, a);
}

export function parseColor(t: Tuple): Tuple {
    return new Tuple(t.x, t.y, t.z, 1.0);
}

export function black(): Tuple {
    return new Tuple(0, 0, 0, 1);
}

export function white(): Tuple {
    return new Tuple(1, 1, 1, 1);
}

export function red(): Tuple {
    return new Tuple(1, 0, 0, 1);
}

export function green(): Tuple {
    return new Tuple(0, 1, 0, 1);
}

export function blue(): Tuple {
    return new Tuple(0, 0, 1, 1);
}

export function purple(): Tuple {
    return new Tuple(1, 0, 1, 1);
}