
export default (gameData, lastMove, pattern) => {

    const boardLength = 3
    const patArr = Object.keys(gameData)
        .filter(key => gameData[key].value === pattern)
        .map(key => {
            return gameData[key].move
        })


    // console.log(patArr, gameData)
    if(patArr.length < boardLength){
        return null
    }

    // console.log("this is path array", patArr)

    const findElementIndex = pos => elem => {
        return elem[0] === pos[0] && elem[1] === pos[1]
    }
    // check rows
    for(let i=0; i<boardLength; i++){

        const tilePos = [lastMove[0], i];
        if(pattern === "o" && patArr.length === 4){
        }

        if(patArr.findIndex(findElementIndex(tilePos)) === -1) break;
        if(i === 2){
            return {
                type: "row",
                pattern,
                value: [
                    [lastMove[0], 0],
                    [lastMove[0], 1],
                    [lastMove[0], 2],
                ]
            }
        }
    }

    // check columns
    for(let i=0; i<boardLength; i++){
        const tilePos = [i, lastMove[1]]
        if(patArr.findIndex(findElementIndex(tilePos)) === -1) break;
        if(i === 2){
            return {
                type: "col",
                pattern,
                value: [
                    [0, lastMove[1]],
                    [1, lastMove[1]],
                    [2, lastMove[1]],
                ]
            }
        }
    }

    // check diagonal
    if(lastMove[0] === lastMove[1]){
        for(let i=0; i<boardLength; i++){
            const tilePos = [i,i]
            if(patArr.findIndex(findElementIndex(tilePos)) === -1) break;
            if(i===2){
                return {
                    type: "diag",
                    pattern,
                    value: [
                        [0, 0],
                        [1, 1],
                        [2, 2]
                    ]
                }
            }
        }
    }

    // check anti-diagonal
    if(lastMove[0]+lastMove[1] === boardLength-1){
        for(let i=0; i<boardLength; i++){
            const tilePos = [i, boardLength-1-i]
            if(patArr.findIndex(findElementIndex(tilePos)) === -1) break;
            if(i===2){
                return  {
                    type: "antidiag",
                    pattern,
                    value: [
                        [0, 2],
                        [1, 1],
                        [2, 0],
                    ]
                }
            }
        }
    }

    return null;
}
