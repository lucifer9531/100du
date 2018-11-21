/**
 * 作者：白雪鹏
 * 开发日期：2018/08/19
 * 描述：通用框架
 * 版权所有 违者必究
 **/
var $$ = function () {

};

$$.prototype = {
    extend: function (tar,source) {
        for (var i in source) {
            tar[i] = source[i];
        }
        return tar;
    }
}
$$ = new $$();

// tab栏
$$.extend($$,{
    tab: function (id) {
        var box = document.getElementById(id);
        var spans = box.getElementsByTagName('span');
        var lis = box.getElementsByTagName('li');

        for (var i = 0; i < spans.length; i++) {

            spans[i].index = i;

            spans[i].mouseover = function () {
                for (var j = 0; j < spans.length; j++) {
                    spans[j].className = '';
                    lis[j].className = '';
                }
                this.className = 'select';
                lis[this.index] = 'select';
            }

        }
    }
})

// 基础
$$.extend($$,{
    random: function (begin,end) {
        return Math.floor(Math.random() * (end - begin)) + begin;
    },
})

// 数据类型判断
$$.extend($$,{
    isNumber: function (val) {
        return typeof  val === 'number' || isFinite(val);
    },
    isString: function (val) {
        return typeof  val === "string";
    },
    isBoolean: function (val) {
        return typeof  val === "boolean";
    },
    isUndefined: function (val) {
        return typeof  val === "undefined";
    },
    isObject: function (str) {
        if (str === null || typeof str === 'undefined') {
            return false;
        }
        return typeof str === 'object';
    },
    isNull: function(val) {
        return val === null;
    },
    isArray: function (arr) {
        if (arr === null || typeof arr === 'undefined') {
            return false;
        }
        return arr.constructor === Array;
    }
})

// 字符串操作
$$.extend($$,{
    // 去除左边空格
    ltrim: function (str) {
        return str.replace(/(^\s*)/g,'');
    },
    // 去除右边空格
    rtrim: function (str) {
        return str.replace(/(\s*$)/g,'');
    },
    // 去除空格
    trim: function (str) {
        return str.replace(/(^\s*)|(\s*$)/g,'');
    },
    // 简单数据绑定formateString
    formateString:function(str, data){
        return str.replace(/@\((\w+)\)/g, function(match, key) {
            return typeof data[key] === "undefined" ? '' : data[key]
        });
    },
})

// ajax封装

$$.extend($$,{
    myAjax: function (URL,fn) {
        var xhr = createXHR();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
                    fn(xhr.responseText);
                } else {
                    alert("错误的文件");
                }
            }
        };
        xhr.open("get",URL,true);
        xhr.send();

        // 使用闭包封装
        function createXHR() {
            if (typeof XMLHttpRequest != "undefined") {
                return new XMLHttpRequest();
            } else if (typeof ActiveXObject != "undefined") {
                if (typeof arguments.callee.activeXString != "string") {
                    var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0",
                            "MSXML2.XMLHttp"
                        ],
                        i, len;

                    for (i = 0, len = versions.length; i < len; i++) {
                        try {
                            new ActiveXObject(versions[i]);
                            arguments.callee.activeXString = versions[i];
                            break;
                        } catch (ex) {
                          
                        }
                    }
                }

                return new ActiveXObject(arguments.callee.activeXString);
            } else {
                throw new Error("No XHR object available.");
            }
        }
    }
})

