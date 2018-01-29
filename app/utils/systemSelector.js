// simple system script;
// the idea is the system alway plays the center if it is available;
// determines the best move based on minimax algorith then using randomly either play the
// best move or a random move from possible moves
import checkWin from './checkWin';

const SYSTEM = "o";
const PLAYER1 = "x";

export default (gameData, tilesData) => {

    // const possibleMoves
    const movesMade = Object.keys(gameData).map(key => gameData[key].move);
    const flatTiles = flattenTiles();
    // console.log(gameData, flatTiles, getEmptyTiles(gameData))

    const available = getEmptyTiles(gameData);

    if(Object.keys(gameData).length <6){
        return;
    }

    const availableActions = available.map(pos => {
        const next = {
            ...gameData,
            [pos.key]: {
                move: pos.move,
                value: SYSTEM
            }
        }

        const minimax = minimaxValue({state: next, move: pos.move, player: SYSTEM})
        return {pos, minimax}
    })

    console.log(availableActions)
    // this.turn

    /*
        check if  center tile played
        my simple script makes sure that the center tile gets played
        within 2 moves, hence I dont need to check center tiles after
        two moves have been played
    */

    if(movesMade.length < 2) {
        for(let i=0; i<movesMade.length; i++){
            if(movesMade[i][0] === 1 && movesMade[i][1] === 1) break
            return tilesData[1, 1]
        }
    }

    /*
        best move based on minimax
    */

    function minimaxValue({state, move, player}){
        const winner = checkWin(state, move, player);
        // console.log(winner, player, move)
        if(winner || Object.keys(state).length === 9) {
            if(winner && player === SYSTEM ){
                console.log("this is in winner")
                return -10 + Object.keys(state)
                    .map(key => state[key])
                    .reduce((acc, next) => {
                        if(next.value === SYSTEM) return acc++
                        return acc
                    }, 0)
            } else if(winner && player === PLAYER1) {
                return 10 - Object.keys(state)
                    .map(key => state[key])
                    .reduce((acc, next) => {
                        if(next.value === SYSTEM) return acc++
                        return acc
                    }, 0)
            } else {
                return 0;
            }

        } else {
            let score;
            if(player === SYSTEM){
                score = 1000;
            } else {
                score = -1000;
            }

            const availablePositions = getEmptyTiles(state);

            const availableStates = availablePositions.map(pos => {
                const nextState = {
                    ...state,
                    [pos.key]: {
                        move: pos.move,
                        value: player === SYSTEM? PLAYER1 : SYSTEM,
                    }
                }

                return {nextState, move: pos.move}
            })

            availableStates.forEach(({nextState, move}) => {
                const nextScore = minimaxValue({state: nextState, move, player: player === SYSTEM? PLAYER1 : SYSTEM})
                if(player === SYSTEM){
                    if(nextScore < score) score = nextScore;
                } else {
                    if(nextScore > score) score = nextScore;
                }
            })
            return score
        }

    }

    function getEmptyTiles(state){
        return flatTiles.filter( value => {
            return Object.keys(state).indexOf(value.key) === -1
        })
    }

    // I know tiles is a 2d-array so I can just flatten it.
    function flattenTiles(){
        let newArray = []

        tilesData.forEach(value => {
            newArray = [...newArray, ...value]
        })
        return newArray
    }
}
