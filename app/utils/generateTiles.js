import shortId from 'shortid';

export default () => {

    let newArray = []

    for(let i=0; i<3; i++){
        let columns = [];
        for(let j=0; j<3; j++){
            columns[j] = {
                key: shortId.generate(),
                move: [i, j]
            }
        }
        newArray[i] = columns
    }

    return newArray
}
