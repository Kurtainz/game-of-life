import React from 'react';
import ReactDOM from 'react-dom';
import './styles.css';


// class Square extends React.Component {

//     handleClick = () => {
//         this.props.handleClick(this.props.y, this.props.x, this.props.active);
//     }
    
//     render() {

//         let className = 'squareOff';
//         if (this.props.active) {
//             className = 'squareOn';
//         }

//          return(
//             <div className={className} onClick={this.handleClick} />
//         )
//     }
   
// }

const Square = (props) => {

    const handleClick = () => {
        props.clickSquare(props.y, props.x, props.active);
    }

    let className = 'squareOff';
    if (props.active) {
        className = 'squareOn';
    }

    return(
        <div className={className} onClick={handleClick} />
    )

}

const Counter = (props) => {

    return(
        <h2>Generation: {props.generation}</h2>
    )

}

const FirstButtonRow = (props) => {

    const handleClick = () => {
        props.changeSize(props.type);
    }

    return(
        <div>
            <Button changeSize={props.changeSize} handleClick={handleClick} type='Small' />
            <Button changeSize={props.changeSize} handleClick={handleClick} type='Medium' />
            <Button changeSize={props.changeSize} handleClick={handleClick} type='Large' />
        </div>
    )

}

const SecondButtonRow = (props) => {

    return(
        <div>
            <Button handleClick={props.changeSpeed} type='Slow' />
            <Button handleClick={props.changeSpeed} type='Mid' />
            <Button handleClick={props.changeSpeed} type='Fast' />
        </div>
    )

}

const ThirdButtonRow = (props) => {

    const handleClick = () => {
        if (props.pause) {
            props.runSim();
        }
        else {
            props.stopSim();
        }
    }

    let pauseText = 'Pause';
    if (props.pause) {
        pauseText = 'Start';
    }

    return(
        <div>
            {/* Stop/Start button */}
            <Button stopSim={props.stopSim} handleClick={handleClick} type={pauseText} />
            {/* Clear board button */}
            <Button handleClick={props.clearBoard} type='Clear' />
        </div>
    )

}

const Button = (props) => {

    const handleClick = () => props.handleClick(props.type);
    
        return(
            <button onClick={handleClick}>{props.type}</button>
        )
    
    }

class Game extends React.Component {

    state = {
        width : 50,
        height : 30,
        generation : 0,
        grid : [],
        activeSquares : [],
        pause : false,
        loop : '',
        speed : 'Fast'
    }

    componentWillMount() {
        this.drawBoard();
    }

    // drawBoard = () => {
    //     const randomSquares = this.randomiseSquares();
    //     this.setState(prevState => ({
    //         activeSquares : randomSquares
    //     }), () => {
    //             const grid = this.makeSquares();
    //             this.setState(prevState => ({
    //                 grid : grid
    //             }), () => this.runSim())
    //         }
    //     )
    // }

    drawBoard = () => {
        const randomSquares = this.randomiseSquares();
        this.changeState({activeSquares : randomSquares}).then(() => {
            const grid = this.makeSquares();
            this.changeState({grid : grid});
        }).then(this.runSim())
    }

    randomiseSquares = () => {
        const randomSquares = [];
        for (let i = 0; i < this.state.height; i++) {
            for (let j = 0; j < this.state.width; j++) {
                const random = Math.floor((Math.random() * 2) + 1);
                if (random === 1) {
                    randomSquares.push({y : i, x : j});
                }
            }
        }
        return randomSquares;
    }

    makeSquares = () => {
        const newGrid = Array.from({length : this.state.height}, (val, y) => {
            return <div className='squareRow' key={y} y={y}>
                 {Array.from({length : this.state.width}, (val, x) => {
                     let active = false;
                    this.state.activeSquares.forEach((square) => {
                        if (square.x === x && square.y === y) {
                            active = true;
                        }
                    })
                    return <Square key={x} x={x} y={y} active={active} clickSquare={this.clickSquare} />
                })}
            </div>
        });
        return newGrid;
    }

    // runSim = () => {
    //     this.setState(prevState => ({
    //         pause : false,
    //         loop : setInterval(() => this.changeSquares(), 1000)
    //     }))
    // }

    runSim = () => {
        this.changeState({pause : false,});
        this.changeSpeed(this.state.speed);
    }

    // stopSim = () => {
    //     this.setState(prevState => ({
    //         pause : true,
    //         loop : clearInterval(this.state.loop)
    //     }))
    // }

    stopSim = () => {
        this.changeState({
            pause : true,
            loop : clearInterval(this.state.loop)
        })
    }

    changeSpeed = (speed) => {
        let interval = 0;
        if (speed === 'Slow') {
            this.changeState({speed : 'Slow'});
            interval = 1000;
        }
        else if (speed === 'Fast') {
            this.changeState({speed : 'Mid'});
            interval = 500;
        }
        else {
            this.changeState({speed : 'Fast'});
            interval = 400;
        }
        this.changeState({loop : clearInterval(this.state.loop)}).then(
            this.changeState({loop : setInterval(() => this.changeSquares(), interval)})
        )

    }

