import Matrix, {identity, makeMatrix} from "./matrix.ts";
import Tuple from "./tuple.ts";

export interface Transformation {
    translate(tx: number, ty: number, tz: number): Tuple | Matrix;

    rotate(axis: number, angle: number): Tuple | Matrix;

    scale(tx: number, ty: number, tz: number): Tuple | Matrix;

    shear(xy: number, xz: number, yx: number, yz: number, zx: number, zy: number): Tuple | Matrix;
}

export function translation(tx: number, ty: number, tz: number) {
    const result = identity();
    result.setElement(0, 3, tx);
    result.setElement(1, 3, ty);
    result.setElement(2, 3, tz);
    return result;
}

export function scaling(tx: number, ty: number, tz: number) {
    const result = identity();
    result.setElement(0, 0, tx);
    result.setElement(1, 1, ty);
    result.setElement(2, 2, tz);
    return result;
}

export function rotation(axis: number, angle: number) {
    const result = identity();
    switch (axis) {
        case 0:
            result.setElement(1, 1, Math.cos(angle));
            result.setElement(1, 2, -Math.sin(angle));
            result.setElement(2, 1, Math.sin(angle));
            result.setElement(2, 2, Math.cos(angle));
            break;
        case 1:
            result.setElement(0, 0, Math.cos(angle));
            result.setElement(0, 2, Math.sin(angle));
            result.setElement(2, 0, -Math.sin(angle));
            result.setElement(2, 2, Math.cos(angle));
            break;
        case 2:
            result.setElement(0, 0, Math.cos(angle));
            result.setElement(0, 1, -Math.sin(angle));
            result.setElement(1, 0, Math.sin(angle));
            result.setElement(1, 1, Math.cos(angle));
            break;
        default:
            throw new Error('Unrecognized axis when trying to rotate');
    }
    return result;
}

export function shearing(xy: number, xz: number, yx: number, yz: number, zx: number, zy: number) {
    return makeMatrix([
        1, xy, xz, 0,
        yx, 1, yz, 0,
        zx, zy, 1, 0,
        0, 0, 0, 1,
    ]);
}

export function viewTransform(from: Tuple, to: Tuple, up: Tuple) {
    const forward = to.subtract(from).normalize();
    const left = forward.cross(up.normalize());
    const trueUp = left.cross(forward);
    const orientation = makeMatrix([
        left.x, left.y, left.z, 0,
        trueUp.x, trueUp.y, trueUp.z, 0,
        -forward.x, -forward.y, -forward.z, 0,
        0, 0, 0, 1
    ]);
    return orientation.multiply(translation(-from.x, -from.y, -from.z));
}