import React, { Component } from 'react'
import './GameOfLife.css'

class GameOfLife extends Component {
  constructor (props) {
    super(props)
    const { width, height, speed } = props
    this.state = {
      width,
      height,
      speed,
      board: [],
      running: true,
      generation: 0
    }
  }

  componentDidMount () {
    const board = this.initBoard()
    this.setState({ board }, () => this.run())
  }

  initBoard (random = true) {
    const { width, height } = this.state
    let board = Array(height).fill().map(x => Array(width).fill(0))
    for (let i = 0; i < this.state.height; i++) {
      for (let j = 0 ; j < this.state.width; j++) {
        let cell = 0
        if (random) {
          cell = Math.random() < 0.5 ? 0 : 1
        }
        board[i][j] = cell
      }
    }
    return board
  }

  onClickCell (x, y) {
		let board = this.state.board.slice()
    if (board[x][y] > 0) {
      board[x][y] = 0
    } else {
      board[x][y] = 1
    }
    this.setState({ board })
	}

  getSpeed () {
    switch (this.state.speed) {
      case 'slow':
        return 2000
      case 'fast':
        return 200
      case 'medium':
      default:
        return 1000
    }
  }

  getNeighbours (rol, col) {
    let ret = []
    const { width, height } = this.state
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) {
          continue
        }
        let x = col + j
        let y = rol + i
        if (x >= 0 && x < width && y >= 0 && y < height) {
          ret.push(this.state.board[y][x])
        }
      }
    }
    return ret
  }

  getNextGameState (board) {
    const { width, height } = this.state
    let nextBoard = Array(height).fill().map(x => Array(width).fill(0))
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        let neighbours = [...this.getNeighbours(i, j)]
        let live = neighbours.filter(x => x).length
        let next = 0
        let current = board[i][j]
        if (current) {
          if (live < 2) {
            next = 0
          } else if (live === 2 || live === 3) {
            next = current + 1
          } else if (live > 3) {
            next = 0
          }
        } else {
          if (live === 3) {
            next = 1
          }
        }
        nextBoard[i][j] = next
      }
    }
    return nextBoard
  }

  run () {
    if (this.state.running) {
      const board = this.getNextGameState(this.state.board)
      const generation = this.state.generation + 1
      this.setState({
        board,
        generation
      })
      setTimeout(this.run.bind(this), this.getSpeed())
    }
  }

  drawBoard () {
    const rows = this.state.board.map((rows, x) => {
      return (
        <tr key={`row-${x}`}>
          {rows.map((cell, y) => <td key={`cell-${x}-${y}`} className={`cell-${Math.min(9, cell)} width-${this.state.width}`} onClick={this.onClickCell.bind(this, x, y)}></td>)}
        </tr>
      )
    })
    const board = (
      <table>
				<tbody>
	        {rows}
				</tbody>
      </table>
    )
    return board
  }

  onClickRun () {
    this.setState({ running: true }, () => this.run())
  }

  onClickPause () {
    this.setState({ running: false })
  }

  onClickClear (random) {
    const board = this.initBoard(random)
    this.setState({
      board,
      generation: 0,
      running: false
    })
  }

  onClickSetSize (width, height) {
    this.setState({
      width,
      height,
      generation: 0
    }, () => {
      const board = this.initBoard()
      this.setState({ board })
    })
  }

  onClickSetSpeed (speed) {
    this.setState({ speed })
  }

  render () {
    const { width, speed, running } = this.state
    return (
      <div className='game-of-life'>
        <div className='header-control'>
          <button className={`selected-${running}`} onClick={this.onClickRun.bind(this)}>{running ? 'Running' : 'Run'}</button>
          <button className={`selected-${!running}`} onClick={this.onClickPause.bind(this)}>{running ? 'Pause' : 'Paused'}</button>
          <button onClick={this.onClickClear.bind(this, false)}>Clear</button>
          <button onClick={this.onClickClear.bind(this, true)}>Randomize</button>
          <span className='generation'>{`Generation: ${this.state.generation}`}</span>
        </div>
        <div className='board'>
          { this.drawBoard() }
        </div>
        <div className='footer-control'>
          <button className={`selected-${width === 50}`} onClick={this.onClickSetSize.bind(this, 50, 30)}>Size: 50x30</button>
          <button className={`selected-${width === 70}`} onClick={this.onClickSetSize.bind(this, 70, 50)}>Size: 70x50</button>
          <button className={`selected-${width === 100}`} onClick={this.onClickSetSize.bind(this, 100, 80)}>Size: 100x80</button>
          <button className={`selected-${speed === 'slow'}`} onClick={this.onClickSetSpeed.bind(this, 'slow')}>Speed: Slow</button>
          <button className={`selected-${speed === 'medium'}`} onClick={this.onClickSetSpeed.bind(this, 'medium')}>Speed: Medium</button>
          <button className={`selected-${speed === 'fast'}`} onClick={this.onClickSetSpeed.bind(this, 'fast')}>Speed: Fast</button>
        </div>
      </div>
    )
  }
}

GameOfLife.propTypes = {
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  speed: React.PropTypes.string
}

GameOfLife.defaultProps = {
  width: 70,
  height: 50,
  speed: 'fast'
}

export default GameOfLife
