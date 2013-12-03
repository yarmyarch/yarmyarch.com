// static class
var Cycler = (function() {
    
var self;
    
var buf = {
    cyclerList : {},
    resized : false,
    dulplicatedElemList : {},
    cssList : []
}
    
var util = PageUtil;

var controller = {
    
    refreshOffsetWidthList : function() {
        var _buf = buf,
            _util = util;
        for (var id in _buf.offsetWidthList) {
            _buf.offsetWidthList[id] = _util.getElementById(id).offsetWidth;
        }
    },
    
    doOverflow : function(id, left, parentWidth) {
        
        var _buf = buf,
            _util = util,
            elem = _util.getElementById(id);
        
        // create the dulplicated element.
        var newElem = _util.getElementById(_buf.dulplicatedElemList[id]) || elem.cloneNode(true),
            newId = newElem.id == id ? _util.validateId() : newElem.id;
        _buf.dulplicatedElemList[id] = newElem.id = newId;
        _buf.dulplicatedElemList[newId] = id;
        
        // appendChild if not exist in the document.
        if (!_util.getElementById(newId)) elem.parentNode.appendChild(newElem);
        _buf.cssList.push({id : newId, property : "left", value : left + 100 + "%"});
        
        return newId;
    }
};

var handlerList = {
    slide : function(speed) {
        
        // closure data here, record a lastTick for each element that uses this handler.
        var lastTick = 0;
        return function(id, tick) {
            
            var _buf = buf,
                _util = util,
                elem = _util.getElementById(id),
                parentWidth = _util.getOffsetWidth(_util.validateId(elem.parentNode)),
                elemWidth = _util.getOffsetWidth(id),
                left = elem.offsetLeft / parentWidth * 100 + speed * ((tick - lastTick));
            
            lastTick = tick;
            
            // if overflow
            if (left + elemWidth / parentWidth * 100 <= 0) {
                left += 100;
            }
            
            _buf.cssList.push({id : id, property : "left", value : left + "%"});
            controller.doOverflow(id, left);
        }
    }
};

return self = {
    
    handler : handlerList,
    
    add : function(elemId, handler) {
        buf.cyclerList[elemId] = {id : elemId, handler : handler};
    },
    
    run : function() {
        var tick = 0,
            lastScrollTop = document.documentElement.scrollTop || document.body.scrollTop,
            _buf = buf,
            _util = util;
        
        // bind event
        window.onresize = function() {
            controller.refreshOffsetWidthList();
        };
        
        window.onscroll = function() {
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop,
                delta = scrollTop - lastScrollTop;
            tick += delta > 0 ? delta : -2;
            lastScrollTop = scrollTop;
        };
        
        var render = function() {
            
            tick += 1;
            _buf.cssList = [];
            for (var i in _buf.cyclerList) {
                var cycler = _buf.cyclerList[i];
                cycler.handler(cycler.id, tick);
            }
            for (var i in _buf.cssList) {
                var cssItem = _buf.cssList[i];
                _util.getElementById(cssItem.id).style[cssItem.property] = cssItem.value;
            }
            
            util.requestAFrame.call(window, render);
        };
        
        render();
    },
    
    // for outer usage.
    util : util
}

})();