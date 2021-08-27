const getRowValues = (puzzleString, row) => {
  return puzzleString.substring(9 * (row - 1), 9 * row)
}

const getColumnValues = (puzzleString, column) => {
  let columnValues = ''
  for (let i = 0; i < 9; i++) {
    columnValues += puzzleString[i * 9 + column - 1]
  }
  return columnValues
}

const getRegionValues = (puzzleString, row, column) => {
  let regionValues = ''
  let len = puzzleString.length < 81 ? puzzleString.length : 81;
  for (let i = 0; i < len; i++) {
    // Check row range
    if (!((Math.floor(i / 9) < Math.ceil(row / 3) * 3) && (Math.floor(i / 9) >= Math.floor(row / 3) * 3))) continue
    if (!(((i % 9) < Math.ceil(column / 3) * 3) && ((i % 9) >= Math.floor(column / 3) * 3))) continue
    regionValues += puzzleString[i]
  }
  return regionValues
}

const is_valid = (data, row, col, k) => {
  for (let i = 0; i < 9; i++) {
    const m = 3 * Math.floor(row / 3) + Math.floor(i / 3);
    const n = 3 * Math.floor(col / 3) + i % 3;
    if (data[row][i] == k || data[i][col] == k || data[m][n] == k) {
      return false;
    }
  }
  return true;
}

const solve_puzzle = (data) => {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (data[i][j] == '.') {
        for (let k = 1; k <= 9; k++) {
          if (is_valid(data, i, j, k)) {
            data[i][j] = `${k}`;
            if (solve_puzzle(data)) {
              return true;
            } else {
              data[i][j] = '.';
            }
          }
        }
        return false;
      }
    }
  }
  return true;
}

class SudokuSolver {

  validate(puzzleString) {
    if (!puzzleString.match(/^[0-9\.]{81}$/g)) return false

    return true
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let puzzleRow = getRowValues(puzzleString, row)
    return puzzleRow.indexOf(value) < 0 ? true : false
  }

  checkColPlacement(puzzleString, row, column, value) {
    let puzzleCol = getColumnValues(puzzleString, column)
    return puzzleCol.indexOf(value) < 0 ? true : false
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let region = getRegionValues(puzzleString, row, column)
    return region.indexOf(value) < 0 ? true : false
  }

  checkPosPlacement(puzzleString, row, col, value) {
    if
      (
      this.checkRowPlacement(puzzleString, row, col, value) &&
      this.checkColPlacement(puzzleString, row, col, value) &&
      this.checkRegionPlacement(puzzleString, row, col, value)
    ) {
      return true
    }
    return false
  }

  solve(puzzleString) {
    if(!this.validate(puzzleString)) return false;

    // Convert to board object
    let solution = [];
    for (let i = 1; i <= 9; i++) {
      solution[i-1] = getRowValues(puzzleString, i).split('')
    }
    // Solve puzzle
    solve_puzzle(solution)

    // Convert to string object
    let solutionString = solution.map(row => {
      return row.join('')
    }).join('')

    return solutionString
  }
}

module.exports = SudokuSolver;

