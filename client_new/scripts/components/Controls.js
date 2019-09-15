define([
    'lib/react',
    'game-logic/clib',
    'game-logic/stateLib',
    'lib/lodash',
    'components/BetButton',
    'actions/ControlsActions',
    'stores/ControlsStore',
    'game-logic/engine',
    'stores/GameSettingsStore'
], function(
    React,
    Clib,
    StateLib,
    _,
    BetButtonClass,
    ControlsActions,
    ControlsStore,
    Engine,
    GameSettingsStore
){
    var BetButton = React.createFactory(BetButtonClass);

    var D = React.DOM;

    function getState(){
        return {
            balanceMeth: Math.floor(Engine.balanceSatoshis/1000000),
            betSize: ControlsStore.getBetSize(), //Bet input string in bits
            betInvalid: ControlsStore.getBetInvalid(), //false || string error message
            cashOut: ControlsStore.getCashOut(),
            cashOutInvalid: ControlsStore.getCashOutInvalid(), //false || string error message
            engine: Engine
        }
    }

    return React.createClass({
        displayName: 'Controls',

        propTypes: {
            isMobileOrSmall: React.PropTypes.bool.isRequired,
            controlsSize: React.PropTypes.string.isRequired
        },

        getInitialState: function () {
            return getState();
        },

        componentDidMount: function() {
            ControlsStore.addChangeListener(this._onChange);
            Engine.on({
                game_started: this._onChange,
                game_crash: this._onChange,
                game_starting: this._onChange,
                player_bet: this._onChange,
                cashed_out: this._onChange,
                placing_bet: this._onChange,
                bet_placed: this._onChange,
                bet_queued: this._onChange,
                cashing_out: this._onChange,
                cancel_bet: this._onChange
            });

            GameSettingsStore.on('all', this._onChange);
        },

        componentWillUnmount: function() {
            ControlsStore.removeChangeListener(this._onChange);
            Engine.off({
                game_started: this._onChange,
                game_crash: this._onChange,
                game_starting: this._onChange,
                player_bet: this._onChange,
                cashed_out: this._onChange,
                placing_bet: this._onChange,
                bet_placed: this._onChange,
                bet_queued: this._onChange,
                cashing_out: this._onChange,
                cancel_bet: this._onChange
            });
            GameSettingsStore.off('all', this._onChange);
        },

        _onChange: function() {
            if(this.isMounted())
                this.setState(getState());
        },

        _placeBet: function () {
            var bet = StateLib.parseBet(this.state.betSize);
            var cashOut = StateLib.parseCashOut(this.state.cashOut);
            console.log("stateLive betInfo", bet, cashOut);
            ControlsActions.placeBet(bet, cashOut);
        },

        _cancelBet: function() {
            ControlsActions.cancelBet();
        },

        _cashOut: function() {
            ControlsActions.cashOut();
        },

        _setBetSize: function(betSize) {
            ControlsActions.setBetSize(betSize);
        },

        _setAutoCashOut: function(autoCashOut) {
            ControlsActions.setAutoCashOut(autoCashOut);
        },

        _redirectToLogin: function() {
            window.location = '/login';
        },

        setTenPercentBet: function () {
            var newBetSize = Math.floor(this.state.balanceMeth/10);
            if (newBetSize < 1 ){
                newBetSize = 1;
            }
            newBetSize = newBetSize.toString();
            this.setState({betSize: newBetSize});
            ControlsActions.setBetSize(newBetSize);
        },
        setTwentyfivePercentBet: function () {
            var newBetSize = Math.floor(this.state.balanceMeth/4);
            if (newBetSize < 1 ){
                newBetSize = 1;
            }
            newBetSize = newBetSize.toString();
            this.setState({betSize: newBetSize});
            ControlsActions.setBetSize(newBetSize);
        },
        setFiftyPercentBet: function () {
            var newBetSize = Math.floor(this.state.balanceMeth/2);
            if (newBetSize < 1 ){
                newBetSize = 1;
            }
            newBetSize = newBetSize.toString();
            this.setState({betSize: newBetSize});
            ControlsActions.setBetSize(newBetSize);
        },
        setHundredPercentBet: function () {
            var newBetSize = Math.floor(this.state.balanceMeth);
            if (newBetSize < 1 ){
                newBetSize = 1;
            }
            newBetSize = newBetSize.toString();
            this.setState({betSize: newBetSize});
            ControlsActions.setBetSize(newBetSize);
        },
        setHalfBet: function() {
            var newBetSize = parseInt(this.state.betSize/2);
            if (newBetSize < 1 ){
                newBetSize = 1;
            }
            newBetSize = newBetSize.toString();
            this.setState({betSize: newBetSize});
            ControlsActions.setBetSize(newBetSize);
        },
        setTwiceValue: function() {
            var newBetSize = this.state.betSize*2;
            if (newBetSize >  this.state.engine.balanceSatoshis){
                newBetSize = this.state.engine.balanceSatoshis;
            }
            newBetSize = parseInt(newBetSize).toString();
            this.setState({betSize: newBetSize});
            ControlsActions.setBetSize(newBetSize);
        },
        setMinValue: function() {
            this.setState({betSize: 1});
            ControlsActions.setBetSize(1);
        },
        setMaxValue: function() {
            this.setState({betSize: this.state.engine.balanceSatoshis});
            ControlsActions.setBetSize(this.state.engine.balanceSatoshis);
        },
        render: function () {
            var self = this;
            var currentUnit = GameSettingsStore.getCurrentUnit(); //{'ETH', 10^6}

            var isPlayingOrBetting =  StateLib.isBetting(Engine) || (Engine.gameState === 'IN_PROGRESS' && StateLib.currentlyPlaying(Engine));

            // If they're not logged in, let just show a login to play
            if (!Engine.username)
                return D.div({ id: 'controls-inner-container' },
                    D.div({ className: 'login-button-container' },
                        D.button({ className: 'login-button bet-button', onClick: this._redirectToLogin }, 'Login to play')
                    ),
                    D.div({ className: 'register-container'},
                        D.a({ className: 'register', href: '/register' }, 'or register ')
                    )
                );

            /** Control Inputs: Bet & AutoCash@  **/
            //var controlInputs = [], betContainer
            var betContainer = D.div({ className: 'bet-container' , key: 'ci-1' },

                D.div({ className: 'bet-input-group' + (this.state.betInvalid? ' error' : '') },
                    D.span({ className: 'text-uppercase' }, 'Bet'),
                    D.input({
                        type: 'text',
                        name: 'bet-size',
                        value: self.state.betSize,
                        disabled: isPlayingOrBetting,
                        onChange: function (e) {
                            self._setBetSize(e.target.value);
                        }
                    }),
                    D.span({ className: '' }, currentUnit.unitName)
                ),
                D.div({className: 'betamount-controls-container'},
                    D.div({ className: 'betamount-controls control1', onClick: this.setTenPercentBet }, '10%'),
                    D.div({ className: 'betamount-controls control2', onClick: this.setTwentyfivePercentBet }, '25%' ),
                    D.div({ className: 'betamount-controls control3', onClick: this.setFiftyPercentBet }, '50%' ),
                    D.div({ className: 'betamount-controls control4', onClick: this.setHundredPercentBet }, '100%' )
                )
            );

            var autoCashContainer = D.div({ className: 'autocash-container', key: 'ci-2' },

                D.div({ className: 'bet-input-group' + (this.state.cashOutInvalid? ' error' : '') },
                    D.span({ className: 'text-uppercase' }, 'Auto Cash Out'),
                    D.input({
                        min: 1,
                        step: 0.01,
                        value: self.state.cashOut,
                        type: 'number',
                        name: 'cash-out',
                        disabled: isPlayingOrBetting,
                        onChange: function (e) {
                            self._setAutoCashOut(e.target.value);
                        }
                    }),
                    D.span({ className: '' }, 'X')
                )
            );

            var controlInputs;
            if(this.props.isMobileOrSmall || this.props.controlsSize === 'small') {
                controlInputs = D.div({ className: 'control-inputs-container' },
                    D.div({ className: 'input-control' },
                        betContainer
                    ),

                    D.div({ className: 'input-control' },
                        autoCashContainer
                    )
                );
            } else {
                controlInputs = [];

                controlInputs.push(D.div({ className: 'input-control controls-row', key: 'coi-1' },
                    betContainer
                ));

                controlInputs.push(D.div({ className: 'input-control controls-row', key: 'coi-2' },
                    autoCashContainer
                ));
            }

            //If the user is logged in render the controls
            return D.div({ id: 'controls-inner-container', className: this.props.controlsSize },

                controlInputs,

                D.div({ className: 'button-container' },
                    BetButton({
                        engine: this.state.engine,
                        placeBet: this._placeBet,
                        cancelBet: this._cancelBet,
                        cashOut: this._cashOut,
                        isMobileOrSmall: this.props.isMobileOrSmall,
                        betSize: this.state.betSize,
                        betInvalid: this.state.betInvalid,
                        cashOutInvalid: this.state.cashOutInvalid,
                        controlsSize: this.props.controlsSize
                    })
                )

            );
        }

        //_getStatusMessage: function () {
        //    var pi = this.state.engine.currentPlay();
        //
        //    if (this.state.engine.gameState === 'STARTING') {
        //        return Countdown({ engine: this.state.engine });
        //    }
        //
        //    if (this.state.engine.gameState === 'IN_PROGRESS') {
        //        //user is playing
        //        if (pi && pi.bet && !pi.stopped_at) {
        //            return D.span(null, 'Currently playing...');
        //        } else if (pi && pi.stopped_at) { // user has cashed out
        //            return D.span(null, 'Cashed Out @  ',
        //                D.b({className: 'green'}, pi.stopped_at / 100, 'x'),
        //                ' / Won: ',
        //                D.b({className: 'green'}, Clib.formatSatoshis(pi.bet * pi.stopped_at / 100)),
        //                ' ', Clib.grammarBits(pi.bet * pi.stopped_at / 100)
        //            );
        //
        //        } else { // user still in game
        //            return D.span(null, 'Game in progress..');
        //        }
        //    } else if (this.state.engine.gameState === 'ENDED') {
        //
        //        var bonus;
        //        if (pi && pi.stopped_at) { // bet and won
        //
        //            if (pi.bonus) {
        //                bonus = D.span(null, ' (+',
        //                    Clib.formatSatoshis(pi.bonus), ' ',
        //                    Clib.grammarBits(pi.bonus), ' bonus)'
        //                );
        //            }
        //
        //            return D.span(null, 'Cashed Out @ ',
        //                D.b({className: 'green'}, pi.stopped_at / 100, 'x'),
        //                ' / Won: ',
        //                D.b({className: 'green'}, Clib.formatSatoshis(pi.bet * pi.stopped_at / 100)),
        //                ' ', Clib.grammarBits(pi.bet * pi.stopped_at / 1000),
        //                bonus
        //            );
        //        } else if (pi) { // bet and lost
        //
        //            if (pi.bonus) {
        //                bonus = D.span(null, ' (+ ',
        //                    Clib.formatSatoshis(pi.bonus), ' ',
        //                    Clib.grammarBits(pi.bonus), ' bonus)'
        //                );
        //            }
        //
        //            return D.span(null,
        //                'Busted @ ', D.b({className: 'red'},
        //                    this.state.engine.tableHistory[0].game_crash / 100, 'x'),
        //                ' / You lost ', D.b({className: 'red'}, pi.bet / 100), ' ', Clib.grammarBits(pi.bet),
        //                bonus
        //            );
        //
        //        } else { // didn't bet
        //
        //          if (this.state.engine.tableHistory[0].game_crash === 0) {
        //            return D.span(null, D.b({className: 'red'}, 'INSTABUST!'));
        //          }
        //
        //          return D.span(null,
        //              'Busted @ ', D.b({className: 'red'}, this.state.engine.tableHistory[0].game_crash / 100, 'x')
        //          );
        //        }
        //
        //    }
        //}
    });
});
