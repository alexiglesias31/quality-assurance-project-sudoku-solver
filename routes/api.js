'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      let puzzleString = req.body.puzzle
      let coordinate = req.body.coordinate
      let value = req.body.value

      if(puzzleString === undefined || coordinate === undefined || value === undefined) {
        res.json({
          error: 'Required field(s) missing'
        })
      }

      if(puzzleString.length !== 81) {
        res.json({
          error: 'Expected puzzle to be 81 characters long'
        })
        return
      }

      if(!solver.validate(puzzleString)) {
        res.json({
          error: 'Invalid characters in puzzle'
        })
        return
      }

      if(!coordinate.match(/^[A-I]\d$/)) {
        res.json({
          error: 'Invalid coordinate'
        })
        return
      }

      if(!value.match(/^\d{1}$/)) {
        res.json({
          error: 'Invalid value'
        })
        return
      }

      let row = coordinate.charCodeAt(0) - 'A'.charCodeAt(0) + 1
      let column = Number(coordinate[1])

      let pos = 9*(row-1) + column;
      if(puzzleString[pos-1].match(/\w/)) {
        res.json({
          valid: true
        })
        return
      }

      let conflict = []
      if(!solver.checkRowPlacement(puzzleString,row,column,value)) {
        conflict.push('row')
      }
      if(!solver.checkColPlacement(puzzleString,row,column,value)) {
        conflict.push('column')
      }
      if(!solver.checkRegionPlacement(puzzleString,row,column,value)) {
        conflict.push('region')
      }

      if(conflict.length > 0) {
        res.json({
          valid: false,
          conflict: conflict
        })
        return
      }

      res.json({
        valid: true
      })

    });
    
  app.route('/api/solve')
    .post((req, res) => {
      let puzzleString = req.body.puzzle
      
      if(puzzleString === undefined) {
        res.json({
          error: 'Required field missing'
        })
        return
      }

      if(puzzleString.length !== 81) {
        res.json({
          error: 'Expected puzzle to be 81 characters long'
        })
        return
      }

      if(!solver.validate(puzzleString)) {
        res.json({
          error: 'Invalid characters in puzzle'
        })
        return
      }

      let solution = solver.solve(puzzleString)

      if(solution.match(/\d{81}/)) {
        res.json({
          solution: solution
        })
      } else {
        res.json({
          error: 'Puzzle cannot be solved'
        })
      }

    });
};
