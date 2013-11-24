var User = (function(){
    
    var self;
    
    var LC = {
        // session id could be found here.
        motherFuckerId : "yar_mf_tick",
        // userid could be found here.
        dadFuckerId : "yar_df_tick"
    }
    
    var buf = {
        localStorage : false
    }
    
    return self = {
        run : function() {
            var _buf = buf,
                _lc = LC;
            
            if (_buf.localStorage = window.localStorage) {
                // load the backup data, preventing some case that the cookie was removed.
                var expires = new Date();
                expires.setTime(+expires + 2592000000);
                if (!pageConfig.userLogged && !+_buf.localStorage["yar_login_faild"]) {
                    if (_buf.localStorage[_lc.motherFuckerId] && _buf.localStorage[_lc.dadFuckerId]) {
                        document.cookie = _lc.motherFuckerId + "=" + _buf.localStorage[_lc.motherFuckerId] + "; path=/; expires=" + expires.toGMTString();
                        document.cookie = _lc.dadFuckerId + "=" + _buf.localStorage[_lc.dadFuckerId] + "; path=/; expires=" + expires.toGMTString();
                        
                        _buf.localStorage["yar_login_faild"] = 1;
                        
                        // do the refresh so the user could be logged in automatically with the saved cookie.
                        window.location.reload();
                    }
                } else if (document.cookie.match(_lc.motherFuckerId) && document.cookie.match(_lc.dadFuckerId)) {
                    _buf.localStorage[_lc.motherFuckerId] = document.cookie.match(_lc.motherFuckerId + "=(\\w+)")[1];
                    _buf.localStorage[_lc.dadFuckerId] = document.cookie.match(_lc.dadFuckerId + "=(\\w+)")[1]
                    _buf.localStorage["yar_login_faild"] = 0;
                }
            }
        },
        
        clear : function() {
            var _buf = buf,
                _lc = LC;
            if (_buf.localStorage = window.localStorage) {
                _buf.localStorage.clear();
                
                var expires = new Date();
                expires.setTime(+expires - 2592000000);
                document.cookie = _lc.motherFuckerId + "=; path=/; expires=" + expires.toGMTString();
                document.cookie = _lc.dadFuckerId + "=; path=/; expires=" + expires.toGMTString();
            }
        },
        
        update : function(mf_tick, df_tick) {
            
            var _buf = buf, _lc = LC,
                expires = new Date();
            
            expires.setTime(+expires + 2592000000);
            document.cookie = _lc.motherFuckerId + "=" + mf_tick + "; path=/; expires=" + expires.toGMTString();
            document.cookie = _lc.dadFuckerId + "=" + df_tick + "; path=/; expires=" + expires.toGMTString();
            _buf.localStorage[_lc.motherFuckerId] = mf_tick;
            _buf.localStorage[_lc.dadFuckerId] = df_tick
            _buf.localStorage["yar_login_faild"] = 0;
        }
    }
    
})();