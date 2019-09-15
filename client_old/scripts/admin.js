define([
    'lib/socket.io-1.2.1',
    'constants/AppConstants'
], function(
    io,
    AppConstants
) { 
    function requestOtt(callback) {

        try {
            var ajaxReq  = new XMLHttpRequest();

            if(!ajaxReq)
                throw new Error("Your browser doesn't support xhr");

            ajaxReq.open("POST", "/ott", true);
            ajaxReq.setRequestHeader('Accept', 'text/plain');
            ajaxReq.send();

        } catch(e) {
            console.error(e);
            alert('Requesting token error: ' + e);
            location.reload();
        }

        ajaxReq.onload = function() {
            if (ajaxReq.status == 200) {
                var response = ajaxReq.responseText;
                callback(null, response);

            } else if (ajaxReq.status == 401) {
                callback(ajaxReq.status);
            } else callback(ajaxReq.responseText);
        }
    }

    var ws = io(AppConstants.Engine.HOST);
    ws.on('connect', function() {
        requestOtt(function(err, ott) {
            if (err) {
                if (err != 401) {
                    console.error('request ott error:', err);
                    if (confirm("An error, click to reload the page: " + err))
                        location.reload();
                    return;
                }
            }
            ws.emit('join', { ott: ott, api_version: 1 },
                function(err, resp) {
                    if (err) {
                        console.error('Error when joining the game...', err);
                        return;
                    }
                    var pauseGameDOM = document.getElementById("pauseGame");
                    var resumeGameDOM = document.getElementById("resumeGame");
                    pauseGameDOM.addEventListener("click", function(){
                        ws.emit('admin_pause_game', { ott: ott, api_version: 1 },
                            function(err, resp) {
                                if (err) {
                                    console.error('Error when admin_pause_game the game...', err);
                                    return;
                                }
                                console.error('Success pausing Game', resp);
                            }
                        );
                    });
                    resumeGameDOM.addEventListener("click", function(){
                        ws.emit('admin_resume_game', { ott: ott, api_version: 1 },
                            function(err, resp) {
                                if (err) {
                                    console.error('Error when admin_resume_game the game...', err);
                                    return;
                                }
                                console.error('Success resuming Game', resp);
                            }
                        );
                    });
                }
            );
        });
    });

    ws.on('disconnect', function(data) {
        console.log('Admin Socket Client disconnected');
    });

});