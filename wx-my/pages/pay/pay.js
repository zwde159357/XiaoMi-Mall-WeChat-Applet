const { globalData: { api } } = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: 0,
        account: 0,
        isOne: true,            // 改变支付方式
        isPop: false,           // 是否弹出支付界面
        isPay: false,           // 是否已经付款
        timer: null,            // 计时器
        time: ''
    },

    /* 改变支付方式 */
    changePayWay: function() {
        this.setData({ isOne: !this.data.isOne });
    },

    /* 开始支付 */
    beginPay: function() {
        this.setData({ 
            isPop: true
         });
    },

    /* 关闭支付界面 */
    closePay: function() {
        this.setData({ 
            isPop: false
         });
    },

    /* 为订单支付 */
    payForOrder: function() {
        console.log(111);
        wx.showModal({
            title: '提示:',
            content: '确定要支付吗？',
            success: async res => {
                if(res.confirm) {
                    await api.order.pay(this.data.id);
                    clearInterval(this.data.timer);
                    this.setData({ timer: null });
                    wx.navigateTo({ url: '/pages/order/order' });
                    wx.showToast({ title: '恭喜您，付款成功！', icon: 'success' });
                }
            }
        });
    },

    /* 去订单管理页面 */
    gotoOrder: function() {
        if(this.data.isPay) {
            wx.navigateTo({ url: '/pages/order/order' });
        } else {
            wx.showModal({
                title: '提示:',
                content: '您还未付款，是否要退出付款页面？',
                success(res) {
                    if(res.confirm)
                        wx.navigateTo({ url: '/pages/order/order' });
                }
            });
        }
    },

    /* 计时器 */
    setTime: function(endTime) {
        let timer = setInterval(() => {
            var diff = endTime - new Date().getTime();
            if(diff <= 0) {
                clearInterval(timer);
                this.setData({ timer: null });
                wx.showToast({
                  title: '订单已取消',
                  icon: 'none'
                })
                wx.navigateTo({ url: '/pages/order/order' });
                return;
            }
            var hourTen = 0;
            var hourBit = parseInt(diff / 3600000) ;
            var minuteTen = parseInt(diff % 3600000 / 60000 / 10);
            var minuteBit = parseInt(diff % 3600000 / 60000 % 10);
            var secondTen = parseInt(diff % 3600000 % 60000 / 1000 / 10);
            var secondBit = parseInt(diff % 3600000 % 60000 / 1000 % 10);
            let time = '' + hourTen + hourBit + ':' + minuteTen + minuteBit + ':' + secondTen + secondBit;
            this.setData({ time });
        }, 1000);
        this.setData({ timer });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        let id = options.id;
        let account = await api.order.account(id);
        this.setData({ 
            id,
            account
        });
        let data = await api.order.all();
        let startTime = new Date(data.find(item => item.orderId === id).orderTime).getTime();
        let endTime = startTime + 0.5*3600*1000;
        this.setTime(endTime);
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})