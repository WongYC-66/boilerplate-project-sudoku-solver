const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver;

suite('Unit Tests', () => {
  // not POST/GET to server, only local
  // # 1  
  test('Logic handles a valid puzzle string of 81 characters', function () {
    let response = solver.validate('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.')
    assert.equal(response.pass, true,'should return a true');
  });
  // # 2
  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', function () {
    let response = solver.validate('@.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.')
    assert.equal(response.error, 'Invalid characters in puzzle','should return Invalid characters in puzzle');
  });
  // # 3
  test('Logic handles a puzzle string that is not 81 characters in length', function () {
    let response = solver.validate('8.2.3674.3.7.2..9.47...8..1..16....926914.37.')
    assert.equal(response.error, 'Expected puzzle to be 81 characters long','should return Expected puzzle to be 81 characters long');
  });
  // # 4
  test('Logic handles a valid row placement', function () {
    let response = solver.checkRowPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',1,2,3)
    assert.equal(response, true,'should return true');
  });
  // # 5
  test('Logic handles an invalid row placement', function () {
    let response = solver.checkRowPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',1,2,5)
    assert.equal(response, false,'should return false');
  });
  // # 6
  test('Logic handles a valid column placement', function () {
    let response = solver.checkColPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',1,2,3)
    assert.equal(response, true,'should return true');
  });
  // # 7
  test('Logic handles an invalid column placement', function () {
    let response = solver.checkColPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',1,2,6)
    assert.equal(response, false,'should return false');
  });
  // # 8
  test('Logic handles a valid region (3x3 grid) placement', function () {
    let response = solver.checkRegionPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',1,2,3)
    assert.equal(response, true,'should return true');
  });
  // # 9
  test('Logic handles an invalid region (3x3 grid) placement', function () {
    let response = solver.checkRegionPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',1,2,5)
    assert.equal(response, false,'should return false');
  });
  // # 10
  test('Valid puzzle strings pass the solver', function () {
    let response = solver.solve('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.')
    assert.isArray(response,'valid puzzle strings should pass the solver');
  });
  // # 11
  test('Invalid puzzle strings fail the solver', function () {
    let response = solver.solve('!@#!$!@#3674.3.7.2..9.47...8..1..16....926914.37.')
    assert.equal(response,'No solution exists!', 'invalid puzzle strings should fail the solver ');
  });
  // # 12
  test('Valid puzzle strings pass the solver', function () {
    let response = solver.solve('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.').flat(3).toString().replaceAll(",","")
    assert.equal(response,'135762984946381257728459613694517832812936745357824196473298561581673429269145378'), 'should returns the expected solution';
  });
  
});
