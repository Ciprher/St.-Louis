/**
 * A chess board that only accepts Queens
 * and only one can be placed in each file.
 */
class Board {
  constructor(size) {
    this.size = size;
    this.files = [];
  }

  copy() {
    const clone = new Board(this.size);
    // Copy files array.
    Object.assign(clone.files, this.files);
    return clone;
  }

  isSafe(file, rank) {
    // If there is already a piece on this file, it is not safe.
    if (this.files[file]) return false;

    // If there is already a piece on this rank, it is not safe.
    if (this.files.some(r => r === rank)) return false;

    // If there is already a piece on the same diagonal, it is not safe.
    if (this.files.some((r, f) =>
      Math.abs(r - rank) === Math.abs(f - file))) return false;

    return true;
  }

  placePiece(file, rank) {
    if (file > this.size) {
      throw new Error(
        `There is no file ${file} on a board of size ${this.size}`);
    }

    if (this.files[file]) {
      throw new Error(
        `There is already a piece on file ${file}.`);
    }

    this.files[file] = rank;
  }

  print() {
    const files = this.files;
    for (let rank = this.size; rank > 0; rank--) {
      const pieces = [];
      for (let file = 1; file <= this.size; file++) {
        pieces[file] = files[file] === rank ? 'Q' : '.';
      }
      console.log(pieces.join(' '));
    }
    console.log(); // blank line to separate multiple boards
  }
}


/**
 * Finds solutions for n pieces given solutions for n - 1 pieces.
 * All the boards must have the same size which can be greater than n.
 * For example, boards can be solutions with three pieces
 * and we are trying to find solutions with four pieces
 * on boards with a size of eight.
 * @param inBoards - an array of Board objects where
 *   n - 1 queens have been successfully placed
 * @returns an array of Board objects where
 *   n queens have been successfully placed
 */
function findPossibleSolutions(inBoards, n) {
  const outBoards = [];
  const maxRank = inBoards[0].size;

  inBoards.forEach(inBoard => {
    for (let rank = 1; rank <= maxRank; rank++) {
      if (inBoard.isSafe(n, rank)) {
        const clone = inBoard.copy();
        clone.placePiece(n, rank);
        outBoards.push(clone);
      }
    }
  });

  return outBoards;
}

function queens(size) {
  let solutions = [new Board(size)]; // an empty board
  // Find all the solutions for a board size of 1, then 2, up to size.
  for (let s = 1; s <= size; s++) {
    solutions = findPossibleSolutions(solutions, s);
  }
  return solutions;
}

const size = Number(process.argv[2]);
if (size && size > 0) {
  const solutions = queens(size);
  if (solutions.length) {
    solutions.forEach((solution, index) => {
      console.log(`solution #${index + 1}`);
      solution.print();
    });
  } else {
    console.log(`There are no solutions for a board size of ${size}.`);
  }
} else {
  console.error('usage: node 8-queens {size}');
}
