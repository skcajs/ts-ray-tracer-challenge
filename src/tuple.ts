import {rotation, scaling, shearing, Transformation, translation} from "./transformations.ts";

export default class Tuple implements Transformation {
    constructor(public x: number = 0, public y: number = 0, public z: number = 0, public w: number = 0) {}

    add(other: Tuple): Tuple {
        return new Tuple(this.x + other.x, this.y + other.y, this.z + other.z, this.w + other.w);
    }

    subtract(other: Tuple): Tuple {
        return new Tuple(this.x - other.x, this.y - other.y, this.z - other.z, this.w - other.w);
    }

    multiply(other: number): Tuple {
        return new Tuple(this.x * other, this.y * other, this.z * other, this.w * other);
    }

    divide(other: number): Tuple {
        return new Tuple(this.x / other, this.y / other, this.z / other, this.w / other);
    }

    magnitude(): number {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2) + Math.pow(this.w, 2));
    }

    normalize() : Tuple {
        return new Tuple(this.x/this.magnitude(), this.y/this.magnitude(), this.z/this.magnitude(), this.w/this.magnitude());
    }

    dot(other: Tuple) : number {
        return this.x * other.x + this.y * other.y + this.z * other.z + other.w * other.w * other.w;
    }

    cross(other: Tuple) : Tuple {
        return new Tuple(this.y * other.z - this.z * other.y,
            this.z * other.x - this.x * other.z,
            this.x * other.y - this.y * other.x);
    }

    rotate(axis: number, angle: number): Tuple {
        return rotation(axis, angle).multiplyTuple(this);
    }

    scale(tx:number, ty:number, tz:number): Tuple {
        return scaling(tx, ty, tz).multiplyTuple(this);
    }

    shear(xy: number, xz: number, yx: number, yz: number, zx: number, zy: number): Tuple {
        return shearing(xy, xz, yx, yz, zx, zy).multiplyTuple(this);
    }

    translate(tx: number, ty: number, tz: number): Tuple {
        return translation(tx, ty, tz).multiplyTuple(this);
    }
}

export class Color {
    constructor(
        public r: number = 0,
        public g: number = 0,
        public b: number = 0,
        public a: number = 1
    ) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    data() : number[] {
        return [
            this.r * 255,
            this.g * 255,
            this.b * 255,
            this.a * 255,
        ]
    }
}

export function makePoint(x: number, y: number, z: number): Tuple {
    return new Tuple(x,y,z,1);
}

export function makeVector(x: number, y: number, z: number): Tuple {
    return new Tuple(x,y,z,0);
}

export function makeUnitVector(x: number, y: number, z: number): Tuple {
    return new Tuple(x,y,z,0).normalize();
}

export function makeColor(r: number, g: number, b: number, a: number = 1.0): Color {
    return new Color(r,g,b,a);
}