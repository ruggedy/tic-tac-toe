/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React, { Component } from 'react';
import Tile from '../../components/tile'
import shortId from 'shortid';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { merge } from 'rxjs/observable/merge';
import { timer } from 'rxjs/observable/timer';

import { map } from 'rxjs/operators/map';
import { delayWhen } from 'rxjs/operators/delayWhen';

import generateTiles from '../../utils/generateTiles';
import checkWin from '../../utils/checkWin';
import systemSelector from '../../utils/systemSelector';

import './index.scss'

// player constants;

const PLAYER1 = "PLAYER1";
const PLAYER2 = "PLAYER2";
const SYSTEM = "SYSTEM";

// ObservableTypes;
const TILESOBSERVABLES = "TILESOBSERVABLES";
const SHOWSELECTABLE = "SHOWSELECTABLE";

export default class App extends Component {

    constructor(props){
        super(props)
        this.tiles = generateTiles();
        this.state = {
            currentPlayer: PLAYER1,
            gameData: {},
            showSelectable: false,
            gameWon: null,
            // errors: {type: }
        }

        this.tilesClickedObservable = new Subject().pipe(
            map(data => ({ type: TILESOBSERVABLES, data })),
            delayWhen( value => this.state.currentPlayer === SYSTEM? timer(500) : timer(0))
        )

        this.showSelectableObservable = new Subject().pipe(
            map(value => ({ type: SHOWSELECTABLE })),
            delayWhen(value => this.state.showSelectable? timer(1000) : timer(0)),
        )

        this.eventsStream = merge(
            this.tilesClickedObservable,
            this.showSelectableObservable,
        )

    }

    componentDidMount = () => {
        this.subscription = this.eventsStream.subscribe(this._handleSubscription)
    }

    componentDidUpdate = (_, prevState) => {
        const pattern = prevState.currentPlayer === PLAYER1? "x" : "o";
        const gameWon = checkWin(this.state.gameData, this.state.lastMove, pattern)
        if(gameWon){
            this.setState({gameWon})
        }

        if(this.state.currentPlayer === SYSTEM) {
            // console.log()
            systemSelector(this.state.gameData, this.tiles)
        }
    }

    componentWillUnmount = () => {
        this.subscription.unsubscribe();
    }

    _handleSubscription = ({ type, data }) => {

        switch(type){
            case TILESOBSERVABLES:
                const { key, move } = data;
                if(this.state.gameData[key]){
                    this.showSelectableObservable.next();
                    break;
                }
                this.setState({
                    gameData: {
                        ...this.state.gameData,
                        [key]: {
                            move,
                            value: this.state.currentPlayer === PLAYER1? "x" : "o"
                        },
                    },
                    currentPlayer:  this.state.currentPlayer === PLAYER1? SYSTEM : PLAYER1,
                    lastMove: move
                })
                break;
            case SHOWSELECTABLE:
                this.setState({showSelectable: !this.state.showSelectable}, () => {
                    if(this.state.showSelectable){
                        this.showSelectableObservable.next()
                    }
                })
                break;
            default:
                break;
        }
    }

    getGameWonIndex = (pos) => {
        const {gameWon} = this.state;
        if(!gameWon) return -1;

        const { value } = gameWon
        for(let i=0; i<value.length; i++){
            const bool = value[i][0] === pos[0] && value[i][1] === pos[1]
            if(bool) return i
        }
        return -1;
    }

    renderRow = (row, index) => {
        return (
            <tr key={index}>
                {row.map(this.renderTile)}
            </tr>
        )
    }

    renderTile = ({key, move}, index) => {
        const { gameData, showSelectable, gameWon } = this.state;
        return <Tile
            key={key}
            type={ gameData[key] && gameData[key].value }
            showSelectable={showSelectable && !gameData[key]}
            gameWonIndex={this.getGameWonIndex(move)}
            gameWonDirection={gameWon && gameWon.type}
            tileClicked={() => this.tilesClickedObservable.next({key, move})} />
    }

    render(){
        return (
            <div className="game-canvas">
                <div className="stars" />
                <div className="stars2" />
                <div className="stars3" />
                <div className="game-info">
                    <h2>Current Player: { this.state.currentPlayer }</h2>
                    <h2>timer</h2>
                </div>
                <table className="game-table">
                    <tbody>
                        {this.tiles.map(this.renderRow)}
                    </tbody>
                </table>
            </div>
        )
    }
}
