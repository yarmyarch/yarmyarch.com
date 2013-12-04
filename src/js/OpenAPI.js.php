<?php
    header('Content-type: text/javascript');
    session_name("yar_mf_tick");
    session_start();
    
    $apiValidate = "ri_".time();
    $_SESSION["apiValidate"] = $apiValidate;
?>

/**
 * based on PageUtil Object.
 */
var OpenApi = (function() {
    
    var self;
    
    var buf = {
        callbackUri : escape(window.location.protocol + "//" + window.location.host + "/openapi?a="),
        callbackFunc : false,
        iframeOpened : false,
        iframeShouldDisplay : false,
        
        requestFrame : false
    };
    
    var util = PageUtil;
    
    var LC = {
        LINK : {
            login : {                
                qq : "https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=100548068&redirect_uri=" + buf.callbackUri + "login%26yarType=qq&scope=get_info&state=<?php echo $apiValidate; ?>",
                sina : "https://api.weibo.com/oauth2/authorize?client_id=1596034048&response_type=code&redirect_uri=" + buf.callbackUri + "login%26yarType=sina&scope=all&state=<?php echo $apiValidate; ?>",
                renren : "https://graph.renren.com/oauth/authorize?client_id=cbeca7eb16564117a62ad9161adcc805&redirect_uri=" + buf.callbackUri + "login%26yarType=renren&response_type=code&scope=read_user_photo+publish_feed+publish_share+operate_like+send_notification"
            },
            
            token : {
                qq : "https://graph.qq.com/oauth2.0/token?client_id=100548068&client_secret=931c3fd90eb2d4c142c6e28a9daa3b2a&grant_type=authorization_code&redirect_uri=" + buf.callbackUri + "token%26yarType=qq",
                sina : "https://api.weibo.com/oauth2/access_token?client_id=1596034048&client_secret=00482360fbd0a00fe518aa8f50cc9a9a&grant_type=authorization_code&redirect_uri=" + buf.callbackUri + "token%26yarType=sina",
                renren : "https://graph.renren.com/oauth/token?client_id=cbeca7eb16564117a62ad9161adcc805&client_secret=7e367ae8b05b408f9a4bdecdb5347193&grant_type=authorization_code&redirect_uri=" + buf.callbackUri + "login%26yarType=renren"
            },
            openId : {
                qq : "https://graph.qq.com/oauth2.0/me?t=" + (+new Date()),
                sina : "https://api.weibo.com/2/account/get_uid.json?t=" + (+new Date())
            },
            userInfo : {
                qq : "https://graph.qq.com/user/get_user_info?format=json",
                sina : "https://api.weibo.com/2/users/show.json?t=" + (+new Date())
            }
        },
        
        ACTION_LIST : {
            login : {
                qq : {
                    // current request type
                    a : "token",
                    // required attributes from the last request
                    yarArg : ["code"]
                },
                sina : {
                    a : "token",
                    yarArg : ["code"]
                },
                renren : {
                    a : "token",
                    yarArg : ["code"]
                }
            },
            token : {
                qq : {
                    a : "openId",
                    yarArg : ["access_token"]
                },
                sina : {
                    a : "openId",
                    yarArg : ["access_token"]
                }
            },
            openId : {
                qq : {
                    a : "userInfo",
                    // client id from the last response, change to oauth_consumer_key in the next request.
                    yarArg : ["openid", "client_id:oauth_consumer_key"]
                },
                sina : {
                    a : "userInfo",
                    yarArg : ["uid"]
                }
            }
        },
        
        METHOD_LIST : {
            token : {
                sina : "post"
            }
        },
        
        // handlers defined for extra actions.
        // ajax or (iframe) request.
        HANDLER_LIST : {
            token : {
                qq : "ajax",
                sina : "ajax",
                renren : "ajax"
            },
            openId : {
                qq : "ajax",
                sina : "ajax"
            },
            userInfo : {
                qq : "ajax",
                sina : "ajax"
            },
        }
    };
    
    var handlerList = {
        
        iframeLoadHandler : function(e) {
            
            var _util = util
                _buf = buf,
                loginWrap = _util.getElementById("loginWrap");
            
            // prevent dulplcated onload.
            if (!_buf.iframeOpened) return;
            _buf.iframeOpened = false;
            
            if (_buf.iframeShouldDisplay) {
                _util.addClass(loginWrap, "active", controller.toggleLoginWrap);
                _buf.iframeShouldDisplay = false;
            }
            
            loginWrap.onclick = function(e) {
                controller.closeRequestFrame();
                _util.removeClass(_util.getElementById("loading"), "float_active", _util.toggleDisplay);
                loginWrap.onclick.onclick = "";
            }
        },
        
        callbackFilter : {
            qq : function(param) {
                
                // {"yarType":"qq","code":"448567D4C8126D297C5E3753DA932446","state":"ri_1383145171"}
                // incase of error
                //~ if (param.status) return param;
                alert("登录成功！欢迎，" + param.userName);
                return param;
            },
            sina : function(param) {
                
                // {"yarType":"sina","state":"ri_1383145171","code":"95de2ef264421747927c731652cf3ef3"}
                alert("登录成功！欢迎，" + param.userName);
                return param;
            },
            renren : function(param) {
                
                // {"yarType":"sina","state":"ri_1383145171","code":"95de2ef264421747927c731652cf3ef3"}
                alert("登录成功！欢迎，" + param.userName);
                return param;
            }
        }
    };
    
    var controller = {
        
        toggleLoginWrap : function(elem, display) {
            
            var _util = util;
            if (display) {
                _util.getElementById("loginWrap").style.display = "";
            } else {
                setTimeout(function() {
                    _util.getElementById("loginWrap").style.display = "none";
                }, 200);
            }
        },
        
        closeRequestFrame : function() {
            
            var _util = util;
            buf.iframeShouldDisplay = false;
            _util.removeClass(loginWrap, "active", controller.toggleLoginWrap);
        },
        
        getRequestFrame : function() {
            
            var _buf = buf;
            if (_buf.requestFrame) return _buf.requestFrame;
            
            var loginFrame = document.createElement("iframe");
            loginFrame.id = "loginFrame";
            loginFrame.className = "login_frame";
            loginFrame.frameborder = "no";
            loginFrame.allowtransparency = "no";
            
            if (loginFrame.attachEvent) {
                loginFrame.attachEvent("onload", handlerList.iframeLoadHandler);
            } else {
                loginFrame.onload = handlerList.iframeLoadHandler;
            }
            util.getElementById("loginInner").appendChild(loginFrame);
            return (_buf.requestFrame = loginFrame);
        },
        
        compactLink : function(param, callback) {
            
            if (!param.a || !param.yarType) return false;
            var _util = util,
                _buf = buf;
            
            // param exist, means the new request should be appeneded with new params from current arguments.
            var link = LC.LINK[param.a][param.yarType];
            if (param.yarArg && param.yarArg.length) {
                for (var i = 0, len = param.yarArg.length; i < len; ++i ) {
                    
                    var argMatch = param.yarArg[i].match(/(.*):(.*)/),
                        fromParam, toParam;
                    if (argMatch) {
                        fromParam = argMatch[1];
                        toParam = argMatch[2];
                    } else {
                        fromParam = param.yarArg[i];
                        toParam = param.yarArg[i];
                    }
                    
                    param[fromParam] && (link += "&" + toParam + "=" + escape(param[fromParam]));
                }
            }
            callback && (_buf.callbackFunc = callback);
            
            return link;
        }
    };
    
    return self = {
        
        callback : function(param) {
            var _buf = buf,
                _hl = handlerList,
                _lc = LC,
                _util = util;
            
            controller.closeRequestFrame();
            
            var newParam;
            if (param.a && _lc.ACTION_LIST[param.a] && (newParam = _lc.ACTION_LIST[param.a][param.yarType])) {
                
                for (var i in newParam) {
                    param[i] = newParam[i];
                }
                
                // use iframe request for the default.
                var handler = _lc.HANDLER_LIST[param.a][param.yarType] || "request";
                self[handler](param);
            } else {
                // hide the loading mask.
                _util.removeClass(_util.getElementById("loading"), "float_active", _util.toggleDisplay);
                _buf.callbackFunc && _buf.callbackFunc(
                    (_hl.callbackFilter[param.yarType] && _hl.callbackFilter[param.yarType](param))
                );
            }
        },
        
        /**
         *@param {a : "actionName", yarType : "requestType", yarDisplay : 0/1, yarArg : [] }
         *@param callback : function({ token : "", userName : "", email : "" })
         */
        request : function(param, callback) {
            
            var link = controller.compactLink(param, callback),
                requestFrame = controller.getRequestFrame(),
                _util = util;
            
            if (!link) return;
            
            if (param.yarDisplay) {
                _util.addClass(loading, "float_active", _util.toggleDisplay);
                _buf.iframeShouldDisplay = true;
            }
            
            requestFrame.src = link + "&t=" + (+new Date());
            
            _buf.iframeOpened = true;
        },
        
        /**
         *@param {a : "actionName", yarType : "qq/sina/renren", yarArg : []}
         */
        ajax : function(param, callback) {
            
            var url = escape(controller.compactLink(param, callback));
            
            if (!url) return;
            
            PageUtil.get(Page.LC.AJAX_LINK
                + "?a=callapi"
                + "&action=" + param["a"]
                + "&type=" + param["yarType"]
                + "&method=" + (LC.METHOD_LIST[param["a"]] && LC.METHOD_LIST[param["a"]][param["yarType"]] || "get" )
                + "&url=" + url,
                function(response) {
                    self.callback(response);
                }
            );
        }
    }
})();