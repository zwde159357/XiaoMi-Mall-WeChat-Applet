const { globalData: { api } } = getApp();

Page({
    data: {
        listAll: [],
        activeId: 0
    },

    /* 获取所有订单信息 */
    getList: async function(e) {
        if(this.data.listAll.some(item => item.status === '待付款')) {
            this.data.listAll.forEach((item,i) => {
                if(item.status === '待付款') {
                    clearInterval(item.timer);
                }
            });
        }
        let id = parseInt(e.currentTarget.dataset.id);
        let list = await this._getAll();
        let listAll = [];
        if(id === 0) listAll = list;
        else if(id === 1) listAll = list.filter(item => item.status === '待付款');
        else if(id === 2) listAll = list.filter(item => item.status === '待收货');
        else listAll = [];
        this.setData({ activeId: id, listAll });
        this._isNeedTime();
    },
    /* 获取所有订单 */
    _getAll: async function() {
        let listAll = await api.order.all();
        listAll.forEach((item,i) => {
            let nowTime = new Date().getTime();
            let startTime = new Date(item.orderTime).getTime();
            let time = nowTime - startTime;
            if(item.pay === 1) item.status = '待收货';
            else if(time > 0.5*3600*1000) item.status = '已取消';
            else item.status = '待付款';
            let total = 0;
            item.details.forEach(it => total = total + it.count);
            item.total = total;
            item.time = '';
            item.timer = null;
        });
        return listAll;
    },

    /* 计时器 */
    _setTime: function(endTime, orderId) {
        let i = this.data.listAll.findIndex(item => item.orderId === orderId);
        let temp1 = "listAll[" + i + "].time";
        let temp2 = "listAll[" + i + "].timer";
        this.setData({ [temp1]: '', [temp2]: null });
        let timer = setInterval(() => {
            var diff = endTime - new Date().getTime();
            if(diff <= 0) {
                clearInterval(timer);
                this.setData({ [temp2]: null });
                wx.showToast({
                  title: '订单已取消',
                  icon: 'none'
                })
                return;
            }
            var hourBit = parseInt(diff / 3600000) ;
            if(hourBit >= 10) var hourTen = '';
            else var hourTen = 0
            var minuteTen = parseInt(diff % 3600000 / 60000 / 10);
            var minuteBit = parseInt(diff % 3600000 / 60000 % 10);
            var secondTen = parseInt(diff % 3600000 % 60000 / 1000 / 10);
            var secondBit = parseInt(diff % 3600000 % 60000 / 1000 % 10);
            let time = '' + hourTen + hourBit + ':' + minuteTen + minuteBit + ':' + secondTen + secondBit;
            this.setData({ [temp1]: time });
        }, 1000);
        this.setData({ [temp2]: timer });
    },

    /* 是否需要计时器 */
    _isNeedTime: function() {
        if(this.data.listAll.some(item => item.status === '待付款')) {
            this.data.listAll.forEach(item => {
                if(item.status === '待付款') {
                    let endTime = new Date(item.orderTime).getTime() + 0.5*3600*1000;
                    this._setTime(endTime, item.orderId);
                }
            });
        }
    },

    /* 退款操作 */
    beginRefund: function() {
        wx.showModal({
            title: '提示:',
            content: '确定要退款吗？',
            success: res => {
                if(res.confirm) {
                    wx.showToast({ title: '进我口袋的钱，别想出去！', icon: 'none' });
                }
            }
        });
    },

    /* 删除订单 */
    beginRemove: function(e) {
        wx.showModal({ 
            title: '提示：',
            content: '确定要删除吗？',
            success: async res => {
                if(res.confirm) {
                    let listAll = this.data.listAll;
                    if(listAll.some(item => item.status === '待付款')) {
                        listAll.forEach((item,i) => {
                            if(item.status === '待付款') {
                                clearInterval(item.timer);
                            }
                        });
                    }
                    let id = e.currentTarget.dataset.id;
                    let i = this.data.listAll.findIndex(item => item.orderId === id);
                    listAll.splice(i, 1);
                    await api.order.remove(id);
                    this.setData({ listAll: [ ...listAll ] });
                    wx.showToast({ title: '删除成功！', icon: 'success' });
                    this._isNeedTime();
                }
            }
         });
    },

    /* 再次购买 */
    beginBuyAgain: function(e) {
        wx.showModal({ 
            title: '提示：',
            content: '确定要再次购买吗？',
            success: async res => {
                if(res.confirm) {
                    let id = e.currentTarget.dataset.id;
                    let it = this.data.listAll.find(item => item.orderId === id);
                    it.details.forEach(async item => {
                        await api.cart.add({ pid: item.id, count: item.count, price: item.price });
                    });
                    await api.order.remove(id);
                    wx.switchTab({ url: '/pages/cart/cart' });
                }
            }
         });
    },

    /* 付款 */
    beginPay: function(e) {
        wx.navigateTo({ url: '/pages/pay/pay?id=' + e.currentTarget.dataset.id });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        let listAll = await this._getAll();
        this.setData({ listAll });
        this._isNeedTime();
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