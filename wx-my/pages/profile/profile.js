const { globalData: { api } } = getApp();

Page({

    data: {
        defaultImage: '/images/profile/user1.png',
        isLogin: true,         // 是否登录
        userInfo: {}
    },

    /* 去地址页面 */
    gotoAddress:function() { wx.navigateTo({ url:'/pages/address/address' }); },

    /* 去订单页面 */
    gotoOrder: function() { wx.navigateTo({ url:'/pages/order/order' }); },

    /* 更新用户信息 */
    updateUserInfo: function() {
        wx.navigateTo({
          url: '/pages/profile_edit/profile_edit?userInfo=' + JSON.stringify(this.data.userInfo)
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        let userInfo = await api.user.user_info();
        this.setData({ userInfo });
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
        let userInfo = await api.user.user_info();
        this.setData({ userInfo });
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