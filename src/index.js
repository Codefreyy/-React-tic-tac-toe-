import React, { Component } from 'react'
import ReactDOM from 'react-dom/client'

const M = 3;

function Square(props) {
    return (
        <button
            className="square"
            onClick={() =>
                props.onClick()
            }>
            {props.value}
        </button>
    );
}


class Board extends Component {
    renderSquare(i) {
        return (
            <Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />
        );
    }

    render() {
        var n = 0;
        let board = [];
        for (var i = 0; i < M; i++) {
            var boardRow = [];
            for (var j = 0; j < M; j++, n++) {
                boardRow.push(this.renderSquare(n));
            }
            board.push(
                <div className="board-row" key={i}>{boardRow}</div>
            );
        }

        /* to solve?? */
        return (
            <div key={i}>{board}</div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{ squares: Array(M * M).fill(null), row: null, col: null },
            ],
            xIsNext: true,
            stepNumber: 0,
        };
    }

    // 跳到某一步
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    // 落子之后
    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([
                {
                    squares: squares,
                    row: parseInt(i / M) + 1,
                    col: i % M + 1,
                }
            ]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
        });
    }


    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to the ' + move + 'th step：' + '(' + step.row + '，' + step.col + ')' :
                'Go to game start';

            if (step === current) {
                return (
                    <li key={move}>

                        <button onClick={() => this.jumpTo(move)} ><strong>{desc}</strong></button>
                    </li>
                )
            } else return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)} >{desc}</button>
                </li>
            )

        })

        let status;
        if (winner) {
            status = 'The Winner is' + winner;
        } else {
            status = 'It is player ' + (this.state.xIsNext ? 'X' : 'O') + "'s turn to go";
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={current.squares} onClick={(i) => this.handleClick(i)} />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
