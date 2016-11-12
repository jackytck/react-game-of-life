import React, { Component } from 'react'
import GameOfLife from './GameOfLife'
import GithubCorner from 'react-github-corner'

class App extends Component {
  render() {
    return (
			<div>
				<GameOfLife/>
				<GithubCorner
	          href='https://github.com/jackytck/react-game-of-life'
	          octoColor='#333'
	          bannerColor='#FFF'/>
			</div>
    )
  }
}

export default App
