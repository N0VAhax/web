define([
    'dispatcher/AppDispatcher',
    'constants/AppConstants'
], function(
    AppDispatcher,
    AppConstants
){

    var PopupActions = {

        fetchPopupInfo: function(){
            console.log("fetchPopupInfo event start")
            AppDispatcher.handleViewAction({
                actionType: AppConstants.ActionTypes.FETCH_POPUP_INFO
            });
        },
        withdrawRequest: function(amount, destination, password, otp){
            console.log("withdrawRequest event start")
            AppDispatcher.handleViewAction({
                actionType: AppConstants.ActionTypes.WITHDRAW_REQUEST,
                amount,
                destination,
                password,
                otp
            });
        }
    };

    return PopupActions;
});