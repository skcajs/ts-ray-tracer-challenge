import {expect, test} from 'vitest'
import Tuple from '../tuple.ts'
import {identity, makeMatrix} from '../matrix.ts'

test('Constructing and inspecting a 4x4 matrix', () => {
    const elements = [
        1, 2, 3, 4,
        5.5, 6.5, 7.5, 8.5,
        9, 10, 11, 12,
        13.5, 14.5, 15.5, 16.5
    ];

    const matrix = makeMatrix(elements);

    expect(matrix.getElement(0, 0)).toBe(1);
    expect(matrix.getElement(0, 3)).toBe(4);
    expect(matrix.getElement(1, 0)).toBe(5.5);
    expect(matrix.getElement(1, 2)).toBe(7.5);
    expect(matrix.getElement(2, 2)).toBe(11);
    expect(matrix.getElement(3, 0)).toBe(13.5);
    expect(matrix.getElement(3, 2)).toBe(15.5);
});

test('A 3x3 matrix ought to be representable', () => {
    const elements = [
        -3, 5, 0,
        1, -2, -7,
        0, 1, 1
    ];

    const matrix = makeMatrix(elements);

    expect(matrix.getElement(0, 0)).toBe(-3);
    expect(matrix.getElement(1, 1)).toBe(-2);
    expect(matrix.getElement(2, 2)).toBe(1);
});

test('A 2x2 matrix ought to be representable', () => {
    const elements = [
        -3, 5,
        1, -2
    ];

    const matrix = makeMatrix(elements);

    expect(matrix.getElement(0, 0)).toBe(-3);
    expect(matrix.getElement(0, 1)).toBe(5);
    expect(matrix.getElement(1, 0)).toBe(1);
    expect(matrix.getElement(1, 1)).toBe(-2);
});

test('Matrix equality with identical matrices', () => {
    const elements = [
        1, 2, 3, 4,
        5, 6, 7, 8,
        9, 10, 11, 12,
        13, 14, 15, 16
    ];

    const matrix1 = makeMatrix(elements);
    const matrix2 = makeMatrix(elements);

    expect(matrix1.equals(matrix2)).toBe(true);
});

test('Matrix equality with different matrices', () => {
    const elements1 = [
        1, 2, 3, 4,
        5, 6, 7, 8,
        9, 10, 11, 12,
        13, 14, 15, 16
    ];

    const elements2 = [
        2, 3, 4, 5,
        6, 7, 8, 9,
        10, 11, 12, 13,
        14, 15, 16, 17
    ];

    const matrix1 = makeMatrix(elements1);
    const matrix2 = makeMatrix(elements2);

    expect(matrix1.equals(matrix2)).toBe(false);
});

test('Multiplying two matrices', () => {
    const A = [
        1, 2, 3, 4,
        5, 6, 7, 8,
        9, 8, 7, 6,
        5, 4, 3, 2
    ];

    const B = [
        -2, 1, 2, 3,
        3, 2, 1, -1,
        4, 3, 6, 5,
        1, 2, 7, 8
    ];

    const product = [
        20, 22, 50, 48,
        44, 54, 114, 108,
        40, 58, 110, 102,
        16, 26, 46, 42
    ];

    const matrix1 = makeMatrix(A);
    const matrix2 = makeMatrix(B);
    const matrixProduct = makeMatrix(product);

    expect(matrix1.multiply(matrix2)).toEqual(matrixProduct);
});

test('A matrix multiplied by a tuple', () => {
    const A = [
        1, 2, 3, 4,
        2, 4, 4, 2,
        8, 6, 4, 1,
        0, 0, 0, 1
    ];

    const matrix = makeMatrix(A);
    const tuple = new Tuple(1, 2, 3, 1);

    const result = new Tuple(18, 24, 33, 1);

    expect(matrix.multiplyTuple(tuple)).toEqual(result);
});

test('multiplying a matrix byt the identity matrix', () => {
    const A = [
        0, 1, 2, 4,
        1, 2, 4, 8,
        2, 4, 8, 16,
        4, 8, 16, 32
    ];
    const matrix = makeMatrix(A);

    expect(matrix.multiply(identity())).toEqual(matrix);
});

test('transposing a matrix', () => {
    const A = [
        0, 9, 3, 0,
        9, 8, 0, 8,
        1, 8, 5, 3,
        0, 0, 5, 8
    ];
    const matrix = makeMatrix(A);

    const transposeA = [
        0, 9, 1, 0,
        9, 8, 8, 0,
        3, 0, 5, 5,
        0, 8, 3, 8
    ];
    const matrixT = makeMatrix(transposeA);

    expect(matrix.transpose()).toEqual(matrixT);
});

test('transposing the identity matrix', () => {
    expect(identity().transpose()).toEqual(identity());
});

test('Calculating the determinant of a 2x2 matrix', () => {
    const A = [
        1, 5,
        -3, 2
    ];
    const matrix = makeMatrix(A);

    expect(matrix.determinant()).toBe(17);

});

test('A sub-matrix of a 3x3 matrix is a 2x2 matrix', () => {
    const matrix = makeMatrix([
        1, 5, 0,
        -3, 2, 7,
        0, 6, -3
    ]);

    const subMatrix = makeMatrix([
        -3, 2,
        0, 6
    ]);

    expect(matrix.subMatrix(0, 2)).toEqual(subMatrix);
});

