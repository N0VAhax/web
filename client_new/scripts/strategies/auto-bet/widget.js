/** Todo: If we send the Store and the actions maybe is better to just send the state, this looks like not fluxy **/

define([
    'game-logic/clib',
    'lib/react',
    'lib/react-radio',
    'strategies/strategies',
    'actions/StrategyEditorActions',
    'game-logic/engine',
    'stores/GameSettingsStore'
], function(
    Clib,
    React,
    ReactRadioClass,
    Strategies,
    StrategyEditorActions,
    Engine,
    GameSettingsStore
){

    var ReactRadio = React.createFactory(ReactRadioClass);
    var D = React.DOM;

    return React.createClass({
        displayName: 'AutoBetWidget',

        propTypes: {
            StrategyEditorStore: React.PropTypes.object.isRequired,
            StrategyEditorActions: React.PropTypes.object.isRequired
        },

        getState: function() {
            var state = this.props.StrategyEditorStore.getWidgetState();
            state.active = this.props.StrategyEditorStore.getEditorState();
            return state;
        },

        getInitialState: function() {
            return this.getState();
        },

        componentDidMount: function() {
            this.props.StrategyEditorStore.addWidgetChangeListener(this._onChange);
            GameSettingsStore.on('all', this._onChange);
        },

        componentWillUnmount: function() {
            this.props.StrategyEditorStore.removeWidgetChangeListener(this._onChange);
            GameSettingsStore.off('all', this._onChange);
        },

        _onChange: function() {
            this.setState(this.getState());
        },

        updateOnLoss: function(opt) {
            this.props.StrategyEditorActions.setWidgetState('onLossSelectedOpt', opt);
        },

        updateOnWin: function(opt) {
            this.props.StrategyEditorActions.setWidgetState('onWinSelectedOpt', opt);
        },

        updateBetAmount: function() {
            var amount = this.refs.bet_amount.getDOMNode().value;
            this.props.StrategyEditorActions.setWidgetState('baseBet', amount);
        },

        updateAutoCashAt: function() {
            var amount = this.refs.auto_cash_at.getDOMNode().value;
            this.props.StrategyEditorActions.setWidgetState('autoCashAt', amount);
        },

        updateOnLossQty: function() {
            var amount = this.refs.onLossQty.getDOMNode().value;
            this.props.StrategyEditorActions.setWidgetState('onLossIncreaseQty', amount);
        },

        updateOnWinQty: function() {
            var amount = this.refs.onWinQty.getDOMNode().value;
            this.props.StrategyEditorActions.setWidgetState('onWinIncreaseQty', amount);
        },

        updateMaxBetStop: function() {
            var amount = this.refs.max_bet_stop.getDOMNode().value;
            this.props.StrategyEditorActions.setWidgetState('maxBetStop', amount);
        },

        _selectStrategy: function() {
            var strategyName = this.refs.strategies.getDOMNode().value;
            StrategyEditorActions.selectStrategy(strategyName);
        },

        setTenPercentBet: function () {
            var balanceMeth = Math.floor(Engine.balanceSatoshis/1000000);
            var newBaseBet = Math.floor(balanceMeth/10);
            if (newBaseBet < 1 ){
                newBaseBet = 1;
            }
            newBaseBet = newBaseBet.toString();
            this.setState({betSize: newBaseBet});
            this.props.StrategyEditorActions.setWidgetState('baseBet', newBaseBet);
        },
        setTwentyfivePercentBet: function () {
            var balanceMeth = Math.floor(Engine.balanceSatoshis/1000000);
            var newBaseBet = Math.floor(balanceMeth/4);
            if (newBaseBet < 1 ){
                newBaseBet = 1;
            }
            newBaseBet = newBaseBet.toString();
            this.setState({betSize: newBaseBet});
            this.props.StrategyEditorActions.setWidgetState('baseBet', newBaseBet);
        },
        setFiftyPercentBet: function () {
            var balanceMeth = Math.floor(Engine.balanceSatoshis/1000000);
            var newBaseBet = Math.floor(balanceMeth/2);
            if (newBaseBet < 1 ){
                newBaseBet = 1;
            }
            newBaseBet = newBaseBet.toString();
            this.setState({betSize: newBaseBet});
            this.props.StrategyEditorActions.setWidgetState('baseBet', newBaseBet);
        },
        setHundredPercentBet: function () {
            var balanceMeth = Math.floor(Engine.balanceSatoshis/1000000);
            var newBaseBet = Math.floor(balanceMeth);
            if (newBaseBet < 1 ){
                newBaseBet = 1;
            }
            newBaseBet = newBaseBet.toString();
            this.setState({betSize: newBaseBet});
            this.props.StrategyEditorActions.setWidgetState('baseBet', newBaseBet);
        },
        setHalfBet: function() {
            var newBaseBet = parseInt(this.state.baseBet/2);
            if (newBaseBet < 1 ){
                newBaseBet = 1;
            }
            newBaseBet = newBaseBet.toString();
            this.setState({baseBet: newBaseBet});
            this.props.StrategyEditorActions.setWidgetState('baseBet', newBaseBet);
        },
        setTwiceValue: function() {
            var newBaseBet = this.state.baseBet*2;
            if (newBaseBet >  Engine.balanceSatoshis){
                newBaseBet = Engine.balanceSatoshis;
            }
            newBaseBet = parseInt(newBaseBet).toString();
            this.setState({baseBet: newBaseBet});
            this.props.StrategyEditorActions.setWidgetState('baseBet', newBaseBet);
        },
        setMinValue: function() {
            this.setState({baseBet: 1});
            this.props.StrategyEditorActions.setWidgetState('baseBet', 1);
        },
        setMaxValue: function() {
            this.setState({baseBet: Engine.balanceSatoshis});
            this.props.StrategyEditorActions.setWidgetState('baseBet', Engine.balanceSatoshis);
        },

        render: function() {

            var self = this;
            var currentUnit = GameSettingsStore.getCurrentUnit(); //{'ETH', 10^6}

            // /** Control Inputs: Bet & AutoCash@  **/
            // //var controlInputs = [], betContainer
            // var betContainer = D.div({ className: 'bet-container' , key: 'ci-1' },

            //     D.div({ className: 'bet-input-group' + (this.state.betInvalid? ' error' : '') },
            //         D.span({ className: 'text-uppercase' }, 'Bet'),
            //         D.input({
            //             type: 'text',
            //             name: 'bet-size',
            //             value: self.state.betSize,
            //             disabled: isPlayingOrBetting,
            //             onChange: function (e) {
            //                 self._setBetSize(e.target.value);
            //             }
            //         }),
            //         D.span({ className: '' }, 'Ethos')
            //     ),
            //     D.div({className: 'betamount-controls-container'},
            //         D.div({ className: 'betamount-controls control1' }, '1/2'),
            //         D.div({ className: 'betamount-controls control2' }, 'x2' ),
            //         D.div({ className: 'betamount-controls control3' }, 'min' ),
            //         D.div({ className: 'betamount-controls control4' }, 'max' )
            //     )
            // );

            // var autoCashContainer = D.div({ className: 'autocash-container', key: 'ci-2' },

            //     D.div({ className: 'bet-input-group' + (this.state.cashOutInvalid? ' error' : '') },
            //         D.span({ className: 'text-uppercase' }, 'Auto Cash Out'),
            //         D.input({
            //             min: 1,
            //             step: 0.01,
            //             value: self.state.cashOut,
            //             type: 'number',
            //             name: 'cash-out',
            //             disabled: isPlayingOrBetting,
            //             onChange: function (e) {
            //                 self._setAutoCashOut(e.target.value);
            //             }
            //         }),
            //         D.span({ className: '' }, '@ X')
            //     )
            // );

            // var controlInputs;
            // if(this.props.isMobileOrSmall || this.props.controlsSize === 'small') {
            //     controlInputs = D.div({ className: 'control-inputs-container' },
            //         D.div({ className: 'input-control' },
            //             betContainer
            //         ),

            //         D.div({ className: 'input-control' },
            //             autoCashContainer
            //         )
            //     );
            // } else {
            //     controlInputs = [];

            //     controlInputs.push(D.div({ className: 'input-control controls-row', key: 'coi-1' },
            //         betContainer
            //     ));

            //     controlInputs.push(D.div({ className: 'input-control controls-row', key: 'coi-2' },
            //         autoCashContainer
            //     ));
            // }

            return D.div({ className: 'auto-bet-container' },
                D.div({ className: 'stra-left-container' },

                    D.div({ className: 'bet-container' , key: 'ci-1' },

                        D.div({ className: 'bet-input-group' + (this.state.betInvalid? ' error' : '') },
                            D.span({ className: 'text-uppercase' }, 'Bet'),
                            D.input({
                                type: 'text',
                                ref: 'bet_amount',
                                onChange: this.updateBetAmount,
                                value: this.state.baseBet,
                                disabled: this.state.active
                            }),
                            D.span({ className: '' }, currentUnit.unitName)
                        ),
                        D.div({className: 'betamount-controls-container'},
                            D.div({ className: 'betamount-controls control1', onClick: this.setTenPercentBet }, '10%'),
                            D.div({ className: 'betamount-controls control2', onClick: this.setTwentyfivePercentBet }, '25%' ),
                            D.div({ className: 'betamount-controls control3', onClick: this.setFiftyPercentBet }, '50%' ),
                            D.div({ className: 'betamount-controls control4', onClick: this.setHundredPercentBet }, '100%' )
                        )
                    ),
                    // D.div({ className: 'stra-base-bet' },
                    //     D.span({ className: 'bet-title' }, 'Base Bet: '),
                    //     D.input({ type: 'text', ref: 'bet_amount', onChange: this.updateBetAmount, value: this.state.baseBet, disabled: this.state.active }),
                    //     D.span(null, 'Bits')
                    // ),
                    D.div({ className: 'autocash-container', key: 'ci-2' },

                        D.div({ className: 'bet-input-group' + (this.state.cashOutInvalid? ' error' : '') },
                            D.span({ className: 'text-uppercase' }, 'Auto Cash Out'),
                            D.input({
                                type: 'text',
                                ref: 'auto_cash_at',
                                onChange: this.updateAutoCashAt,
                                value: this.state.autoCashAt,
                                disabled: this.state.active
                            }),
                            D.span({ className: '' }, 'X')
                        )
                    )
                    // D.div({ className: 'stra-cash-out-at' },
                    //     D.span({ className: 'bet-title' }, 'Auto Cashout at:'),
                    //     D.input({ type: 'text', ref: 'auto_cash_at', onChange: this.updateAutoCashAt, value: this.state.autoCashAt, disabled: this.state.active }),
                    //     D.span(null, 'x')
                    // )
                ),
                D.div({ className: 'stra-right-container' },
                    D.div({ className: 'stra-max-bet-stop' },
                        D.span({ className: 'bet-title first-span-end' }, 'Stop if bet is > '),
                        D.span({},
                            D.input({ type: 'text', ref: 'max_bet_stop', onChange: this.updateMaxBetStop, value: this.state.maxBetStop, disabled: this.state.active }),
                            D.span(null, currentUnit.unitName)
                        )
                    ),
                    D.div({ className: 'stra-on-loss' },
                        D.span({ className: 'bet-title text-uppercase' }, 'On loss:'),
                        ReactRadio({ name: 'onLoss', className: 'radio-group', onChange: this.updateOnLoss, defaultValue: this.state.onLossSelectedOpt  },
                            D.input({
                                    type: 'radio',
                                    className: 'stra-on-loss-return-to-base-radio',
                                    value: 'return_to_base',
                                    disabled: this.state.active
                                },  D.span({className: "first-input-end"}, 'Base bet')
                            ),
                            D.input({
                                    type: 'radio',
                                    className: 'stra-on-loss-increase-bet-by',
                                    value: 'increase_bet_by',
                                    disabled: this.state.active
                                },
                                D.span(null, 'Increase bet by: '),
                                D.input({
                                        type: 'text',
                                        ref: 'onLossQty',
                                        onChange: this.updateOnLossQty,
                                        value: this.state.onLossIncreaseQty,
                                        disabled: this.state.active || this.state.onLossSelectedOpt != 'increase_bet_by' }
                                ),
                                D.span(null, 'x')
                            )
                        )
                    ),
                    D.div({ className: 'stra-on-win' },
                        D.span({ className: 'bet-title text-uppercase' }, 'On win:'),
                        ReactRadio({ name: 'onWin', className: 'radio-group', onChange: this.updateOnWin, defaultValue: this.state.onWinSelectedOpt },
                            D.input({
                                    type: 'radio',
                                    className: 'stra-on-win-return-to-base-radio',
                                    value: 'return_to_base',
                                    disabled: this.state.active
                                },  D.span({className: "first-input-end"}, 'Base bet')
                            ),
                            D.input({
                                    type: 'radio',
                                    className: 'stra-on-win-increase_bet_by',
                                    value: 'increase_bet_by',
                                    disabled: this.state.active
                                },  D.span(null, 'Increase bet by: '),
                                D.input({
                                        type: 'text',
                                        ref: 'onWinQty',
                                        onChange: this.updateOnWinQty,
                                        value: this.state.onWinIncreaseQty,
                                        disabled: this.state.active || this.state.onWinSelectedOpt != 'increase_bet_by' }
                                ),
                                D.span(null, 'x')
                            )
                        )
                    )//,
                    // D.select({ className: 'strategy-select', value: self.props.selectedStrategy,  onChange: self._selectStrategy, ref: 'strategies', disabled: self.props.active }, strategiesOptions)
                )
            );
        }

    });

});
