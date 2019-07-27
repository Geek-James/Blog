/*
 * @Description:  jQuery 源码剖析 -  事件绑定 体系结构设计
 * @Author: James
 * @Date: 2019-07-21 13:38:17
 * @LastEditTime: 2019-07-27 12:29:16
 * @LastEditors: Please set LastEditors
 */

// 闭包 立即执行函数
(function(root){

    var textExp = /^\s*(<[w\W]+>)[^>]*$/;
    var rejectExp = /^<(\w+)\s*\/?>(?:<\/\1|)$/;
    var version = "1.0.5";
    
    var jQuery = function(selector,context) {
        // jQuery对象实际上只是init构造函数
        // 如果调用了jQuery，则需要init（如果不包含则只允许抛出错误
        return new jQuery.prototype.init(selector,context);
    }
    
    // var rootjQuery = jQuery(document);
    jQuery.fn = jQuery.prototype = {
        length:0,
        jquert:version,
        selector:"",
        /**
         * [selector] 传入的参数
         * [context] DOM 查询的限定范围
         * **/
        init:function (selector,context) {
            context = context || document;
            var match,elem,index=0;
            if(!selector){
                return this;
            }
            /**
             * 检测传过来的数据是否是字符串
             * **/
            if(typeof selector === "string"){
                if (selector.charAt(0) === "<" && selector.charAt(selector.length-1)=== ">" && selector.length>=3) {
                   // 此时是HTML  
                    match = [selector];
                }
                // 匹配html或确保没有为#id指定上下文 
                if (match) {
                    /**
                     * 合并数组
                     * **/
                    jQuery.merge(this, jQuery.parseHTML(selector,context));
                  // 查询DOM节点  
                } else {
                    elem = document.querySelectorAll(selector);
                    // 转化为真数组
                    var elems = Array.prototype.slice.call(elem);
                    this.length = elem.length;

                    for (;index = elem.length;index ++) {
                        this[index] = elems[index];
                    }
                    this.context = context;
                    this.selector = selector;
                }
                // HANDLE: $(DOMElement)
            } else if (selector.nodeType){ // 
                this.context = this[0] = selector;
                this.length = 1;
                return this;
              //  $(function)
              // 函数处理
            } else if (isFunction( selector )) { 
                // rootjQuery.ready(selector);// 实例对象的方法
                jQuery(document).ready(selector);
                
            }
            return jQuery.makeArray( selector, this );
        },
        ready:function (fn){
            // 检测dom是否加载完毕
            document.addEventListener("DOMContentLoaded",jQuery.ready,false)
            if (jQuery.isReady) { // 默认false    调用为true
                fn.call(document)
            } else {
                jQuery.readylist.push(fn);
            }
        }
    }

    jQuery.extend = jQuery.fn.extend = function () {
        // 声明变量
        var options,name,copy,src,copyIsArray,clone,
        target = arguments[0] || {},
        length = arguments.length,
        // 从第1个参数开始解析,因为第0个是我们targer,用来接收解析过的数据的
        i = 1,
        // 是否是深拷贝,外界传过来的第一个参数
        deep = false;

        // 处理深层复制情况 
        if(typeof target === "boolean") {
            // extender(deep,{},obj1,obj2) 
            deep = target;
            target = arguments[i] || {};
            i ++;
        }
        // 判断 targer不是对象也不是方法
        if(typeof target !== "object" && !isFunction(target)) {
            target = {};
        } 

        // 如果只传递一个参数，则扩展jQuery本身
        if (length === i) {
            target = this;
            // 此时把i变为0
            i--;
        }

        for ( ; i < length ; i++){
            // 仅处理非null /未定义的值
            if((options = arguments[i]) != null) {

                // 仅处理非null /未定义的值
                for(name in options) {
                    copy = options[name];
                    src = target[name];

                    // 防止Object.prototype污染
                    // 防止死循环循环 
                    if (name === "__proto__" || target == copy) {
                        continue;
                    }

                    //如果我们要合并普通对象或数组，请递归
                    // 此时的copy必须是数组或者是对象
                    if ( deep &&  (jQuery.isPlainObject(copy) ||
					(copyIsArray = jQuery.isArray(copy)))) {

                        // 确保源值的正确类型  源值只能是数组或者对象
                        if ( copyIsArray ) {
                            copyIsArray = false;
                            clone = src && jQuery.isArray(src)?src:[];
                        } else {
                            clone = src && jQuery.isPlainObject(src)?src:{};
                        } 
                        //永远不要移动原始对象，克隆它们
                        target[name] = jQuery.extend(deep,clone,copy);

                        //不要引入未定义的值
                    } else if (copy !== undefined){
                        // 浅拷贝
                        target[name] = copy;
                    }
                }
            }
        }
        //返回修改后的对象 
        return target;
    };
    var optionsCache = {};
    // 扩展属性和方法
    jQuery.extend({
        // 随机数
        expando:"jQuery" + (version + Math.random()).replace(/\D/g,""),
        guid:1, //计数器
        /**
         * [inArray] 某个元素是否存在于某个数组中
         * [elem]    元素
         * arr       数组   
         * **/ 
        inArray : function (elem,arr){
            return arr == null?-1:[].indexOf.call(arr,elem);
        },
        // 类型检测
        isPlainObject: function(obj) {
            // "[object Object]" 第二个O一定是大写,坑了我好几个小时.......
            return toString.call(obj) === "[object Object]";
        },
        isArray: function(obj) {
            return toString.call(obj) === "[object Array]";
        },
        /**
         *  合并数组
         *  [first] jQuery的实例对象  this
         *  [second] DOM 节点 
         */
        merge:function (first,second) {
            var l = second.length, // 1
                i = first.length, // 0
                j = 0;
            if (typeof l === "number") {
                for ( ; j < l; j++){ // 遍历DOM节点
                    first[i++] = second[j];
                }
            } else {
                while (second[j] !== undefined) {
                    first[i++] = second[j++];
                }
            } 
            first.length = i;
            // 返回jQuery的实例对象
            return first;   
        },
        /**
         * 解析HTML
         * [data] 传入的数据
         * [context] 返回的值
         * **/
        parseHTML:function (data,context) {
            if (!data || typeof data !== "string") {
                return null;
            }
            /**
             * exec() 是正则方法 返回为数组   
             * [0] 为正则表达式相匹配的文本
             * [1] 表达式相匹配的文本    
             * **/
            // 过滤掉符号,只提取标签 "<a>" ==> "a"
            var parse = rejectExp.exec(data);
            // 返回一个创建DOM的元素
            return [context.createElement(parse[1])];
        },
        /**
         * 将一个类数组对象转换为真正的数组对象
         * [arr] 传入的数组
         * [result] 返回的数组
         * **/
        makeArray:function(arr,result){
            var ret = result || [];
            if ( arr != null ) {
                if ( isArrayLike( Object( arr ) ) ) {
                    jQuery.merge( ret,
                        typeof arr === "string" ?
                        [ arr ] : arr
                    );
                } else {
                   [].push.call( ret, arr );
                }
            }
            return ret;
        },
        isReady:false,
        readylist:[],// list 
        ready:function(){ // 事件函数
           jQuery.isReady = true;
           jQuery.readylist.forEach(function(callback){
               callback.call(document);
           })  
           // 清空
           jQuery.readylist = null;
        },
    /**
     * [Callbacks] Callbacks回调方法
     * [options] 外界传进来的参数 可以是多个
     * **/
    // var optionsCache = {};
    Callbacks : function (options){
        // 检测options的类型
       options = typeof options === "string"?(optionsCache[options]||createOpeions(options)):{};
        // 定义一个数组用来存放add将来的方法
        var list = [],
        length,
        index,
        startAdd,
        memory,
        start,
        memorySarts;
        var fire = function(data){
            // memory
            memory = options.memory && data;
            // 为了防止memory再次调用一次定义了starts
            index = memorySarts || 0;
            start = 0;
            length = list.length;
            startAdd = true; // 用来记录fire()方式是否执行 便于"once"方法操作
            // 遍历循环list
            for(; index < length; index++){
                // 通过遍历查找list[index]的值为false 且options有stopOnfalse这个参数时遍历终止返回
                if (list[index].apply(data[0],data[1]) == false && options.stopOnfalse){
                    break;
                }
            }
        }
        var self = {
            // 添加 方法
            add:function(){
                // Array.prototype.slice.call(arguments 伪数组转真数组
                var args = Array.prototype.slice.call(arguments);
                start = list.length;
                // 遍历args 找出里面的Function
                args.forEach(function(fn){
                    // 检索fn是是否是Function
                    if (toString.call(fn) === "[object Function]") {
                        // unique 不存在 且fn在list中 那么可以把fn添加到队里中
                        if(!options.unique || !self.has(fn,list)) {
                            list.push(fn);
                        }
                    }
                });
                // memory 
                if (memory) {
                    memorySarts = start;
                    fire(memory);
                }
                // 方便链式编程
                return this;
            },
            // 定义一个上下文绑定函数
            fileWith:function(context,arguments){
                var args = [context,arguments];
                // 非fire做限制调用
                if(!options.once || !startAdd) {
                    fire(args);
                }
            },
            fire:function(){
                self.fileWith(this,arguments);
            },
            has:function(fn,array){
                return arr = jQuery.inArray(fn,array) > -1;
            }
        }
        return self;
    },
    /**
     * Deferred  异步回调解决方案
     * 
     * **/
    Deferred : function(func){
        /**
         *  tuples     定义一个数组来存储三种不同状态信息的描述
         *  第一个参数  延时对象的状态
         *  第二个参数  往队列里添加处理函数
         *  第三个参数  创建不同状态的队列
         *  第四个参数  记录最终状态信息
         * **/
        var tuples = [
                  ["resolve","done",jQuery.Callbacks("once memory"),"resolved"],
                  ["reject","fail",jQuery.Callbacks("once memory"),"rejected"],
                  ["notify","progress",jQuery.Callbacks("memory")]        
        ],
        state = "pending",  // 进行中的状态
        promise = {
            state :function(){
                return state;
            },
            then:function() {
            },
            promise:function(obj) {
                console.log(promise);
                debugger
                return obj !=null ? jQuery.extend(obj,promise):promise;
            }
        },
        // 延迟对象   属性 方法 
        deferred = {};
        // 遍历 tuples
        tuples.forEach(function(tuple,i){
            var list = tuple[2], // 创建队列  创建三次 self对象的引用 映射 调用Callbacks里面的方法 
                stateString = tuple[3]; // 拿到当前最终信息的描述
            // promise[done | fail |progress]  将这三个状态都拿到Callbacks self里面方法的引用 添加处理函数
            promise[tuple[1]] = list.add;
            
            // Handle state 成功或者失败
            if (stateString) { //添加第一个处理程序
                list.add(function(){
                    // state = [resolved | rejected]
                    state = stateString;
                });
            }
            // deferred [resolve | reject | notify ]  延时对象的状态拿到函数的引用
            deferred[tuple[0]] = function(){
                deferred[tuple[0] + "With"] (this === deferred ? promise : this, arguments);
                return this;
            };
            // list.fireWith 执行队列并且传参
            // 调用队列中的处理函数 并且给他们传参 绑定执行时的上下文对象
            deferred[tuple[0] + "With"] = list.fireWith;
        });
        // Make the deferred a promise
        promise.promise(deferred);
        return deferred;
    },
    // 执行一个或多个对象的延迟函数的回调函数
    when : function(subordinate){
        return subordinate.promise();
    },

    /**
     * each     遍历
     * object   目标源
     * callback 回调函数
     * args     自定义回调参数
     * **/
    each:function(object,callback,args) {
        //object 数组对象  | 对象
        var length = object.length;
        var name,i=0;

        // 自定义callback 参数
        if(args) {
            if(length === undefined){
                for (name in object){
                    callback.apply(object,args);
                }
            } else {
                for(; i<length;){
                    callback.apply(object[i++],args);
                }
            }
        } else {
            if (length === undefined) {
                for (name in object){
                    callback.call(object,name,object[name]);
                }
            } else {
                for (;i<length;){
                    callback.call(object[i],i,object[i++]);
                }
            }
        }
       },
    });

    /**
     *  获取随机缓存值
     * **/ 
    function Data() {
        this.expando = jQuery.expando + Math.random();
        this.cache = {};
        }
    Data.uid = 1;
    Data.prototype = {
        key:function(elem){
            var descript = {},
                unlock = elem[this.expando];
            if (!unlock) {
                unlock = Data.uid++;
                descript[this.expando] = {
                    value:unlock
                };
                Object.defineProperties(elem,descript);
            }    
            // 确保缓存对象记录信息
            if(!this.cache[unlock]) {
                this.cache[unlock] = {};
            }
            return unlock;
        },
        get:function(elem,key) {
            var cache = this.cache[this.key[elem]];
            return key === undefined ? cache :cache[key];
        },
    }
    var data_priv = new Data();
    // jQuery 事件模块
    jQuery.event = {
        // 1.利用 data_priv 数据缓存
        add:function(elem,type,hander) {
            var eventHandle,events,handlers;
            // 事件缓存
            var elemData = data_priv.get(elem);
            //检测handler是否存在ID 如果没有那么就传给他一个ID
            //添加ID的目的是 用来寻找或者删除相应的事件
            if(!hander.guid) {
                hander.guid = jQuery.guid++;
            }
            // 给缓存增加事件处理语柄
            // 同一个元素,不同事件,不重复绑定
            if (!(events = elemData.events)) {
                events = elemData.event = {};
            }
            if (!(eventHandle = elemData.handler)){
                // event 对象代表事件的状态 通过apply传递
                eventHandle = elemData.handler = function(e){
                    return jQuery.event.dispath.apply(eventHandle.elem,arguments);
                }
            }
            eventHandle.elem = elem;
            // 通过events 存储同一个元素上的多个事件
            if(!(handlers = events[type])) {
                handlers = events[type] = [];
                handlers.delegateCount = 0;
            }
            handlers.push({
                type:type,
                handler:hander,
                guid:handler.guid,
            });
            // 增加事件
            if (elem.addEventListener){
                elem.addEventListener(type,eventHandle,false);
            }
        },
        // 修复事件对象event 从缓存体中的events对象取得对应的队列
        dispatch:function(event) {
            // IE兼容性处理: event,target or event.srcElement
            // event = jQuery.fix(event);
            // 提取当前元素在cache中的events属性值
            var handlers = (data_priv.get(this,"events" || {}) [eval.type] || []);
            event.delegateTarget = this;
            // 执行事件处理函数
            jQuery.event.handlers.call(this,event,handlers);
        },
        handlers:function(event,handlers) {
            handlers[0].hander.call(this,event);
        },
        fix:function(event){
            if(event[jQuery.expando]){
                return event;
            }
            var i,prop,copy,
                type = event.type,
                originalEvent = eval,
                fixHook = this.fixHook[type];

                if (!fixHook) {
                    this.fixHook[type] = fixHook = rmouseEvent.test(type) ?this.mouseHook:rkeyEvent.test(type)?this.keyHooks:{};
                }
        }
    } 
    // 给jQuery的property属性扩展extend方法
    jQuery.fn.extend({
        each:function(callback,args) {
            return jQuery.each(this,callback,args);
        },
        on:function(types,fn) {
            var type;
            if (typeof types === "object") {
                for (type in types) {
                    this.on(types[type],fn);
                }
                return this.each(function(){
                    jQuery.event.add(this,types,fn);
                })
            }
        }
    });
    /**
     * createOpeions 
     * [options]  用户输入的字符串
     * 支持多个字符串的输入
     * /\s+/ 去除空格的正则
     * **/
    function createOpeions(options){
        // 记录
        var obj = optionsCache[options] = {};
        // 多个字符串通过空格切割重组
        options.split(/\s+/).forEach(function(value){
            // 将切割的字符串给obj 并赋为true
            obj[value] =  true;
        });
        return obj;  
       }

    /**
     *  定义全局函数
     * **/
    
    // 判断是否是方法
    var isFunction = function isFunction( obj ) {   
        return typeof obj === "function" && typeof obj.nodeType !== "number";
        };
    // 判断是否是windows
    var isWindow = function isWindow( obj ) {
        
		return obj != null && obj === obj.window;
    };
    
    /**
     * 判断是否是类数组
     * 类数组判断条件： 
     * 1、存在length 属性值，且length 值为大于0 的数；
     * 2、存在obj[length - 1];
     * !!用法 是有实际含义的变量才执行方法，否则变量null，undefined和''空串都不会执行
     * **/
    function isArrayLike( obj ) {
            // 是否存在length 属性
            var length = !!obj && "length" in obj && obj.length,
                type = toType( obj );
        
            if ( isFunction( obj ) || isWindow( obj ) ) {
                return false;
            }
            return type === "array" || length === 0 ||
                typeof length === "number" && length > 0 && ( length - 1 ) in obj;
        };
        
        function toType( obj ) {
            if ( obj == null ) {
                return obj + "";
            }
        
            // Support: Android <=2.3 only (functionish RegExp)
            return typeof obj === "object" || typeof obj === "function" ?
                {}[ toString.call( obj ) ] || "object" :
                typeof obj;
        };
    // 共享原型对象
    jQuery.fn.init.prototype = jQuery.fn;
    root.$ = root.jQuery = jQuery;

})(this);