test('A subMatrix of a 4x4 matrix is a 3x3 matrix', () => {
    const A = makeMatrix([
        -6, 1, 1, 6,
        -8, 5, 8, 6,
        -1, 0, 8, 2,
        -7, 1, -1, 1
    ]);

    const subMatrixA = makeMatrix([
        -6, 1, 6,
        -8, 8, 6,
        -7, -1, 1
    ]);

    expect(A.subMatrix(2, 1)).toEqual(subMatrixA);
});

test('Calculate the minor of a 3x3 matrix', () => {
    const A = makeMatrix([
        3, 5, 0,
        2, -1, -7,
        6, -1, 5
    ]);

    const B = A.subMatrix(1, 0);

    expect(B.determinant()).toBe(25);
    expect(A.minor(1, 0)).toBe(25);
});

test('Calculating the cofactor of a 3x3 matrix', () => {
    const A = makeMatrix([
        3, 5, 0,
        2, -1, -7,
        6, -1, 5
    ]);

    expect(A.minor(0, 0)).toBe(-12);
    expect(A.cofactor(0, 0)).toBe(-12);
    expect(A.minor(1, 0)).toBe(25);
    expect(A.cofactor(1, 0)).toBe(-25);
});

test('Calculating the determinant of a 3x3 matrix', () => {
    const A = makeMatrix([
        1, 2, 6,
        -5, 8, -4,
        2, 6, 4
    ]);

    expect(A.cofactor(0, 0)).toBe(56);
    expect(A.cofactor(0, 1)).toBe(12);
    expect(A.minor(0, 2)).toBe(-46);
    expect(A.determinant()).toBe(-196);
});

test('Calculating the determinant of a 4x4 matrix', () => {
    const A = makeMatrix([
        -2, -8, 3, 5,
        -3, 1, 7, 3,
        1, 2, -9, 6,
        -6, 7, 7, -9
    ]);

    expect(A.cofactor(0, 0)).toBe(690);
    expect(A.cofactor(0, 1)).toBe(447);
    expect(A.minor(0, 2)).toBe(210);
    expect(A.minor(0, 3)).toBe(-51);
    expect(A.determinant()).toBe(-4071);
});


test('Testing an invertible matrix for invertibility', () => {
    const A = makeMatrix([
        6, 4, 4, 4,
        5, 5, 7, 6,
        4, -9, 3, -7,
        9, 1, 7, -6
    ]);
    expect(A.determinant()).toBe(-2120);
    expect(A.isInvertible()).toBeTruthy();
});

test('Testing an non invertible matrix for invertibility', () => {
    const A = makeMatrix([
        -4, 2, -2, -3,
        9, 6, 2, 6,
        0, -5, 1, -5,
        0, 0, 0, 0
    ]);
    expect(A.determinant()).toBe(0);
    expect(A.isInvertible()).toBeFalsy();
});

test('Calculating the inverse of a matrix', () => {
    const A = makeMatrix([
        -5, 2, 6, -8,
        1, -5, 1, 8,
        7, 7, -6, -7,
        1, -3, 7, 4
    ]);

    const B = A.inverse();

    const result = makeMatrix([
        0.21805, 0.45113, 0.24060, -0.04511,
        -0.80827, -1.45677, -0.44361, 0.52068,
        -0.07895, -0.22368, -0.05263, 0.19737,
        -0.52256, -0.81391, -0.30075, 0.30639
    ]);

    expect(A.determinant()).toBe(532);
    expect(A.cofactor(2, 3)).toBe(-160);
    expect(B.getElement(3, 2)).toBe(-160 / 532);
    expect(A.cofactor(3, 2)).toBe(105);
    expect(B.getElement(2, 3)).toBe(105 / 532);
    expect(B.equals(result)).toBeTruthy();
});

test('Calculating the inverse of another matrix', () => {
    const A = makeMatrix([
        8, -5, 9, 2,
        7, 5, 6, 1,
        -6, 0, 9, 6,
        -3, 0, -9, -4
    ]);

    const inverseA = makeMatrix([
        -0.15385, -0.15385, -0.28205, -0.53846,
        -0.07692, 0.12308, 0.02564, 0.03077,
        0.35897, 0.35897, 0.43590, 0.92308,
        -0.69231, -0.69231, -0.76923, -1.92308
    ]);

    expect(A.inverse().equals(inverseA)).toBeTruthy();
});

test('Calculating the inverse of a third matrix', () => {
    const A = makeMatrix([
        9, 3, 0, 9,
        -5, -2, -6, -3,
        -4, 9, 6, 4,
        -7, 6, 6, 2
    ]);

    const inverseA = makeMatrix([
        -0.04074, -0.07778, 0.14444, -0.22222,
        -0.07778, 0.03333, 0.36667, -0.33333,
        -0.02901, -0.14630, -0.10926, 0.12963,
        0.17778, 0.06667, -0.26667, 0.33333
    ]);

    expect(A.inverse().equals(inverseA)).toBeTruthy();
});

test('Multiplying a product by its inverse', () => {
    const A = makeMatrix([
        3, -9, 7, 3,
        3, -8, 2, -9,
        -4, 4, 4, 1,
        -6, 5, -1, 1
    ]);

    const B = makeMatrix([
        8, 2, 2, 2,
        3, -1, 7, 0,
        7, 0, 5, 4,
        6, -2, 0, 5
    ]);

    const C = A.multiply(B);

    expect(C.multiply(B.inverse()).equals(A)).toBeTruthy();
});