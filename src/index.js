import React from 'react';
import ReactDOM from 'react-dom';
import './styles.css';

const Grid = (props) => {

    return(
        <div>
            <h2>Generation: {props.generation}</h2>
            <div className='block' >{props.grid}</div>
        </div>
    )

}

const Square = (props) => {

    let className = 'squareOff';
    if (props.active) {
        className = 'squareOn';
    }

    const handleClick = () => props.clickSquare(props.y, props.x, props.active);

    return(
        <div className={className} onClick={handleClick} style={props.style} />
    )

}

const ActionButtons = (props) => {

    let startStop = 'Stop';
    if (props.pause === true) {
        startStop = 'Start';
    }

    const handleClick = (type) => {
        if (type === 'Reset') {
            props.clearBoard();
        }
        else {
            if (type === 'Stop') {
                props.stopSim();
            }
            else {
                props.startSim();
            }
        }
    }

    return(
        <div>
            <Button handleClick={handleClick} type={startStop} />
            <Button handleClick={handleClick} type='Reset' />
        </div>
    )

}

const SpeedButtons = (props) => {

    const handleClick = (type) => props.changeSpeed(type);

    return(
        <div>
            <Button currentState={props.speed} handleClick={handleClick} type='Slow' />
            <Button currentState={props.speed} handleClick={handleClick} type='Mid' />
            <Button currentState={props.speed} handleClick={handleClick} type='Fast' />
        </div>
    )

}

const SizeButtons = (props) => {

    const handleClick = (type) => props.changeSize(type);

    return(
        <div>
            <Button currentState={props.size} handleClick={handleClick} type='Small' />
            <Button currentState={props.size} handleClick={handleClick} type='Medium' />
            <Button currentState={props.size} handleClick={handleClick} type='Large' />
        </div>
    )

}

const Button = (props) => {

    const handleClick = () => props.handleClick(props.type);

    let disabled = false;
    if (props.currentState === props.type) {
        disabled = true;
    }

    return(
        <button disabled={disabled} onClick={handleClick} >{props.type}</button>
    )

}

class Game extends React.Component {

    state = {
        width : 50,
        height : 30,
        pause : false,
        speed : 'Fast',
        size : 'Medium',
        generation : 1,
        grid : [],
    }

    componentWillMount() {
        console.log('Mount');
        this.drawBoard();
        this.setState(prevState => ({
            grid : this.grid
        }))
        this.loop = setInterval(() => {
            this.grid = this.changeSquares();
            this.setState(prevState => ({
                grid : this.grid,
                generation : prevState.generation += 1
            }))
        }, 200)
    }
    
    grid = [];

    smallSquareRow = {
        height : 'calc(100% / 24)'
    };

    smallSquare = {
        width : 'calc(100% / 30)'
    }

    medSquareRow = {
        height : 'calc(100% / 30)'
    };

    medSquare = {
        width : 'calc(100% / 50)'
    }

    largeSquareRow = {
        height : 'calc(100% / 40)'
    };

    largeSquare = {
        width : 'calc(100% / 70)'
    }

    rowStyle = this.medSquareRow;
    squareStyle = this.medSquare;

