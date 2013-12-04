var PageUtil=(function(){var LC={ANIMATION_INTERNAL:200,INTERVAL:40};var buf={ajaxList:{},slideStatus:{},elemList:{},offsetHeightList:{},offsetWidthList:{},getEBCNBuffer:{},topList:{},leftList:{},getStyleBuffer:{}};return self={stopDefault:function(e){var e=e||window.event;if(e.preventDefault){e.preventDefault()}else{e.returnValue=false}},stopBubble:function(e){var e=e||window.event;if(e.stopPropagation){e.stopPropagation()}else{e.cancelBubble=true}},get:function(url,callback){if(buf.ajaxList[url]){return}buf.ajaxList[url]=1;YarAjax.get(url,function(response){buf.ajaxList[url]=0;try{response=eval("("+response+")")}catch(e){response={status:1,msg:""}}callback&&callback(response)})},post:function(url,param,callback){if(buf.ajaxList[url]){return}buf.ajaxList[url]=1;YarAjax.post(url,param,function(response){try{response=eval("("+response+")")}catch(e){response={status:1,msg:""}}callback&&callback(response);buf.ajaxList[url]=0})},toggleClass:function(elem,targetClass,callback){var className=elem.className;if(className.match(targetClass)){elem.className=className.replace(new RegExp("\\s+"+targetClass),"");callback&&callback(elem,0)}else{callback&&callback(elem,1);setTimeout(function(){elem.className=className+" "+targetClass},0)}},removeClass:function(elem,targetClass,callback){var className=elem.className;if(className.match(targetClass)){elem.className=className.replace(new RegExp("\\s+"+targetClass),"")}callback&&callback(elem,0)},addClass:function(elem,targetClass,callback){var className=elem.className;if(!className.match(targetClass)){callback&&callback(elem,1);setTimeout(function(){elem.className=className+" "+targetClass},0)}},toggleDisplay:function(elem,display){if(display){elem.style.display="block"}else{setTimeout(function(){elem.style.display="none"},LC.ANIMATION_INTERNAL)}},toggleSlide:function(elem){var _buf=buf,_util=self,id=_util.validateId(elem);if(_buf.slideStatus[id]){_util.slideHide(elem)}else{_util.slideShow(elem)}},slideShow:function(elem,param){var duration=(param&&param.duration)||LC.ANIMATION_INTERNAL/1000,_buf=buf;_buf.slideStatus[elem.id]=true;elem.style.height="0px";elem.style.display="";elem.style.opacity="0";elem.style.overflow="hidden";elem.style.transition="none";setTimeout(function(){elem.style.transition="all "+duration+"s linear";elem.style.height=elem.scrollHeight+"px";elem.style.opacity=(param&&param.opacity)||"1";setTimeout(function(){elem.style.transition="none";elem.style.height="";elem.style.overflow=""},duration*1000)},0)},slideHide:function(elem,param){var duration=(param&&param.duration)||LC.ANIMATION_INTERNAL/1000;buf.slideStatus[elem.id]=false;elem.style.transition="none";elem.style.height=elem.scrollHeight+"px";setTimeout(function(){elem.style.transition="all "+duration+"s linear";elem.style.overflow="hidden";elem.style.height="0px";elem.style.opacity="0"},0)},getRandId:function(){return(Math.random()).toString(36).substring(2)},validateId:function(element){return element&&(element.id||(element.id="_RI_"+self.getRandId()))||"_RI_"+self.getRandId()},getOffsetWidth:function(id){var _buf=buf,_util=self;return _buf.offsetWidthList[id]||(_buf.offsetWidthList[id]=_util.getElementById(id).offsetWidth)},getOffsetHeight:function(id){var _buf=buf,_util=self;return _buf.offsetHeightList[id]||(_buf.offsetHeightList[id]=_util.getElementById(id).offsetHeight)},getElementById:function(id,updateBuffer){return buf.elemList[id]||(buf.elemList[id]=document.getElementById(id))},getElementsByClassName:function(className,tagName,parentNode,updateBuffer){var _buf=buf,elems,tmpElems,key=className+"_"+tagName,parentNode=parentNode||document;if(!updateBuffer&&_buf.getEBCNBuffer[key]){return _buf.getEBCNBuffer[key]}elems=document.getElementsByClassName&&document.getElementsByClassName(className);if(elems){return elems}tagName=tagName||"div";tmpElems=parentNode.getElementsByTagName(tagName);elems=[];for(var i=0,len=tmpElems.length;i<len;++i){tmpElems[i].className.match(className)&&elems.push(tmpElems[i])}return _buf.getEBCNBuffer[key]=elems},htmlDecode:function($str){return $str.replace(/&lt;/ig,"<").replace(/&gt;/ig,">").replace(/&quot;/ig,'"').replace(/&amp;/ig,"&")},addEventListener:function(target,eventName,handler){var pureEventName=eventName.replace(/$on/,"");eventName="on"+pureEventName;if(target.addEventListener){target.addEventListener(pureEventName,handler,false)}else{target.attachEvent(eventName,handler)}},removeEventListener:function(target,eventName,handler){var pureEventName=eventName.replace(/$on/,"");eventName="on"+pureEventName;if(target.removeEventListener){target.removeEventListener(pureEventName,handler,false)}else{target.detachEvent(eventName,handler)}},requestAFrame:(function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||function(callback,interval){return window.setTimeout(callback,interval||_lc.INTERVAL)}})(),cancelAFrame:(function(){return window.cancelAnimationFrame||window.webkitCancelAnimationFrame||window.mozCancelAnimationFrame||window.oCancelAnimationFrame||function(id){window.clearTimeout(id)}})(),matrixCross:function(a,b){if(a[0].length!=b.length){return}var i,j,lenA,lenB,c=[];for(var k=0,lenK=b[0].length;k<lenK;++k){for(var i=0,lenA=a.length;i<lenA;++i){c[i]=c[i]||[];for(var j=0,lenB=a[i].length;j<lenB;++j){c[i][k]=c[i][k]||0;c[i][k]+=a[i][j]*b[j][k]}}}return c},getTop:function(e,refresh){var id=(self.validateId(e)),_buf=buf;if(!refresh&&_buf.topList[id]){return _buf.topList[id]}var offset=e.offsetTop;if(e.offsetParent!=null){offset+=self.getTop(e.offsetParent,--refresh)}return _buf.topList[id]=offset},getLeft:function(e,refresh){var id=(self.validateId(e)),_buf=buf;if(!refresh&&_buf.leftList[id]){return _buf.leftList[id]}var offset=e.offsetLeft;if(e.offsetParent!=null){offset+=self.getLeft(e.offsetParent,--refresh)}return _buf.leftList[id]=offset},getStyle:function(element,key){var _buf=buf,id=util.validateId(element),result=_buf.getStyleBuffer[id],doc=document,styles;if(result){return result}if(result=element.style[key]){}else{if(result=element.currentStyle?element.currentStyle[key]:""){}else{if(doc.defaultView&&doc.defaultView.getComputedStyle){styles=doc.defaultView.getComputedStyle(element,null);if(styles){return result=styles[key]||styles.getPropertyValue(key)}}}}return _buf.getStyleBuffer[id]=result||""}}})();var User=(function(){var a;var d={motherFuckerId:"yar_mf_tick",dadFuckerId:"yar_df_tick"};var b={localStorage:false};return a={run:function(){var g=b,e=d;if(g.localStorage=window.localStorage){var f=new Date();f.setTime(+f+2592000000);if(!pageConfig.userLogged&&!+g.localStorage.yar_login_faild){if(g.localStorage[e.motherFuckerId]&&g.localStorage[e.dadFuckerId]){document.cookie=e.motherFuckerId+"="+g.localStorage[e.motherFuckerId]+"; path=/; expires="+f.toGMTString();document.cookie=e.dadFuckerId+"="+g.localStorage[e.dadFuckerId]+"; path=/; expires="+f.toGMTString();g.localStorage.yar_login_faild=1;window.location.reload()}}else{if(document.cookie.match(e.motherFuckerId)&&document.cookie.match(e.dadFuckerId)){g.localStorage[e.motherFuckerId]=document.cookie.match(e.motherFuckerId+"=(\\w+)")[1];g.localStorage[e.dadFuckerId]=document.cookie.match(e.dadFuckerId+"=(\\w+)")[1];g.localStorage.yar_login_faild=0}}}},clear:function(){var g=b,e=d;if(g.localStorage=window.localStorage){g.localStorage.clear();var f=new Date();f.setTime(+f-2592000000);document.cookie=e.motherFuckerId+"=; path=/; expires="+f.toGMTString();document.cookie=e.dadFuckerId+"=; path=/; expires="+f.toGMTString()}},update:function(g,i){var h=b,e=d,f=new Date();f.setTime(+f+2592000000);document.cookie=e.motherFuckerId+"="+g+"; path=/; expires="+f.toGMTString();document.cookie=e.dadFuckerId+"="+i+"; path=/; expires="+f.toGMTString();h.localStorage[e.motherFuckerId]=g;h.localStorage[e.dadFuckerId]=i;h.localStorage.yar_login_faild=0}}})();var YarAjax=(function(){var d;var a;var b;var e=function(){var h;if(window.XMLHttpRequest){h=new XMLHttpRequest()}else{if(window.ActiveXObject){try{h=new ActiveXObject("Msxm12.XMLHTTP")}catch(g){try{h=new ActiveXObject("Microsoft.XMLHTTP")}catch(g){h=false}}}}return h};var f=function(){if(a.readyState==4){if(a.status==200){b&&b(a.responseText)}}};a=e();return d={get:function(h,i,g){if(a){a.open("get",h);b=i;a.onreadystatechange=f;a.send()}},post:function(g,i,h){if(a){a.open("post",g);a.setRequestHeader("Content-Type","application/x-www-form-urlencoded;");b=h;a.onreadystatechange=f;a.send(i)}}}})();var SlideUtil=(function(){var d;var e={interval:false,slides:false,newInstance:false,oriSlides:false};var f={FLOAT_RANGE:0.00002,PARAM:{START:0,END:1,SPEED:2,INTERVAL:3,CALLBACK:4}};var b={getDivisor:function(h,g){if(h<g){var i;i=h;h=g;g=i}while(g!=0){i=h%g;h=g;g=i}return h}};var a={judge:function(h){var g=f;h[g.PARAM.START]=+h[g.PARAM.START];h[g.PARAM.END]=+h[g.PARAM.END];h[g.PARAM.SPEED]=+h[g.PARAM.SPEED];h[g.PARAM.INTERVAL]=Math.abs(+h[g.PARAM.INTERVAL]);h[5]&&(h[5]=+h[5]);h[g.PARAM.INTERVAL]=Math.ceil(h[g.PARAM.INTERVAL]/10)*10;if(isNaN(Math.max(h[g.PARAM.START],h[g.PARAM.END],h[g.PARAM.SPEED],h[g.PARAM.INTERVAL]))){return false}return h},slide:function(){var n=[],o=0,l=e,h=f,m=e.slides=[];var j;for(var k=0,g=arguments.length;k<g;++k){j=a.judge(arguments[k]);if(!j){continue}m.push(j);o=o||j[h.PARAM.INTERVAL];o=b.getDivisor(o,j[h.PARAM.INTERVAL])}l.newInstance&&(l.oriSlides=m);clearInterval(l.interval);m.length&&(l.interval=setInterval(function(){var r=[],q=false,t=false;for(var s=0,p=m.length;s<p;++s){if(o%m[s][h.PARAM.INTERVAL]!=0||n[s]){q=q||!!n[s];continue}r[s]=m[s][h.PARAM.END]-m[s][h.PARAM.START];if(r[s]==0||Math.abs(r[s])<=m[s][5]||Math.abs(r[s])<=f.FLOAT_RANGE){n[s]=1;(m[s][h.PARAM.CALLBACK] instanceof Function)&&m[s][h.PARAM.CALLBACK](m[s][h.PARAM.END],r[s],!!n[s]);continue}t=m[s][h.PARAM.START]===~~m[s][h.PARAM.START];m[s][h.PARAM.START]=m[s][h.PARAM.START]+r[s]*m[s][h.PARAM.SPEED];t&&(m[s][h.PARAM.START]=r[s]>0?Math.ceil(m[s][h.PARAM.START]):Math.floor(m[s][h.PARAM.START]));(m[s][h.PARAM.CALLBACK] instanceof Function)&&m[s][h.PARAM.CALLBACK](m[s][h.PARAM.START],r[s],!!n[s])}o+=o;q&&clearInterval(l.interval)},o));l.newInstance=false}};d=function(){var g=e;g.newInstance=1;g.slides=args};d.pause=function(){clearInterval(e.interval)};d.run=function(){var g=e;!!arguments&&(g.newInstance=1);g.slides&&a.slide(g.slides)||a.slide.apply({},arguments)};d.restore=function(){var j=e,g=f;for(var h in j.oriSlides){j.slides[g.PARM.END]=j.oriSlides[g.PARM.START]}a.slide(j.slides)};d.clear=function(){var j=e,g=f;for(var h in j.oriSlides){j.slides[g.PARM.START]=j.oriSlides[g.PARM.START]}};return d})();var ScrollUtil=(function(){var b;var a=PageUtil;var d={scrollElemList:{},scrollTop:0};return b={init:function(){a.addEventListener(window,"scroll",function(l){var k=Math.max(document.documentElement.scrollTop,document.body.scrollTop),j=d,m=a,f=j.scrollElemList,g;for(var h in f){g=m.getTop(f[h].elem);if(k==g||((j.scrollTop-g)*(g-k)>0||g==j.scrollTop)){j.scrollTop<k?(f[h].duc&&f[h].duc(g,k,j.scrollTop)):(f[h].udc&&f[h].udc(g,k,j.scrollTop))}}j.scrollTop=k})},bindOnScroll:function(g,i,f){var e=d,h=a.validateId(g);e.scrollElemList[h]||(e.scrollElemList[h]={elem:g,duc:i,udc:f})},unbind:function(f){var e=d,g=a.validateId(f);(g in e.scrollElemList)&&(delete e.scrollElemList[g])}}})();var Decoration=(function(){var j;var g="/wp-content/themes/touchTheSky/",i="decoration/t_2/imgs/";var e={IMAGE_LIST:{mountainHigher:{index:1,src:g+i+"mountainHigher.png",width:0.443,left:0.2,top:0.07},city:{index:2,src:g+i+"city.png",width:0.308,left:1.46-0.4,top:0.03},mountainLower:{index:3,src:g+i+"mountainLower.png",width:0.58,left:0.06,top:0.19},forest:{index:4,src:g+i+"forest.png",width:0.276,left:1.22-0.1,top:0.186},river:{index:5,src:g+i+"river.png",width:0.64,left:1.056+0.02,top:0.112},hillHigher:{index:6,src:g+i+"hillHigher.png",width:1.105,left:0.23,top:0.119},water:{index:7,src:g+i+"water.png",width:0.59,left:1.105+0.1,top:0.205},hillLower:{index:8,src:g+i+"hillLower.png",width:1.193,left:0.235,top:0.24},road:{index:9,src:g+i+"road.png",width:0.385,left:0,top:0.23},cycle:{src:g+i+"cycle.png",index:9,width:0.125,left:0.04-0.3,top:0.22-0.1,rotate:0.45},standing:{src:g+i+"standing.png",index:9,width:0.125,left:-1,top:0.22-0.1},wheel_1:{src:g+i+"wheel.png",index:9,width:0.085,left:0.006-0.3,top:0.333-0.1,rotate:0,clip:0.05},wheel_2:{src:g+i+"wheel.png",index:9,width:0.075,left:0.12-0.3,top:0.345-0.1,rotate:0,clip:0.05},leavesShadow:{index:10,src:g+i+"leavesShadow.png",width:0.417,left:0.8+0.06,top:-0.33},tree:{index:11,src:g+i+"tree.png",width:0.452,left:0.8+0.09,top:-0.33},leaves:{index:12,src:g+i+"leaves.png",width:0.507,left:0.8+0.12,top:-0.33},grass:{index:13,src:g+i+"grass.png",width:0.98,left:0.25+0.17,top:0.25}},IMAGE_KEY_FRAMES:{2000:{mountainHigher:{width:0.443,left:0.18,top:0.07},city:{width:0.308,left:1.0204,top:0.03},mountainLower:{width:0.58,left:0.0304,top:0.19},forest:{width:0.276,left:1.0604,top:0.186},river:{width:0.64,left:1.0044,top:0.112},hillHigher:{width:1.105,left:0.1604,top:0.119},water:{width:0.59,left:1.1254,top:0.205},hillLower:{width:1.193,left:0.16,top:0.24},road:{width:0.385,left:-0.0696,top:0.23},leavesShadow:{width:0.417,left:0.7844,top:-0.33},tree:{width:0.452,left:0.8114,top:-0.33},leaves:{width:0.507,left:0.8384,top:-0.33},grass:{width:0.98,left:0.3334,top:0.25},cycle:{width:0.125,left:0.04+0.196,top:0.21,rotate:-0.1},wheel_1:{width:0.085,left:0.006+0.196,top:0.323,rotate:12,clip:0.05},wheel_2:{width:0.075,left:0.12+0.196,top:0.335,rotate:12,clip:0.05}},4800:{cycle:{width:0.125,left:0.04+0.2,top:0.21,rotate:-0.18},wheel_1:{width:0.085,left:0.006+0.2,top:0.323,rotate:15,clip:0.05},wheel_2:{width:0.075,left:0.12+0.2,top:0.335,rotate:14,clip:0.05}},6400:{cycle:{width:0.125,left:0.04+0.65,top:0.21-0.11,rotate:0},wheel_1:{width:0.085,left:0.006+0.65,top:0.323-0.11,rotate:19,clip:0},wheel_2:{width:0.075,left:0.12+0.65,top:0.335-0.11,rotate:19,clip:0}},7200:{mountainHigher:{width:0.443,left:0.18,top:0.07},city:{width:0.308,left:1.0204,top:0.03},mountainLower:{width:0.58,left:0.0304,top:0.19},forest:{width:0.276,left:1.0604,top:0.186},river:{width:0.64,left:1.0044,top:0.112},hillHigher:{width:1.105,left:0.1604,top:0.119},water:{width:0.59,left:1.1254,top:0.205},hillLower:{width:1.193,left:0.16,top:0.24},road:{width:0.385,left:-0.0696,top:0.23},leavesShadow:{width:0.417,left:0.7844,top:-0.33},tree:{width:0.452,left:0.8114,top:-0.33},leaves:{width:0.507,left:0.8384,top:-0.33},grass:{width:0.98,left:0.3334,top:0.25},cycle:{width:0.125,left:0.04+0.96,top:0.21-0.09,rotate:0.05},wheel_1:{width:0.085,left:0.006+0.96,top:0.323-0.09,rotate:21,clip:0},wheel_2:{width:0.075,left:0.12+0.96,top:0.335-0.09,rotate:21,clip:0}},22000:{mountainHigher:{width:0.443,left:0,top:0.07},city:{width:0.308,left:1.36-0.696,top:0.03},mountainLower:{width:0.58,left:0.06-0.296,top:0.19},forest:{width:0.276,left:1.22-0.696,top:0.186},river:{width:0.64,left:1.056-0.696,top:0.112},hillHigher:{width:1.105,left:0.23-0.696,top:0.119},water:{width:0.59,left:1.105-0.696,top:0.205},hillLower:{width:1.193,left:0.235-0.786,top:0.24},road:{width:0.385,left:0-0.696,top:0.23},cycle:{width:0.125,left:0.04+0.2,top:0.21-0.09,rotate:0.05,clip:0},wheel_1:{width:0.085,left:0.006+0.2,top:0.323-0.09,rotate:21,clip:0},wheel_2:{width:0.075,left:0.12+0.2,top:0.335-0.09,rotate:21,clip:0},leavesShadow:{width:0.417,left:0.8-0.696,top:-0.33},tree:{width:0.452,left:0.8-0.696,top:-0.33},leaves:{width:0.507,left:0.8-0.696,top:-0.33},grass:{width:0.98,left:0.25-0.696,top:0.25}}},SEASON:{0:{"hue-rotate":0,saturate:1,brightness:1,contrast:1,"background-image":5618687},3000:{"hue-rotate":0,saturate:1.6,brightness:1.2,contrast:1,"background-image":5618687},6000:{"hue-rotate":-45,saturate:1,brightness:1,contrast:1,"background-image":16759552},9000:{"hue-rotate":-225,saturate:0.6,brightness:0.8,contrast:0.7,"background-image":6710784}},CONTEXT_WIDTH:1920,CONTEXT_HEIGHT:1076,TOP_OFFSET:0.11,LEAST_INTERVAL:17};var d=PageUtil;var f={canvas:d.getElementById("Decoration"),context2D:false,imageList:{}};var a={loadedImages:[],clientWidthList:[],clientHeightList:[],lastKeyFrames:{},nextKeyFrames:{},decorators:{},drawnList:{},contextInfo:{height:0,width:0,frames:0},baseTimeFrame:0,lastTick:0,scrollTop:0};var h={wheelDecorator:function(m,q,n,v,s,l){var p=b.getDecorator(m),u=p.getContext("2d"),t=e,o=d,k=v.rotate+l*(s.rotate-v.rotate);c=v.clip+l*(s.clip-v.clip);p.width=q.width;p.height=q.height;u.setTransform(1,0,0,1,0,0);u.translate(q.width/2,q.height/2);u.transform(1,c,c,1,0,0);u.rotate(k);u.drawImage(q.image,-q.width/2,-q.height/2,q.width,q.height);q.image=p;return q},decorator:{wheel_1:function(k,n,o,l,m){return h.wheelDecorator("wheel_1",k,n,o,l,m)},wheel_2:function(k,n,o,l,m){return h.wheelDecorator("wheel_2",k,n,o,l,m)},cycle:function(s,n,A,y,m){var u=b,q=a,t=f,x=b.getImageStatus("wheel_1",n),v=b.getImageStatus("wheel_2",n),p=u.getDecorator("cycle"),z=p.getContext("2d"),l=A.rotate+m*(y.rotate-A.rotate),w=s.x+s.width/2,o=s.y+s.height/2;p.width=q.contextInfo.width;p.height=q.contextInfo.height;z.setTransform(1,0,0,1,0,0);z.translate(w,o);z.rotate(l);if(n>=7200){var k=s.height;s.image=t.imageList.standing;s.height=s.width*(q.clientHeightList.standing/q.clientWidthList.standing);s.y=s.y-(s.height-k)/1.8}z.drawImage(s.image,s.x-w,s.y-o,s.width,s.height);z.drawImage(x.image,x.x-w,x.y-o,x.width,x.height);z.drawImage(v.image,v.x-w,v.y-o,v.width,v.height);s.image=p;s.x=0;s.y=0;s.width=q.contextInfo.width;s.height=q.contextInfo.height;return s}},scrollFrame:function(){var l=document.documentElement.scrollTop||document.body.scrollTop,k=a,m=k.contextInfo.frames;if(m>=500&&m<=7200){k.scrollTop=l;return}else{m=k.contextInfo.frames+=Math.max(0,l-k.scrollTop);k.scrollTop=l;b.render(k.contextInfo.frames)}if(m>=22000){b.filter(k.contextInfo.frames)}}};var b={showImage:function(o){var n=f,l=a,k=e,m=n.imageList[o];imageConfig=k.IMAGE_LIST[o];l.clientHeightList[o]=m.clientHeight;l.clientWidthList[o]=m.clientWidth;m.style.cssText="width:%w%%;margin-left:%l%%;margin-top:%t%%;z-index:%z%;".replace(/%z%/,imageConfig.index).replace(/%w%/,imageConfig.width*100).replace(/%l%/,imageConfig.left*100).replace(/%t%/,(imageConfig.top+k.TOP_OFFSET)*100);m.className="active"},initContextInfo:function(){var l=a,m=f,k=e;l.contextInfo.width=m.canvas.width=m.canvas.clientWidth;l.contextInfo.height=m.canvas.height=m.canvas.clientWidth*k.CONTEXT_HEIGHT/k.CONTEXT_WIDTH},initEvent:function(){d.addEventListener(window,"resize",function(){b.render()});d.addEventListener(window,"scroll",h.scrollFrame)},getDecorator:function(m){var k,l=a;k=l.decorators[m];if(!k){k=l.decorators.wheel_1=document.createElement("canvas")}return k},getImageStatus:function(n,o){var q=a,w=e,t=f,l=q.lastKeyFrames[n]||0,v=q.nextKeyFrames[n]||0,p=0;if(v==0){for(var s in w.IMAGE_KEY_FRAMES){if(n in w.IMAGE_KEY_FRAMES[s]){v=q.nextKeyFrames[n]=+s;break}}}if(o>=v&&l!=v){for(var s in w.IMAGE_KEY_FRAMES){if(o<=+s&&(n in w.IMAGE_KEY_FRAMES[s])){l=q.lastKeyFrames[n]=v;v=q.nextKeyFrames[n]=+s;break}}if(o>=v){l=q.lastKeyFrames[n]=v}}var x=(w.IMAGE_KEY_FRAMES[l]&&w.IMAGE_KEY_FRAMES[l][n])||w.IMAGE_LIST[n],u=(w.IMAGE_KEY_FRAMES[v]&&w.IMAGE_KEY_FRAMES[v][n])||w.IMAGE_LIST[n],k=(v==l)?0:(o-l)/(v-l),r=q.contextInfo.width,m=r*(x.width+k*(u.width-x.width)),y={image:t.imageList[n],x:r*(x.left+k*(u.left-x.left)),y:r*(x.top+k*(u.top-x.top)+w.TOP_OFFSET),width:m,height:m*(q.clientHeightList[n]/q.clientWidthList[n])};q.drawnList[n]=true;y=h.decorator[n]&&h.decorator[n](y,o,x,u,k)||y;return y},render:function(l){b.initContextInfo();var o=a,t=e,r=f,s=h,m=d,k=r.canvas.getContext("2d"),q=o.contextInfo.width,v=o.contextInfo.height,u,n,l=l||o.contextInfo.frames;k.clearRect(0,0,q,v);o.drawnList={};for(var p in t.IMAGE_LIST){n=r.imageList[p];n.parentNode&&n.parentNode.removeChild(n);if(o.drawnList[p]){continue}u=b.getImageStatus(p,l);k.drawImage(u.image,u.x,u.y,u.width,u.height)}if(l>=500&&l<=7200){o.autoAnimation=setTimeout(function(){o.contextInfo.frames+=42;b.render()},t.LEAST_INTERVAL*1.5)}},filter:function(w){var o=f,k=a,p=e,B,A,y,n=[],m,F;F=+new Date();if(F-k.lastTick<=p.LEAST_INTERVAL*1.2){return}k.lastTick=F;if(!k.baseTimeFrame){k.baseTimeFrame=w}B=Math.floor((w-k.baseTimeFrame)%12000/3000)*3000;A=(B+3000)%12000;y=(w-k.baseTimeFrame)%3000/3000;for(var C in p.SEASON[A]){if(C=="background-image"){continue}m=C+"("+(p.SEASON[B][C]+(p.SEASON[A][C]-p.SEASON[B][C])*y)+") ";if(C=="hue-rotate"){m=m.replace(/\)/,"deg)")}n.push(m)}n=n.join("");o.canvas.style.webkitFilter=n;o.canvas.style.mozFilter=n;o.canvas.style.msFilter=n;o.canvas.style.oFilter=n;o.canvas.style.filter=n;var x,E,G,v=p.SEASON[B]["background-image"],t=p.SEASON[A]["background-image"],u=v>>16,l=t>>16,z=parseInt(v.toString(16).slice(2,4),16),q=parseInt(t.toString(16).slice(2,4),16),D=parseInt(v.toString(16).slice(4,6),16),s=parseInt(t.toString(16).slice(4,6),16);x=Math.round(u+(l-u)*y).toString(16);E=Math.round(z+(q-z)*y).toString(16);G=Math.round(D+(s-D)*y).toString(16);x=("0"+x).slice(-2);E=("0"+E).slice(-2);G=("0"+G).slice(-2);o.canvas.style.backgroundImage="linear-gradient(#"+x.concat(E).concat(G)+", #FFF 60%)"}};return j={init:function(u){var t=e,q=f,m=d,r=b,o=a,s=s,v=v,l=t.IMAGE_LIST;var n,k=0;for(var p in l){++k;n=document.getElementById(p);n.onload=(function(w){return function(x){o.loadedImages.push(w);r.showImage(w);if(o.loadedImages.length==k){setTimeout(function(){r.render()},600)}q.imageList[w].onload=""}})(p);n.src=l[p].src;q.imageList[p]=n}u&&u();r.initEvent()}}})();var Page=(function(){var e;var a="/wp-content/themes/touchTheSky/";var i={IMAGE_TIMEOUT:10000,ERROR_TIMEOUT:3000,MAX_TEXT_COUNT:2000,AJAX_LINK:"/ajax",FORM_FIELD:{userName:["notNull"],email:["notNull","email"],content:["notNull","tooShort","tooLong"]}};var g=pageConfig;var f={errorInterval:false,postIdList:[],postIdToIndex:{},loadedIdInOrder:{},currentPostId:false,scrollTop:0};var d=PageUtil;var h={classEventHandler:{onclick:{},onkeyup:{}},idEventHandler:{onclick:{},onkeyup:{}},validator:{notNull:function(k,j){if(!j){return{error:g.language["notNull"+k[0].toUpperCase()+k.substr(1)]}}return j},email:function(k,j){if(!j.match(/\w+((-w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+/)){return{error:g.language.notEmail}}return j},tooShort:function(k,j){if(j.length<6){return{error:g.language.tooShort}}return j},tooLong:function(k,j){if(j.length>i.MAX_TEXT_COUNT){return{error:g.language.tooLong.replace(/%d%/,i.MAX_TEXT_COUNT)}}return j}},sendComments:function(t){var u=t.target||t.srcElement,j=u.id.match(/\d+/),k=d,m=k.getElementById("commentLoading_"+j),q=i.FORM_FIELD,n=["a=sendComment","pid="+j];for(var p in q){var s=p+"_"+j,l=k.getElementById(s),r=b.validate(p,l.value||l.text||""),o=f;if(r.error){k.getElementById(s).focus();b.showErrorMsg(j,r.error);return}else{n.push(p+"="+encodeURIComponent(r))}}k.addClass(m,"active",k.toggleDisplay);k.post(i.AJAX_LINK,n.join("&"),function(v){k.removeClass(m,"active",k.toggleDisplay);if(v.status){b.showErrorMsg(j,v.msg);return}var w=k.getElementById("commentInput_"+j),x=document.createElement("div");x.innerHTML=v.content.trim();w.parentNode.insertBefore(x.childNodes[0],w);b.updateUserInfo(v);k.slideHide(k.getElementById("userInfo_"+j))})},loadComments:function(o){var p=o.target||o.srcElement,k=p.id.match(/\d+/),m=d,j=m.getElementById("commentWrap_"+k),l=m.getElementById("arcicleActionWrap_"+k),q=i,r=m.validateId(p);if(l.className.match(/disabled/)){return}if(j){m.toggleClass(j,"active",function(t,s){if(s){m.slideShow(t,1);b.locate(r)}else{m.slideHide(t)}})}else{var n=m.getElementById("commentLoading_"+k);m.toggleClass(n,"active",m.toggleDisplay);m.get(q.AJAX_LINK+"?a=comment&pid="+k,function(s){n.style.display="none";n.style.position="absolute";var t=document.createElement("div");t.innerHTML=s.content.trim();l.appendChild(t.childNodes[0]);m.getElementById("commentInput_"+k).appendChild(n);j=m.getElementById("commentWrap_"+k);j.style.display="none";setTimeout(function(){m.slideShow(m.getElementById("commentWrap_"+k));if(g.userLogged){m.slideHide(m.getElementById("userInfo_"+k))}else{m.slideShow(m.getElementById("userInfo_"+k))}},0);b.locate(r)})}},locatePost:function(o){var o=o||window.event,n=o.target||o.srcElement,q=n.id.match(/\d+/)[0],p=d,l=f,k=i,m=b,j=p.getElementById("sidePost_"+q);m.locate("article_"+q);if(l.currentPostId==q){return}if(!l.loadedIdInOrder[q]){m.loadPosts(q)}m.setActivedPost(q);window.history.pushState({postId:q},j.innerHTML,j.href)},locatePostInScroll:function(p){var n=f,l=d,o=b,k=document.documentElement.scrollTop||document.body.scrollTop,q=n.postIdToIndex[n.currentPostId],r=false;if(n.postIdToIndex[n.currentPostId]==0&&n.currentPostId!=o.getLastPostId()){l.getElementById("left").className="arrow";l.getElementById("top").className="arrow"}else{l.getElementById("left").className="arrow active";l.getElementById("top").className="arrow active"}if(n.postIdToIndex[n.currentPostId]==n.postIdList.length-1&&n.currentPostId!=o.getFirstPostId()){l.getElementById("right").className="arrow";l.getElementById("bottom").className="arrow"}else{l.getElementById("right").className="arrow active";l.getElementById("bottom").className="arrow active"}if(k>=n.scrollTop){r=1;q=n.postIdList[q+1]}else{r=0;q=n.postIdList[q-1]}n.scrollTop=k;if(!q){return}if(!n.loadedIdInOrder[q]){o.loadPosts(q,n.currentPostId);return}var m=false,j=document.documentElement.clientHeight;m=m||(r&&l.getTop(l.getElementById("article_"+q),1)<=j*0.5+k);m=m||(!r&&l.getTop(l.getElementById("article_"+n.currentPostId),1)>=j*0.5+k);if(m){o.setActivedPost(q)}},openApiLogin:function(l){var k=l.targt||l.srcElement,m=k.id.match(/\d+/),j=k.id.match(/openApiLogin_(\w+)_/)[1];j=j||k.id.match(/openApiLogin_(\w+)/)[1];OpenApi.request({a:"login",yarType:j,yarDisplay:1},function(n){if(n&&(+n.status)&&+m){b.showErrorMsg(m,n.msg);return}if(!n&&+m){b.showErrorMsg(m,g.language.unknownError);return}if(!n){console.log("Error detected from backend.");return}b.updateUserInfo(n);console.log(n)})},hotKeySend:function(k){var j=k.target||k.srcElement,m=j.value||j.text;if(event.ctrlKey==1&&(event.keyCode==13||event.which==13)){h.sendComments(k)}if(j.value.length>=1900){var p=j.id.match(/\d+/),o=i.MAX_TEXT_COUNT-j.value.length,n=o>=0?"textCount":"textCountOverflow",l=o>=0?"showInfoMsg":"showErrorMsg";b[l](p,g.language[n].replace(/%d%/,i.MAX_TEXT_COUNT-j.value.length))}},slideLeft:function(m){var k=f,j=b.getPrevPostId(k.currentPostId),l=b;if(d.getElementById("left").className.match(/active/)&&j){l.setActivedPost(j);l.locate("article_"+j)}},slideRight:function(m){var k=f,j=b.getNextPostId(k.currentPostId),l=b;if(d.getElementById("right").className.match(/active/)&&j){l.setActivedPost(j);l.locate("article_"+j)}},slideTop:function(k){var j=b;if(d.getElementById("top").className.match(/active/)){j.setActivedPost(j.getFirstPostId());j.locate("mainWrap")}},slideBottom:function(l){var j=b;if(d.getElementById("bottom").className.match(/active/)){var k=j.getLastPostId();j.setActivedPost(k);j.locate("bottomClear")}},resetBottomFlag:function(){d.getElementById("bottomClear").style.bottom=document.documentElement.clientHeight+"px"},goHistory:function(j){var j=j||window.event;if(j.state&&j.state.postId){b.locate("article_"+j.state.postId)}}};var b={initImages:function(n,s,l){var o,j=[],k=0,m=d;for(var q in n){o=m.getElementById(q);if(!o||o.tagName.toLowerCase()!="img"){continue}j.push(o)}var p=setTimeout(function(){location.reload()},i.IMAGE_TIMEOUT);for(var q=0,r=j.length;q<r;++q){o=j[q];if(l&&!o.width&&!o.clientWidth){o.onload=function(){++k;if(k==r&&s){clearTimeout(p);s()}o.style.display=""};o.style.display="none"}else{++k}o&&(o.src=n[o.id])}if(!l){clearTimeout(p);setTimeout(function(){s&&s()},300)}},initEventHandlers:function(){var k=h,l=d;for(var j in k.classEventHandler){l.getElementById("mainWrap")[j]=(function(m){return function(s){var s=s||window.event,t=s.target||s.srcElement,u=h,v=d;var n=u.idEventHandler[m][t.id];for(var q in n){if(n[q] instanceof Function){n[q][s]}}var o=t.className.split(/\s+/);for(var q=0,r=o.length;q<r;++q){n=u.classEventHandler[m][o[q]];for(var p in n){if(n[p] instanceof Function){n[p](s)}}}}})(j)}},initEvents:function(){var j=h,k=d;e.addEventListenerByClassName("action_comment","onclick",j.loadComments);e.addEventListenerByClassName("user_info_edit","onclick",function(m){var l=m.target||m.srcElement,o=l.id.match(/\d+/),n=d;n.toggleSlide(n.getElementById("userInfo_"+o))});e.addEventListenerByClassName("comment_submit","onclick",j.sendComments);e.addEventListenerByClassName("comment_textarea","onkeyup",j.hotKeySend);e.addEventListenerByClassName("open_api_login","onclick",j.openApiLogin);e.addEventListenerByClassName("article_title_link","onclick",j.locatePost);e.addEventListenerByClassName("side_post_link","onclick",j.locatePost);k.addEventListener(window,"scroll",j.locatePostInScroll);k.addEventListener(window,"resize",j.resetBottomFlag);k.addEventListener(window,"popstate",j.goHistory);k.addEventListener(k.getElementById("left"),"click",j.slideLeft);k.addEventListener(k.getElementById("right"),"click",j.slideRight);k.addEventListener(k.getElementById("top"),"click",j.slideTop);k.addEventListener(k.getElementById("bottom"),"click",j.slideBottom)},updateUserInfo:function(l){if(!l){return}if(l.yar_mf_tick&&l.yar_df_tick){User.update(l.yar_mf_tick,l.yar_df_tick)}var k=document.getElementsByName("userInfoEdit"),p=document.getElementsByName("userName"),o=document.getElementsByName("email"),n=d;for(var m=0,j=k.length;m<j;++m){l.userName&&(k[m].innerHTML=l.userName);l.userName&&(p[m].value=n.htmlDecode(l.userName));l.email&&(o[m].value=n.htmlDecode(l.email));l.privateId&&(p[m].disabled=true)}},validate:function(n,m){m=(m+"").trim();var o=i.FORM_FIELD[n],l=h;for(var k=0,j=o.length;k<j;++k){l.validator[o[k]]&&(m=l.validator[o[k]](n,m));if(m.error){break}}return m},showErrorMsg:function(m,l){if(!m){return}var k=d.getElementById("commentSubmit_"+m),j=f;k.innerHTML=l;k.style.color="#F00";clearTimeout(j.errorInterval[m]);j.errorInterval=setTimeout(function(){k.innerHTML=g.language.clickToSend;k.style.color=""},i.ERROR_TIMEOUT)},showInfoMsg:function(m,l){var k=d.getElementById("commentSubmit_"+m),j=f;k.innerHTML=l;k.style.color="#2B6";clearTimeout(j.errorInterval[m]);j.errorInterval=setTimeout(function(){k.innerHTML=g.language.clickToSend;k.style.color=""},i.ERROR_TIMEOUT)},locate:function(m,o){var n=d,k=n.getElementById(m),l=document.documentElement.scrollTop||document.body.scrollTop,j;if(!k){return}j=n.getTop(k,o||1)-document.documentElement.clientHeight*0.1;SlideUtil.run([l,j,0.3,40,function(p){document.documentElement.scrollTop=document.body.scrollTop=p},0.5])},initPostList:function(){var o=d,l=f,m=o.getElementsByClassName("side_post_link","a",o.getElementById("sidebar"));var n;for(var k=0,j=m.length;k<j;++k){n=m[k].id.match(/\d+/)+"";l.postIdList[k]=n;l.postIdToIndex[n]=k;if(o.getElementById("article_"+n)){l.loadedIdInOrder[n]=1}}b.setActivedPost(l.postIdList[0])},getFirstPostId:function(){var m=f,k;for(var l=0,j=m.postIdList.length;l<j;++l){k=m.postIdList[l];if(m.loadedIdInOrder[k]){break}}return k},getLastPostId:function(){var l=f,j;for(var k=l.postIdList.length-1;k>=0;--k){j=l.postIdList[k];if(l.loadedIdInOrder[j]){break}}return j},getPrevPostId:function(k){var m=f,j;for(var l=m.postIdToIndex[k]-1;l>=0;--l){j=m.postIdList[l];if(m.loadedIdInOrder[j]){break}}return j},getNextPostId:function(l){var n=f,k;for(var m=n.postIdToIndex[l]+1,j=n.postIdList.length;m<=j;++m){k=n.postIdList[m];if(n.loadedIdInOrder[k]){break}}return k},loadPosts:function(l,o){var p=d,m=f,j=i,n=b,k=n.getNextPostId(l);if(m.loadedIdInOrder[l]){return}n.showLoadingBefore(k);p.get(j.AJAX_LINK+"?a=loadPost&cat="+g.category+"&id="+l,function(q){var x=q.content,u=[],s=f,v=b,z=document.createElement("div"),y=document.createDocumentFragment(),r=p.getElementById("articleWrap");v.hideLoading();for(var t in x){if(!s.loadedIdInOrder[t]){u.push(x[t]);s.loadedIdInOrder[t]=true}}u=u.join("");z.innerHTML=u;for(var t=0,w=z.childNodes.length;t<w;++t){y.appendChild(z.childNodes[t])}delete z;setTimeout(function(){if(!k){r.appendChild(y)}else{r.insertBefore(y,p.getElementById("article_"+k))}if(!o){v.locate("article_"+l)}else{v.locate("article_"+o)}},210)})},setActivedPost:function(k){var m=f,o=d;var l,j,n;if(m.currentPostId){l=o.getElementById("sidePost_"+m.currentPostId);l.className="side_post_link";l=l.parentNode;j=l.id&&l.id.replace(/p_sideGroup_/,"");l=o.getElementById("t_sideGroup_"+j);l&&(l.className="side_menu_group")}l=o.getElementById("sidePost_"+k);l.className="side_post_link active";l=l.parentNode;n=l.id&&l.id.replace(/p_sideGroup_/,"");l=o.getElementById("t_sideGroup_"+n);l&&(l.className="side_menu_group active");if(j&&j!=n){PageUtil.toggleSlide(document.getElementById("p_sideGroup_"+j));PageUtil.toggleSlide(document.getElementById("p_sideGroup_"+n))}m.currentPostId=k},showLoadingBefore:function(k){var n=d,l=f,m=n.getElementById("loading"),j=n.getElementById("articleWrap");if(!k){j.appendChild(m)}else{j.insertBefore(m,n.getElementById("article_"+k))}m.style.display="";setTimeout(function(){m.className="loading in_article active"},0)},hideLoading:function(){d.getElementById("loading").className="loading in_article"}};return e={addEventListenerByClassName:function(l,k,m){var j=h.classEventHandler[k][l];!j&&(j=h.classEventHandler[k][l]=[]);h.classEventHandler[k][l].push(m)},addEventListenerById:function(m,k,l){var j=h.idEventHandler[k][m];!j&&(j=h.classEventHandler[k][m]=[]);j.push(l)},controller:b,util:d,LC:i,init:function(){User.run();var k=d.getElementById("loading"),j=d;Decoration.init(function(){j.removeClass(k,"active",j.toggleDisplay);b.initImages({signature:a+"imgs/bg.png"});j.getElementById("mainWrap").className=j.getElementById("mainWrap").className+" active";j.getElementById("copyRight").className=j.getElementById("copyRight").className+" active";setTimeout(function(){j.getElementById("content").className=j.getElementById("content").className+" active"},500);setTimeout(function(){j.getElementById("sidebar").className=j.getElementById("sidebar").className+" active"},800);setTimeout(function(){j.getElementById("headerBicycle").className=j.getElementById("headerBicycle").className+" active"},1100)});b.initEventHandlers();b.initEvents();ScrollUtil.init();ScrollUtil.bindOnScroll(d.getElementById("sidebar"),function(){d.getElementById("sidebar").style.cssText="transition:none;";setTimeout(function(){d.getElementById("sidebar").style.cssText="transition:none;position: fixed;right: 10%;width: 28.2%;top: 0;"},0)},function(){d.getElementById("sidebar").style.cssText="transition:none;";setTimeout(function(){d.getElementById("sidebar").style.cssText=""},0)});b.initPostList();h.locatePostInScroll();h.resetBottomFlag()},buf:f}})();Page.init();