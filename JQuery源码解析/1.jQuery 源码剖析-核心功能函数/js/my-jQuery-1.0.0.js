// 闭包 立即执行函数
(function(root){
    var jQuery = function() {
        return new jQuery.prototype.init();
    }

    jQuery.fn = jQuery.prototype = {
        init:function () {

        },
        css:function(){

        }
    }
 // 判断是否是方法
    var isFunction = function isFunction( obj ) {   
    return typeof obj === "function" && typeof obj.nodeType !== "number";
    };


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

    // 扩展属性和方法
    jQuery.extend({
        // 类型检测
        isPlainObject: function(obj) {
            // "[object Object]" 第二个O一定是大写,坑了我好几个小时.......
            return toString.call(obj) === "[object Object]";
        },
        isArray: function(obj) {
            return toString.call(obj) === "[object Array]";
        }
    });

    // 共享原型对象
    jQuery.fn.init.prototype = jQuery.fn;
    root.$ = root.jQuery = jQuery;

})(this);