    drawBoard = () => {
        const randomSquares = this.randomiseSquares();
        this.grid = this.makeSquares(randomSquares);
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

    makeSquares = (activeSquares) => {
        const newGrid = Array.from({length : this.state.height}, (val, y) => {
            return <div style={this.rowStyle} key={y} y={y}>
                 {Array.from({length : this.state.width}, (val, x) => {
                    let active = false;
                    if (activeSquares) {
                        activeSquares.forEach((square) => {
                            if (square.x === x && square.y === y) {
                                active = true;
                            }
                        })
                    }
                    return <Square key={x} x={x} y={y} active={active} style={this.squareStyle} clickSquare={this.clickSquare} />
                })}
            </div>
        });
        return newGrid;
    }

    setStyle = (size) => {
        switch (size) {
            case 'Small':
                this.rowStyle = this.smallSquareRow;
                this.squareStyle = this.smallSquare;
                break;
            case 'Medium':
                this.rowStyle = this.medSquareRow;
                this.squareStyle = this.medSquare;
                break;
            case 'Large':
                this.rowStyle = this.largeSquareRow;
                this.squareStyle = this.largeSquare;
                break;
        }
    }

    changeSquares = () => {
        const newGrid = Array.from({length : this.state.height}, (val, y) => {
            return <div style={this.rowStyle} className='squareRow' key={y} y={y}>
                {Array.from({length : this.state.width}, (val, x) => {
                    let activeCounter = 0;
                    let active = false;
                    const adjSquares = this.getAdjacentSquares(x, y);
                    adjSquares.forEach((adjSquare) => {
                        if (activeCounter < 4) {
                            if (this.grid[adjSquare.props.y].props.children[adjSquare.props.x].props.active === true) {
                                activeCounter++;
                            }
                        }
                    })
                    if (this.grid[y].props.children[x].props.active) {
                        if (activeCounter === 2 || activeCounter === 3) {
                            active = true;
                        }
                    }
                    else {
                        if (activeCounter === 3) {
                            active = true;
                        }
                    }
                    return <Square key={x} x={x} y={y} active={active} style={this.squareStyle} clickSquare={this.clickSquare} />
                })}
            </div>
        });
        return newGrid;
    }

    clickSquare = (y, x, active) => {
        clearInterval(this.loop);
        const activeSquares = [];
        this.grid.forEach((row) => {
            row.props.children.forEach((square) => {
                if (square.props.active) {
                    if (!(square.props.y === y && square.props.x === x)) {
                        activeSquares.push({y : square.props.y, x : square.props.x});                        
                    }
                }
            })
        })
        if (!active) {
            activeSquares.push({y : y, x : x})
        }
        this.grid = this.makeSquares(activeSquares);
        this.setState(prevState => ({
            grid : this.grid
        }))
        if (!this.state.pause) {
            this.loop = setInterval(() => {
                this.grid = this.changeSquares();
                this.setState(prevState => ({
                    grid : this.grid,
                    generation : prevState.generation += 1
                }))
            }, 200);
        }
    }

    getActiveSquares = () => {
        this.grid.forEach((row) => {
            row.props.children.forEach((square) => {
                if (square.props.active) {
                    
                }
            })
        })
    }

    clearBoard = () => {
        this.stopSim();
        this.grid = this.makeSquares();
        this.setState(prevState => ({
            grid : this.grid,
            generation : 0
        }));
    }

    stopSim = () => {
        clearInterval(this.loop);
        this.setState(prevState => ({pause : true}));
    }

    startSim = () => {
        this.setState(prevState => ({pause : false}));
        this.loop = setInterval(() => {
            this.grid = this.changeSquares();
            this.setState(prevState => ({
                grid : this.grid,
                generation : prevState.generation += 1
            }));
        }, 200);
    }

    changeSpeed = (speed) => {
        let interval = 200;
        if (speed === 'Slow') {
            console.log('Slow');
            interval = 1000;
        }
        else if (speed === 'Mid') {
            interval = 700;
        }
        this.setState(prevState => ({speed : speed}));
        clearInterval(this.loop);
        this.loop = setInterval(() => {
            this.grid = this.changeSquares();
            this.setState(prevState => ({
                grid : this.grid,
                generation : prevState.generation += 1
            }));
        }, interval);
    }

    changeSize = (size) => {
        let width = 50;
        let height = 30;
        switch (size) {
            case 'Small':
                width = 30;
                height = 24;
                break;
            case 'Large':
                width = 70;
                height = 40;
                break;
        }
        this.setState(prevState => ({
            size : size,
            width : width,
            height : height
        }), () => {
            const activeSquares = [];
            this.grid.forEach((row) => {
                row.props.children.forEach((square) => {
                    if (square.props.active) {
                        activeSquares.push({y : square.props.y, x : square.props.x});
                    }
                })
            })
            this.setStyle(size);
            this.grid = this.makeSquares(activeSquares);
            this.setState(prevState => ({grid : this.grid}));
            if (!this.state.pause) {
                this.changeSpeed(this.state.speed);                
            }
        })
    }

    changeState = (obj) => this.setState(prevState => (obj));

    getAdjacentSquares = (x, y) => {
        
        const height = this.state.height;
        const width = this.state.width;

        // Top left corner
        if (x === 0 && y === 0) {
            return [
                this.grid[height - 1].props.children[width - 1],
                this.grid[height - 1].props.children[x],
                this.grid[height - 1].props.children[x + 1],
                this.grid[y].props.children[width - 1],
                this.grid[y].props.children[x + 1],
                this.grid[y + 1].props.children[width - 1],
                this.grid[y + 1].props.children[x],
                this.grid[y + 1].props.children[x + 1]
            ];
        }
        // Bottom left corner
        else if (y === height - 1 && x === 0) {
            return [
                this.grid[y - 1].props.children[width - 1],
                this.grid[y - 1].props.children[x],
                this.grid[y - 1].props.children[x + 1],
                this.grid[y].props.children[width - 1],
                this.grid[y].props.children[x + 1],
                this.grid[0].props.children[width - 1],
                this.grid[0].props.children[x],
                this.grid[0].props.children[x + 1]
            ];
        }
        // Top right corner
        else if (x === width - 1 && y === 0) {
            return [
                this.grid[height - 1].props.children[x - 1],
                this.grid[height - 1].props.children[x],
                this.grid[height - 1].props.children[0],
                this.grid[y].props.children[x - 1],
                this.grid[y].props.children[0],
                this.grid[y + 1].props.children[x - 1],
                this.grid[y + 1].props.children[x],
                this.grid[y + 1].props.children[0]
            ];
        }
        // Bottom right corner
        else if (x === width - 1 && y === height - 1) {
            return [
                this.grid[y - 1].props.children[0],
                this.grid[y - 1].props.children[x],
                this.grid[y - 1].props.children[0],
                this.grid[y].props.children[x - 1],
                this.grid[y].props.children[0],
                this.grid[0].props.children[x - 1],
                this.grid[0].props.children[x],
                this.grid[0].props.children[0]
            ];
        }
        // Top of board, not in corner
        else if (y === 0) {
            return [
                this.grid[height - 1].props.children[x - 1],
                this.grid[height - 1].props.children[x],
                this.grid[height - 1].props.children[x + 1],
                this.grid[y].props.children[x - 1],
                this.grid[y].props.children[x + 1],
                this.grid[y + 1].props.children[x - 1],
                this.grid[y + 1].props.children[x],
                this.grid[y + 1].props.children[x + 1]
            ];
        }
        // Right edge, not in corner
        else if (x === width - 1) {
            return [
                this.grid[y - 1].props.children[x - 1],
                this.grid[y - 1].props.children[x],
                this.grid[y - 1].props.children[0],
                this.grid[y].props.children[x - 1],
                this.grid[y].props.children[0],
                this.grid[y + 1].props.children[x - 1],
                this.grid[y + 1].props.children[x],
                this.grid[y + 1].props.children[0]
            ];
        }
        // Bottom edge, not in corner
        else if (y === height - 1) {
            return [
                this.grid[y - 1].props.children[x - 1],
                this.grid[y - 1].props.children[x],
                this.grid[y - 1].props.children[x + 1],
                this.grid[y].props.children[x - 1],
                this.grid[y].props.children[x + 1],
                this.grid[0].props.children[x - 1],
                this.grid[0].props.children[x],
                this.grid[0].props.children[x + 1]
            ];
        }
        // Left edge, not in corner
        else if (x === 0) {
            return [
                this.grid[0].props.children[width - 1],
                this.grid[y - 1].props.children[x],
                this.grid[y - 1].props.children[x + 1],
                this.grid[y].props.children[width - 1],
                this.grid[y].props.children[x + 1],
                this.grid[y + 1].props.children[width - 1],
                this.grid[y + 1].props.children[x],
                this.grid[y + 1].props.children[x + 1]
            ];
        }
        // No edges
        else {
            return [
                this.grid[y - 1].props.children[x - 1],
                this.grid[y - 1].props.children[x],
                this.grid[y - 1].props.children[x + 1],
                this.grid[y].props.children[x - 1],
                this.grid[y].props.children[x + 1],
                this.grid[y + 1].props.children[x - 1],
                this.grid[y + 1].props.children[x],
                this.grid[y + 1].props.children[x + 1]
            ];
        }

    }

    render() {
        return(
            <div>
                <Grid generation={this.state.generation} grid={this.state.grid} />
                <div>
                    <ActionButtons pause={this.state.pause} clearBoard={this.clearBoard} stopSim={this.stopSim} startSim={this.startSim} />
                </div>
                <div>
                    <SpeedButtons speed={this.state.speed} changeSpeed={this.changeSpeed} />
                </div>
                <div>
                    <SizeButtons size={this.state.size} changeSize={this.changeSize} />
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