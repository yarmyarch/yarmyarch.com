var YarAjax = (function() {
    
    var self;
    var xmlHttp;
    var response;
    
    var getXMLHttp = function() {
    
        var xmlHttpResult;
        if(window.XMLHttpRequest) {                               
            xmlHttpResult = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            try {
                xmlHttpResult = new ActiveXObject("Msxm12.XMLHTTP"); 
            } catch (e) {
                try {
                    xmlHttpResult = new ActiveXObject("Microsoft.XMLHTTP"); 
                } catch (e) {
                    xmlHttpResult = false;
                }
            }
        }
        return xmlHttpResult;
    };
    
    var doResponse = function () {
    
        if (xmlHttp.readyState == 4)
            if (xmlHttp.status == 200) {
                response &&  response(xmlHttp.responseText);
        }
    };
    
    xmlHttp = getXMLHttp();
    
    return self = {
        get : function(url, respondMethod, syn) {

            if (xmlHttp) {
                xmlHttp.open("get", url);
                response = respondMethod;
                xmlHttp.onreadystatechange = doResponse;
                xmlHttp.send();
            }
        },
        
        /**
         * @param param encoded param.
         */
        post : function(url, param, respondMethod) {

            if (xmlHttp) {
                xmlHttp.open("post", url);
                xmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded;");
                response = respondMethod;
                xmlHttp.onreadystatechange = doResponse;
                xmlHttp.send(param);
            }
        }
    }
})();
