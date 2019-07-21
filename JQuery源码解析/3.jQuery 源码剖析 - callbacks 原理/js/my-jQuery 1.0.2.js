/*
 * @Description: Callbacks 原理剖析
 * @Author: Geek-James
 * @Descript 仅仅是callbacks 函数实现没有其他任何源码
 * @Use 引入头文件 通过 _.callbacks()调用
 * @Date: 2019-07-21 11:11:18
 * @LastEditTime: 2019-07-21 20:33:01
 * @LastEditors: Please set LastEditors
 */
(function(window){
    // 定义一个 optionsCache 缓存对象
    var optionsCache = {};
    var _ = {
        callbacks :function(options){
            
            options = typeof options === "string"?(optionsCache[options]||createOption(options)):{};            
            // 定义一个队列用来添加函数
            var list = [];
            var length,index,testting,memory,start,starts;
            var fire  = function(data){
                // memory
                memory = options.memory && data;
                // 为了防止memory执行时,再次从头调用
                index = starts || 0;
                start = 0;
                length = list.length;
                testting = true; // 只有fire被调用时候,记录下testting
                for(;index<length;index++) {
                    // 找到队列中的每个函数通apply()执行
                    // data[0] ==>context self  data[1] ==>arguments 参数
                    if(list[index].apply(data[0],data[1]) === false && options.stopOnfalse){
                        // 终止执行
                        break;
                    }
                }
            }
            var self = {
                // 添加
                add:function(){
                 // ES6 语法直接可以通过... 赋值表达式完成此操作 
                 // Array.prototype.slice.call(arguments 伪数组转真数组   
                 var args = Array.prototype.slice.call(arguments);
                 start = list.length;
                 args.forEach(function(fn){
                    // 检索数据类型 是否是Function
                    if (toString.call(fn) === "[object Function]"){
                        // 方法是否已经存在
                        if(!options.unique || !self.has(fn,list)) {
                            list.push(fn);
                        }
                    }
                 });
                 if(memory) {
                    starts = start;
                    fire(memory);
                 }
                },
                // 上下文绑定
                fileWith:function(context,arguments){
                    var args = [context,arguments];
                    // 给fire方法做限制调用
                    if(!options.once || !testting) {
                        fire(args);
                    }
                },
                fire:function(){
                    self.fileWith(this,arguments);
                },
                has:function(fn,array){
                    // 检测拦截
                    return self.inArray(fn,array) > -1;
                },
                inArray:function(elem,arr){
                    return arr == null ? -1:[].indexOf.call(arr,elem);
                }
            }
            return self;
        }
    }
    
    /**
     * [createOption]   
     * [options]  用户输入的字符串
     * 支持多个字符串的输入
     * **/ 
    function createOption(options){
        // 记录
      var object = optionsCache[options] = {};
        // 多个字符串切割重组
        // \s+ 空格 正则
        options.split(/\s+/).forEach(function(value){
            // 将切割的value给到object
            object[value] = true;
        });
        return object;

    }
    // 给window 挂载一个 _  外界通过_就可以访问
    window._ = _;
})(this);
