define([
    'lib/react',
    'game-logic/clib',
    'game-logic/stateLib',
    'stores/GameSettingsStore'
], function(
    React,
    Clib,
    StateLib,
    GameSettingsStore
) {

    var D = React.DOM;

    return React.createClass({
        displayName: 'payout',

        propTypes: {
            engine: React.PropTypes.object.isRequired
        },

        getInitialState: function() {
            return {
                payout: 0
            }
        },

        componentDidMount: function() {
            window.requestAnimationFrame(this.draw);
        },

        draw: function() {
            if (!this.isMounted())
                return;

            var po = Clib.calcGamePayout(Clib.getElapsedTimeWithLag(this.props.engine));

            if (po)
                this.setState({ payout: po * StateLib.currentPlay(this.props.engine).bet });
            else
                this.setState({ payout: null });

            window.requestAnimationFrame(this.draw);
        },

        render: function() {
            var currentUnit = GameSettingsStore.getCurrentUnit(); //{'ETH', 10^6}
            var decimals = StateLib.currentPlay(this.props.engine).bet < currentUnit.unitValue*10000 ? 2 : 0;

            return D.span({ id: 'payout' }, Clib.formatSatoshis(this.state.payout/currentUnit.unitValue, decimals));
        }
    });

});