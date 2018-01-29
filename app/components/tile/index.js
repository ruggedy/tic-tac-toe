import React, { PureComponent } from 'react';


import './index.scss';

export default class Tiles extends PureComponent {

    constructor(props){
        super(props)
    }

    static defaultProps = {
        type: null
    }

    componentWillReceiveProps = (nextProps) => {
        if(this._tileRef && nextProps.gameWonIndex !== -1){
            this._tileRef.style.setProperty('--delay', `${nextProps.gameWonIndex*0.25}s`)
        }
    }

    renderLine = () => {
        const { gameWonIndex, gameWonDirection } = this.props;
        if(gameWonIndex === -1) return null;
        return <div className={`win-line ${gameWonDirection}`} />

    }

    renderPattern = (type) => {
        if(!type) return null;

        const classes = type === 'x'? "fa-times" : "fa-circle-o"
        return (
            <div className="pattern">
                <i className={`fa ${classes} fa-5x`} />
            </div>
        )
    }

    render(){
        const { showSelectable, tileClicked, type, gameWonIndex } = this.props;
        const classes = `game-tile ${showSelectable? 'selectable': ''}`

        return (
            <td ref={ ref => this._tileRef = ref } className={classes} onClick={tileClicked}>
                {this.renderPattern(type)}
                {this.renderLine()}
            </td>
        )
    }
}
