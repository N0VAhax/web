define([
    'lib/react'
], function(
    React
) {

    var D = React.DOM;
    // var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
    var ReactCSSTransitionGroup = D.div;

    return React.createClass({
        render: function() {
            return (
                D.div({ className: ["modal", this.props.children ? 'in' : ''].join(' '), role: "dialog" },
                    D.div({ className: "modal-slide" },
                        this.props.children
                    )
                )
            );
        }
    });
});