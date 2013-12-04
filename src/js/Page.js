var Page = (function(){

var self;
    
var tmpRoot = "/wp-content/themes/touchTheSky/";

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

// load global pageConfig here
var pc = pageConfig;

var buf = {
    errorInterval : false,
    
    // array that records all possible posts in current page.
    postIdList : [],
    // reverse of the postIdList array, that points to the index for given id.
    postIdToIndex : {},
    
    // would be changed in the callback of function "loadPosts".
    loadedIdInOrder : {},
    
    // used to locate the sidebar link.
    currentPostId : false,
    
    scrollTop : 0
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
            if (!value) return { error: pc.language["notNull" + field[0].toUpperCase() + field.substr(1)] };
            return value;
        },
        
        email : function(field, value) {
            if (!value.match(/\w+((-w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+/)) return { error: pc.language.notEmail };
            return value;
        },
        
        tooShort : function(field, value) {
            if (value.length < 6) return { error : pc.language.tooShort };
            return value;
        },
        
        tooLong : function(field, value) {
            if (value.length > LC.MAX_TEXT_COUNT) return { error : pc.language.tooLong.replace(/%d%/, LC.MAX_TEXT_COUNT) };
            return value;
        }
    },
        
    sendComments : function(e) {
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
    
    loadComments : function(e) {
        
        var target = e.target || e.srcElement,
            id = target.id.match(/\d+/),
            _util = util,
            commentWrap = _util.getElementById("commentWrap_" + id),
            articleActionWrap = _util.getElementById("arcicleActionWrap_" + id),
            _lc = LC,
            targetId = _util.validateId(target);
        
        if (articleActionWrap.className.match(/disabled/)) return;
        
        // if the comment list exist already, just diplay it.
        if (commentWrap) {
            _util.toggleClass(commentWrap, "active", function(commentWrap, actived) {
                if (actived) {
                    _util.slideShow(commentWrap, 1);
                    
                    // relocate
                    controller.locate(targetId);
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
                        if (pc.userLogged) {
                            _util.slideHide(_util.getElementById("userInfo_" + id));
                        } else {
                            _util.slideShow(_util.getElementById("userInfo_" + id));
                        }
                    }, 0);
                    
                    // relocate
                    controller.locate(targetId);
                }
            );
        }
    },
    
    locatePost : function(e) {
        var e = e || window.event,
            target = e.target || e.srcElement,
            id = target.id.match(/\d+/)[0],
            _util = util,
            _buf = buf,
            _lc = LC,
            _cl = controller;
        _cl.locate("article_" + id);
        
        if (_buf.currentPostId == id) return;
        
        // if it's not in currently loaded posts, get it via ajax.
        if (!_buf.loadedIdInOrder[id]) {
            _cl.loadPosts(id);
        }
        
        // prevent auto-load while auto-locating.
        _cl.setActivedPost(id);
    },
    
    // show actived post in sidebar
    locatePostInScroll : function(e) {
        var _buf = buf,
            _util = util,
            _cl = controller,
            scrollTop = document.documentElement.scrollTop || document.body.scrollTop,
            targetPostId = _buf.postIdToIndex[_buf.currentPostId],
            isUpToDown = false;
        
        // refresh arrows.
        if (_buf.postIdToIndex[_buf.currentPostId] == 0 || _buf.currentPostId != _cl.getLastPostId()) {
            _util.getElementById("left").className = "arrow";
            _util.getElementById("top").className = "arrow";
        } else {
            _util.getElementById("left").className = "arrow active";
            _util.getElementById("top").className = "arrow active";
        }
        if (_buf.postIdToIndex[_buf.currentPostId] == _buf.postIdToIndex.length - 1 || _buf.currentPostId != _cl.getFirstPostId()) {
            _util.getElementById("right").className = "arrow";
            _util.getElementById("bottom").className = "arrow";
        } else {
            _util.getElementById("right").className = "arrow active";
            _util.getElementById("bottom").className = "arrow active";
        }
        
        // scrolling from top to bottom, check next related post.
        if (scrollTop >= _buf.scrollTop) {
            isUpToDown = 1;
            targetPostId = _buf.postIdList[targetPostId + 1];
        } else {
            isUpToDown = 0;
            targetPostId = _buf.postIdList[targetPostId - 1];
        }
        
        _buf.scrollTop = scrollTop;
        
        if (!targetPostId) return;
        
        if (!_buf.loadedIdInOrder[targetPostId]) {
            // preload
            _cl.loadPosts(targetPostId, 1);
            return;
        }
        
        // if target post found, try to check if it matches the rule of been figured as "actived".
        // rule for scrolling up to down: the title of the target post is smaller than or equels to 50% of the screen height;
        // rule for scrolling down to up: the title of the current post is bigger than or equels to 30% of the screen height.
        // if rules matched, then set target as current actived post, otherwise do nothing.
        var setTarget = false,
            screenHeight = document.documentElement.clientHeight;
        
        // refresh layer : 1
        setTarget = setTarget || (isUpToDown && _util.getTop(_util.getElementById("article_" + targetPostId), 1) <= screenHeight * 0.5 + scrollTop);
        setTarget = setTarget || (!isUpToDown && _util.getTop(_util.getElementById("article_" + _buf.currentPostId), 1) >= screenHeight * 0.5 + scrollTop);
        
        if (setTarget) {
            _cl.setActivedPost(targetPostId);
        }
    },
    
    openApiLogin : function(e) {
            
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
                controller.showErrorMsg(id, pc.language.unknownError);
                return;
            }
            
            if (!response) {
                console.log("Error detected from backend.");
                return;
            }
            
            controller.updateUserInfo(response);
            
            console.log(response);
        });
    },
    
    hotKeySend : function(e) {
            
        var target = e.target || e.srcElement,
            text = target.value || target.text;
        if (event.ctrlKey == 1 && (event.keyCode == 13 || event.which == 13)) {
            handlerList.sendComments(e);
        }
        if (target.value.length >= 1900) {
            var id = target.id.match(/\d+/),
                textCount = LC.MAX_TEXT_COUNT - target.value.length,
                language = textCount >= 0 ? "textCount" : "textCountOverflow",
                functionCall = textCount >= 0 ? "showInfoMsg" : "showErrorMsg";
            controller[functionCall](id, pc.language[language]
                .replace(/%d%/, LC.MAX_TEXT_COUNT - target.value.length)
            );
        }
    },
    
    slideLeft : function(e) {
        var _buf = buf,
            targetPostId = controller.getPrevPostId(_buf.currentPostId),
            _cl = controller;
        if (util.getElementById("left").className.match(/active/) && targetPostId) {
            _cl.setActivedPost(targetPostId);
            _cl.locate("article_" + targetPostId, 1);
        }
    },
    
    slideRight : function(e) {
        var _buf = buf,
            targetPostId = controller.getNextPostId(_buf.currentPostId),
            _cl = controller;
        if (util.getElementById("right").className.match(/active/) && targetPostId) {
            _cl.setActivedPost(targetPostId);
            _cl.locate("article_" + targetPostId, 1);
        }
    },
    
    slideTop : function(e) {
        var _cl = controller;
        if (util.getElementById("top").className.match(/active/)) {
            _cl.setActivedPost(_cl.getFirstPostId());
            _cl.locate("mainWrap", 1);
        }
    },
    
    slideBottom : function(e) {
        var _cl = controller;
        if (util.getElementById("bottom").className.match(/active/)) {
            var lastPostId = _cl.getLastPostId();
            _cl.setActivedPost(lastPostId);
            _cl.locate("bottomClear", 1);
        }
    },
    
    resetBottomFlag : function() {
        util.getElementById("bottomClear").style.bottom = document.documentElement.clientHeight + "px";
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
    
    initEventHandlers : function() {
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
        
        var _hl = handlerList,
            _util = util;
        
        // load comment list.
        self.addEventListenerByClassName("action_comment", "onclick", _hl.loadComments);
        
        // show the user info wrap if logged in.
        self.addEventListenerByClassName("user_info_edit", "onclick", function(e) {
            var target = e.target || e.srcElement,
                id = target.id.match(/\d+/),
                _util = util;
            _util.toggleSlide(_util.getElementById("userInfo_" + id));
        });
        
        // submit a comment.
        self.addEventListenerByClassName("comment_submit", "onclick", _hl.sendComments);
        self.addEventListenerByClassName("comment_textarea", "onkeyup", _hl.hotKeySend);
        
        // login open api entrance
        self.addEventListenerByClassName("open_api_login", "onclick", _hl.openApiLogin);
        
        self.addEventListenerByClassName("article_title_link", "onclick", _hl.locatePost);
        self.addEventListenerByClassName("side_post_link", "onclick", _hl.locatePost);
        
        _util.addEventListener(window, "scroll", _hl.locatePostInScroll);
        _util.addEventListener(window, "resize", _hl.resetBottomFlag);
        
        // events to arrows
        _util.addEventListener(_util.getElementById("left"), "click", _hl.slideLeft);
        _util.addEventListener(_util.getElementById("right"), "click", _hl.slideRight);
        _util.addEventListener(_util.getElementById("top"), "click", _hl.slideTop);
        _util.addEventListener(_util.getElementById("bottom"), "click", _hl.slideBottom);
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
            response.privateId && (userNames[i].disabled = true);
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
            errorWrap.innerHTML = pc.language.clickToSend;
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
            infoWrap.innerHTML = pc.language.clickToSend;
            infoWrap.style.color = "";
        }, LC.ERROR_TIMEOUT);
    },
    
    /**
     * try to locate to the given element, that leads the scrollTop change by the sliderUtil.
     * @param refreshLevel : default 1.
     */
    locate : function(elemId, refreshLevel) {
        var _util = util,
            elem = _util.getElementById(elemId),
            scrollTop = document.documentElement.scrollTop || document.body.scrollTop,
            targetTop;
        
        if (!elem) return;
        targetTop = _util.getTop(elem, refreshLevel || 1) - document.documentElement.clientHeight * 0.1;
        
        SlideUtil.run([scrollTop, targetTop, 0.3, 40, function(target){
            document.documentElement.scrollTop = document.body.scrollTop = target;
        }, 0.5]);
    },
    
    /**
     * generate the full post list from current sidebar elements.
     */
    initPostList : function() {
        var _util = util,
            _buf = buf,
            posts = _util.getElementsByClassName("side_post_link", "a", _util.getElementById("sidebar"));
        
        var id;
        for (var i = 0, len = posts.length; i < len; ++i) {
            // match returns an array...
            id = posts[i].id.match(/\d+/) + "";
            _buf.postIdList[i] = id;
            _buf.postIdToIndex[id] = i;
            
            if (_util.getElementById("article_" + id)) {
                _buf.loadedIdInOrder[id] = 1;
            }
        }
        
        // set the first post as the current actived one.
        controller.setActivedPost(_buf.postIdList[0]);
    },
    
    getFirstPostId : function() {
        
        var _buf = buf,
            targetPostId;
        
        for (var i = 0, len = _buf.postIdList.length; i < len; ++i) {
            targetPostId = _buf.postIdList[i];
            if (_buf.loadedIdInOrder[targetPostId]) break;
        }
        
        return targetPostId;
    },
    
    getLastPostId : function() {
        
        var _buf = buf,
            targetPostId;
        
        for (var i = _buf.postIdList.length - 1; i >= 0; --i) {
            targetPostId = _buf.postIdList[i];
            if (_buf.loadedIdInOrder[targetPostId]) break;
        }
        
        return targetPostId;
    },
    
    getPrevPostId : function(postId) {
        
        var _buf = buf,
            targetPostId;
        
        for (var i = _buf.postIdToIndex[postId] - 1; i >= 0; --i) {
            targetPostId = _buf.postIdList[i];
            if (_buf.loadedIdInOrder[targetPostId]) break;
        }
        
        return targetPostId;
    },
    
    getNextPostId : function(postId) {
        
        var _buf = buf,
            targetPostId;
        
        // i <= len, targetPostId should be undefined when the loop over while no matched ones found.
        for (var i = _buf.postIdToIndex[postId], len = _buf.postIdList.length; i <= len; ++i) {
            targetPostId = _buf.postIdList[i];
            if (_buf.loadedIdInOrder[targetPostId]) break;
        }
        
        return targetPostId;
    },
    
    /**
     * load series of posts via given id.
     */
    loadPosts : function(postId, noLocate) {
        
        var _util = util,
            _buf = buf,
            _lc = LC,
            _cl = controller,
            targetPostId = _cl.getNextPostId(postId);
        
        if (_buf.loadedIdInOrder[postId]) return;
        
        // show loading image at the proper place and locate the scroll top to it, located from _buf.postIdToIndex.
        _cl.showLoadingBefore(targetPostId);
        _util.get(
            _lc.AJAX_LINK 
            + "?a=loadPost"
            + "&cat=" + pc.category
            + "&id=" + postId,
            function(response) {
                
                // hide loading image here and append loaded html content.
                var contentList = response.content,
                    html = [],
                    _buf = buf,
                    _cl = controller,
                    tmpDiv = document.createElement("div"),
                    docFrag = document.createDocumentFragment(),
                    articleWrap = _util.getElementById("articleWrap");
                
                _cl.hideLoading();
                
                for (var i in contentList) {
                    if (!_buf.loadedIdInOrder[i]) {
                        html.push(contentList[i]);
                        _buf.loadedIdInOrder[i] = true;
                    }
                }
                
                html = html.join("");
                tmpDiv.innerHTML = html;
                for (var i = 0, len = tmpDiv.childNodes.length; i < len; ++i) {
                    docFrag.appendChild(tmpDiv.childNodes[i]);
                }
                delete tmpDiv;
                
                setTimeout(function() {
                    if (!targetPostId) {
                        articleWrap.appendChild(docFrag);
                    } else {
                        articleWrap.insertBefore(docFrag, _util.getElementById("article_" + targetPostId));
                    }
                    if (!noLocate) _cl.locate("article_" + postId);
                }, 210);
            }
        );
    },
    
    setActivedPost : function(postId) {
        
        var _buf = buf,
            _util = util;
        
        // focus the sidebar
        // toggle the last one
        var sidePost, lastParentId, newParentId;
        
        if (_buf.currentPostId) {
            sidePost = _util.getElementById("sidePost_" + _buf.currentPostId);
            sidePost.className = "side_post_link";
            sidePost = sidePost.parentNode;
            
            lastParentId = sidePost.id && sidePost.id.replace(/p_sideGroup_/, "");
            sidePost = _util.getElementById("t_sideGroup_" + lastParentId);
            sidePost && (sidePost.className = "side_menu_group");
        }
        
        // show the current one
        sidePost = _util.getElementById("sidePost_" + postId);
        sidePost.className = "side_post_link active";
        sidePost = sidePost.parentNode;
        
        newParentId = sidePost.id && sidePost.id.replace(/p_sideGroup_/, "");            
        sidePost = _util.getElementById("t_sideGroup_" + newParentId);
        sidePost && (sidePost.className = "side_menu_group active");
        
        if (lastParentId && lastParentId != newParentId) {
            PageUtil.toggleSlide(document.getElementById("p_sideGroup_" + lastParentId));
            PageUtil.toggleSlide(document.getElementById("p_sideGroup_" + newParentId));
        }
        
        // update buffer
        _buf.currentPostId = postId;
    },
    
    /**
     * showloading page at a specific position.
     */
    showLoadingBefore : function(postId) {
        var _util = util,
            _buf = buf,
            loadingWrap = _util.getElementById("loading"),
            articleWrap = _util.getElementById("articleWrap");
        
        if (!postId) {
            articleWrap.appendChild(loadingWrap);
        } else {
            articleWrap.insertBefore(loadingWrap, _util.getElementById("article_" + postId));
        }
        
        loadingWrap.style.display = "";
        setTimeout(function(){
            loadingWrap.className = "loading in_article active";
        }, 0);
    },
    
    hideLoading : function() {
        util.getElementById("loading").className = "loading in_article";
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
        
        controller.initEventHandlers();
        controller.initEvents();
        
        // init bind on scroll
        ScrollUtil.init();
        //~ ScrollUtil.bindOnScroll(util.getElementById("sidebar"));
        
        // init existing post list via className.
        controller.initPostList();
        
        handlerList.locatePostInScroll();
        // init the bottom flag for slide.
        handlerList.resetBottomFlag();
    }
};
})();

// let's go.
Page.init();