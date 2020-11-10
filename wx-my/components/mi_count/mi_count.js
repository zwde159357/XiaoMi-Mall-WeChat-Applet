// components/mi_count/mi_count.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        count: Number,
        maxCount: {
            type: Number,
            value: 5
        }
    },

    options: {
        styleIsolation: 'isolated'
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        decreaseHandler: function() {
            if(this.data.count === 1) {
                wx.showToast({ title: '至少买一个', icon: 'none' });
                return;
            }
            this.triggerEvent('decrease');
        },
        increaseHandler: function() {
            if(this.data.count === this.data.maxCount) {
                wx.showToast({ title: '已达到购买上限', icon: 'none' });
                return;
            }
            this.triggerEvent('increase');
        }
    }
})
