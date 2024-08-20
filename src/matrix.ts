// noinspection PointlessArithmeticExpressionJS,DuplicatedCode

import Tuple from './tuple.ts';
import {rotation, scaling, shearing, Transformation, translation} from "./transformations.ts";

export default abstract class Matrix implements Transformation {
    readonly e: number[];
    readonly size: number;

    protected constructor(data: number[]) {
        this.e = data;
        this.size = Math.floor(Math.sqrt(data.length));
    }

    getElement(row: number, col: number): number {
        if (row < 0 || row >= this.size || col < 0 || col >= this.size) {
            throw new Error("Invalid indices for matrix.");
        }
        return this.e[row * this.size + col];
    }

    setElement(row: number, col: number, value: number): void {
        if (row < 0 || row >= this.size || col < 0 || col >= this.size) {
            throw new Error("Invalid indices for matrix.");
        }
        this.e[row * this.size + col] = value;
    }

    equals(m: Matrix): boolean {
        const tolerance: number = 1e-5;
        if (this.size !== m.size) return false;

        return this.e.every((value, i) =>
            Math.abs(value - m.e[i]) < tolerance
        );
    }

    abstract multiply(m: Matrix): Matrix;

    abstract multiplyTuple(t: Tuple): Tuple;

    transpose(): Matrix {
        const result = identity(this.size);
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                result.e[j * this.size + i] = this.e[i * this.size + j];
            }
        }
        return result;
    }

    determinant(): number {
        if (this.size === 2)
            return this.e[0 * this.size + 0] * this.e[1 * this.size + 1] - this.e[0 * this.size + 1] * this.e[1 * this.size + 0];
        else {
            let det = 0;
            for (let col = 0; col < this.size; col++) {
                det += this.getElement(0, col) * this.cofactor(0, col);
            }
            return det;
        }
    }

    subMatrix(row: number, col: number): Matrix {
        const reducedSize = this.size - 1;
        const result = identity(reducedSize);
        let x = 0;
        for (let i = 0; i < this.size; i++) {
            if (i === row) continue;
            let y = 0;
            for (let j = 0; j < this.size; j++) {
                if (j === col) continue;
                result.e[x * reducedSize + y] = this.e[i * this.size + j];
                y++;
            }
            x++;
        }
        return result;
    }

    minor(row: number, col: number): number {
        return this.subMatrix(row, col).determinant();
    }

    cofactor(row: number, col: number): number {
        const minor = this.minor(row, col);
        if ((row + col) % 2 === 0) {
            return minor;
        }
        return -minor;
    }

    isInvertible(): boolean {
        return this.determinant() !== 0;
    }

    inverse(): Matrix {
        if (!this.isInvertible())
            throw new Error("Matrix is not invertible.");

        const size = this.size;
        const result = identity(size);
        const det = this.determinant();
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                result.e[col * size + row] = this.cofactor(row, col) / det;
            }
        }
        return result;
    }

    rotate(axis: number, angle: number): Matrix {
        return rotation(axis, angle).multiply(this);
    }

    scale(tx: number, ty: number, tz: number): Matrix {
        return scaling(tx, ty, tz).multiply(this);
    }

    shear(xy: number, xz: number, yx: number, yz: number, zx: number, zy: number): Matrix {
        return shearing(xy, xz, yx, yz, zx, zy).multiply(this);
    }

    translate(tx: number, ty: number, tz: number): Matrix {
        return translation(tx, ty, tz).multiply(this);
    }

}

class Matrix4 extends Matrix {

    constructor(data: number[]) {
        super(data);
    }

