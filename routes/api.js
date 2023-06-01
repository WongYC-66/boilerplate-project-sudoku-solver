'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function(app) {

  let solver = new SudokuSolver();


  app.route('/api/check')
    .post((req, res) => {
      console.log("POST /api/check")
      // console.log(req.body)

      // error handling
      if (!req.body.puzzle || !req.body.coordinate || !req.body.value ) return res.json({error : 'Required field(s) missing'});
      // Invalid coordinate
      if( ! /[A-I]/.test(req.body.coordinate.slice(0,1))) return res.json({ error: 'Invalid coordinate'})
      if(! /^[1-9]$/.test(req.body.coordinate.slice(1))) return res.json({ error: 'Invalid coordinate'})
      // Invalid value
      if(! /^[1-9]$/.test(req.body.value))  return res.json({ error: 'Invalid value' })
      
      const puzzleString = req.body.puzzle
      const row = req.body.coordinate.toUpperCase().charCodeAt(0) - 64; // A = 1, B = 2 .... I = 9
      const col = parseInt(req.body.coordinate.slice(1)); // 2nd character
      const value = parseInt(req.body.value);
      // console.log({ row, col, value })

      let x = solver.checkAllPlacement(puzzleString, row, col, value)
      // console.log(x)
      return res.json(x);

    });
//*****************************************************
  app.route('/api/solve')
    .post((req, res) => {
      console.log("POST /api/solve")
      // console.log(req.body)

      const puzzleString = req.body.puzzle
      let isValidReturn = solver.validate(puzzleString)
      if (! isValidReturn.pass){
        // console.log(isValidReturn)
        return res.json(isValidReturn);
      }
      
      const solution = solver.solve(puzzleString)
      if (solution == 'No solution exists!'){
        return res.json({error : 'Puzzle cannot be solved'});
      }
      // found solution, return
      const solutionString = solution.flat(3).toString().replaceAll(",","")
      // console.log(solutionString)
      return res.json({solution : solutionString });


    });
};
