const { globalData: { api } } = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        ids: [],
        list: [],
        account: 0,
        address: {}
    },

    gotoAddress: function() {
        wx.navigateTo({
          url: '/pages/address/address',
          events: {
              getNewAddress: data => {
                  this.setData({ address: data });
              }
          }
        });
    },
    generateOrder: function() {
        wx.showModal({
            title: '提示',
            content: '确定要生成订单吗？',
            success: async res => {
                if(!res.confirm) return;
                if(!this.data.address) {
                    wx.showToast({ title: '地址为空，请添加商品邮寄地址！', icon: 'none' });
                    return;
                }
                let data = {
                    ids: this.data.ids,
                    account: this.data.account,
                    addressId: this.data.address.id
                };
                let id = await api.order.confirm(data);
                wx.navigateTo({ url: '/pages/pay/pay?id=' + id });
            }
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        let data = await api.cart.list_ids({ ids: options.ids.split(',') });
        let account = 0;
        let address = await api.address.get_default();
        data.forEach(item => {
            account = account + item.price * item.count;
        });
        this.setData({ 
            ids: options.ids.split(','),
            list: data,
            account,
            address
         });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: async function () {

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