    multiply(m: Matrix): Matrix {
        const s = this.size;
        const result = makeMatrix(4);

        const me = m.e;
        const te = this.e;

        result.e[0 * s + 0] = te[0 * s + 0] * me[0 * s + 0] + te[0 * s + 1] * me[1 * s + 0] + te[0 * s + 2] * me[2 * s + 0] + te[0 * s + 3] * me[3 * s + 0];
        result.e[0 * s + 1] = te[0 * s + 0] * me[0 * s + 1] + te[0 * s + 1] * me[1 * s + 1] + te[0 * s + 2] * me[2 * s + 1] + te[0 * s + 3] * me[3 * s + 1];
        result.e[0 * s + 2] = te[0 * s + 0] * me[0 * s + 2] + te[0 * s + 1] * me[1 * s + 2] + te[0 * s + 2] * me[2 * s + 2] + te[0 * s + 3] * me[3 * s + 2];
        result.e[0 * s + 3] = te[0 * s + 0] * me[0 * s + 3] + te[0 * s + 1] * me[1 * s + 3] + te[0 * s + 2] * me[2 * s + 3] + te[0 * s + 3] * me[3 * s + 3];
        result.e[1 * s + 0] = te[1 * s + 0] * me[0 * s + 0] + te[1 * s + 1] * me[1 * s + 0] + te[1 * s + 2] * me[2 * s + 0] + te[1 * s + 3] * me[3 * s + 0];
        result.e[1 * s + 1] = te[1 * s + 0] * me[0 * s + 1] + te[1 * s + 1] * me[1 * s + 1] + te[1 * s + 2] * me[2 * s + 1] + te[1 * s + 3] * me[3 * s + 1];
        result.e[1 * s + 2] = te[1 * s + 0] * me[0 * s + 2] + te[1 * s + 1] * me[1 * s + 2] + te[1 * s + 2] * me[2 * s + 2] + te[1 * s + 3] * me[3 * s + 2];
        result.e[1 * s + 3] = te[1 * s + 0] * me[0 * s + 3] + te[1 * s + 1] * me[1 * s + 3] + te[1 * s + 2] * me[2 * s + 3] + te[1 * s + 3] * me[3 * s + 3];
        result.e[2 * s + 0] = te[2 * s + 0] * me[0 * s + 0] + te[2 * s + 1] * me[1 * s + 0] + te[2 * s + 2] * me[2 * s + 0] + te[2 * s + 3] * me[3 * s + 0];
        result.e[2 * s + 1] = te[2 * s + 0] * me[0 * s + 1] + te[2 * s + 1] * me[1 * s + 1] + te[2 * s + 2] * me[2 * s + 1] + te[2 * s + 3] * me[3 * s + 1];
        result.e[2 * s + 2] = te[2 * s + 0] * me[0 * s + 2] + te[2 * s + 1] * me[1 * s + 2] + te[2 * s + 2] * me[2 * s + 2] + te[2 * s + 3] * me[3 * s + 2];
        result.e[2 * s + 3] = te[2 * s + 0] * me[0 * s + 3] + te[2 * s + 1] * me[1 * s + 3] + te[2 * s + 2] * me[2 * s + 3] + te[2 * s + 3] * me[3 * s + 3];
        result.e[3 * s + 0] = te[3 * s + 0] * me[0 * s + 0] + te[3 * s + 1] * me[1 * s + 0] + te[3 * s + 2] * me[2 * s + 0] + te[3 * s + 3] * me[3 * s + 0];
        result.e[3 * s + 1] = te[3 * s + 0] * me[0 * s + 1] + te[3 * s + 1] * me[1 * s + 1] + te[3 * s + 2] * me[2 * s + 1] + te[3 * s + 3] * me[3 * s + 1];
        result.e[3 * s + 2] = te[3 * s + 0] * me[0 * s + 2] + te[3 * s + 1] * me[1 * s + 2] + te[3 * s + 2] * me[2 * s + 2] + te[3 * s + 3] * me[3 * s + 2];
        result.e[3 * s + 3] = te[3 * s + 0] * me[0 * s + 3] + te[3 * s + 1] * me[1 * s + 3] + te[3 * s + 2] * me[2 * s + 3] + te[3 * s + 3] * me[3 * s + 3];

        return result;
    }

    multiplyTuple(t: Tuple): Tuple {
        const result = [0, 0, 0, 0];
        const tupleArray = [t.x, t.y, t.z, t.w];

        for (let i = 0; i < 4; i++) {
            result[i] = 0;
            for (let j = 0; j < 4; j++) {
                result[i] += this.e[i * 4 + j] * tupleArray[j];
            }
        }
        return new Tuple(result[0], result[1], result[2], result[3]);
    }
}

class Matrix3 extends Matrix {
    constructor(data: number[]) {
        super(data);
    }

