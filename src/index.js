function MCer(obj) {
    this.init(obj);
};
MCer.prototype = {
    $store: [],
    $last_pos: {},
    $computer: null,
    $max_length: 30,
    init(obj) {
        console.log('init');
        document.addEventListener('mousemove', function(e) {
            this.$store.push(this.getMousePos(e));
        }.bind(this));
        document.addEventListener('scroll', function(e) {
            console.log(e.target.scrollTop)
        });

        this.$computer = setInterval(function() {
            /*私有堆栈*/
            this.storeReCalculater(obj);
        }.bind(this), 100);
    },
    getMousePos(event) {
        var e = event || window.event;
        var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
        var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
        var x = e.pageX || e.clientX + scrollX;
        var y = e.pageY || e.clientY + scrollY;
        console.log('x: ' + x + '\ny: ' + y);
        return { 'x': x, 'y': y };
    },
    showMap(setting) {
        var data;
        if(typeof(setting) === 'object' && Array.isArray(setting)) {
            data = setting;
        }else {
            data = setting.data;
        }
        var canvas = document.getElementById('MCer__canvas');
        if(!canvas) {
            var canvas_e = document.createElement('canvas');

            canvas_e.id = 'MCer__canvas';
            canvas_e.style.position = 'absolute';
            canvas_e.style.left = '0px';
            canvas_e.style.top = '0px';
            canvas_e.style.right = '0px';
            canvas_e.style.bottom = '0px';

            canvas_e.width = window.innerWidth;
            canvas_e.height = window.innerHeight;

            document.body.append(canvas_e);

            canvas = canvas_e;
        }

        var ctx = canvas.getContext("2d");

        function draw(item) {
            var r = 0, g = 255, b = 0;
            ctx.beginPath();

            /*根据value值生成颜色*/
            r = (10.2 * item.value);
            g = 255 - (10.2 * item.value);
            g = g > 255 ? 255 : g;
            ctx.strokeStyle = 'rgba(' + r + ', ' + g + ', 0, 0.1)';

            ctx.arc(item.x, item.y, item.value, 0 ,2*Math.PI);
            ctx.stroke();
        }

        data.forEach(function(item) {

            if(setting.range) {
                var range = setting.range;
                if(range[1]) {
                    if(item.value >= range[0] && item.value <= range[1]) {
                        draw(item);
                    }
                }else {
                    if(item.value >= range[0]) {
                        draw(item);
                    }
                }
            }else {
                draw(item);
            }

            // var div = document.createElement('div');
            // div.style.width = (item.value * 10) + 'px';
            // div.style.height = (item.value * 10) + 'px';
            // div.style.position = 'absolute';
            // div.style.left = item.x + 'px';
            // div.style.top = item.y + 'px';
            // div.style.background = 'rgba(0,0,0,0.2)';
            // div.style.transform = 'translate(-50%, -50%)';
            // document.body.append(div)
        })
    },
    storeReCalculater(obj) {
        var private_store = [];
        console.log(this.$store);

        function lastCheck(item, index) {
            if(index === (this.$store.length - 1)) {
                this.$last_pos = item;
            }
        }

        if(this.$store.length > 0) {
            this.$store.forEach(function(item, index) {
                var private_store_length = private_store.length;
                if(private_store_length > 0) {
                    var last = private_store[private_store_length - 1];

                    /*计算两点之间的距离，勾股定理 */
                    var length = (Math.sqrt(Math.pow(item.x - last.x, 2) + Math.pow(item.y - last.y, 2)));
                    /*判断是否超过设定的最大距离
                      超过则认为是个新的操作点*/
                    if(length > this.$max_length) {
                        private_store.push(item);
                        lastCheck.call(this, item, index);
                        /*否则与之前的一个点进行合并*/
                    } else {
                        var new_last = {};
                        new_last.value = (last.value || 1) + 1;

                        /*重新计算生成上一个点的坐标，并根据所设定的最大值计算偏移量*/
                        new_last.x = (Math.abs(last.x - item.x) / this.$max_length) + last.x;
                        new_last.y = (Math.abs(last.y - item.y) / this.$max_length) + last.y;

                        private_store.splice(private_store_length - 1, 1, new_last);
                        lastCheck.call(this, new_last, index);
                    }
                }else {
                    /*第一个点入栈*/
                    item.value = 1;
                    private_store.push(item);
                    lastCheck.call(this, item, index);
                }
            }.bind(this));
        }else {
            var last = this.$last_pos;
            last.value = (last.value || 1) + (10 / ((last.value || 1) * ((last.value || 1) + 1)));
            private_store.push(last);
        }

        this.$store.splice(0, this.$store.length);
        console.log(private_store);

        if(obj.mode == 'show') {
            this.showMap(private_store);
        }

        obj.handler && obj.handler.call(this, private_store);

        return private_store;
    }
}

module.exports = MCer;
