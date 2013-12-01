var PageUtil = (function(){

var LC = {
    ANIMATION_INTERNAL : 200,
    INTERVAL : 40
};

var buf = {
    ajaxList : {},
    slideStatus : {},
    elemList : {},
    offsetHeightList : {},
    offsetWidthList : {},
    getEBCNBuffer : {},
        
    topList : {},
    leftList : {}
};

return self = {
    
    stopDefault : function(e) {
        var e = e || window.event;
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
    },
    
    stopBubble : function(e) {
        var e = e || window.event;
        if (e.stopPropagation) {
            e.stopPropagation();
        } else {
            e.cancelBubble = true;
        }
    },
    
    get : function(url, callback) {
        if (buf.ajaxList[url]) return;
        buf.ajaxList[url] = 1;
        YarAjax.get(url, function(response) {
            buf.ajaxList[url] = 0;
            try {
                response = eval("(" + response + ")");
            } catch (e) {
                response = {status:1, msg:""};
            }
            callback && callback(response);
        });
    },
    
    post : function(url, param, callback) {
        if (buf.ajaxList[url]) return;
        buf.ajaxList[url] = 1;
        YarAjax.post(url, param, function(response) {
            try {
                response = eval("(" + response + ")");
            } catch (e) {
                response = {status:1, msg:""};
            }
            callback && callback(response);
            buf.ajaxList[url] = 0;
        });
    },
    
    /**
     *@param callback(exist) : accept param, 0 if className removed, otherwise 1.
     */
    toggleClass : function(elem, targetClass, callback) {
        
        var className = elem.className;
        if (className.match(targetClass)) {
            elem.className = className.replace(new RegExp("\\s+" + targetClass), ""); 
            callback && callback(elem, 0);
        } else {
            callback && callback(elem, 1);
            setTimeout(function(){
                elem.className =  className + " " + targetClass;
            },0);
        }
    },
    
    removeClass : function(elem, targetClass, callback) {
        
        var className = elem.className;
        if (className.match(targetClass)) {
            elem.className = className.replace(new RegExp("\\s+" + targetClass), "");
        }
        callback && callback(elem, 0);
    },
    
    addClass : function(elem, targetClass, callback) {
        
        var className = elem.className;
        if (!className.match(targetClass)) {
            callback && callback(elem, 1);
            setTimeout(function(){
                elem.className =  className + " " + targetClass;
            }, 0);
        }
    },
    
    toggleDisplay : function(elem, display) {
        if (display) {
            elem.style.display = "block";
        } else {
            setTimeout(function() {
                elem.style.display = "none";
            }, LC.ANIMATION_INTERNAL);
        }
    },
    
    toggleSlide : function(elem) {
        var _buf = buf,
            _util = self,
            id = _util.validateId(elem);
        
        if (_buf.slideStatus[id]) {
            _util.slideHide(elem);
        } else {
            _util.slideShow(elem);
        }
    },
    
    slideShow : function(elem, param) {
        
        var duration = (param && param.duration) || LC.ANIMATION_INTERNAL / 1000,
            _buf = buf;
        
        _buf.slideStatus[elem.id] = true;
        
        elem.style.height = "0px";
        elem.style.display = "";
        elem.style.opacity = "0";
        elem.style.overflow = "hidden";
        elem.style.transition = "none";
        setTimeout(function() {
            elem.style.transition = "all " + duration + "s linear";
            elem.style.height = elem.scrollHeight + "px";
            elem.style.opacity = (param && param.opacity) || "1";
            
            setTimeout(function(){
                elem.style.transition = "none";
                elem.style.height = "";
                elem.style.overflow = "";
            }, duration * 1000);
        }, 0);
    },
    
    slideHide : function(elem, param) {
        
        var duration = (param && param.duration) || LC.ANIMATION_INTERNAL / 1000;
        
        buf.slideStatus[elem.id] = false;
        
        elem.style.transition = "none";
        elem.style.height = elem.scrollHeight + "px";
        setTimeout(function() {
            elem.style.transition = "all " + duration + "s linear";
            elem.style.overflow = "hidden";
            elem.style.height = "0px";
            elem.style.opacity = "0";
        }, 0);
    },
    
    getRandId : function() {
        return (Math.random()).toString(36).substring(2);
    },
    
    validateId : function(element) {
        
        return element && (element.id || (element.id = "_RI_" + self.getRandId())) || "_RI_" + self.getRandId();
    },
    
    getOffsetWidth : function(id) {
        var _buf = buf,
            _util = self;
        return _buf.offsetWidthList[id] || (_buf.offsetWidthList[id] = _util.getElementById(id).offsetWidth);
    },
    
    getOffsetHeight : function(id) {
        var _buf = buf,
            _util = self;
        return _buf.offsetHeightList[id] || (_buf.offsetHeightList[id] = _util.getElementById(id).offsetHeight);
    },
    
    getElementById : function(id, updateBuffer) {
        return buf.elemList[id] || (buf.elemList[id] = document.getElementById(id));
    },
    
    getElementsByClassName : function(className, tagName, useBuffer) {
            
        //check buf first
        var _buf = buf,
            elems, tmpElems,
            key = className + "_" + tagName;
        if (!updateBuffer && _buf.getEBCNBuffer[key]) return _buf.getEBCNBuffer[key];
        
        elems = document.getElementsByClassName && document.getElementsByClassName(className);
        
        if (elems) return elems;
        tagName = tagName || "div";
        tmpElems = document.getElementsByTagName(tagName);
        elems = [];
        for (var i = 0, len = tmpElems.length; i < len; ++i) {
            tmpElems[i].className.match(className) && elems.push(tmpElems[i]);
        }
        return _buf.getEBCNBuffer[key] = elems;
    },
    
    htmlDecode : function($str) {
        return $str
            .replace(/&lt;/ig, "<")
            .replace(/&gt;/ig, ">")
            .replace(/&quot;/ig, "\"")
            .replace(/&amp;/ig, "&");
    },
    
    addEventListener : function(target, eventName, handler) {
        var pureEventName = eventName.replace(/$on/, "");
        eventName = "on" + pureEventName;
        
        if (target.addEventListener) {
            target.addEventListener(pureEventName, handler, false);
        } else {
            target.attachEvent(eventName, handler);
        }
    },
    
    removeEventListener : function(target, eventName, handler) {
        var pureEventName = eventName.replace(/$on/, "");
        eventName = "on" + pureEventName;
        
        if (target.removeEventListener) {
            target.removeEventListener(pureEventName, handler, false);
        } else {
            target.detachEvent(eventName, handler);
        }
    },
    
    requestAFrame : (function () {
        return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                function (callback, interval) {
                    return window.setTimeout(callback, interval || _lc.INTERVAL);
                };
    })(),

    cancelAFrame : (function () {
        return window.cancelAnimationFrame ||
                window.webkitCancelAnimationFrame ||
                window.mozCancelAnimationFrame ||
                window.oCancelAnimationFrame ||
                function (id) {
                    window.clearTimeout(id);
                };
    })(),
    
    /**
     *@param 2 leval array 
     */
    matrixCross : function(a, b) {
        if (a[0].length != b.length) return;
        
        var i, j, lenA, lenB, c = [];
        for (var k = 0, lenK = b[0].length; k < lenK; ++k) {
            for (var i = 0, lenA = a.length; i < lenA; ++i) {
                c[i] = c[i] || [];
                for (var j = 0, lenB = a[i].length; j < lenB; ++j) {
                    c[i][k] = c[i][k] || 0;
                    c[i][k] += a[i][j] * b[j][k];
                }
            }
        }
        
        return c;
    },
    
    getTop : function(e, refresh){
        var id = (self.validateId(e)),
            _buf = buf;
        if (!refresh && _buf.topList[id]) return _buf.topList[id];
        
        var offset = e.offsetTop;
        if(e.offsetParent != null) offset += self.getTop(e.offsetParent, --refresh); 
        return _buf.topList[id] = offset; 
    },
    
    getLeft : function(e, refresh){
        var id = (self.validateId(e)),
            _buf = buf;
        if (!refresh && _buf.leftList[id]) return _buf.leftList[id];
        
        var offset = e.offsetLeft; 
        if(e.offsetParent != null) offset += self.getLeft(e.offsetParent, --refresh); 
        return _buf.leftList[id] = offset; 
    }
};

})();