// 事件框架
$$.extend($$,{
    on: function (id,type,fn) {

        var dom = $$.isString(id) ? document.getElementById(id) : id;
        
        if (dom.addEventListener) {
            
            dom.addEventListener(type,fn,false);
            
        } else if (dom.attachEvrnt) {
            
            dom.attachEvrnt('on' + type, fn);
        }
    },
    un: function(id,type,fn) {

        var dom = $$.isString(id) ? document.getElementById(id) : id;

        if (dom.removeEventListener) {

            dom.removeEventListener(type,fn);

        } else if (dom.detachEvent) {

            dom.detachEvent(type, fn);
        }
    },
    trigger: function(id,type){

        var dom = $$.isString(id)?document.getElementById(id):id;
        // 现代浏览器
        if(dom.dispatchEvent){
            // 创建事件
            var evt = document.createEvent('Event');
            // 定义事件的类型
            evt.initEvent(type, true, true);
            // 触发事件
            dom.dispatchEvent(evt);
            // IE
        } else if(dom.fireEvent){
            dom.fireEvent('on' + type);
        }
    },
    click: function (id,fn) {
        this.on(id,'click',fn);
    },
    mouseover: function (id,fn) {
        this.on(id,'mouseover',fn);
    },
    mouseout: function (id,fn) {
        this.on(id,'mouseout',fn);
    },
    hover: function (id,fnover,fnout) {
        if (fnover) {
            $$.on(id,'mouseover',fnover);
        }
        if (fnout) {
            $$.on(id,'mouseout',fnout);
        }
    },
    // 获取event事件
    getEvent: function (e) {
        return e ? e : window.event;
    },
    // 获取目标元素
    getTarget: function (e) {
        
        var event = $$.getEvent(e);
        // 短路表达式
        return event.target || event.srcElement;
    },
    
    // 阻止默认行为
    preventDefault: function (event) {
        var event = $$.getEvent(event);
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    },
    // 阻止冒泡
    stopPropagation: function (event) {
        var event = $$.getEvent(event);
        if (event.stopPropagation) {
            event.stopPropagation();
        } else {
           event.cancelable = true;
        }
    }
    
})

// 选择框架
$$.extend($$,{
    $id: function (str) {
        return document.getElementById(str);
    },
    $tag: function (tag,context) {
        if (typeof context == 'string') {
            context = $$.$id(context);
        }

        if (context) {
            return context.getElementsByTagName(tag);
        } else {
            return document.getElementsByTagName(tag);
        }
    },
    $class: function (context,className) {
        context = document.getElementById(context);
        if (context.getElementsByClassName) {

            return context.getElementsByClassName(className);

        } else {
            var arr = [];

            dom = context.getElementsByTagName('*');

            for (var i = 0; i < dom.length; i++) {

                if (dom[i].className && dom[i].className == className) {

                    arr.push(dom[i]);
                }
            }
        }
        return arr;
    },

    // 分组选择器
    $group: function (content) {
        var result = [], doms = [];
        var arr = $$.trim(content).split(',');
        for (var i = 0; i < arr.length; i++) {

            var item = $$.trim(arr[i]);
            var first = item.charAt(0);
            var index = item.indexOf(first);

            if (first === '.') {

                dom = $$.$class(item.slice(index + 1))
                pushArray(doms,result);

            } else if (first === '#') {

                dom = [$$.$id(item.slice(index + 1))]
                pushArray(doms,result);

            } else {
                dom = $$.$tag(item);
                pushArray(doms,result);
            }
        }
        return result;

        function pushArray(doms,result) {

            for (var i = 0; i < doms.length; i++) {

                result.push(dom[i]);
            }
        }
    },

    // 层次选择器
    $cengci: function (select) {
        var sel = $$.trim(select).split('');
        var result = [];
        var context = [];
        for (var i = 0; i < sel.length; i++) {
           result = [];
           var item = $$.trim(sel[i]);
           var first = sel[i].charAt(0);
           var index = item.indexOf(first);

           if (first === '#') {
               pushArray([$$.$id(item.slice(index + 1))]);
               context = result;
           } else if (first === '.') {
               if (context.length) {
                   for (var j = 0; j < context.length; j++) {

                       pushArray($$.$class(item.slice(index + 1),context[j]));
                   }
               } else {

                   pushArray($$.$class(item.slice(index + 1)));
               }
               context = result;
           } else {
               if (context.length) {
                   for (var j = 0; j < context.length; j++) {
                      pushArray($$.$tag(item,context[j]));
                   }
               } else {
                   pushArray($$.$tag(item));
               }
               context = result;
           }
        }
        return context;

        function pushArray(doms) {
            for (var i = 0; i < doms.length; i++) {

                result.push(dom[i]);

            }
        }
    },

    // 多组 + 层次
    $select: function (str) {
        var result = [];
        var item = $$.trim(str).slice(',');
        for (var i = 0; i < item.length; i++) {
            var select = $$.trim(item);
            var context = [];
            context.$$.$cengci(select);
            pushArray(context);
        };
        return result;

        function pushArray(doms) {
            for (var i = 0; i < doms.length; i++) {

                result.push(dom[i]);
            }
        }
    },

    // HTML5 实现的框架
    $all: function (selector,context) {
        context = context || document;
        return context.querySelectorAll(selector);
    },
})