    clearBoard = () => {
        this.stopSim();
        this.changeState({activeSquares : []}).then(() => {
            const newGrid = this.makeSquares();
            this.changeState({
                grid : newGrid,
                generation : 0,
                pause : true
            });
        })
    }

    // changeState = (newState) => {
    //     this.setState(prevState => (newState))
    // }

    changeState = (newState) => {
        return new Promise((resolve, reject) => {
            this.setState(prevState => (newState), resolve())
        })
    }

    // changeSquares = () => {

    //     let newActiveArr = this.state.activeSquares.slice();
    //     this.state.grid.forEach((row) => {
    //         row.props.children.forEach((square) => {
    //             const x = square.props.x;
    //             const y = square.props.y;
    //             let activeCounter = 0;
    //             const adjSquares = this.getAdjacentSquares(x, y);
    //             adjSquares.forEach((adjSquare) => {
    //                 if (this.state.grid[adjSquare.props.y].props.children[adjSquare.props.x].props.active === true) {
    //                     activeCounter++;
    //                 }
    //             })
    //             if (square.props.active) {
    //                 if (activeCounter < 2 || activeCounter > 3) {
    //                     for (let i = 0; i < newActiveArr.length; i++) {
    //                         if (newActiveArr[i].y === y && newActiveArr[i].x === x) {
    //                             newActiveArr.splice(i, 1);
    //                         }
    //                     }
    //                 }
    //             }
    //             else if (!square.props.active) {
    //                 if (activeCounter === 3) {
    //                     newActiveArr.push({y : y, x : x});
    //                 }
    //             }
    //         })
    //     })
    //     this.setState(prevState => ({
    //         activeSquares : newActiveArr
    //     }), () => {
    //         const newGrid = this.makeSquares();
    //         this.setState(prevState => ({
    //             grid : newGrid
    //         }))
    //     });
    // }

    changeSquares = () => {
        
        let newActiveArr = this.state.activeSquares.slice();
        this.state.grid.forEach((row) => {
            row.props.children.forEach((square) => {
                const x = square.props.x;
                const y = square.props.y;
                let activeCounter = 0;
                const adjSquares = this.getAdjacentSquares(x, y);
                adjSquares.forEach((adjSquare) => {
                    if (activeCounter < 4) {
                        if (this.state.grid[adjSquare.props.y].props.children[adjSquare.props.x].props.active === true) {
                            activeCounter++;
                        }
                    }
                })
                if (square.props.active) {
                    if (activeCounter < 2 || activeCounter > 3) {
                        for (let i = 0; i < newActiveArr.length; i++) {
                            if (newActiveArr[i].y === y && newActiveArr[i].x === x) {
                                newActiveArr.splice(i, 1);
                            }
                        }
                    }
                }
                else if (!square.props.active) {
                    if (activeCounter === 3) {
                        newActiveArr.push({y : y, x : x});
                    }
                }
            })
        })
        this.changeState({activeSquares : newActiveArr}).then(() => {
            const newGrid = this.makeSquares();
            const generation = this.state.generation + 1;
            this.changeState({
                grid : newGrid,
                generation : generation
            });
        })
    }

    // handleClick = (y, x, active) => {
    //     if (active) {
    //         this.setState(prevState => ({
    //             activeSquares : prevState.activeSquares.splice(prevState.activeSquares.findIndex((entry) => entry.y === y && entry.x === x))
    //         }))
    //     }
    //     else {
    //         this.setState(prevState => ({
    //             activeSquares : prevState.activeSquares.concat({y : y, x : x})
    //         }))
    //     }
    // }

    clickSquare = (y, x, active) => {
        const prevState = this.state;
        if (!this.state.pause) {
            this.changeState({loop : clearInterval(this.state.loop)});
        }
        if (active) {
            this.changeState({activeSquares : prevState.activeSquares.splice(prevState.activeSquares.findIndex((entry) => entry.y === y && entry.x === x))}).then(
                () => {
                    const newGrid = this.makeSquares();
                    this.changeState({grid : newGrid}).then(this.changeSpeed(this.state.speed))
                }
            )
        }
        else {
            this.changeState({activeSquares : prevState.activeSquares.concat({y : y, x : x})}).then(() => {
                const newGrid = this.makeSquares();
                this.changeState({grid : newGrid}).then(this.changeSpeed(this.state.speed))
            })
        }
    }

