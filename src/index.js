import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
	if(props.winner==='true'){
		return(
			<button className="squarewin" onClick={props.onClick}>
				{props.value}
			</button>
		);	
	}else{
		return(
		<button className="square" onClick={props.onClick}>
			{props.value}
		</button>
	);
	}
}

function calculateWinner(squares) {
	const lines = [
		[0,1,2],
		[3,4,5],
		[6,7,8],
		[0,3,6],
		[1,4,7],
		[2,5,8],
		[0,4,8],
		[2,4,6],
	];
	for (let i=0;i <lines.length; i++) {
		const [a,b,c] =lines[i];
		const hasil = [];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			hasil.push(squares[a]);
			hasil.push(a);
			hasil.push(b);
			hasil.push(c);
			return hasil;
		}
	}
	return null
}


class Board extends React.Component {

  

  renderSquare(i) {
  	if(this.props.winner){
  		for(let j=1;j<4;j++){
  			if(this.props.winner[j] === i){
  				return( <Square key={i}
  				winner='true'
  				value={this.props.squares[i]}
  				onClick={() => this.props.onClick(i)}
  				 />
  				);
  			}	
  		}	
  	}
    return( <Square key={i}
    winner='false'
    value={this.props.squares[i]}
    onClick={() => this.props.onClick(i)}
     />
    );
  }


  render() {
  	let list=[];
  	for (let i=0;i<3;i++){
  		let rows=[];
  		for (let j=0;j<3;j++){
  			rows.push(this.renderSquare(j+(i*3)))
  		}
  		list.push(<div className="board-row" key={i}>{rows}</div>)
  	}
    return (
      <div>
        {list}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
  	super(props);
  	this.state = {
  		history: [{
  			squares: Array(9).fill(null),
  			lasts: 0,
  		}],
  		stepNumber: 0,
  		xIsNext: true,
  		choose: 0,
  		dir: true,
  	};
  }

  handleClick(i) {
  	const history = this.state.history.slice(0, this.state.stepNumber + 1);
  	const current = history[history.length - 1];
  	const squares = current.squares.slice();
  	if (calculateWinner(squares)||squares[i]){
  		return;
  	}
  	squares[i] = this.state.xIsNext ? 'X' : 'O';
  	this.setState({
  		history: history.concat([{
  			squares: squares,
  			lasts: i,
  		}]),
  		stepNumber: history.length,
  		xIsNext: !this.state.xIsNext,
  		choose: history.length,
  	});
  }

  jumpTo(step){
  	if(this.state.dir){
  		this.setState({
  			stepNumber: step,
  			xIsNext: (step % 2) === 0,
  			choose: step,
  		});	
  	}else{
  		this.setState({
  			stepNumber: this.state.history.length-step-1,
  			xIsNext: (this.state.history.length-step-1 % 2) === 0,
  			choose: this.state.history.length-step-1,
  		});
  	}
  	
  	//alert(this.state.stepNumber);
  }

  changeDir(){
  	this.setState({
  		dir: !this.state.dir,
  	})
  }

  render() {
  	const history=this.state.history;
  	let historys;
  	if(this.state.dir){
  		historys = this.state.history;	
  		  	}else{
  		historys = this.state.history.slice(0).reverse();
  	}
  	
  	const current = history[this.state.stepNumber];
  	//alert(this.state.stepNumber);
  	const winner = calculateWinner(current.squares);
  	var movs = 0;
  	var desc;
  	const moves = historys.map((step,move)=>{
  		if(this.state.dir){
  			movs = move;
  			desc = move ? 'Go to move #' + move + ' Location: '+Math.floor((step.lasts+3)/3)+'(row), '+((step.lasts)%3+1)+'(col)':'Go to game start';

  		}else{
  			movs = history.length-move-1;
  			desc = move===(history.length-1) ? 'Go to game start':'Go to move #' + (movs) + ' Location: '+Math.floor((step.lasts+3)/3)+'(row), '+((step.lasts)%3+1)+'(col)';
  		}
  		if(movs===this.state.choose){
  			return (
  			<li key={movs}>
  				<button onClick={(movs)=> {this.jumpTo(move)}}><strong>{desc}</strong></button>
  			</li>
  			);	
  		}else{
  			return (
  			<li key={movs}>
  				<button onClick={(movs)=> {this.jumpTo(move)}}>{desc}</button>
  			</li>
  			);
  		}
  	});
  	let status;
  	let winners;
  	if (winner) {
  		status = 'Winner: '+winner[0];
  		winners = winner;
  	}else{
    	status = 'Next player: '+(this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board 
          	squares={current.squares}
          	winner={winners}
          	onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={()=>{this.changeDir()}}>Change Direction</button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