    multiply(m: Matrix): Matrix {
        const s = this.size;
        const result = makeMatrix(s);

        const me = m.e;
        const te = this.e;

        result.e[0 * s + 0] = te[0 * s + 0] * me[0 * s + 0] + te[0 * s + 1] * me[1 * s + 0] + te[0 * s + 2] * me[2 * s + 0];
        result.e[0 * s + 1] = te[0 * s + 0] * me[0 * s + 1] + te[0 * s + 1] * me[1 * s + 1] + te[0 * s + 2] * me[2 * s + 1];
        result.e[0 * s + 2] = te[0 * s + 0] * me[0 * s + 2] + te[0 * s + 1] * me[1 * s + 2] + te[0 * s + 2] * me[2 * s + 2];
        result.e[0 * s + 3] = te[0 * s + 0] * me[0 * s + 3] + te[0 * s + 1] * me[1 * s + 3] + te[0 * s + 2] * me[2 * s + 3];
        result.e[1 * s + 0] = te[1 * s + 0] * me[0 * s + 0] + te[1 * s + 1] * me[1 * s + 0] + te[1 * s + 2] * me[2 * s + 0];
        result.e[1 * s + 1] = te[1 * s + 0] * me[0 * s + 1] + te[1 * s + 1] * me[1 * s + 1] + te[1 * s + 2] * me[2 * s + 1];
        result.e[1 * s + 2] = te[1 * s + 0] * me[0 * s + 2] + te[1 * s + 1] * me[1 * s + 2] + te[1 * s + 2] * me[2 * s + 2];
        result.e[1 * s + 3] = te[1 * s + 0] * me[0 * s + 3] + te[1 * s + 1] * me[1 * s + 3] + te[1 * s + 2] * me[2 * s + 3];
        result.e[2 * s + 0] = te[2 * s + 0] * me[0 * s + 0] + te[2 * s + 1] * me[1 * s + 0] + te[2 * s + 2] * me[2 * s + 0];
        result.e[2 * s + 1] = te[2 * s + 0] * me[0 * s + 1] + te[2 * s + 1] * me[1 * s + 1] + te[2 * s + 2] * me[2 * s + 1];
        result.e[2 * s + 2] = te[2 * s + 0] * me[0 * s + 2] + te[2 * s + 1] * me[1 * s + 2] + te[2 * s + 2] * me[2 * s + 2];
        result.e[2 * s + 3] = te[2 * s + 0] * me[0 * s + 3] + te[2 * s + 1] * me[1 * s + 3] + te[2 * s + 2] * me[2 * s + 3];

        return result;
    }

    // @ts-ignore
    multiplyTuple(t: Tuple): Tuple {
        throw new Error('Method not implemented.');
    }
}

class Matrix2 extends Matrix {
    constructor(data: number[]) {
        super(data);
    }

    multiply(m: Matrix): Matrix {
        const s = this.size;
        const result = makeMatrix(s);

        const me = m.e;
        const te = this.e;

        result.e[0 * s + 0] = te[0 * s + 0] * me[0 * s + 0] + te[0 * s + 1] * m.e[1 * s + 0];
        result.e[0 * s + 1] = te[0 * s + 0] * me[0 * s + 1] + te[0 * s + 1] * m.e[1 * s + 1];
        result.e[0 * s + 2] = te[0 * s + 0] * me[0 * s + 2] + te[0 * s + 1] * m.e[1 * s + 2];
        result.e[0 * s + 3] = te[0 * s + 0] * me[0 * s + 3] + te[0 * s + 1] * m.e[1 * s + 3];
        result.e[1 * s + 0] = te[1 * s + 0] * me[0 * s + 0] + te[1 * s + 1] * m.e[1 * s + 0];
        result.e[1 * s + 1] = te[1 * s + 0] * me[0 * s + 1] + te[1 * s + 1] * m.e[1 * s + 1];
        result.e[1 * s + 2] = te[1 * s + 0] * me[0 * s + 2] + te[1 * s + 1] * m.e[1 * s + 2];
        result.e[1 * s + 3] = te[1 * s + 0] * me[0 * s + 3] + te[1 * s + 1] * m.e[1 * s + 3];

        return result;
    }

    // @ts-ignore
    multiplyTuple(t: Tuple): Tuple {
        throw new Error('Method not implemented.');
    }
}

export const identity = (size: number = 4) => {

    switch (size) {
        case 4:
            return new Matrix4([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
        case 3:
            return new Matrix3([1, 0, 0, 0, 1, 0, 0, 0, 1]);
        case 2:
            return new Matrix2([1, 0, 0, 1]);
        default:
            throw new Error("Can only create an identity matrix of sizes 4, 3 or 2");
    }
}

export const makeMatrix = (data: number[] | number) => {
    if (Array.isArray(data)) {
        if (![4, 9, 16].includes(data.length))
            throw new Error("Data must be a 4x4, 3x3, or 2x2 matrix.");

        if (data.length == 16) {
            return new Matrix4(data);
        } else if (data.length == 9) {
            return new Matrix3(data);
        } else return new Matrix2(data);
    }

    switch (data) {
        case 4:
            return new Matrix4([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        case 3:
            return new Matrix4([0, 0, 0, 0, 0, 0, 0, 0, 0]);
        case 2:
            return new Matrix2([0, 0, 0, 0]);
        default:
            throw new Error("Data must specify a size of 4, 3 or 2");
    }

}