// css3 框架
$$.extend($$,{
    show: function (context) {
        var doms = $$.$all(context);
        for (var i = 0; i < doms.length; i++) {
            $$.css(doms[i], 'display', 'block');
        }
    },
    hide: function (context) {
        var doms = $$.$all(context);
        for (var i = 0; i < doms.length; i++) {
            $$.css(doms[i], 'display', 'none');
        }
    },
    css: function (context,key,value) {
        var dom = $$.isString(context) ? $$.$all(context) : context;

        if (dom.length) {
            if (value) {
                for (var i = dom.length - 1; i >= 0; i--) {

                    setStyle(dom[i],key,value);
                }
            } else {
                return getStyle(dom[0]);
            }
        } else {
            if (value) {
                setStyle(dom,key,value);
            } else {
                return getStyle(dom);
            }
        }
        function getStyle(dom) {
            if (dom.currentStyle) {
                return dom.currentStyle[key];
            } else {
                return getComputedStyle(dom,null)[key];
            }
        }
        function setStyle(dom,key,value) {
            dom.style[key] = value;
        }
    },

    //元素高度宽度概述
    //计算方式：clientHeight clientWidth innerWidth innerHeight
    //元素的实际高度+border，也不包含滚动条
    width: function (id) {
        return $$.$id(id).clientWidth;
    },
    height: function (id) {
        return $$.$id(id).clientHeight;
    },

    //元素的滚动高度和宽度
    //当元素出现滚动条时候，这里的高度有两种：可视区域的高度 实际高度（可视高度+不可见的高度）
    //计算方式 scrollwidth
    scrollWidth: function (id) {
        return $$.$id(id).scrollWidth;
    },
    scrollHeight: function (id) {
        return $$.$id(id).scrollHeight;
    },

    //元素滚动的时候 如果出现滚动条 相对于左上角的偏移量
    //计算方式 scrollTop scrollLeft
    scrollTop: function (id) {
        return $$.$id(id).scrollTop;
    },
    scrollLeft: function (id) {
        return $$.$id(id).scrollLeft;
    },

    // 获取屏幕的宽度和高度
    sWidth: function () {
        return window.screen.width;
    },
    sHeight: function () {
        return window.screen.height;
    },

    // 文档视口的高度和宽度
    wWidth: function () {
        return document.documentElement.clientWidth;
    },
    wHeight: function () {
        return document.documentElement.clientHeight;
    },

    // 文档滚动区域的整体的高和宽

    wScrollWidth: function () {
        return document.body.scrollWidth;
    },
    wScrollHeight: function () {
        return document.body.scrollHeight;
    },

    // 获取滚动条相对于其顶部的偏移量
    wScrollTop: function () {
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        return scrollTop;
    },
    // 获取滚动条相对于其左边的偏移量
    wScrollLeft: function () {
        var scrollLeft = window.body.scrollLeft || (document.documentElement && document.documentElement.scrollLeft);
        return scrollLeft;
    },
})

