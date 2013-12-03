// Bind on scroll

var ScrollUtil = (function() {

    var self;
    
    var util = PageUtil;
    
    var buf = {
        scrollElemList : {},
        scrollTop : 0
    };

    return self = {
        
        init : function() {
          
            util.addEventListener(window, "scroll", function(e) {
                var scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop),
                    _buf = buf,
                    _util = util,
                    elemList = _buf.scrollElemList,
                    elemTop;
                for (var i in elemList) {
                    elemTop = _util.getTop(elemList[i].elem);
                    if (scrollTop == elemTop || ((_buf.scrollTop - elemTop) * (elemTop - scrollTop) > 0 || elemTop == _buf.scrollTop)) {
                        _buf.scrollTop < scrollTop ? (elemList[i].duc && elemList[i].duc(elemTop, scrollTop, _buf.scrollTop)) : (elemList[i].udc && elemList[i].udc(elemTop, scrollTop, _buf.scrollTop));
                    }
                }
                _buf.scrollTop = scrollTop;
            });  
        },
        
        bindOnScroll : function(elem, downUpCallback, upDownCallback) {
            var _buf = buf,
                id = util.validateId(elem);
            _buf.scrollElemList[id] || (_buf.scrollElemList[id] = {
                elem : elem,
                duc : downUpCallback,
                udc : upDownCallback
            });
        },

        unbind : function(elem) {
            var _buf = buf,
                id = util.validateId(elem);
            (id in _buf.scrollElemList) && (delete _buf.scrollElemList[id]);
        }
        
    }

})();