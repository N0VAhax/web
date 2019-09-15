define([
    'lib/react',
    'components/GamesLog',
    'components/Players',
    'stores/TabsSelectorStore',
    'actions/TabsSelectorActions'
], function(
    React,
    GamesLogClass,
    PlayersClass,
    TabsSelectorStore,
    TabsSelectorActions
) {

    var GamesLog = React.createFactory(GamesLogClass);
    var Players = React.createFactory(PlayersClass);

    var D = React.DOM;

    function getState(){
        return TabsSelectorStore.getState();
    }

    return React.createClass({
        displayName: 'LogChatSelector',

        propTypes: {
            isMobileOrSmall: React.PropTypes.bool.isRequired,
            controlsSize: React.PropTypes.string.isRequired
        },

        getInitialState: function () {
            return getState();
        },

        componentDidMount: function() {
            TabsSelectorStore.addChangeListener(this._onChange);
        },

        componentWillUnmount: function() {
            TabsSelectorStore.removeChangeListener(this._onChange);
        },

        _onChange: function() {
            if(this.isMounted())
                this.setState(getState());
        },

        _selectTab: function(tab) {
            return function() {
                TabsSelectorActions.selectTab(tab);
            }
        },

        render: function() {
            var widget, contClass = '';
            switch(this.state.selectedTab) {
                case 'gamesLog':
                    widget = GamesLog();
                    contClass = 'gamesLog';
                    break;
                case 'players':
                    widget = Players();
                    break;
            }

            var tabCols, tabCount = 2;

        	tabCols = 'col-' + tabCount;

            return D.div({ id: 'tabs-inner-container', className: 'log-chat-tabs-container' },

                D.div({ className: 'tab-container noselect' },
                        D.ul({ className: '' },
                            D.li({
                                    className: 'tab ' + tabCols + ' noselect' + ((this.state.selectedTab === 'players') ? ' tab-active' : ''),
                                    onClick: this._selectTab('players')
                                },
                                D.a(null, 'Active Game')
                            ),
                            D.li({
                                    className: 'tab ' + tabCols + ' noselect' + ((this.state.selectedTab === 'gamesLog') ? ' tab-active' : ''),
                                    onClick: this._selectTab('gamesLog')
                                },
                                D.a(null, 'History')
                            )
                        )
                ),

                D.div({ className: 'widget-container ' + contClass },
                    widget
                )
            );

        }
    });

});