// 属性
$$.extend($$,{
    attr: function (context,key,value) {
        var doms = $$.$all(context);
        if(doms.length){
            if(value){
                for(var i= 0, len=doms.length; i <len; i++){
                    doms[i].setAttribute(key, value);
                }
            }else{
                return doms[0].getAttribute(key);
            }
//            如果是单个元素  比如id
        }else{
            if(value){
                doms.setAttribute(key, value);
            }else{
                return doms.getAttribute(key);
            }
        }
    },
    // 动态添加和移除class
    addClass: function (context,name) {
        var doms = $$.$all(context);
        if (doms.length) {
            for (var i = 0; i < doms.length; i++) {
               addName(doms[i]);
            }
        } else {
            addName(doms);
        }
        function addName(dom) {
            dom.className = dom.className + '' + name;
        }
    },
    removeClass: function (context,name) {
        var doms = $$.$all(context);
        for (var i = 0; i < doms.length; i++) {
            removeName(doms[i],name);
        }
        function removeName(dom) {
           dom.className = dom.className.replace(name,''); 
        }
    },
    hasClass: function (context,name) {
        var doms = $$.$all(context);
        var flag = true;
        for (var i = 0; i < doms.length; i++) {
            flag = flag && check(doms[i],name);
        }
        return flag;
        // 判断单个元素
        function check(element,name) {
            return -1<("" + element.className + "").indexOf("" + name + "");
        }
    },
    getClass: function (id) {
        var doms = $$.$all(id)
        return $$.trim(doms[0].className).split(" ")
    }
})

// 内容框架
$$.extend($$,{
    html: function (context,value) {
        var doms = $$.$all(context);
        // 设置模式
        if (value) {
            for (var i = 0; i < doms.length; i++) {
                doms[i].innerHTML = value;
            }
        } else {

            return doms[0].innerHTML;
        }
    }
})

// 封装json
$$.extend($$,{
    sjson: function (json) {
        return JSON.stringify(json);
    },
    // 将字符串转成json
    json: function (str) {
        return eval(str);
    }
});

// 缓存框架  内存篇
$$.cache = {
    data: [],
    get: function (key) {
        var value = null;
        console.log(this.data)
        for (var i = 0; i < this.data.length; i++) {
            var item = this.data[i];
            if (key == item.key) {
                value = item.value;
            }
        }
        console.log('get'+value)
        return value;
    },
    add: function (key,value) {
        var json = {key:key,value:value};
        this.data.push(json);
    },
    delete: function (key) {
        var status = false;
        for (var i = 0; i < this.data.length; i++) {
            var item = this.data[i];
            if (item.key.trim() == key) {
               this.data.splice(i,1);
               status = true;
               break;
            }
        }
        return status;
    },
    update:function(key,value){
        var status = false;
        // 循环数组元素
        for(var i= 0,len=this.data.length;i<len; i++){
            var item = this.data[i]
            if (item.key.trim() === key.trim()) {
                item.value = value.trim();
                status = true;
                break;
            }
        }
        return status;
    },
    isExist: function (key) {
        for (var i = 0; i < this.data.length; i++) {
            var item = this.data[i];
            if (key == item.key) {
                return true;
            } else {
                return false;
            }
        }
    }
}

