var Decoration = (function(){
    
    var self;
    
    var tmpRoot = "/wp-content/themes/touch the sky/",
        decorateRoot = "decoration/t_2/imgs/";
    
    var LC = {
        IMAGE_LIST : {
            // image configurations with starting status
            mountainHigher  : {
                index : 1,
				src : tmpRoot + decorateRoot + "mountainHigher.png",
                width : 0.443,
                left : 0.2,
                top : 0.07
            },
            city            : {
                index : 2,
				src : tmpRoot + decorateRoot + "city.png",
                width : 0.308,
                left : 1.46 - 0.4,
                top : 0.03
            },
            mountainLower   : {
                index : 3,
				src : tmpRoot + decorateRoot + "mountainLower.png",
                width : 0.58,
                left : 0.06,
                top : 0.19
            },
            forest          : {
                index : 4,
				src : tmpRoot + decorateRoot + "forest.png",
                width : 0.276,
                left : 1.22 - 0.1,
                top : 0.186
            },
            river           : {
                index : 5,
				src : tmpRoot + decorateRoot + "river.png",
                width : 0.64,
                left : 1.056 + 0.02,
                top : 0.112
            },
            hillHigher      : {
                index : 6,
				src : tmpRoot + decorateRoot + "hillHigher.png",
                width : 1.105,
                left : 0.23,
                top : 0.119
            },
            water           : {
                index : 7,
				src : tmpRoot + decorateRoot + "water.png",
                width : 0.59,
                left : 1.105 + 0.1,
                top : 0.205
            },
            hillLower       : {
                index : 8,
				src : tmpRoot + decorateRoot + "hillLower.png",
                width : 1.193,
                left : 0.235,
                top : 0.24
            },
            road            : {
                index : 9,
				src : tmpRoot + decorateRoot + "road.png",
                width : 0.385,
                left : 0,
                top : 0.23
            },
            
            // the bicycle here.
            cycle : {
                src : tmpRoot + decorateRoot + "cycle.png",
                index : 9,
                width : 0.125,
                left : 0.04 - 0.3,
                top : 0.22 - 0.1,
                rotate : 0.45
            }, 
            // unvisible, all the same as the cycle
            standing : {
                src : tmpRoot + decorateRoot + "standing.png",
                index : 9,
                width : 0.125,
                left : -1,
                top : 0.22 - 0.1
            }, 
            wheel_1 : {
                src : tmpRoot + decorateRoot + "wheel.png",
                index : 9,
                width : 0.085,
                left : 0.006 - 0.3,
                top : 0.333 - 0.1,
                rotate : 0,
                clip : 0.05
            }, 
            wheel_2 : {
                src : tmpRoot + decorateRoot + "wheel.png",
                index : 9,
                width : 0.075,
                left : 0.12 - 0.3,
                top : 0.345 - 0.1,
                rotate : 0,
                clip : 0.05
            }, 
            
            leavesShadow    : {
                index : 10,
				src : tmpRoot + decorateRoot + "leavesShadow.png",
                width : 0.417,
                left : 0.8 + 0.06,
                top : -0.33
            },
            tree            : {
                index : 11,
				src : tmpRoot + decorateRoot + "tree.png",
                width : 0.452,
                left : 0.8 + 0.09,
                top : -0.33
            },
            leaves          : {
                index : 12,
				src : tmpRoot + decorateRoot + "leaves.png",
                width : 0.507,
                left : 0.8 + 0.12,
                top : -0.33
            },
            grass           : {
                index : 13,
				src : tmpRoot + decorateRoot + "grass.png",
                width : 0.98,
                left : 0.25 + 0.17,
                top : 0.25
            }
        },
        
        IMAGE_KEY_FRAMES : {
            
            2000: {
                mountainHigher: {
                    width: 0.443,
                    left: 0.18,
                    top : 0.07
                },
                city: {
                    width: 0.308,
                    left: 1.0204,
                    top : 0.03
                },
                mountainLower: {
                    width: 0.58,
                    left: 0.0304,
                    top : 0.19
                },
                forest: {
                    width: 0.276,
                    left: 1.0604,
                    top : 0.186
                },
                river: {
                    width: 0.64,
                    left: 1.0044,
                    top : 0.112
                },
                hillHigher: {
                    width: 1.105,
                    left: 0.1604,
                    top : 0.119
                },
                water: {
                    width: 0.59,
                    left: 1.1254,
                    top : 0.205
                },
                hillLower: {
                    width : 1.193,
                    left: 0.16,
                    top : 0.24
                },
                road: {
                    width: 0.385,
                    left: -0.0696,
                    top : 0.23
                },
                leavesShadow: {
                    width: 0.417,
                    left: 0.7844,
                    top : -0.33
                },
                tree: {
                    width: 0.452,
                    left: 0.8114,
                    top : -0.33
                },
                leaves: {
                    width: 0.507,
                    left: 0.8384,
                    top : -0.33
                },
                grass: {
                    width: 0.98,
                    left: 0.3334,
                    top : 0.25
                },
                
                cycle : {
                    width : 0.125,
                    left : 0.04 + 0.196,
                    top : 0.21,
                    rotate : -0.1
                }, 
                wheel_1 : {
                    width : 0.085,
                    left : 0.006 + 0.196,
                    top : 0.323,
                    rotate : 12,
                    clip : 0.05
                }, 
                wheel_2 : {
                    width : 0.075,
                    left : 0.12 + 0.196,
                    top : 0.335,
                    rotate : 12,
                    clip : 0.05
                }
            },
            4800: {
                cycle : {
                    width : 0.125,
                    left : 0.04 + 0.2,
                    top : 0.21,
                    rotate : -0.18
                }, 
                wheel_1 : {
                    width : 0.085,
                    left : 0.006 + 0.2,
                    top : 0.323,
                    rotate : 15,
                    clip : 0.05
                }, 
                wheel_2 : {
                    width : 0.075,
                    left : 0.12 + 0.2,
                    top : 0.335,
                    rotate : 14,
                    clip : 0.05
                }
            },
            6400: {
                cycle : {
                    width : 0.125,
                    left : 0.04 + 0.65,
                    top : 0.21 - 0.11,
                    rotate : 0
                }, 
                wheel_1 : {
                    width : 0.085,
                    left : 0.006 + 0.65,
                    top : 0.323 - 0.11,
                    rotate : 19,
                    clip : 0
                }, 
                wheel_2 : {
                    width : 0.075,
                    left : 0.12 + 0.65,
                    top : 0.335 - 0.11,
                    rotate : 19,
                    clip : 0
                }
            },
            7200: {
                mountainHigher: {
                    width: 0.443,
                    left: 0.18,
                    top : 0.07
                },
                city: {
                    width: 0.308,
                    left: 1.0204,
                    top : 0.03
                },
                mountainLower: {
                    width: 0.58,
                    left: 0.0304,
                    top : 0.19
                },
                forest: {
                    width: 0.276,
                    left: 1.0604,
                    top : 0.186
                },
                river: {
                    width: 0.64,
                    left: 1.0044,
                    top : 0.112
                },
                hillHigher: {
                    width: 1.105,
                    left: 0.1604,
                    top : 0.119
                },
                water: {
                    width: 0.59,
                    left: 1.1254,
                    top : 0.205
                },
                hillLower: {
                    width : 1.193,
                    left: 0.16,
                    top : 0.24
                },
                road: {
                    width: 0.385,
                    left: -0.0696,
                    top : 0.23
                },
                leavesShadow: {
                    width: 0.417,
                    left: 0.7844,
                    top : -0.33
                },
                tree: {
                    width: 0.452,
                    left: 0.8114,
                    top : -0.33
                },
                leaves: {
                    width: 0.507,
                    left: 0.8384,
                    top : -0.33
                },
                grass: {
                    width: 0.98,
                    left: 0.3334,
                    top : 0.25
                },
                
                cycle : {
                    width : 0.125,
                    left : 0.04 + 0.96,
                    top : 0.21 - 0.09,
                    rotate : 0.05
                }, 
                wheel_1 : {
                    width : 0.085,
                    left : 0.006 + 0.96,
                    top : 0.323 - 0.09,
                    rotate : 21,
                    clip : 0
                }, 
                wheel_2 : {
                    width : 0.075,
                    left : 0.12 + 0.96,
                    top : 0.335 - 0.09,
                    rotate : 21,
                    clip : 0
                }
            },
            
            22000 : {
                mountainHigher  : {
                    width : 0.443,
                    left : 0,
                    top : 0.07
                },
                city            : {
                    width : 0.308,
                    left : 1.36  - 0.696,
                    top : 0.03
                },
                mountainLower   : {
                    width : 0.58,
                    left : 0.06  - 0.296,
                    top : 0.19
                },
                forest          : {
                    width : 0.276,
                    left : 1.22  - 0.696,
                    top : 0.186
                },
                river           : {
                    width : 0.64,
                    left : 1.056  - 0.696,
                    top : 0.112
                },
                hillHigher      : {
                    width : 1.105,
                    left : 0.23  - 0.696,
                    top : 0.119
                },
                water           : {
                    width : 0.59,
                    left : 1.105  - 0.696,
                    top : 0.205
                },
                hillLower       : {
                    width : 1.193,
                    left : 0.235  - 0.786,
                    top : 0.24
                },
                road            : {
                    width : 0.385,
                    left : 0  - 0.696,
                    top : 0.23
                },                
                
                cycle : {
                    width : 0.125,
                    left : 0.04+ 0.2,
                    top : 0.21 - 0.09,
                    rotate : 0.05,
                    clip : 0
                }, 
                wheel_1 : {
                    width : 0.085,
                    left : 0.006+ 0.2,
                    top : 0.323 - 0.09,
                    rotate : 21,
                    clip : 0
                }, 
                wheel_2 : {
                    width : 0.075,
                    left : 0.12+ 0.2,
                    top : 0.335 - 0.09,
                    rotate : 21,
                    clip : 0
                },              
                
                leavesShadow    : {
                    width : 0.417,
                    left : 0.8  - 0.696,
                    top : -0.33
                },
                tree            : {
                    width : 0.452,
                    left : 0.8  - 0.696,
                    top : -0.33
                },
                leaves          : {
                    width : 0.507,
                    left : 0.8  - 0.696,
                    top : -0.33
                },
                grass           : {
                    width : 0.98,
                    left : 0.25  - 0.696,
                    top : 0.25
                }
            }
        },
        
        SEASON : {
            0 : {
                "hue-rotate" : 0,
                saturate : 1,
                brightness : 1,
                contrast : 1,
                "background-image"  : 0x55BBFF
            },
            3000 : {
                "hue-rotate" : 0,
                saturate : 1.6,
                brightness : 1.2,
                contrast : 1,
                "background-image"  : 0x55BBFF
            },
            6000 : {
                "hue-rotate" : -45,
                saturate : 1,
                brightness : 1,
                contrast : 1,
                "background-image"  : 0xFFBB00
            },
            9000 : {
                "hue-rotate" : -225,
                saturate : 0.6,
                brightness : 0.8,
                contrast : 0.7,
                "background-image" : 0x666600
            }
        },
        
        CONTEXT_WIDTH : 1920,
        CONTEXT_HEIGHT : 1076,
        TOP_OFFSET : 0.11,
        LEAST_INTERVAL : 17
    };
    
    var util = PageUtil;
    
    var view = {
        canvas : util.getElementById("Decoration"),
        context2D : false,
        imageList : {}
    };
    
    var buf = {
        loadedImages : [],
        
        clientWidthList : [],
        clientHeightList : [],
        
        lastKeyFrames : {},
        nextKeyFrames : {},
            
        decorators : {},
        
        // record images that's already on canvas.
        drawnList : {},
        
        //should be updated once the window resized.
        contextInfo : {
            height : 0,
            width : 0,
            // currentFrame. Increases when the animations triggered.
            frames : 0
        },
        
        baseTimeFrame : 0,
        
        scrollTop : 0
    };
    
    var handlerList = {
        
        // common decorator for two wheels.
        wheelDecorator : function(id, status, frame, lastConfig, nextConfig, frameRange) {
                
            var decorator = controller.getDecorator(id),
                dContext = decorator.getContext("2d"),
                _lc = LC,
                _util = util,
                r = lastConfig.rotate + frameRange * (nextConfig.rotate - lastConfig.rotate);
                c = lastConfig.clip + frameRange * (nextConfig.clip - lastConfig.clip);
            
            decorator.width = status.width;
            decorator.height = status.height;
            
            // reset the transform
            dContext.setTransform(1, 0, 0, 1, 0, 0);
            // transform first, then rotate
            dContext.translate(status.width/2, status.height/2);
            dContext.transform(1, c, c, 1, 0, 0);

            dContext.rotate(r);
            dContext.drawImage(status.image, -status.width/2, -status.height/2, status.width, status.height);
            
            status.image = decorator;
            return status;
        },
        
        decorator : {
            wheel_1 : function(status, frame, lastConfig, nextConfig, frameRange) {
                return handlerList.wheelDecorator("wheel_1", status, frame, lastConfig, nextConfig, frameRange);
            },
            wheel_2 : function(status, frame, lastConfig, nextConfig, frameRange) {
                return handlerList.wheelDecorator("wheel_2", status, frame, lastConfig, nextConfig, frameRange);
            },
            cycle : function(status, frame, lastConfig, nextConfig, frameRange) {
                var _cl = controller,
                    _buf = buf,
                    _view = view,
                    wheel_1 = controller.getImageStatus("wheel_1", frame),
                    wheel_2 = controller.getImageStatus("wheel_2", frame),
                    decorator = _cl.getDecorator("cycle"),
                    dContext = decorator.getContext("2d"),
                    r = lastConfig.rotate + frameRange * (nextConfig.rotate - lastConfig.rotate),
                    xOffset = status.x + status.width / 2,
                    yOffset = status.y + status.height / 2;
                
                decorator.width = _buf.contextInfo.width;
                decorator.height = _buf.contextInfo.height;
                
                dContext.setTransform(1,0,0,1,0,0);
                dContext.translate(xOffset, yOffset);
                dContext.rotate(r);
                
                // change the standing image
                if (frame >= 7200) {
                    var heightOffset = status.height;
                    status.image = _view.imageList["standing"];
                    status.height = status.width * (_buf.clientHeightList["standing"] / _buf.clientWidthList["standing"]);
                    status.y = status.y - (status.height - heightOffset) / 1.8;
                }
                
                dContext.drawImage(status.image, status.x - xOffset, status.y - yOffset, status.width, status.height);
                dContext.drawImage(wheel_1.image, wheel_1.x - xOffset, wheel_1.y - yOffset, wheel_1.width, wheel_1.height);
                dContext.drawImage(wheel_2.image, wheel_2.x - xOffset, wheel_2.y - yOffset, wheel_2.width, wheel_2.height);
                
                status.image = decorator;
                status.x = 0;
                status.y = 0;
                status.width = _buf.contextInfo.width;
                status.height = _buf.contextInfo.height;
                
                return status;
            }
        },
        
        scrollFrame : function() {
                
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop,
                _buf = buf,
                frame = _buf.contextInfo.frames;
            
            if (frame >= 500 && frame <= 7200) {
                _buf.scrollTop = scrollTop;
                return;
            } else {
                frame = _buf.contextInfo.frames += Math.max(0, scrollTop - _buf.scrollTop);
                _buf.scrollTop = scrollTop;
                controller.render(_buf.contextInfo.frames);
            }
            
            // show filters
            if (frame >= 22000) {
                controller.filter(_buf.contextInfo.frames);
            }
        }
    };
    
    var controller = {
        showImage : function(id) {
            var _view = view,
                _buf = buf,
                _lc = LC,
                image = _view.imageList[id];
                imageConfig = _lc.IMAGE_LIST[id];
            
            _buf.clientHeightList[id] = image.clientHeight;
            _buf.clientWidthList[id] = image.clientWidth;
            
            image.style.cssText = "width:%w%%;margin-left:%l%%;margin-top:%t%%;z-index:%z%;"
                .replace(/%z%/, imageConfig.index)
                .replace(/%w%/, imageConfig.width * 100)
                .replace(/%l%/, imageConfig.left * 100)
                .replace(/%t%/, (imageConfig.top + _lc.TOP_OFFSET) * 100);
            
            image.className = "active";
        },
        
        initContextInfo : function() {
            
            var _buf = buf,
                _view = view,
                _lc = LC;
            
            // init canvas information.
            _buf.contextInfo.width = _view.canvas.width = _view.canvas.clientWidth;
            _buf.contextInfo.height = _view.canvas.height = _view.canvas.clientWidth * _lc.CONTEXT_HEIGHT / _lc.CONTEXT_WIDTH;
        },
        
        initEvent : function() {
            
            util.addEventListener(window, "resize", function() {
                controller.render();
            });
            
            util.addEventListener(window, "scroll", handlerList.scrollFrame);
        },
        
        getDecorator : function(id) {
            
            var decorator,
                _buf = buf;
            
            decorator = _buf.decorators[id];
            if (!decorator) {
                decorator = _buf.decorators["wheel_1"] = document.createElement("canvas");
            }
                
            return decorator;
        },
        
        // get image status via given frame and image id.
        // cauculated from keyframes configurations.
        getImageStatus : function(id, frame) {
            
            var _buf = buf,
                _lc = LC,
                _view = view,
                lastKeyFrame = _buf.lastKeyFrames[id] || 0,
                nextKeyFrame = _buf.nextKeyFrames[id] || 0,
                frameCount = 0;
            
            if (nextKeyFrame == 0) {
                for (var i in _lc.IMAGE_KEY_FRAMES) {
                    if (id in _lc.IMAGE_KEY_FRAMES[i]) {
                        nextKeyFrame = _buf.nextKeyFrames[id] = +i;
                        break;
                    }
                }
            }
            
            // try to update the nexe key frame.
            if (frame >= nextKeyFrame && lastKeyFrame != nextKeyFrame) {
                for (var i in _lc.IMAGE_KEY_FRAMES) {
                    if (frame <= +i && (id in _lc.IMAGE_KEY_FRAMES[i])) {
                        lastKeyFrame = _buf.lastKeyFrames[id] = nextKeyFrame;
                        nextKeyFrame = _buf.nextKeyFrames[id] = +i;
                        break;
                    }
                }
                // no next keyframe found
                if (frame >= nextKeyFrame) {
                    lastKeyFrame = _buf.lastKeyFrames[id] = nextKeyFrame;
                }
            }
            
            var lastConfig = (_lc.IMAGE_KEY_FRAMES[lastKeyFrame] && _lc.IMAGE_KEY_FRAMES[lastKeyFrame][id]) || _lc.IMAGE_LIST[id],
                nextConfig = (_lc.IMAGE_KEY_FRAMES[nextKeyFrame] && _lc.IMAGE_KEY_FRAMES[nextKeyFrame][id]) || _lc.IMAGE_LIST[id],
                frameRange = (nextKeyFrame == lastKeyFrame) ? 0 : (frame - lastKeyFrame) / (nextKeyFrame - lastKeyFrame),
                contextWidth = _buf.contextInfo.width,
                width = contextWidth * (lastConfig.width + frameRange * (nextConfig.width - lastConfig.width)),
                result = {
                    image : _view.imageList[id],
                    x : contextWidth * (lastConfig.left + frameRange * (nextConfig.left - lastConfig.left)),
                    y : contextWidth * (lastConfig.top + frameRange * (nextConfig.top - lastConfig.top) + _lc.TOP_OFFSET),
                    width : width,
                    height : width * (_buf.clientHeightList[id] / _buf.clientWidthList[id])
                };
            
            _buf.drawnList[id] = true;
            
            result = handlerList.decorator[id] && handlerList.decorator[id](result, frame, lastConfig, nextConfig, frameRange) || result;
            
            return result;
        },
        
        render : function(frame) {
            
            controller.initContextInfo();
            
            var _buf = buf,
                _lc = LC,
                _view = view,
                _hl = handlerList,
                _util = util,
                context = _view.canvas.getContext("2d"),
                contextWidth = _buf.contextInfo.width,
                contextHeight = _buf.contextInfo.height,
                imageConfig, image,
                frame = frame || _buf.contextInfo.frames;
            
            context.clearRect(0, 0, contextWidth, contextHeight);
            
            _buf.drawnList = {};
            
            // paste image at the corrert place.
            for (var i in _lc.IMAGE_LIST) {
   
                image = _view.imageList[i];
                
                image.parentNode && image.parentNode.removeChild(image);
                //~ image.style.display = "none";
                
                if (_buf.drawnList[i]) continue;
                
                imageConfig = controller.getImageStatus(i, frame);
                
                context.drawImage(
                    imageConfig.image,
                    // x
                    imageConfig.x,
                    // y
                    imageConfig.y,
                    // width
                    imageConfig.width, 
                    // height
                    imageConfig.height
                );
            }
            
            // auto trigger between 2000 to 7200
            if (frame >= 500 && frame <= 7200) {
                
                _buf.autoAnimation = setTimeout(function() {
                    _buf.contextInfo.frames += 42;
                    controller.render();
                }, _lc.LEAST_INTERVAL * 1.5);
            }
        },
        
        filter : function(frame) {
            
            var _view = view,
                _buf = buf,
                _lc = LC,
                lastTimeFrame,
                nextTimeFrame,
                frameRange,
                values = [],
                tmpValue;
            
            if (!_buf.baseTimeFrame) _buf.baseTimeFrame = frame;
            lastTimeFrame = Math.floor((frame - _buf.baseTimeFrame) % 12000 / 3000) * 3000;
            nextTimeFrame = (lastTimeFrame + 3000) % 12000;
            frameRange = (frame - _buf.baseTimeFrame) % 3000 / 3000;
            
            // cauculate filters
            for (var i in _lc.SEASON[nextTimeFrame]) {
                
                if (i == "background-image") {
                    continue;
                }
                tmpValue = i + "(" + (_lc.SEASON[lastTimeFrame][i] + (_lc.SEASON[nextTimeFrame][i] - _lc.SEASON[lastTimeFrame][i]) * frameRange) + ") ";
                if (i == "hue-rotate") {
                    tmpValue = tmpValue.replace(/\)/, "deg)");
                }
                
                values.push(tmpValue);
            }
            
            values = values.join("");
            _view.canvas.style.webkitFilter = values;
            _view.canvas.style.mozFilter = values;
            _view.canvas.style.msFilter = values;
            _view.canvas.style.oFilter = values;
            _view.canvas.style.filter = values;
            
            // calculate background
            var r,g,b,
                lastRgb = _lc.SEASON[lastTimeFrame]["background-image"],
                nextRgb = _lc.SEASON[nextTimeFrame]["background-image"],
                lastR = lastRgb >> 16,
                nextR = nextRgb >> 16,
                lastG = parseInt(lastRgb.toString(16).slice(2,4), 16),
                nextG = parseInt(nextRgb.toString(16).slice(2,4), 16),
                lastB = parseInt(lastRgb.toString(16).slice(4,6), 16),
                nextB = parseInt(nextRgb.toString(16).slice(4,6), 16);
            
            r = Math.round(lastR + (nextR - lastR) * frameRange).toString(16);
            g = Math.round(lastG + (nextG - lastG) * frameRange).toString(16);
            b = Math.round(lastB + (nextB - lastB) * frameRange).toString(16);
            
            r = ("0" + r).slice(-2);
            g = ("0" + g).slice(-2);
            b = ("0" + b).slice(-2);
            
            _view.canvas.style.backgroundImage = "linear-gradient(#" + r.concat(g).concat(b) + ", #FFF 60%)";
        }
    };
    
    return self = {
        init : function(callback) {
            var _lc = LC,
                _view = view,
                _util = util,
                _cl = controller,
                _buf = buf,
                //~ _view.context2D = _view.canvas.getContext("2d"),
                tmpRoot = tmpRoot,
                decorateRoot = decorateRoot,
                imageList = _lc.IMAGE_LIST;
            
            // load images.
            var image, imageCount = 0;
            for (var i in imageList) {
                
                ++ imageCount;
                
                image = document.getElementById(i);
                image.onload = (function(id){
                    return function(e) {
                        
                        _buf.loadedImages.push(id);
                        _cl.showImage(id);
                        if (_buf.loadedImages.length == imageCount) {
                            setTimeout(function(){
                                _cl.render();
                            }, 600);
                        }
                        _view.imageList[id].onload = "";
                    }
                })(i);
                image.src = imageList[i].src;
                
                _view.imageList[i] = image;
            }
            
            callback && callback();
            
            _cl.initEvent();
        }
    };
    
})();