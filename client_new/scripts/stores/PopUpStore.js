define([
    'lib/lodash',
    'lib/events',
    'dispatcher/AppDispatcher',
    'constants/AppConstants'
], function(
    _,
    Events,
    AppDispatcher,
    AppConstants
) {
    var accountInfo = null;
    var leaderboardInfo = null;
    var ETH_USD = null;

    //Singleton ControlsStore Object
    var PopupStore = _.extend({}, Events, {
        fetchPopupInfo: function() {
            console.log("fetchPopupInfo");
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    console.log("fetchPopupInfo finish1");
                    console.log("popUpInfo.accountInfo", xhttp.responseText);
                    accountInfo = JSON.parse(xhttp.responseText);
                    console.log("popUpInfo.accountInfo", accountInfo)

                }
            };
            xhttp.open("GET", "/accountInfo", true);
            xhttp.send();

            var xhttp1 = new XMLHttpRequest();
            xhttp1.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    console.log("fetchPopupInfo finish2");
                    leaderboardInfo = JSON.parse(xhttp1.responseText);
                }
            };
            xhttp1.open("GET", "/leaderboardInfo", true);
            xhttp1.send();

            var xhttp2 = new XMLHttpRequest();
            xhttp2.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    console.log("fetchPopupInfo finish2");
                    ETH_USD = JSON.parse(xhttp2.responseText).USD;
                }
            };
            xhttp2.open("GET", "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD", true);
            xhttp2.send();

        },
        withdrawRequest: function(amount, destination, password, otp) {
            console.log("withdraw-requestAJAX event start")
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    console.log("fetchPopupInfo finish1");
                    accountInfo = JSON.parse(xhttp.responseText);
                }
            };
            xhttp.open("POST", "/withdraw-requestAJAX", true);
            xhttp.setRequestHeader("Content-Type", "application/json");
            xhttp.send(JSON.stringify({
                amount,
                destination,
                password,
                otp
            }));
        },
        getState: function() {
            return {
                accountInfo,
                leaderboardInfo,
                ETH_USD
            }
        }
    });

    AppDispatcher.register(function(payload) {
        var action = payload.action;

        switch(action.actionType) {
            case AppConstants.ActionTypes.FETCH_POPUP_INFO:
                PopupStore.fetchPopupInfo();
                break;
            case AppConstants.ActionTypes.WITHDRAW_REQUEST:
                PopupStore.withdrawRequest(
                    action.amount,
                    action.destination,
                    action.password,
                    action.otp
                );
                break;
        }

        return true; // No errors. Needed by promise in Dispatcher.
    });

    return PopupStore;
});