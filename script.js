document.addEventListener('DOMContentLoaded', () => {
    const gridElement = document.getElementById('sudoku-grid');
    const newGameBtn = document.getElementById('new-game');
    const checkBtn = document.getElementById('check-solution');
    const difficultySelect = document.getElementById('difficulty');
    const statusMsg = document.getElementById('status-message');

    let solution = [];
    let initialGrid = [];

    function generateSudoku() {
        const grid = Array.from({ length: 9 }, () => Array(9).fill(0));
        fillGrid(grid);
        solution = grid.map(row => [...row]);
        
        const difficulty = difficultySelect.value;
        let attempts = difficulty === 'easy' ? 30 : difficulty === 'medium' ? 45 : 55;
        
        const puzzle = grid.map(row => [...row]);
        while (attempts > 0) {
            let row = Math.floor(Math.random() * 9);
            let col = Math.floor(Math.random() * 9);
            if (puzzle[row][col] !== 0) {
                puzzle[row][col] = 0;
                attempts--;
            }
        }
        initialGrid = puzzle.map(row => [...row]);
        renderGrid(puzzle);
    }

    function fillGrid(grid) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (grid[row][col] === 0) {
                    let nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
                    for (let num of nums) {
                        if (isValid(grid, row, col, num)) {
                            grid[row][col] = num;
                            if (fillGrid(grid)) return true;
                            grid[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    function isValid(grid, row, col, num) {
        for (let x = 0; x < 9; x++) {
            if (grid[row][x] === num || grid[x][col] === num) return false;
        }
        let startRow = row - row % 3;
        let startCol = col - col % 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (grid[i + startRow][j + startCol] === num) return false;
            }
        }
        return true;
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function renderGrid(grid) {
        gridElement.innerHTML = '';
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                if (grid[r][c] !== 0) {
                    cell.textContent = grid[r][c];
                    cell.classList.add('fixed');
                } else {
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.maxLength = 1;
                    input.dataset.row = r;
                    input.dataset.col = c;
                    input.addEventListener('input', (e) => {
                        if (!/^[1-9]$/.test(e.target.value)) {
                            e.target.value = '';
                        }
                    });
                    cell.appendChild(input);
                }
                gridElement.appendChild(cell);
            }
        }
    }

    function checkSolution() {
        const inputs = gridElement.querySelectorAll('input');
        let currentGrid = initialGrid.map(row => [...row]);
        let completed = true;

        inputs.forEach(input => {
            const r = parseInt(input.dataset.row);
            const c = parseInt(input.dataset.col);
            const val = parseInt(input.value);
            if (!val) {
                completed = false;
            } else {
                currentGrid[r][c] = val;
            }
        });

        if (!completed) {
            statusMsg.textContent = "Please fill all cells.";
            statusMsg.className = "status error";
            return;
        }

        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (currentGrid[r][c] !== solution[r][c]) {
                    statusMsg.textContent = "Incorrect solution. Try again!";
                    statusMsg.className = "status error";
                    return;
                }
            }
        }

        statusMsg.textContent = "Congratulations! You solved it!";
        statusMsg.className = "status success";
    }

    newGameBtn.addEventListener('click', () => {
        statusMsg.textContent = "";
        generateSudoku();
    });

    checkBtn.addEventListener('click', checkSolution);

    // Start initial game
    generateSudoku();
});
