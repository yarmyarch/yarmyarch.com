var Page = (function(){

var self;
    
var tmpRoot = "/wp-content/themes/touch the sky/";

var LC = {
    IMAGE_TIMEOUT : 10000,
    ERROR_TIMEOUT : 3000,
    MAX_TEXT_COUNT : 2000,
    AJAX_LINK : "/ajax",
    // fields(with the given pre-id as the key below) and required validations. empty array if no validation required.
    FORM_FIELD : {
        "userName" : ["notNull"],
        "email" : ["notNull", "email"],
        "content" : ["notNull", "tooShort", "tooLong"]
    }
};

var buf = {
    errorInterval : false,
    
    // used to locate the sidebar link.
    lastPostId : false
};

var util = PageUtil;

var handlerList = {
    classEventHandler : {
        onclick : {},
        onkeyup : {}
    },
    idEventHandler : {
        onclick : {},
        onkeyup : {}
    },
    
    validator : {
        notNull : function(field, value) {
            if (!value) return { error: pageConfig.language["notNull" + field[0].toUpperCase() + field.substr(1)] };
            return value;
        },
        
        email : function(field, value) {
            if (!value.match(/\w+((-w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+/)) return { error: pageConfig.language.notEmail };
            return value;
        },
        
        tooShort : function(field, value) {
            if (value.length < 6) return { error : pageConfig.language.tooShort };
            return value;
        },
        
        tooLong : function(field, value) {
            if (value.length > LC.MAX_TEXT_COUNT) return { error : pageConfig.language.tooLong.replace(/%d%/, LC.MAX_TEXT_COUNT) };
            return value;
        }
    },
        
    sendCommentHandler : function(e) {
        var target = e.target || e.srcElement,
            id = target.id.match(/\d+/),
            _util = util,
            loading = _util.getElementById("commentLoading_" + id),
            fields = LC.FORM_FIELD,
            params = ["a=sendComment", "pid=" + id];
        
        for (var i in fields) {
            var fieldId = i + "_" + id,
                valueTarget = _util.getElementById(fieldId),
                validatedValue = controller.validate(i, valueTarget.value || valueTarget.text || ""),
                _buf = buf;
            if (validatedValue.error) {
                // opps. Focus and show error messages (that's given by the validator).
                _util.getElementById(fieldId).focus();
                
                controller.showErrorMsg(id, validatedValue.error);
                return;
            } else {
                // add into param list.
                params.push(i + "=" + encodeURIComponent(validatedValue));
            }
        }
        
        _util.addClass(loading, "active", _util.toggleDisplay);
        
        _util.post(
            LC.AJAX_LINK, 
            params.join("&"),
            function(response) {
                
                _util.removeClass(loading, "active", _util.toggleDisplay);
                if (response.status) {
                    controller.showErrorMsg(id, response.msg);
                    return;
                }
                
                var commentInputWrap = _util.getElementById("commentInput_" + id),
                    bufElem = document.createElement("div");
                
                bufElem.innerHTML = response.content.trim();
                commentInputWrap.parentNode.insertBefore(bufElem.childNodes[0], commentInputWrap);
                
                controller.updateUserInfo(response);
                
                // hide the user info input.
                _util.slideHide(_util.getElementById("userInfo_" + id));
            }
        );
    },
    
    locatePost : function(e) {
        var e = e || window.event,
            target = e.target || e.srcElement,
            id = target.id.match(/\d+/),
            _util = util;
            _buf = buf;
        controller.locate(target);
        
        if (_buf.lastPostId == id) return;
        
        // focus the sidebar
        // toggle the last one
        var sidePost, parentId;
        if (false != _buf.lastPostId) {
            sidePost = _util.getElementById("sidePost_" + _buf.lastPostId);
            sidePost.className = "side_post_link";
            sidePost = sidePost.parentNode;
            parentId = sidePost.id && sidePost.id.replace(/p_sideGroup_/, "");
            sidePost = _util.getElementById("t_sideGroup_" + parentId);
            sidePost && (sidePost.className = "side_menu_group");
        }
        
        // show the current one
        sidePost = _util.getElementById("sidePost_" + id);
        sidePost.className = "side_post_link active";
        sidePost = sidePost.parentNode;
        parentId = sidePost.id && sidePost.id.replace(/p_sideGroup_/, "");
        sidePost = _util.getElementById("t_sideGroup_" + parentId);
        sidePost && (sidePost.className = "side_menu_group active");
        
        // update buffer
        _buf.lastPostId = id;
    }
};

var controller = {
    initImages : function(param, callback, showLoading) {
        
        var elem, elems = [], imgCount = 0, _util = util;
        for (var i in param) {
            elem = _util.getElementById(i);
            if (!elem || elem.tagName.toLowerCase() != "img") continue;
            elems.push(elem);
        }
        
        var iamgeTimer = setTimeout(function() {
            location.reload();
        }, LC.IMAGE_TIMEOUT);
        
        for (var i = 0, len = elems.length; i < len; ++i) {
            elem = elems[i];
            if (showLoading && !elem.width && !elem.clientWidth) {
                elem.onload = function() {
                    ++imgCount;
                    if (imgCount == len && callback) {
                        clearTimeout(iamgeTimer);
                        callback();
                    }
                    elem.style.display = "";
                };
                elem.style.display = "none";
            } else {
                ++imgCount;
            };
            elem && (elem.src = param[elem.id]);
        }
        
        if (!showLoading) {
            clearTimeout(iamgeTimer);
            setTimeout(function(){
                callback && callback();
            }, 300);
        }
    },
    
    initHandlers : function() {
        var _hl = handlerList, _util = util;
        
        for (var i in _hl.classEventHandler) {
            _util.getElementById("mainWrap")[i] = (function(eventName) {
                return function(e) {
                    
                    // execute the callback bind to the given element, by className or id.
                    var e = e || window.event,
                        target = e.target || e.srcElement,
                        _hl = handlerList,
                        _ut = util;
                    
                    // check for id first.
                    var handlers = _hl.idEventHandler[eventName][target.id];                    
                    for (var i in handlers) {
                        if (handlers[i] instanceof Function) {
                            handlers[i][e];
                        }
                    }
                    
                    // then className
                    var classNameList = target.className.split(/\s+/);
                    for (var i = 0, len = classNameList.length; i < len; ++i) {
                        
                        handlers = _hl.classEventHandler[eventName][classNameList[i]];
                        for (var j in handlers) {
                            if (handlers[j] instanceof Function) {
                                handlers[j](e);
                            }
                        }
                    }
                }
            })(i);
        }
    },
    
    initEvents : function() {
        
        // load comment list.
        self.addEventListenerByClassName("action_comment", "onclick", function(e) {
            var target = e.target || e.srcElement,
                id = target.id.match(/\d+/),
                _util = util,
                commentWrap = _util.getElementById("commentWrap_" + id),
                articleActionWrap = _util.getElementById("arcicleActionWrap_" + id),
                _lc = LC;
            
            if (articleActionWrap.className.match(/disabled/)) return;
            
            // if the comment list exist already, just diplay it.
            if (commentWrap) {
                _util.toggleClass(commentWrap, "active", function(commentWrap, actived) {
                    if (actived) {
                        _util.slideShow(commentWrap, 1);
                        
                        // relocate
                        controller.locate(target);
                    } else {
                        _util.slideHide(commentWrap);
                    }
                });
            } else {
                // show the loading image below
                var loading = _util.getElementById("commentLoading_" + id);
                _util.toggleClass(loading, "active", _util.toggleDisplay);
                
                _util.get(_lc.AJAX_LINK 
                    + "?a=comment"
                    + "&pid=" + id,
                    function(response) {
                        loading.style.display = "none";
                        loading.style.position = "absolute";
                        
                        var div = document.createElement("div");
                        
                        div.innerHTML = response.content.trim();
                        articleActionWrap.appendChild(div.childNodes[0]);
                        
                        // remove the loading image into the comment_input node so it can be used when a comment submitted.
                        _util.getElementById("commentInput_" + id).appendChild(loading);
                        
                        // set the comment wrap visible, with some basic animations.
                        commentWrap = _util.getElementById("commentWrap_" + id);
                        commentWrap.style.display = "none";
                        setTimeout(function() {
                            _util.slideShow(_util.getElementById("commentWrap_" + id));
                            
                            // if the user is logged, hide the user info input area.
                            if (pageConfig.userLogged) {
                                _util.slideHide(_util.getElementById("userInfo_" + id));
                            } else {
                                _util.slideShow(_util.getElementById("userInfo_" + id));
                            }
                        }, 0);
                        
                        // relocate
                        controller.locate(target);
                    }
                );
            }
        });
        
        // show the user info wrap if logged in.
        self.addEventListenerByClassName("user_info_edit", "onclick", function(e) {
            var target = e.target || e.srcElement,
                id = target.id.match(/\d+/),
                _util = util;
            _util.toggleSlide(_util.getElementById("userInfo_" + id));
        });
        
        // submit a comment.
        self.addEventListenerByClassName("comment_submit", "onclick", handlerList.sendCommentHandler);
        self.addEventListenerByClassName("comment_textarea", "onkeyup", function(e) {
            
            var target = e.target || e.srcElement,
                text = target.value || target.text;
            if (event.ctrlKey == 1 && (event.keyCode == 13 || event.which == 13)) {
                handlerList.sendCommentHandler(e);
            }
            if (target.value.length >= 1900) {
                var id = target.id.match(/\d+/),
                    textCount = LC.MAX_TEXT_COUNT - target.value.length,
                    language = textCount >= 0 ? "textCount" : "textCountOverflow",
                    functionCall = textCount >= 0 ? "showInfoMsg" : "showErrorMsg";
                controller[functionCall](id, pageConfig.language[language]
                    .replace(/%d%/, LC.MAX_TEXT_COUNT - target.value.length)
                );
            }
        });
        
        // login open api entrance
        self.addEventListenerByClassName("open_api_login", "onclick", function(e) {
            
            var target = e.targt || e.srcElement,
                id = target.id.match(/\d+/),
                type = target.id.match(/openApiLogin_(\w+)/)[1];
            
            OpenApi.request({a : "login", yarType : type, yarDisplay : 1}, function(response) {
                // in case of error
                if (response && (+response.status) && +id) {
                    controller.showErrorMsg(id, response.msg);
                    return;
                }
                
                if (!response && +id) {
                    controller.showErrorMsg(id, pageConfig.language.unknownError);
                    return;
                }
                
                if (!response) {
                    console.log("Error detected from backend.");
                    return;
                }
                
                controller.updateUserInfo(response);
                
                console.log(response);
            });
        });
        
        self.addEventListenerByClassName("article_title_link", "onclick", handlerList.locatePost);
    },
    
    updateUserInfo : function(response) {
        
        if (!response) return;
        if (response.yar_mf_tick && response.yar_df_tick) {
            User.update(response.yar_mf_tick, response.yar_df_tick);
        }
        
        var userInfos = document.getElementsByName("userInfoEdit"),
            userNames = document.getElementsByName("userName"),
            emails = document.getElementsByName("email"),
            _util = util;
        
        for (var i = 0, len = userInfos.length; i < len; ++i) {
            response.userName && (userInfos[i].innerHTML = response.userName);
            response.userName && (userNames[i].value = _util.htmlDecode(response.userName));
            response.email && (emails[i].value = _util.htmlDecode(response.email));
            
            // from api login
            response.privateId && userNames[i].disabled = true;
        }
    },
    
    validate : function(field, value) {
        
        // any other pre handle if required.
        value = (value + "").trim();
        
        var validatorList = LC.FORM_FIELD[field],
            _hl = handlerList;
        
        for (var i = 0, len = validatorList.length; i < len; ++i) {
            _hl["validator"][validatorList[i]] && (value = _hl["validator"][validatorList[i]](field, value));
            if (value.error) {
                // append other informations to returned error message if required here.
                break;
            }
        }
        return value;
    },
    
    showErrorMsg : function(id, msg) {
        
        if (!id) return;
        
        var errorWrap = util.getElementById("commentSubmit_" + id),
            _buf = buf;
        errorWrap.innerHTML = msg;
        errorWrap.style.color = "#F00";
        
        // set the send button back.
        clearTimeout(_buf.errorInterval[id]);
        _buf.errorInterval = setTimeout(function() {
            errorWrap.innerHTML = pageConfig.language.clickToSend;
            errorWrap.style.color = "";
        }, LC.ERROR_TIMEOUT);
    },
    
    showInfoMsg : function(id, msg) {
        
        var infoWrap = util.getElementById("commentSubmit_" + id),
            _buf = buf;
        infoWrap.innerHTML = msg;
        infoWrap.style.color = "#2B6";
        
        // set the send button back.
        clearTimeout(_buf.errorInterval[id]);
        _buf.errorInterval = setTimeout(function() {
            infoWrap.innerHTML = pageConfig.language.clickToSend;
            infoWrap.style.color = "";
        }, LC.ERROR_TIMEOUT);
    },
    
    /**
     * try to locate to the given element, that leads the scrollTop change by the sliderUtil.
     */
    locate : function(elem, refreshLevel) {
        var _util = util,
            scrollTop = document.documentElement.scrollTop || document.body.scrollTop,
            targetTop;
        
        if (!elem) return;
        targetTop = _util.getTop(elem, refreshLevel) - document.documentElement.clientHeight * 0.1;
        
        SlideUtil.run([scrollTop, targetTop, 0.3, 40, function(target){
            document.documentElement.scrollTop = document.body.scrollTop = target;
        }, 0.5]);
    }
};

return self = {
    addEventListenerByClassName : function(className, eventName, callback) {
        var hl = handlerList.classEventHandler[eventName][className];
        
        !hl && (hl = handlerList.classEventHandler[eventName][className] = []);
        handlerList.classEventHandler[eventName][className].push(callback);
    },
    addEventListenerById : function(id, eventName, callback) {
        var hl = handlerList.idEventHandler[eventName][id];
        
        !hl && (hl = handlerList.classEventHandler[eventName][id] = []);
        hl.push(callback);
    },
    
    controller : controller,
    
    util : util,
    
    LC : LC,
    
    init : function() {
        
        // register current user.
        User.run();
        
        var loading = util.getElementById("loading"),
            _util = util;
        
        //~ _util.addClass(loading, "active", _util.toggleDisplay);
        
        // load all images in this page.
        Decoration.init(function() {
            _util.removeClass(loading, "active", _util.toggleDisplay);
            //~ _util.getElementById("show").style.display = "block";
            
            // load signature
            controller.initImages({
                signature : tmpRoot + "imgs/bg.png"
                //~ h_bicycle : tmpRoot + "decoration/t_1/imgs/cycle.png",
                //~ h_wheel_1 : tmpRoot + "decoration/t_1/imgs/wheel.png",
                //~ h_wheel_2 : tmpRoot + "decoration/t_1/imgs/wheel.png"
            });
            
            // show the posts and other page-related stuff here.
            setTimeout(function() {
                
                _util.getElementById("mainWrap").className = _util.getElementById("mainWrap").className + " active";
                _util.getElementById("copyRight").className = _util.getElementById("copyRight").className + " active";
                setTimeout(function(){
                    _util.getElementById("content").className = _util.getElementById("content").className + " active";
                }, 500);
                setTimeout(function(){
                    _util.getElementById("sidebar").className = _util.getElementById("sidebar").className + " active";
                }, 800);
                setTimeout(function(){
                    _util.getElementById("headerBicycle").className = _util.getElementById("headerBicycle").className + " active";
                }, 1100);
                
                /*
                Cycler.add("birds_2", Cycler.handler.slide(-0.1));
                Cycler.add("birds_1", Cycler.handler.slide(-0.08));
                Cycler.add("mountain_1", Cycler.handler.slide(-0.03));
                Cycler.add("clouds_4", Cycler.handler.slide(-0.04));
                Cycler.add("clouds_3", Cycler.handler.slide(-0.05));
                Cycler.add("clouds_2", Cycler.handler.slide(-0.05));
                Cycler.add("clouds_1", Cycler.handler.slide(-0.09));
                */
                //~ Cycler.run();
            }, pageConfig.animationTimeout);
        });
            /*
        controller.initImages({
            h_bicycle : tmpRoot + "decoration/t_1/imgs/cycle.png",
            h_wheel_1 : tmpRoot + "decoration/t_1/imgs/wheel.png",
            h_wheel_2 : tmpRoot + "decoration/t_1/imgs/wheel.png",
            
            bicycle : tmpRoot + "decoration/t_1/imgs/cycle.png",
            wheel_1 : tmpRoot + "decoration/t_1/imgs/wheel.png",
            wheel_2 : tmpRoot + "decoration/t_1/imgs/wheel.png",
            mountain_1 : tmpRoot + "decoration/t_1/imgs/mountain_1.png",
            mountain_2 : tmpRoot + "decoration/t_1/imgs/mountain_2.png",
            birds_1 : tmpRoot + "decoration/t_1/imgs/birds_1.png",
            birds_2 : tmpRoot + "decoration/t_1/imgs/birds_2.png",
            grass : tmpRoot + "decoration/t_1/imgs/grass.png",
            road : tmpRoot + "decoration/t_1/imgs/road.png",
            clouds_1 : tmpRoot + "decoration/t_1/imgs/clouds_1.png",
            clouds_2 : tmpRoot + "decoration/t_1/imgs/clouds_2.png",
            clouds_3 : tmpRoot + "decoration/t_1/imgs/clouds_3.png",
            clouds_4 : tmpRoot + "decoration/t_1/imgs/clouds_4.png",
            
            road            : tmpRoot + decorateRoot + "road.png",
            city            : tmpRoot + decorateRoot + "city.png",
            mountainHigher  : tmpRoot + decorateRoot + "mountainHigher.png",
            grass           : tmpRoot + decorateRoot + "grass.png",
            hillLower       : tmpRoot + decorateRoot + "hillLower.png",
            hillHigher      : tmpRoot + decorateRoot + "hillHigher.png",
            mountainLower   : tmpRoot + decorateRoot + "mountainLower.png",
            leaves          : tmpRoot + decorateRoot + "leaves.png",
            leavesShadow    : tmpRoot + decorateRoot + "leavesShadow.png",
            tree            : tmpRoot + decorateRoot + "tree.png",
            forest          : tmpRoot + decorateRoot + "forest.png",
            water           : tmpRoot + decorateRoot + "water.png",
            river           : tmpRoot + decorateRoot + "river.png",
            
            signature : tmpRoot + "imgs/bg.png"
        }, callback, 0);
        */
        
        controller.initHandlers();
        controller.initEvents();
        
        // init bind on scroll
        ScrollUtil.init();
        //~ ScrollUtil.bindOnScroll(util.getElementById("sidebar"));
    },
    
    locate : controller.locate
};
})();

// let's go.
Page.init();