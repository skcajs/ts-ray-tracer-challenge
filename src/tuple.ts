import {rotation, scaling, shearing, Transformation, translation} from "./transformations.ts";

export default class Tuple implements Transformation {
    constructor(public x: number = 0, public y: number = 0, public z: number = 0, public w: number = 0) {
    }

    get(a: number): number {
        if (a == 0) return this.x;
        if (a == 1) return this.y;
        if (a == 2) return this.z;
        if (a == 3) return this.w;
        throw new Error("Tried returning axis that is not defined.");
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
        if (this.magnitude() > 0) {
            return new Tuple(this.x / this.magnitude(), this.y / this.magnitude(), this.z / this.magnitude(), this.w / this.magnitude());
        }
        return new Tuple(this.x, this.y, this.z, this.w);
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
            this.w * 255
        ];
    }
}

export function makePoint(x: number, y: number, z: number): Tuple {
    return new Tuple(x, y, z, 1);
}

export function makeVector(x: number, y: number, z: number): Tuple {
    return new Tuple(x, y, z, 0);
}

export function unitVector(x: number, y: number, z: number): Tuple {
    return new Tuple(x, y, z, 0).normalize();
}

export function makeColor(r: number, g: number, b: number, a: number = 1.0): Tuple {
    return new Tuple(r, g, b, a);
}

export function parseColor(t: Tuple): Tuple {
    return new Tuple(t.x, t.y, t.z, 1.0);
}

export const black = () => {
    return new Tuple(0, 0, 0, 1);
};

export const white = () => {
    return new Tuple(1, 1, 1, 1);
};

export const red = () => {
    return new Tuple(1, 0, 0, 1);
};

export const green = () => {
    return new Tuple(0, 1, 0, 1);
};

export const blue = () => {
    return new Tuple(0, 0, 1, 1);
};

export const purple = () => {
    return new Tuple(1, 0, 1, 1);
};