    getAdjacentSquares = (x, y) => {

        const height = this.state.height;
        const width = this.state.width;

        // Top left corner
        if (x === 0 && y === 0) {
            return [
                this.state.grid[height - 1].props.children[width - 1],
                this.state.grid[height - 1].props.children[x],
                this.state.grid[height - 1].props.children[x + 1],
                this.state.grid[y].props.children[width - 1],
                this.state.grid[y].props.children[x + 1],
                this.state.grid[y + 1].props.children[width - 1],
                this.state.grid[y + 1].props.children[x],
                this.state.grid[y + 1].props.children[x + 1]
            ];
        }
        // Bottom left corner
        else if (y === height - 1 && x === 0) {
            return [
                this.state.grid[y - 1].props.children[width - 1],
                this.state.grid[y - 1].props.children[x],
                this.state.grid[y - 1].props.children[x + 1],
                this.state.grid[y].props.children[width - 1],
                this.state.grid[y].props.children[x + 1],
                this.state.grid[0].props.children[width - 1],
                this.state.grid[0].props.children[x],
                this.state.grid[0].props.children[x + 1]
            ];
        }
        // Top right corner
        else if (x === width - 1 && y === 0) {
            return [
                this.state.grid[height - 1].props.children[x - 1],
                this.state.grid[height - 1].props.children[x],
                this.state.grid[height - 1].props.children[0],
                this.state.grid[y].props.children[x - 1],
                this.state.grid[y].props.children[0],
                this.state.grid[y + 1].props.children[x - 1],
                this.state.grid[y + 1].props.children[x],
                this.state.grid[y + 1].props.children[0]
            ];
        }
        // Bottom right corner
        else if (x === width - 1 && y === height - 1) {
            return [
                this.state.grid[y - 1].props.children[0],
                this.state.grid[y - 1].props.children[x],
                this.state.grid[y - 1].props.children[0],
                this.state.grid[y].props.children[x - 1],
                this.state.grid[y].props.children[0],
                this.state.grid[0].props.children[x - 1],
                this.state.grid[0].props.children[x],
                this.state.grid[0].props.children[0]
            ];
        }
        // Top of board, not in corner
        else if (y === 0) {
            return [
                this.state.grid[height - 1].props.children[x - 1],
                this.state.grid[height - 1].props.children[x],
                this.state.grid[height - 1].props.children[x + 1],
                this.state.grid[y].props.children[x - 1],
                this.state.grid[y].props.children[x + 1],
                this.state.grid[y + 1].props.children[x - 1],
                this.state.grid[y + 1].props.children[x],
                this.state.grid[y + 1].props.children[x + 1]
            ];
        }
        // Right edge, not in corner
        else if (x === width - 1) {
            return [
                this.state.grid[y - 1].props.children[x - 1],
                this.state.grid[y - 1].props.children[x],
                this.state.grid[y - 1].props.children[0],
                this.state.grid[y].props.children[x - 1],
                this.state.grid[y].props.children[0],
                this.state.grid[y + 1].props.children[x - 1],
                this.state.grid[y + 1].props.children[x],
                this.state.grid[y + 1].props.children[0]
            ];
        }
        // Bottom edge, not in corner
        else if (y === height - 1) {
            return [
                this.state.grid[y - 1].props.children[x - 1],
                this.state.grid[y - 1].props.children[x],
                this.state.grid[y - 1].props.children[x + 1],
                this.state.grid[y].props.children[x - 1],
                this.state.grid[y].props.children[x + 1],
                this.state.grid[0].props.children[x - 1],
                this.state.grid[0].props.children[x],
                this.state.grid[0].props.children[x + 1]
            ];
        }
        // Left edge, not in corner
        else if (x === 0) {
            return [
                this.state.grid[0].props.children[width - 1],
                this.state.grid[y - 1].props.children[x],
                this.state.grid[y - 1].props.children[x + 1],
                this.state.grid[y].props.children[width - 1],
                this.state.grid[y].props.children[x + 1],
                this.state.grid[y + 1].props.children[width - 1],
                this.state.grid[y + 1].props.children[x],
                this.state.grid[y + 1].props.children[x + 1]
            ];
        }
        // No edges
        else {
            return [
                this.state.grid[y - 1].props.children[x - 1],
                this.state.grid[y - 1].props.children[x],
                this.state.grid[y - 1].props.children[x + 1],
                this.state.grid[y].props.children[x - 1],
                this.state.grid[y].props.children[x + 1],
                this.state.grid[y + 1].props.children[x - 1],
                this.state.grid[y + 1].props.children[x],
                this.state.grid[y + 1].props.children[x + 1]
            ];
        }

    }

    changeSize = (size) => {
        let width = 30;
        let height = 50;
        if (size === 'Medium') {
            width = 60;
            height = 90;
        }
        else if (size === 'Large') {
            width = 100;
            height = 150;
        }
        this.changeState({
            width : width,
            height : height
        }).then(this.drawBoard);
    }

    render() {
        return(
            <div>
                <Counter generation={this.state.generation} />
                <div className='block'>
                    {this.state.grid}
                </div>
                <div>
                    <FirstButtonRow changeSize={this.changeSize} />
                    <SecondButtonRow changeSpeed={this.changeSpeed} />
                    <ThirdButtonRow pause={this.state.pause} runSim={this.runSim} stopSim={this.stopSim} clearBoard={this.clearBoard} />
                </div>
            </div>
        )
    }

}

class App extends React.Component {

    render() {
        return(
            <div>
                <h1>Welcome To The New Project</h1>
                <Game />
            </div>
        )
    }

}

ReactDOM.render(<App />, document.getElementById('root'));