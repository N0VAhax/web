/**
 * This view acts as a wrapper for all the other views in the game
 * it is subscribed to changes in EngineVirtualStore but it only
 * listen to connection changes so every view should subscribe to
 * EngineVirtualStore independently.
 */
define([
    'lib/react',
    'components/TopBar',
    'components/ChartControls',
    'components/Chat',
    'components/TabsSelector',
    'components/BetBar',
    'components/Modal',
    'game-logic/engine',
    'game-logic/clib',
    'game-logic/hotkeys',
    'stores/GameSettingsStore',
    'stores/PopUpStore',
    'actions/PopUpActions'
], function(
    React,
    TopBarClass,
    ChartControlsClass,
    ChatClass,
    TabsSelectorClass,
    BetBarClass,
    ModalClass,
    Engine,
    Clib,
    Hotkeys,
    GameSettingsStore,
    PopUpStore,
    PopUpActions
){
    var TopBar = React.createFactory(TopBarClass);
    //var SpaceWrap = React.createFactory(SpaceWrapClass);
    var ChartControls = React.createFactory(ChartControlsClass);
    var Chat = React.createFactory(ChatClass);
    var TabsSelector = React.createFactory(TabsSelectorClass);
    var BetBar = React.createFactory(BetBarClass);
    var Modal  = React.createFactory(ModalClass);

    var D = React.DOM;

    return React.createClass({
        displayName: 'Game',

        getInitialState: function () {
            var state = GameSettingsStore.getState();
            state.isConnected = Engine.isConnected;
            state.showMessage = true;
            state.isMobileOrSmall = Clib.isMobileOrSmall(); //bool
            state.showWalletModal = 0;
            state.showLeaderboardModal = false;
            state.showFaqModal = false;
            state.showAccountPage = false;
            state.showSecurityPage = false;
            state.leaderSort = false;
            state.leaderboardInfo = null;
            state.accountInfo = null;
            state.securityInfo = null;
            state.faqExpandedQuestion = 'What is Crash 3D?';
            state.email = "";
            state.showSupportPage = false;
            return state;
        },

        componentWillMount: function () {
            PopUpActions.fetchPopupInfo();
        },

        componentDidMount: function() {
            Engine.on({
                'connected': this._onEngineChange,
                'disconnected': this._onEngineChange
            });
            GameSettingsStore.addChangeListener(this._onSettingsChange);

            window.addEventListener("resize", this._onWindowResize);

            Hotkeys.mount();
        },

        componentWillUnmount: function() {
            Engine.off({
                'connected': this._onChange,
                'disconnected': this._onChange
            });

            window.removeEventListener("resize", this._onWindowResize);

            Hotkeys.unmount();
        },

        _onEngineChange: function() {
            if((this.state.isConnected != Engine.isConnected) && this.isMounted())
                this.setState({ isConnected: Engine.isConnected });
        },

        _onSettingsChange: function() {
            if(this.isMounted())
                this.setState(GameSettingsStore.getState());
        },

        _onWindowResize: function() {
            var isMobileOrSmall = Clib.isMobileOrSmall();
            if(this.state.isMobileOrSmall !== isMobileOrSmall)
                this.setState({ isMobileOrSmall: isMobileOrSmall });
        },

        _hideMessage: function() {
            this.setState({ showMessage: false });
        },

        showWalletModal: function() {
            this.setState({ showWalletModal: 1 });
        },

        leaderSort: function() {
            var self = this;
            self.setState({ leaderSort: !self.state.leaderSort});
            Engine.getLeaderBoard(self.state.leaderSort, function(err, res) {
                if (err) {
                    console.error(err);
                }
                else {
                    self.setState({ leaderboardInfo: res });
                }
            });
        },

        originWalletModal: function() {
            this.setState({ showWalletModal: 1 });
        },

        extendWalletModal: function() {
            this.setState({ showWalletModal: 2 });
        },

        showLeaderboardModal: function() {
            var self = this;
            Engine.getLeaderBoard(null, function(err, res) {
                if (!err) {
                    self.setState({ showLeaderboardModal: true });
                    self.setState({ leaderboardInfo: res});
                }
            })
            // this.setState({ showLeaderboardModal: true });
        },

        showFaqModal: function() {
            this.setState({ showFaqModal: true });
        },

        showSecurityPage: function() {
            var self = this;
            Engine.requestSecurityInfo(function(err, res) {
                if (!err) {
                    var json = JSON.parse(res);
                    self.setState({ securityInfo: json.user });
                    self.setState({ showAccountPage: false });
                    self.setState({ showSecurityPage: true });
                    self.setState({ showSupportPage: false });
                    var qr_container = document.getElementsByClassName("qr-container")[0];
                    if (!json.user.mfa_secret)
                        qr_container.innerHTML = json.user.qr_svg;
                    self.setState({email: json.user.email});
                }
                else
                    console.log(err);
            });
        },

        showAccountPage: function() {
            if (this.state.showAccountPage)
                return;
            this.setState({ showAccountPage: true });
            this.setState({ showSecurityPage: false });
            this.setState({ showSupportPage: false });
        },

        showSupportPage: function() {
            var self = this;
            if (this.state.showSupportPage)
                return;
            Engine.requestSecurityInfo(function(err, res) {
                if (!err) {
                    var json = JSON.parse(res);
                    self.setState({ email: json.user.email });
                    self.setState({ showSupportPage: true });
                    self.setState({ showAccountPage: false });
                    self.setState({ showSecurityPage: false });
                }
                else
                    console.log(err);
            });
        },

        sendEmail: function() {
            var self = this;
            var email = document.getElementsByName("email")[0].value;
            var content = document.getElementsByName("message")[0].value;
            var data = {
                'email': email,
                'content': content
            }
            Engine.requestContact(data, function(err, res) {
                if (!err) {
                    alert("Thank you for writing, one of my humans will write you back very soon");
                    window.location.href = "/";
                }
                else
                    console.log(err);
            })
        },

        onTodoChange: function(event){
            this.setState({
                 email: event.target.value
            });
        },

        onModalClose: function() {
            this.setState({
                showFaqModal: false,
                showLeaderboardModal: false,
                showWalletModal: 0
            });
            var element = document.getElementsByClassName("modal")[0];
            if (element.classList.contains("in"))
                element.classList.remove("in");
        },

        _onWithdraw: function() {
            const destination = document.getElementById("withdraw-destination").value;
            const amount = document.getElementById("withdraw-amount").value;
            const password = document.getElementById("withdraw-password").value;
            const otp = '';

            PopUpActions.withdrawRequest(
                amount,
                destination,
                password,
                otp
            );
        },

        copyToClipboard: function(str) {
            const el = document.createElement('textarea');
            el.value = str;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
        },

        changePassword: function() {
            var old_password = document.getElementsByName("old_password")[0].value;
            var new_password = document.getElementsByName("new_password")[0].value;
            var confirmation = document.getElementsByName("confirmation_pass")[0].value;
            var otp = document.getElementsByName("otp_pass")[0].value;
            var self = this;
            if (old_password == "" || new_password == "" || confirmation == "") {
                alert("Password can't be empty.");
                return;
            }
            else if (new_password.length < 7 || confirmation.length < 7) {
                alert("Password length should be greater than 7.");
                return;
            }
            else {
                var data = {
                    'old_password': old_password,
                    'password': new_password,
                    'confirmation': confirmation,
                    'otp': otp
                }
                Engine.changePassword(data, function(err, res) {
                    if (err) {
                        alert("ERROR:" + err);
                    }
                    else {
                        alert('Changed password successfully!');
                        // document.getElementsByClassName('accountpage-body')[0].reset();
                        window.location.href = '/';
                    }
                })
            }
        },

        editMail: function() {
            var email = document.getElementsByName("email")[0].value;
            var password = document.getElementsByName("confirmation")[0].value;
            var otp = document.getElementsByName("otp_pass")[1].value;
            var self = this;
            if (password == "") {
                alert("Password can't be empty.");
                return;
            }
            else if (password.length < 7) {
                alert("Password length should be greater than 7.");
                return;
            }
            else {
                var data = {
                    'password': password,
                    'email': email,
                    'otp': otp
                }
                Engine.changeEmail(data, function(err, res) {
                    if (err) {
                        alert("ERROR:" + err);
                    }
                    else {
                        alert('Changed email successfully!');
                        // document.getElementsByClassName('accountpage-body')[0].reset();
                        window.location.href = '/';
                    }
                })
            }
        },

        changeMfaStatus: function() {
            if (this.state.securityInfo.mfa_secret)
                var otp = document.getElementsByName("otp_pass")[2].value;
            else
                var otp = document.getElementsByName("otp_pass")[0].value;
            var mfa_potential_secret = document.getElementsByName("mfa_potential_secret")[0].value;
            var sig = document.getElementsByName("sig")[0].value;
            var self = this;
            if (otp == "") {
                alert("2FA code can't be empty.");
                return;
            } else {

                var data = {
                    'otp': otp,
                    'status': self.state.securityInfo.mfa_secret,
                    'mfa_potential_secret': mfa_potential_secret,
                    'sig': sig
                }
                var org_status = self.state.securityInfo.mfa_secret;
                Engine.changeMfaStatus(data, function(err, res) {
                    if (err) {
                        alert("ERROR:" + err);
                    }
                    else {
                        if (org_status)
                            alert('Disabled two-factor authentication.');
                        else
                            alert('Enabled two-factor authentication.');
                        window.location.href = '/';
                    }
                })
            }
        },

        logOut: function() {
            Engine.logOut(function(err, res) {
                if (err) {
                    alert("ERROR:" + err);
                }
                else
                    window.location.href = '/';
            })
        },

        render: function() {
            if (!this.state.isConnected)
                return D.div({ id: 'loading-container' },
                    D.div({ className: 'loading-image' },
                        D.span({ className: 'bubble-1' }),
                        D.span({ className: 'bubble-2' }),
                        D.span({ className: 'bubble-3' })
                    )
                );

            var messageContainer;
            if(USER_MESSAGE && this.state.showMessage) {

                var messageContent, messageClass, containerClass = 'show-message';
                switch(USER_MESSAGE.type) {
                    case 'error':
                        messageContent = D.span(null,
                                            D.span(null, USER_MESSAGE.text)
                        );
                        messageClass = 'error';
                        break;
                    case 'advice':
                        messageContent = D.span(null,
                            D.span(null, USER_MESSAGE.advice)
                        );
                        messageClass = 'advice';
                        break;
                    default:
                        messageContent = null;
                        messageClass = 'hide';
                        containerClass = '';
                }

                messageContainer = D.div({ id: 'game-message-container', className: messageClass },
                    messageContent,
                    D.a({ className: 'close-message', onClick: this._hideMessage }, D.i({ className: 'fa fa-times' }))
                )
            } else {
                messageContainer = null;
                containerClass = '';
            }

            if (this.state.leaderboardInfo != undefined)
            var leaderboardRows = this.state.leaderboardInfo.map(function(playerInfo, i) {
                    return D.tr({ key: 'no_' + i},
                        D.td(null, (i + 1)),
                        D.td(null, playerInfo.username),
                        D.td(null, playerInfo.gross_profit),
                        D.td(null, playerInfo.net_profit),
                        D.td(null, playerInfo.games_played)
                    )
                })

            var rightContainer = !this.state.isMobileOrSmall?
                D.div({ id: 'game-right-container' },
                    TabsSelector({
                        isMobileOrSmall: this.state.isMobileOrSmall
                    }),
                    BetBar()
                ) : null;
            const { showWalletModal, showLeaderboardModal, showFaqModal, showAccountPage, showSecurityPage, showSupportPage } = this.state;
            var showModal = (showWalletModal||showLeaderboardModal||showFaqModal);
            var gameInnerContainerClass = showModal? 'is-blur': '';

            var currentUnit = GameSettingsStore.getCurrentUnit(); //{'ETH', 10^6}
            var balanceEth = Clib.formatDecimals(Engine.balanceSatoshis/1000000000,3);
            var balanceMeth = Clib.formatDecimals(Engine.balanceSatoshis/1000000,2);
            var popUpInfo = PopUpStore.getState();
            console.log("fetched popupInfo", popUpInfo);
            var ModalComponent = Modal();
            if (showWalletModal) {
                var walletModalPart1 = [
                    D.div({className: 'modal-title'}, 'Wallet'),
                    D.div({ className: "modal-close", onClick: this.onModalClose.bind(this) }),

                    D.div({ className: 'balance-container' },
                        D.div({ className: 'currency-label' }, 'Currency '),
                        D.div({ className: 'balance' }, "INSERT JUST LOGO OF COIN" ),
                        D.div({ className: 'currency-type' }, currentUnit.unitName),
                        D.div({ className: 'select-coin'  })
                    ),

                    D.div({ className: 'text-uppercase input-label' }, 'Ethereum Deposit Address'),
                    D.div({ className: 'deposit-address'},
                        D.input({value: popUpInfo.accountInfo.user.deposit_address}),
                        D.div({ className: 'copy-btn' },
                            D.div({
                                className: 'copy-btn-icon',
                                onClick: this.copyToClipboard.bind(this, popUpInfo.accountInfo.user.deposit_address)
                            })
                        )
                    ),
                    D.div({className: 'balances'},
                        D.div({className: 'eth-balance'},
                            D.div({className: 'balance-label'}, 'BALANCE'),
                            D.div({className: 'balance-value'}, balanceEth+' ETH')
                        ),
                        D.div({className: 'eth-balance'},
                            D.div({className: 'balance-label'}, 'BALANCE (in milli)'),
                            D.div({className: 'balance-value'}, balanceMeth+' mETH')
                        ),
                        D.div({className: 'eth-balance'},
                            D.div({className: 'balance-label'}, 'CURRENT PRICE'),
                            D.div({className: 'balance-value'}, '$'+popUpInfo.ETH_USD)
                        ),
                        D.div({className: 'eth-balance'},
                            D.div({className: 'balance-label'}, 'NET PROFIT'),
                            D.div({className: 'balance-value'}, parseFloat(popUpInfo.accountInfo.user.net_profit)+' mETH')
                        )
                    )
                ];

                const extended = showWalletModal === 2;
                const extendedContent = D.div({className: 'padding'},
                      D.div({className: 'withdraw-warning'},
                        D.div({className: 'icon'}),
                        D.div({className: 'text'}, 'Please double check your destination address as well as withdrawal amount, as your submitted transaction will be final. Also, please note that your withdrawal will probably be sent from an address that is different from your deposit address, meaning returning funds to that address as opposed to your deposit address may result in loss of funds.')
                      ),
                      D.div({className: 'input-label text-uppercase'}, 'Destination Address'),
                      D.div({className: 'destination-address text-uppercase'},
                        D.input({ required: true, id: 'withdraw-destination' })
                      ),
                      D.div({className: 'amount-password'},
                        D.div({className: 'amount text-uppercase'},
                            D.div({className: 'input-label'}, 'Amount To Withdraw'),
                            D.div({className: 'amount-input'},
                                D.input({ required: true, id: 'withdraw-amount' }),
                                D.div({className: 'available-balance'}, 'Available: '+balanceEth+' ETH')
                            )
                        ),
                        D.div({className: 'password text-uppercase'},
                            D.div({className: 'input-label'}, 'Your Password'),
                            D.div({className: 'password-input'},
                                D.input({ required: true, id: 'withdraw-password', type: 'password' })
                            )
                        )
                      ),
                      D.div({className: 'withdraw-btn'},
                        D.button({onClick: this._onWithdraw}),
                        D.div({className: 'text'}, 'withdraw')
                      )
                );

                ModalComponent = Modal({ isOpen: true },
                    D.div({className: 'wallet-modal'},
                      D.div({className: 'main-content'}, ...walletModalPart1),
                      D.div({
                        className: 'withdrawal-arrow-down' + (extended ? '' : ' withdrawal'),
                        onClick: extended ? this.originWalletModal.bind(this) : this.extendWalletModal.bind(this)
                      },
                          D.div({className: 'withdrawal'},  extended ? 'Close' : 'withdrawal'),
                          D.div({className: 'arrow-down'})
                      ),
                      D.div({ className: 'extended-content' + (extended ? ' extended' : '')}, extendedContent)
                    )
                  );
            }

            if (showLeaderboardModal) {
                console.log("show Leaderboard Modal");

                ModalComponent = Modal({ isOpen: true },
                    D.div({className: 'leaderboard-modal'},
                      D.div({className: 'padding'},
                        D.div({className: 'modal-title'}, 'Leaderboard'),
                        D.div({ className: "modal-close", onClick: this.onModalClose.bind(this) }),

                        D.div({ className: 'modal-body' },
                          D.div({ className: 'header-bg' }),
                          D.div({ className: 'table-inner' },
                              D.table({ className: 'table-content' },
                                  D.thead({ className: 'th-inner'},
                                      D.tr(null,
                                          D.th(null, '#'),
                                          D.th(null, 'Player'),
                                          D.th(null, 'Gross Profit'),
                                          D.th(null, D.a({onClick: this.leaderSort.bind(this)}, 'Net Profit')),
                                          D.th(null, 'Games Played')
                                      )
                                  ),
                                  D.tbody(null,
                                      leaderboardRows
                                  )
                              )
                          )
                        )
                      )
                    )
                )
            }

            if (showFaqModal) {
                const renderQuestion = (question, answer) => {
                    const expanded = this.state.faqExpandedQuestion === question;
                    return (
                        D.div({ className: 'question-block' },
                            D.div({
                                className: 'question-header',
                                onClick: () => this.setState({ faqExpandedQuestion: expanded ? '' : question })
                            },
                                D.div({ className: expanded ? 'question-title expanded' : 'question-title' }, question),
                                D.div({ className: 'question-arrow' + (expanded ? ' expanded' : '') })
                            ),
                            D.div({ className: 'answer-block' + (expanded ? '' : ' collapsed') },
                                D.div({ className: 'answer-block-content' }, answer)
                            )
                        )
                    );
                }

                ModalComponent =  Modal({ isOpen: true },
                    D.div({className: 'faq-modal'},
                      D.div({className: 'padding'},
                        D.div({className: 'modal-title'}, 'Frequently Asked Questions'),
                        D.div({ className: "modal-close", onClick: this.onModalClose.bind(this) }),

                        D.div({ className: 'modal-body' },
                          D.div({ className: 'section' },
                              D.div({className: 'section-header'}, 'Basic'),
                              renderQuestion('What is Crash 3D?', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'),
                              renderQuestion('How to play?', 'TestAnswer'),
                              renderQuestion('What are bits?', 'TestAnswer'),
                              renderQuestion('What is the house edge?', 'TestAnswer'),
                              renderQuestion('What about Internet lag?', 'TestAnswer')
                          ),
                          D.div({ className: 'section' },
                              D.div({className: 'section-header'}, 'How does it work'),
                              renderQuestion('How to verify game results?', 'TestAnswer'),
                              renderQuestion('Is the game fair?', 'TestAnswer'),
                              renderQuestion('How high can the game go?', 'TestAnswer'),
                              renderQuestion('What happens when the server forces people to cash out?', 'TestAnswer')
                          )
                        )
                      )
                    )
                )
            }

            var componentBody;
            if (!showAccountPage && !showSecurityPage && !showSupportPage) {
                componentBody = [
                    messageContainer,

                    D.div({ id: 'game-playable-container', className: containerClass },
                        D.div({ id: 'game-left-container', className: this.state.isMobileOrSmall? ' small-window' : '' },
                            D.div({ id: 'tabs-controls-row' },
                                D.div({ id: 'tabs-controls-col' },
                                    D.div({ className: 'cell-wrapper' },
                                        Chat({
                                            isMobileOrSmall: this.state.isMobileOrSmall
                                        })
                                    )
                                )
                            )
                        ),
                        D.div({ id: 'game-center-container', className: this.state.isMobileOrSmall? ' small-window' : '' },
                            D.div({ id: 'chart-controls-row' },
                                D.div({ id: 'chart-controls-col', className: this.state.controlsSize },
                                    D.div({ className: 'cell-wrapper' },
                                        ChartControls({
                                            isMobileOrSmall: this.state.isMobileOrSmall,
                                            controlsSize: this.state.controlsSize
                                        })
                                    )
                                )
                            )
                        ),
                        rightContainer
                    )];
            } else {
                var accountPageBody = null;
                if (showAccountPage) {
                    accountPageBody = D.div({className: 'accountpage-body'},
                        D.div({className: 'accountpage-inner-body'},
                            D.h5({className: 'page-title'}, 'Account Information'),

                            D.div({ className: 'text-uppercase deposit-address-label' }, 'Ethereum Deposit Address'),
                            D.div({ className: 'deposit-address'},
                                D.input({value: popUpInfo.accountInfo.user.deposit_address}),
                                D.div({className: 'copy-deposit-addresss-btn', onClick: this.copyToClipboard.bind(this, popUpInfo.accountInfo.user.deposit_address)},
                                    D.img({src: 'img/nav-item/icon/iconmonstr-copy.svg'})
                                )
                            ),
                            D.div({className: 'balances'},
                                D.div({className: 'eth-balance'},
                                    D.div({className: 'balance-label'}, 'DEPOSITS'),
                                    D.div({className: 'balance-value'}, popUpInfo.accountInfo.user.deposits)
                                ),
                                D.div({className: 'eth-balance'},
                                    D.div({className: 'balance-label'}, 'WITHDRAWALS'),
                                    D.div({className: 'balance-value'}, popUpInfo.accountInfo.user.withdrawals)
                                ),
                                D.div({className: 'eth-balance'},
                                    D.div({className: 'balance-label'}, 'BALANCE'),
                                    D.div({className: 'balance-value'}, balanceEth+" ETH")
                                ),
                                D.div({className: 'eth-balance'},
                                    D.div({className: 'balance-label'}, 'NET PROFIT'),
                                    D.div({className: 'balance-value'}, popUpInfo.accountInfo.user.net_profit)
                                )
                            )
                            // D.div({className: 'refer-friend-container'},
                            //     D.div({className: 'refer-label'},
                            //         'Refer a friend and win 10% of what they lose'
                            //     ),
                            //     D.div({className: 'refer-link'},
                            //         D.a({className: 'refer-link-a'}, 'https://crash3d.com?&refer=tanels?&id=7283712')
                            //     )
                            // )
                            // ,
                            // D.div({className: 'profile-leaderboard-btn-container'},
                            //     D.div({className: 'profile-btn-container'},
                            //         D.button({}, 'Public Profile')
                            //     ),
                            //     D.div({className: 'leaderboard-btn-container'},
                            //         D.button({}, 'Leaderboard')
                            //     )
                            // )
                        )
                    )
                } else if (showSecurityPage) {
                    var oneTimePassLabel = null;
                    var oneTimePassInput = null;
                    var oneTimePassSmallLabel = null;
                    if (this.state.securityInfo.mfa_secret) {
                        oneTimePassLabel = D.div({ className: 'deposit-address-label, security-label' }, "2FA Code");
                        oneTimePassInput = D.div({ className: 'deposit-address password-input'},
                                                D.input({ required: true, name: 'otp_pass', type: 'text' })
                                            );
                    }
                    accountPageBody = D.div({className: 'accountpage-body'},
                        D.div({className: 'accountpage-inner-body'},
                            D.h5({className: 'page-title'}, 'Update Your Password'),

                            D.div({ className: 'deposit-address-label, security-label' }, 'Old Password'),
                            D.div({ className: 'deposit-address password-input'},
                                D.input({ required: true, name: 'old_password', type: 'password' })
                            ),
                            D.div({ className: 'deposit-address-label, security-label' }, 'New Password (at least 7 characters)'),
                            D.div({ className: 'deposit-address password-input'},
                                D.input({ required: true, name: 'new_password', type: 'password' })
                            ),
                            D.div({ className: 'deposit-address-label, security-label' }, 'Confirm Password'),
                            D.div({ className: 'deposit-address password-input'},
                                D.input({ required: true, name: 'confirmation_pass', type: 'password' })
                            ),
                            oneTimePassLabel,
                            oneTimePassInput,
                            D.div({ className: 'profile-leaderboard-btn-container'},
                                D.div({ className: 'leaderboard-btn-container change-btn-container' },
                                    D.button({ id: 'change_password', onClick: this.changePassword.bind(this)}, 'CHANGE')
                                )
                            ),
                            D.h5({className: 'page-title with-border'}, 'Edit Email Address'),
                            D.p({ className: 'small' }, "If you edit your email address, you will not be able to log in to your account with your old email address."),
                            D.div({ className: 'deposit-address-label, security-label' }, 'New Email'),
                            D.div({ className: 'deposit-address password-input'},
                                D.input({ name: 'email', type: 'email', value: this.state.email, onChange:this.onTodoChange.bind(this) })
                            ),
                            D.div({ className: 'deposit-address-label, security-label' }, 'Your Password'),
                            D.div({ className: 'deposit-address password-input'},
                                D.input({ name: 'confirmation', type: 'password' })
                            ),
                            oneTimePassLabel,
                            oneTimePassInput,
                            D.div({ className: 'profile-leaderboard-btn-container'},
                                D.div({ className: 'leaderboard-btn-container change-btn-container' },
                                    D.button({ onClick: this.editMail.bind(this) }, 'SAVE')
                                )
                            ),

                            D.h5({className: 'page-title with-border'}, this.state.securityInfo.mfa_secret ? 'Disable Two-Factor Authentication' :'Enable Two-Factor Authentication'),
                            D.p({ className: 'small' }, this.state.securityInfo.mfa_secret ? 'To disable two-factor authentication, please enter your one-time password.' : "To enable two-factor authentication, scan the following QR code or enter the secret manually, then enter your one-time password to confirm.",
                                D.br({}),
                                D.b({}, this.state.securityInfo.mfa_secret?null:"If you lose your two-factor authentication code, you may be permanently locked out of your account. Ensure you back up your 2FA application, or save this QR code or secret. Do not enable 2FA unless you are sure you have a safe copy of this information.")
                            ),
                            this.state.securityInfo.mfa_secret ? null : D.div({ className: "column medium-6 qr-container"}),
                            D.div({ className: this.state.securityInfo.mfa_secret?"column medium-12":"column medium-6"},
                                D.label({}, "2FA Code",
                                    D.input({type: 'hidden', value: this.state.securityInfo.mfa_potential_secret?this.state.securityInfo.mfa_potential_secret:"", name: 'mfa_potential_secret'}),
                                    D.input({type: 'hidden', value: this.state.securityInfo.sig?this.state.securityInfo.sig:"", name: 'sig'}),
                                    D.input({type: 'text', required: true, name: 'otp_pass'})
                                ),
                                D.div({ className: 'profile-leaderboard-btn-container mfa-btn-container'},
                                    D.div({ className: 'leaderboard-btn-container change-btn-container' },
                                        D.button({ onClick: this.changeMfaStatus.bind(this) }, this.state.securityInfo.mfa_secret ? 'Disable' : 'Enable')
                                    )
                                )
                            )
                        )
                    )
                } else {
                    accountPageBody = D.div({className: 'accountpage-body'},
                        D.div({className: 'accountpage-inner-body'},
                            D.h5({className: 'page-title with-bottom-border'}, 'Need help? Questions or comments? Please contact us!'),

                            D.div({ className: 'deposit-address-label, security-label' }, 'Email'),
                            D.div({ className: 'deposit-address password-input'},
                                D.input({ name: 'email', type: 'email', value: this.state.email, onChange:this.onTodoChange.bind(this) })
                            ),
                            D.div({ className: 'deposit-address-label, security-label' }, 'Message'),
                            D.textarea({ name: 'message', rows: 10, className: 'messageContent' }),
                            D.div({ className: 'profile-leaderboard-btn-container'},
                                D.div({ className: 'leaderboard-btn-container change-btn-container' },
                                    D.button({ id: 'change_password', onClick: this.sendEmail.bind(this)}, 'SEND')
                                )
                            )
                        )
                    )
                }

                componentBody = [
                    D.div({className: 'accountpage-container'},
                        D.div({className: 'accountpage-sidebar'},
                            D.div({className: 'sidebar-element active', onClick: this.showAccountPage.bind(this)},
                                D.div({className:'image-container'},
                                    D.img({ className: '',
                                        src: 'img/nav-item/icon/account.svg'
                                    })
                                ),
                                D.div({className: 'text'}, 'Account')
                            ),
                            D.div({className: 'sidebar-element', onClick: this.showSecurityPage.bind(this)},
                                D.div({className:'image-container'},
                                    D.img({ className: '',
                                        src: 'img/nav-item/icon/security.svg'
                                    })
                                ),
                                D.div({className: 'text'}, 'Security')
                            ),
                            D.div({className: 'sidebar-element'},
                                D.div({className:'image-container'},
                                    D.img({ className: '',
                                        src: 'img/nav-item/icon/support.svg'
                                    })
                                ),
                                D.div({className: 'text', onClick: this.showSupportPage.bind(this)}, 'Support')
                            ),
                            D.div({className: 'sidebar-element'},
                                D.div({className:'image-container'},
                                    D.img({ className: '',
                                        src: 'img/nav-item/icon/logout.svg'
                                    })
                                ),
                                D.div({className: 'text', onClick: this.logOut.bind(this)}, 'Logout')
                            )
                        ),
                        accountPageBody
                    )
                ]
            }
            return D.div({ className: 'game-total-container'  },
                D.div({ id: 'game-inner-container', className: gameInnerContainerClass },
                    TopBar({
                        isMobileOrSmall: this.state.isMobileOrSmall,
                        showWalletModal: this.showWalletModal.bind(this),
                        showLeaderboardModal: this.showLeaderboardModal.bind(this),
                        showFaqModal: this.showFaqModal.bind(this),
                        showAccountPage: this.showAccountPage.bind(this)
                    }),
                    ...componentBody
                ),
                ModalComponent
            );
        }
    });

});
