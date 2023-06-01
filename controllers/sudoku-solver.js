class SudokuSolver {

  validate(puzzleString) {
    if (!puzzleString) return {error: 'Required field missing'}
    if (puzzleString == "") return {error: 'Required field missing'}
    if (/[^\.|^\d]/.test(puzzleString)) return {error: 'Invalid characters in puzzle'}
    if (puzzleString.length != 81) return {error: 'Expected puzzle to be 81 characters long'}
    // console.log(puzzleString.length)
    return  {pass: true}
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let GRID = []
    for (let i = 0; i < 9; i++) {
      let subArr = puzzleString.slice(i * 9, (i + 1) * 9).split("")
      GRID.push(subArr)
    }
    // console.log(GRID)
    // console.log(GRID[0])
    // console.log(GRID[0][2])

    // if exists, then conflict = false
    if (GRID[row - 1].includes(value.toString())) {
      // console.log(`${value} - conflict in row`)
      return false
    } else {
      // console.log(`${value} - row - ok`)
      return true
    }
  }

  checkColPlacement(puzzleString, row, column, value) {
    let GRID = []
    for (let i = 0; i < 9; i++) {
      let subArr = []
      for (let j = i; j < 81; j += 9) {
        subArr.push(puzzleString.slice(j, j + 1))
      }
      GRID.push(subArr)
    }
    // console.log(GRID)
    // console.log(GRID[0])
    // console.log(GRID[0][2])

    // if exists, then conflict = false
    if (GRID[column - 1].includes(value.toString())) {
      // console.log(`${value} - conflict in column`)
      return false
    } else {
      // console.log(`${value} - column - ok`)
      return true
    }
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let GRID = []
    let REGION = []
    for (let i = 0; i < 9; i++) {
      let subArr = puzzleString.slice(i * 9, (i + 1) * 9).split("")
      GRID.push(subArr)
    }
    // console.log(GRID)
    // console.log(GRID[0])
    // console.log(GRID[0][2])

    // [row][column] -> find center of region
    // push nearby 9 number into  REGION
    let regionCenterRow, regionCenterColumn;
    switch (row) {
      case 1:
      case 2:
      case 3:
        regionCenterRow = 1;
        break;
      case 4:
      case 5:
      case 6:
        regionCenterRow = 4;
        break;
      case 7:
      case 8:
      case 9:
        regionCenterRow = 7;
        break;
    }
    switch (column) {
      case 1:
      case 2:
      case 3:
        regionCenterColumn = 1;
        break;
      case 4:
      case 5:
      case 6:
        regionCenterColumn = 4;
        break;
      case 7:
      case 8:
      case 9:
        regionCenterColumn = 7;
        break;
    }
    let x = puzzleString.slice()
    // [ x  x  x ]
    // [ x  x  x ]
    // [ x  x  x ]
    REGION.push(GRID[regionCenterRow - 1][regionCenterColumn - 1])
    REGION.push(GRID[regionCenterRow - 1][regionCenterColumn])
    REGION.push(GRID[regionCenterRow - 1][regionCenterColumn + 1])
    REGION.push(GRID[regionCenterRow][regionCenterColumn - 1])
    REGION.push(GRID[regionCenterRow][regionCenterColumn])
    REGION.push(GRID[regionCenterRow][regionCenterColumn + 1])
    REGION.push(GRID[regionCenterRow + 1][regionCenterColumn - 1])
    REGION.push(GRID[regionCenterRow + 1][regionCenterColumn])
    REGION.push(GRID[regionCenterRow + 1][regionCenterColumn + 1])

    // console.log(REGION)

    // if exists, then conflict = false
    if (REGION.includes(value.toString())) {
      // console.log(`${value} - conflict in region`)
      return false
    } else {
      // console.log(`${value} - region - ok`)
      return true
    }
  }
  checkAllPlacement(puzzleString, row, column, value) {
    // make a grid of 9x9
    let GRID = []
    for (let i = 0; i < 9; i++) {
      let subArr = puzzleString.replaceAll('.','0').slice(i * 9, (i + 1) * 9).split("").map(Number)
      GRID.push(subArr)
    }
   
    // same value at given coordinate
    if(GRID[row-1][column-1] === value) return {valid: true}
    // Invalid characters in puzzle
    if (/[^\.|^\d]/.test(puzzleString)) return {error: 'Invalid characters in puzzle'}
    // Expected puzzle to be 81 characters long
    if (puzzleString.length != 81) return {error: 'Expected puzzle to be 81 characters long'}
    
    
    let rowResult = this.checkRowPlacement(puzzleString, row, column, value);
    let colResult = this.checkColPlacement(puzzleString, row, column, value);
    let regionResult = this.checkRegionPlacement(puzzleString, row, column, value);
    let returnObj = { valid: true, conflict: [] }
    if (!rowResult) returnObj.valid = false
    if (!rowResult) returnObj.conflict.push("row")
    if (!colResult) returnObj.valid = false
    if (!colResult) returnObj.conflict.push("column")
    if (!regionResult) returnObj.valid = false
    if (!regionResult) returnObj.conflict.push("region")
    if (returnObj.valid) {  // true
      delete returnObj.conflict;
      return returnObj;
    } else {                // false
      return returnObj; // {"valid" : true}
    }
  }

  solve(puzzleString) {

    // *******************************************
    function printBoard(board) {
      for (let row = 0; row < 9; row++) {
        let rowStr = "";
        for (let col = 0; col < 9; col++) {
          rowStr += board[row][col] + " ";
        }
        console.log(rowStr);
      }
    }

    function solveSudoku(board) {
      if (solveHelper(board)) {
        // console.log("Solution found!")
        return board;      // found solution
      } else {
        // console.log("No solution exists!")
        return "No solution exists!"
      }
    }

    function solveHelper(board) {
      // console.log("backtracking")
      const emptyCell = findEmptyCell(board);
      if (! emptyCell){
        return true; // all cells filled, solution found
      }
      const [row, col] = emptyCell;
      const possibleValues = getPossibleValues(board, row, col);

      // solving
      for (let value of possibleValues) {
          board[row][col] = value;

          if (solveHelper(board)) {
            return true;
          }
          board[row][col] = 0 // undo the curren tcell
        }
      return false; // no valid number found, backtrack.
    }

    function findEmptyCell(board) {
      // console.log("find empty cell")

      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (board[row][col] === 0) {
            // console.log(`next empty cell [${row}][${col}]`)
            return [row, col];
          }
        }
      }
      return null; // No empty cells left
    }

    function getPossibleValues(board, row, col) {
      // console.log("getPossibleValues")
      let possibleValues = new Set([1,2,3,4,5,6,7,8,9])
      // Exclude values present in the same row
      for (let i = 0; i < 9; i++) {
        possibleValues.delete(board[row][i])
      }
      // Exclude values present in the same column
      for (let i = 0; i < 9; i++) {
        possibleValues.delete(board[i][col])
      }
      // Exclude values present in the same 3x3 box
      const boxRowStart = Math.floor(row / 3) * 3;
      const boxColStart = Math.floor(col / 3) * 3;
      for (let i = boxRowStart; i < boxRowStart + 3; i++) {
        for (let j = boxColStart; j < boxColStart + 3; j++) {
          possibleValues.delete(board[i][j])
        }
      }
      return Array.from(possibleValues); // Number is valid in this cell
    }

    //**************** MAIN  solver **********************
    // error handling
    if( ! this.validate(puzzleString).pass) return 'No solution exists!'
    
    // create board of 9x9
    let board = []
    for (let i = 0; i < 9; i++) {
      let subArr = puzzleString.replaceAll('.','0').slice(i * 9, (i + 1) * 9).split("").map(Number)
      board.push(subArr)
    }
    // console.log("Board :");
    // printBoard(board)
    // console.log(board)

    // return
    
    // console.log("Solving the Sudoku ... ");
    const solveBoard = solveSudoku(board);

    // console.log("Solution :")
    // printBoard(solveBoard);
    return solveBoard;

  }
}

module.exports = SudokuSolver;

