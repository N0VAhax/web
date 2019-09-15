define([
    'lib/react',
    'dispatcher/AppDispatcher',
    'constants/AppConstants',
    'game-logic/engine',
    'stores/GameSettingsStore',
    'actions/GameSettingsActions',
    'game-logic/clib',
    'screenfull',
    'components/ChatChannelSelector',
    'actions/ChatActions',
    'game-logic/chat',
], function(
    React,
    AppDispatcher,
    AppConstants,
    Engine,
    GameSettingsStore,
    GameSettingsActions,
    Clib,
    Screenfull, //Attached to window.screenfull
    ChatChannelSelectorClass,
    ChatActions,
    ChatEngine
) {
    var D = React.DOM;
    var ChatChannelSelector = React.createFactory(ChatChannelSelectorClass);

    function getState() {
        return {
            balanceBitsFormatted: Clib.formatSatoshis(Engine.balanceSatoshis).replace(/,/g,''),
            theme: GameSettingsStore.getCurrentTheme()//black || white
        }
    }

    return React.createClass({
        displayName: 'TopBar',

        propTypes: {
            isMobileOrSmall: React.PropTypes.bool.isRequired,
            showWalletModal: React.PropTypes.func.isRequired,
            showLeaderboardModal: React.PropTypes.func.isRequired,
            showFaqModal: React.PropTypes.func.isRequired
        },

        getInitialState: function() {
            var state = getState();
            state.username = Engine.username;
            state.fullScreen = false;

            return state;
        },

        componentDidMount: function() {
            Engine.on({
                game_started: this._onChange,
                game_crash: this._onChange,
                cashed_out: this._onChange
            });
            GameSettingsStore.on('all', this._onChange);
            ChatEngine.on('all', this._onChange);
        },

        componentWillUnmount: function() {
            Engine.off({
                game_started: this._onChange,
                game_crash: this._onChange,
                cashed_out: this._onChange
            });
            GameSettingsStore.off('all', this._onChange);
            ChatEngine.off('all', this._onChange);
        },

        _onChange: function() {
            this.setState(getState());
        },

        _toggleTheme: function() {
            GameSettingsActions.toggleTheme();
        },

        _toggleFullScreen: function() {
        	window.screenfull.toggle();
            this.setState({ fullScreen: !this.state.fullScreen });
        },

        _selectChatChannel: function(channelName) {
            ChatActions.selectChannel(channelName);
        },

        _changeCurrencyType: function() {
            AppDispatcher.handleViewAction({
                actionType: AppConstants.ActionTypes.TOGGLE_UNIT
            });
        },

        render: function() {
            var balanceMeth = 0;

            var currentUnit = GameSettingsStore.getCurrentUnit(); //{'ETH', 10^6}
            var userLogin;
            if(this.state.username) {
                //balanceBits = (parseFloat(this.state.balanceBitsFormatted)/currentUnit.unitValue).toFixed(1+currentUnit.unitValue.toString().length);
                balanceMeth = Math.floor(Engine.balanceSatoshis/1000000);
                userLogin = D.div({ className: 'user-login' },
                    ChatChannelSelector({
                        selectChannel: this._selectChatChannel,
                        selectedChannel: ChatEngine.channelName,
                        isMobileOrSmall: this.props.isMobileOrSmall,
                        moderator: ChatEngine.moderator
                    }),
                    D.div({ className: 'full-screen noselect account-image-container', onClick: this.props.showAccountPage },
                        D.div({ className: 'account-image'})
                    )
                );
            } else {
                userLogin = D.div({ className: 'user-login' },
                    D.div({ className: 'register' },
                        D.a({ href: '/register', className: 'text-uppercase'  }, 'Register' )
                    ),
                    D.div({ className: 'login' },
                        D.a({ href: '/login', className: 'text-uppercase' }, 'Log in' )
                    )
                );
            }

            return D.div({ id: 'top-bar' },
                D.div({ className: 'title' },
                    D.a({ href: '/', className: 'logo' },
                        D.img({
                            src: 'img/Crash3D-logo.svg',
                            className: 'logo-image'
                        })
                    )
                ),
                userLogin,
                D.div({ className: 'full-screen noselect' },
                    D.a({ className: 'text-uppercase', onClick: this.props.showFaqModal }, 'Help' )
            	),
                D.div({ className: 'full-screen noselect' },
                    D.a({ className: 'text-uppercase', onClick: this.props.showWalletModal }, 'Wallet' )
            	),
                D.div({ className: 'full-screen noselect' },
                    D.a({ className: 'text-uppercase', onClick: this.props.showLeaderboardModal }, 'Leaderboard' )
                ),
                D.div({ className: 'balance-bits', onClick: this._changeCurrencyType },
                    D.div({ className: 'currency-label' }, 'Currency '),
                    D.div({ className: 'balance' }, Clib.formatDecimals(balanceMeth,0)),
                    D.div({ className: 'currency-type' }, currentUnit.unitName),
                    D.div({ className: 'select-coin'  }, '')
                )
            );
        }
    });
});
