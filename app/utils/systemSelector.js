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

    // if(Object.keys(gameData).length <6){
    //     return;
    // }

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
    console.log(availableActions.sort((a, b) => a.minimax - b.minimax))

    return availableActions.sort((a, b) => a.minimax - b.minimax)[0].pos;

    /*
        best move based on minimax
    */

    function minimaxValue({state, move, player}){
        // console.log(state)
        const winner = checkWin(state, move, player);
        // console.log(winner, player, move)
        const aiMoves = Object.keys(state)
            .map(key => state[key])
            .filter(stateItem => stateItem.value === SYSTEM)
            .length

        if(winner || Object.keys(state).length === 9) {
            if(winner && player === SYSTEM ){
                return aiMoves-10;
            } else if(winner && player === PLAYER1) {
                return 10-aiMoves;
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

            const nextPlayer = player === SYSTEM? PLAYER1 : SYSTEM;

            const availableStates = availablePositions.map(pos => {
                const nextState = {
                    ...state,
                    [pos.key]: {
                        move: pos.move,
                        value: nextPlayer,
                    }
                }
                return {nextState, move: pos.move}
            })

            availableStates.forEach(({nextState, move}) => {
                const nextScore = minimaxValue({state: nextState, move, player: nextPlayer})
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