// cookie框架
$$.cookie = {
    //设置coolie
    setCookie: function (name,value,days,path){
        var name = escape(name);
        var value = escape(value);
        var expires = new Date();
        expires.setTime(expires.getTime() + days*24*60*60*1000);
        path = path == "" ? "" : ";path=" + path;
        _expires = (typeof hours) == "string" ? "" : ";expires=" + expires.toUTCString();
        document.cookie = name + "=" + value + _expires + path;
    },
    //获取cookie值
    getCookie:function (name){
        var name = escape(name);
        //读cookie属性，这将返回文档的所有cookie
        var allcookies = document.cookie;

        //查找名为name的cookie的开始位置
        name += "=";
        var pos = allcookies.indexOf(name);
        //如果找到了具有该名字的cookie，那么提取并使用它的值
        if (pos != -1){                                             //如果pos值为-1则说明搜索"version="失败
            var start = pos + name.length;                  //cookie值开始的位置
            var end = allcookies.indexOf(";",start);        //从cookie值开始的位置起搜索第一个";"的位置,即cookie值结尾的位置
            if (end == -1) end = allcookies.length;        //如果end值为-1说明cookie列表里只有一个cookie
            var value = allcookies.substring(start,end);  //提取cookie的值
            return unescape(value);                           //对它解码
        }
        else return "";                                             //搜索失败，返回空字符串
    },
    //删除cookie
    deleteCookie:function (name,path){
        var name = escape(name);
        var expires = new Date(0);
        path = path == "" ? "" : ";path=" + path;
        document.cookie = name + "="+ ";expires=" + expires.toUTCString() + path;
    }
}

//本地存储框架
$$.store = (function () {
    var api = {},
        win = window,
        doc = win.document,
        localStorageName  = 'localStorage',
        globalStorageName = 'globalStorage',
        storage;

        api.set = function (key, value) {};
        api.get = function (key) {};
        api.remove = function (key) {};
        api.clear  = function () {};

    if (localStorageName in win && win[localStorageName]) {
        storage = win[localStorageName];
        api.set = function (key, val) {

            storage.setItem(key, val)
        };
        api.get = function (key) {

            return storage.getItem(key)
        };
        api.remove = function (key) {

            storage.removeItem(key)
        };
        api.clear  = function () {

            storage.clear()
        };

    } else if (globalStorageName in win && win[globalStorageName]) {

        storage = win[globalStorageName][win.location.hostname];
        api.set = function (key, val) {

            storage[key] = val
        };
        api.get = function (key) {

            return storage[key] && storage[key].value
        };
        api.remove = function (key) {

            delete storage[key]
        };
        api.clear = function () {

            for (var key in storage ) {

                delete storage[key]
            }
        };

    } else if (doc.documentElement.addBehavior) {

        function getStorage() {

            if (storage) {
                return storage
            }
            storage = doc.body.appendChild(doc.createElement('div'));

            storage.style.display = 'none';
            // See http://msdn.microsoft.com/en-us/library/ms531081(v=VS.85).aspx
            // and http://msdn.microsoft.com/en-us/library/ms531424(v=VS.85).aspx
            storage.addBehavior('#default#userData');
            storage.load(localStorageName);
            return storage;
        }
        api.set = function (key, val) {
            var storage = getStorage();
            storage.setAttribute(key, val);
            storage.save(localStorageName);
        };
        api.get = function (key) {
            var storage = getStorage();
            return storage.getAttribute(key);
        };
        api.remove = function (key) {
            var storage = getStorage();
            storage.removeAttribute(key);
            storage.save(localStorageName);
        }
        api.clear = function () {
            var storage = getStorage();
            var attributes = storage.XMLDocument.documentElement.attributes;;
            storage.load(localStorageName);
            for (var i=0, attr; attr = attributes[i]; i++) {

                storage.removeAttribute(attr.name);
            }
            storage.save(localStorageName);
        }
    }
    return api;
})();

