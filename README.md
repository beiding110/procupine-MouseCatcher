# procupine-MouseCatcher
记录鼠标在窗口中的位置信息并进行存储的类

new MCer({
    // mode: 'show',
    handler: function(data) {
        this.showMap({
            data: data,
            range: [3]
        })
    }
});

MCer类，相较直接记录，该类多了一步数据合并操作，会将连续的，在一定范围内的点进行数据合并，从而减少数据量；

实例参数：
    mode：实例类型，为'show'时为演示模式，会自动生成演示画板并绘制数据;
    handler：数据合并后的回调函数；
MCer类方法：
    showMap：在body插入生成数据展图，参数可以为数组，也可以为设置对象；
        数组：即类处理生成后的数据格式
            [{
                x: x,
                y: y,
                value: value
            }],
        对象：包含data属性和range属性，其中data属性必选，同上数据格式，range属性为渲染中，可生成元素的数据格式中value值的阈值，为一个长度为1或2的数组；
