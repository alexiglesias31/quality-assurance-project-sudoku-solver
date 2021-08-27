const chai = require('chai');
const assert = chai.assert;

const SudokuSolver = require('../controllers/sudoku-solver.js');
let solver = new SudokuSolver()
let validString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
let solution = '135762984946381257728459613694517832812936745357824196473298561581673429269145378'
let invalidString = '1.35.2.84..63.12.7.2..5..a..9*.1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'

suite('UnitTests', () => {
    test('Handle puzzle string with 81 characters', function() {
        assert.isTrue(solver.validate(validString))
    })
    test('Validate characters puzzle string', function() {
        assert.isTrue(solver.validate(validString))
        assert.isFalse(solver.validate('1.5..2.84..63.12.7.2..5..a..9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'))
        assert.isFalse(solver.validate('1.5..2.84..63.12.7.2..5..*..9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'))
    })
    test('Handle puzzle string with no 81 characters', function() {
        assert.isFalse(solver.validate('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.'))
        assert.isFalse(solver.validate('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914......'))
    })
    test('Handle valid row placement', function() {
        assert.isTrue(solver.checkRowPlacement(validString, 1, 2, 3))
    })
    test('Handle invalid row placement', function() {
        assert.isFalse(solver.checkRowPlacement(validString, 1, 2, 4))
    })
    test('Handle valid column placement', function() {
        assert.isTrue(solver.checkColPlacement(validString, 1, 2, 4))
    })
    test('Handle invalid column placement', function() {
        assert.isFalse(solver.checkColPlacement(validString, 1, 2, 6))
    })
    test('Handle valid 3x3 region placement', function() {
        assert.isTrue(solver.checkRegionPlacement(validString, 5, 5, 4))
    })
    test('Handle invalid 3x3 region placement', function() {
        assert.isFalse(solver.checkRegionPlacement(validString, 5, 5, 6))
    })
    test('Valid string pass the solver', function() {
        assert.match(solver.solve(validString), /\d{81}/)
    })
    test('Invalid string do not pass the solver', function() {
        assert.isFalse(solver.solve(invalidString))
    })
    test('Solver return expected solution for incomplete puzzle', function() {
        assert.match(solver.solve(validString), /\d{81}/)
        assert.equal(solver.solve(validString), solution)
    })
});
