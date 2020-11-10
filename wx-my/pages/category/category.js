const { globalData: { api }, observe } = getApp();

// pages/category/category.js
Page({
    data: {
        listMain: [],
        activeId: 0,
        listSub: []
    },

    actived: async function(e) {
        this.setData({ activeId: e.currentTarget.dataset.item.id });
    },
    
    watch: {
        activeId: async function(newValue, oldValue) {
            // 这个函数会在data中的activeId变化时自动调用
            // 这个函数调用时第一个参数是activeId的新值，第二个是旧值
            // 必须保证这个函数内部的this指针指向的是当前的Page
            let data = await api.category.list(newValue);
            this.setData({ listSub: data });
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        // 调用自定义函数，让当前Page具有使用watch监听data中数据变化的能力
        observe(this);
        let data = await api.category.list(0);
        this.setData({
            listMain: data,
            activeId: data[0].id
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