class Demo {
    constructor ({
        dom,
        data,
        showBorder = false,
        titleColor = '#fff',
        titleFontSize = 20
    }) {
        if (!dom) {
            console.error('请传入dom')
            return
        }
        createjs.Ticker.timingMode = createjs.Ticker.RAF
        this.graphicsType = 'line'
        this.startPoint = {
            x: 0,
            y: 0
        }
        this.showBorder = showBorder
        this.dom = dom
        this.color = '#fff'
        this.lineWidth = 1
        this.doms = {
            colorDom: document.getElementById('color'),
            lineWidth: document.getElementById('lineWidth')
        }
        this.canvas = document.createElement('canvas')
        this.canvas.width = this.dom.offsetWidth
        this.canvas.height = this.dom.offsetHeight
        this.dom.appendChild(this.canvas)
        // 创建舞台
        this.stage = new createjs.Stage(this.canvas)
        createjs.Ticker.on('tick', this.stage)
        this.shape = new createjs.Shape()
        this.stage.addChild(this.shape);
        this.addEvent()
    }

    // 添加事件
    addEvent () {
        let me = this
        // mousemove事件，按下添加事件，抬起解绑事件
        let mousemove = (e) => {
            if (me.graphicsType === 'circle') {
                let changeX = Math.abs(e.offsetX - this.startPoint.x)
                let changeY = Math.abs(e.offsetY - this.startPoint.y)
                let R = Math.max(changeX, changeY)
                me.newCircle.graphics.clear()
                .setStrokeStyle(me.lineWidth, 'round').beginStroke(me.color)
                .arc(this.startPoint.x, this.startPoint.y, R, 0, Math.PI*2)
            } else if (me.graphicsType === 'line') {
                this.shape.graphics.lt(e.offsetX, e.offsetY)
            } else if (me.graphicsType === 'rect') {
                let changeX = Math.abs(e.offsetX - this.startPoint.x)
                let changeY = Math.abs(e.offsetY - this.startPoint.y)
                me.newRect.graphics.clear()
                .setStrokeStyle(me.lineWidth, 'round').beginStroke(me.color)
                .rect(this.startPoint.x, this.startPoint.y, changeX, changeY)
            } else if (me.graphicsType === 'eraser') {
                this.newEraser.graphics.beginFill('#000').rect(e.offsetX, e.offsetY, 10, 10)
            }
        }
        this.dom.addEventListener('mousedown', e => {
            me.getOp()
            this.startPoint = {
                x: e.offsetX,
                y: e.offsetY
            }
            if (me.graphicsType === 'circle') {
                me.newCircle = new createjs.Shape()
                me.stage.addChild(me.newCircle)
            } else if (me.graphicsType === 'line') {
                this.shape.graphics.setStrokeStyle(me.lineWidth, 'round').beginStroke(me.color).mt(e.offsetX, e.offsetY)
            } else if (me.graphicsType === 'rect') {
                me.newRect = new createjs.Shape()
                me.stage.addChild(me.newRect)
            } else if (me.graphicsType === 'eraser') {
                me.newEraser = new createjs.Shape()
                me.stage.addChild(me.newEraser)
            }
            this.dom.addEventListener('mousemove', mousemove)
        })
        this.dom.addEventListener('mouseup', e => {
            this.dom.removeEventListener('mousemove', mousemove)
        })
        me.setGraphicsType('line')
        me.setGraphicsType('circle')
        me.setGraphicsType('rect')
        me.setGraphicsType('eraser')

        window.addEventListener('resize', () => {
            me.resize()
        })
    }
    /**
     * 给按钮类型绑定事件
     * @param {String} type 
     */
    setGraphicsType (type) {
        let me = this
        let Btn = document.querySelector('#' + type)
        Btn.addEventListener('click', e => {
            me.graphicsType = type
        })
    }
    getOp () {
        this.color = this.doms.colorDom.value
        this.lineWidth = this.doms.lineWidth.value
    }

    // 自适应
    resize () {
        this.canvas.width = this.dom.offsetWidth
        this.canvas.height = this.dom.offsetHeight
    }
}