/*动画框架*/
function Animate() {

    //一般再编写框架的时候都会定义一个配置对象保存控制动画的一些值，允许用户自定义
    //我们首先定义好默认值
    this.config = {
        interval:16,
        ease:'linear',
    }

    this.timer = 0;
    //定义一个index统计每次添加的对象编号 第一个为0
    this.index = -1;
    //动画对象
    //我们定义一个对象来保存运动中我们需要的数据，比如now，pass等
    this._obj = {};
    //我们使用数组来保存每个每个物体的运动数据
    this._queen = []
    //调用初始化函数
    this._init();
}
Animate.prototype = {


    /* ------------------------------------------------
     *公共部门
     *放置其他部门都会使用的公共方法属性
     *-------------------------------------------------*/
    eases:{
        //线性匀速
        linear:function (t, b, c, d){
            return (c - b) * (t/ d);
        },
        //弹性运动
        easeOutBounce:function (t, b, c, d) {
            if ((t/=d) < (1/2.75)) {
                return c*(7.5625*t*t) + b;
            } else if (t < (2/2.75)) {
                return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
            } else if (t < (2.5/2.75)) {
                return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
            } else {
                return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
            }
        },
        //其他
        swing: function (t, b, c, d) {
            return this.easeOutQuad(t, b, c, d);
        },
        easeInQuad: function (t, b, c, d) {
            return c*(t/=d)*t + b;
        },
        easeOutQuad: function (t, b, c, d) {
            return -c *(t/=d)*(t-2) + b;
        },
        easeInOutQuad: function (t, b, c, d) {
            if ((t/=d/2) < 1) return c/2*t*t + b;
            return -c/2 * ((--t)*(t-2) - 1) + b;
        },
        easeInCubic: function (t, b, c, d) {
            return c*(t/=d)*t*t + b;
        },
        easeOutCubic: function (t, b, c, d) {
            return c*((t=t/d-1)*t*t + 1) + b;
        },
        easeInOutCubic: function (t, b, c, d) {
            if ((t/=d/2) < 1) return c/2*t*t*t + b;
            return c/2*((t-=2)*t*t + 2) + b;
        },
        easeInQuart: function (t, b, c, d) {
            return c*(t/=d)*t*t*t + b;
        },
        easeOutQuart: function (t, b, c, d) {
            return -c * ((t=t/d-1)*t*t*t - 1) + b;
        },
        easeInOutQuart: function (t, b, c, d) {
            if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
            return -c/2 * ((t-=2)*t*t*t - 2) + b;
        },
        easeInQuint: function (t, b, c, d) {
            return c*(t/=d)*t*t*t*t + b;
        },
        easeOutQuint: function (t, b, c, d) {
            return c*((t=t/d-1)*t*t*t*t + 1) + b;
        },
        easeInOutQuint: function (t, b, c, d) {
            if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
            return c/2*((t-=2)*t*t*t*t + 2) + b;
        },
        easeInSine: function (t, b, c, d) {
            return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
        },
        easeOutSine: function (t, b, c, d) {
            return c * Math.sin(t/d * (Math.PI/2)) + b;
        },
        easeInOutSine: function (t, b, c, d) {
            return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
        },
        easeInExpo: function (t, b, c, d) {
            return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
        },
        easeOutExpo: function (t, b, c, d) {
            return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
        },
        easeInOutExpo: function (t, b, c, d) {
            if (t==0) return b;
            if (t==d) return b+c;
            if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
            return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
        },
        easeInCirc: function (t, b, c, d) {
            return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
        },
        easeOutCirc: function (t, b, c, d) {
            return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
        },
        easeInOutCirc: function (t, b, c, d) {
            if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
            return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
        },
        easeInElastic: function (t, b, c, d) {
            var s=1.70158;var p=0;var a=c;
            if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
            if (a < Math.abs(c)) { a=c; var s=p/4; }
            else var s = p/(2*Math.PI) * Math.asin (c/a);
            return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
        },
        easeOutElastic: function (t, b, c, d) {
            var s=1.70158;var p=0;var a=c;
            if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
            if (a < Math.abs(c)) { a=c; var s=p/4; }
            else var s = p/(2*Math.PI) * Math.asin (c/a);
            return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
        },
        easeInOutElastic: function (t, b, c, d) {
            var s=1.70158;var p=0;var a=c;
            if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
            if (a < Math.abs(c)) { a=c; var s=p/4; }
            else var s = p/(2*Math.PI) * Math.asin (c/a);
            if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
            return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
        },
        easeInBack: function (t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c*(t/=d)*t*((s+1)*t - s) + b;
        },
        easeOutBack: function (t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
        },
        easeInOutBack: function (t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
            return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
        },
        easeInBounce: function (t, b, c, d) {
            return c - this.easeOutBounce (d-t, 0, c, d) + b;
        },
        easeInOutBounce: function (t, b, c, d) {
            if (t < d/2) return this.easeInBounce (t*2, 0, c, d) * .5 + b;
            return this.easeOutBounce (t*2-d, 0, c, d) * .5 + c*.5 + b;
        }
    },
    //获取时间进程
    _getTween:function (now,pass,duration,ease) {

        var yongshi = pass -now;
        //复习字面量的两种访问方式
        return this.eases[ease](yongshi,0,1,duration);
    },
    //初始化执行的代码一般放在init里面，一般是构造函数调用
    _init:function(){},

    /*新的技术*/
    getAnimationFrame:function() {
        var lastTime = 0;
        var prefixes = 'webkit moz ms o'.split(' '); //各浏览器前缀

        var requestAnimationFrame = window.requestAnimationFrame;
        var cancelAnimationFrame = window.cancelAnimationFrame;

        var prefix;
        //通过遍历各浏览器前缀，来得到requestAnimationFrame和cancelAnimationFrame在当前浏览器的实现形式
        for( var i = 0; i < prefixes.length; i++ ) {
            if ( requestAnimationFrame && cancelAnimationFrame ) {
                break;
            }
            prefix = prefixes[i];
            requestAnimationFrame = requestAnimationFrame || window[ prefix + 'RequestAnimationFrame' ];
            cancelAnimationFrame  = cancelAnimationFrame  || window[ prefix + 'CancelAnimationFrame' ] || window[ prefix + 'CancelRequestAnimationFrame' ];
        }

        //如果当前浏览器不支持requestAnimationFrame和cancelAnimationFrame，则会退到setTimeout
        if ( !requestAnimationFrame || !cancelAnimationFrame ) {
            requestAnimationFrame = function( callback, element ) {
                var currTime = new Date().getTime();
                //为了使setTimteout的尽可能的接近每秒60帧的效果
                var timeToCall = Math.max( 0, 16 - ( currTime - lastTime ) );
                var id = window.setTimeout( function() {
                    callback( currTime + timeToCall );
                }, timeToCall );
                lastTime = currTime + timeToCall;
                return id;
            };

            cancelAnimationFrame = function( id ) {
                window.clearTimeout( id );
            };
        }

        //得到兼容各浏览器的API
        return {
            requestAnimationFrame : requestAnimationFrame,
            cancelAnimationFrame : cancelAnimationFrame
        }

    },

    /* ------------------------------------------------
     *运行部 老大:run
     *部门职责描述: 根据添加进来的元素属性创建动画,并运行起来
     *-------------------------------------------------*/
    //运行部老大
    _run:function() {
        var that = this;

        //run函数其实就是个循环
        that.timer = setInterval(function() {

            that._loop();}, that.config.interval);
    },
    //我们新增一个loop以此针对每个物体做运动 --其实就是遍历每个对象，然后依次执行move方法
    _loop:function() {

        for(var i= 0,len=this._queen.length;i<len;i++) {

            this._move(this._queen[i])
        }
    },
    //单个物体运动方法
    _move:function (_obj) {
        var pass = +new Date();
        _obj.pass = pass - _obj.now;

        var dom =_obj.dom;
        var styles= _obj.styles;
        var tween = this._getTween(_obj.now,pass,_obj.duration,this.config.ease);
        if(tween>=1) {
            //this.timer.clearInterval();
            //this.timer = 0;
            //_obj.callback()
            tween = 1;
            for(var i= 0,len=styles.length;i<len;i++) {
                if(styles[i].property=='opacity') {

                    $$.css(dom, styles[i].property, styles[i].start+styles[i].juli*tween);
                }
                else {
                    $$.css(dom, styles[i].property, styles[i].start+styles[i].juli*tween+'px');
                }
            }
        } else {
            for(var i= 0,len=styles.length;i<len;i++) {
                if(styles[i].property=='opacity') {

                    $$.css(dom, styles[i].property, styles[i].start+styles[i].juli*tween);
                }
                else {
                    $$.css(dom, styles[i].property, styles[i].start+styles[i].juli*tween+'px');
                }
            }
        }
    },
    //动画执行结束后的回调函数
    _callBack:function() {},


    /* ------------------------------------------------
     *添加部  -- add
     *部门职责描述: 添加元素 以及确定我要对哪个属性做动画
     *-------------------------------------------------*/
    //部门老大 - 添加
    addOld:function(id,json,duration,callback) {
        //add方法做两件事情：适配器，运行动画，只要用户调用add方法，整个动画能够运行起来
        //我们先宏观规划add函数的接口 --注释法
        this._apdapter(id,json,duration,callback)

        this._run();
    },
    add:function() {
        try {
            //add方法做两件事情：适配器，运行动画，只要用户调用add方法，整个动画能够运行起来
            //我们先宏观规划add函数的接口 --注释法
            var options = arguments
            var id = options[0]
            var json = options[1]
            var duration = options[2]
            var callback = options[3]

            console.log(duration)

            //添加默认值
            if(!duration) {
                duration=2000;
            } else {
                if($$.isString(duration)) {
                    switch (duration) {
                        case 'slow' :
                        case '慢' :
                            duration = 8000;
                            break;
                        case 'normal' :
                        case '普通' :
                            duration = 4000;
                            break;
                        case 'fast' :
                        case '快' :
                            duration = 2000;
                            break;
                    }
                } else {

                }
            }
            this._apdapter(id,json,duration,callback)
            this._run();
        }catch(e){
            alert('代码出错,系统出错提示：'+'\n'+ e.message+'\n'+ e.name);
        }

    },
    //适配器 --单一职责原则
    //我们继续完善适配器 -- 这样运行部需要的数据基本都保存在_obj中了
    _apdapter:function (id,source,duration,callback) {
        var _obj = {}
        this.index++;
        _obj.index = this.index;
        /*数据类型判断的重要性*/
        _obj.dom = $$.isString(id)?$$.$id(id):id
        _obj.duration = duration
        _obj.now = +new Date()
        _obj.callback = callback;

        var target = [];
        for(var item in source){
            var json = {};
            //元素属性的起始位置 比如目标元素目前left 100px，希望运动到500px，那么100就是起始位置
            json.start = parseFloat($$.css(_obj.dom,item))
            json.juli = parseFloat(source[item]) - json.start;
            json.property = item
            target.push(json)
        }
        _obj.styles = target;
        this._queen.push(_obj)
    },




    /* ------------------------------------------------
     *公共API -- 学习什么是公共API
     *提供给使用框架的人，使用框架的人一般只需要这样
     *-------------------------------------------------*/
    //开始动画
    begin:function() {},
    //停止动画
    stop:function() {},
    //自定义动画的配置
    setConfig:function(json) {
        //如何允许用户控制动画
        var that = this;
        $$.extend(this.config,json)
    },

    /* ------------------------------------------------
     *后勤部
     *部门职责描述: 辅助运行动画  比如清除 比如内存回收
     *-------------------------------------------------*/
    _destroy:function(obj) {
        var that = this;
        //内存优化
        //1 释放队列  -- 数组实现的  -- 就是删除数组
        //哪个物体执行完，我就释放哪个物体所占用的内存
        that._queen.splice(obj.index,1);
        //2 释放对象的属性和方法
        for(var i in obj) {

            delete obj[i];
        }
        //3 释放对象所占用的内存
        obj = null;
    }
}
$$.animate = new Animate()
