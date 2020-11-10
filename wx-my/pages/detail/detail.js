// pages/detail/detail.js
const { globalData: { api } } = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: 0,
        topShow: false,         // 头部是否显示
        activeItem: 1,
        titleShow: false,       // 商品详情标题是否显示
        product: {},            // 该商品的详细数据
        bannerImgs: [],         // 轮播图照片
        otherImgs: [],          // 详情照片
        count: 1,               // 已选择商品的数量
        countAll: 0,            // 购物车中所有商品的数量
        isHide: true,           
        token: ''               // 是否登录
    },

    decreaseHandler: function() { this.setData({ count: this.data.count - 1 }); },
    increaseHandler: function(e) { this.setData({ count: this.data.count + 1 }); },
    popCart: function() { this.setData({ isHide: false }) },
    popClose: function() { this.setData({ isHide: true }) },
    scrollTo: function(e) { 
        console.log(e.currentTarget.dataset.id);
        if(e.currentTarget.dataset.id === '1') {
            wx.pageScrollTo({ scrollTop: 0 });
        } else if(e.currentTarget.dataset.id === '2') {
            wx.pageScrollTo({ scrollTop: 820 });
        } else if(e.currentTarget.dataset.id === '3') {
            wx.pageScrollTo({ scrollTop: 1250 });
        } else {
            wx.pageScrollTo({ scrollTop: 5200 });
        }
    },
    gotoTop: function() { wx.pageScrollTo({ scrollTop: 0 }); },
    gotoCart: function() {
        wx.switchTab({ url: "/pages/cart/cart" });
    },
    save: async function() {
        await api.cart.add({ pid: this.data.id, count: this.data.count, price: this.data.product.price });
        this.setData({ isHide: true, countAll: this.data.countAll + this.data.count });
        wx.showToast({ title: '商品新增成功！', icon: "success" });

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        this.setData({ 
            id: parseInt(options.id),
        });
        let data = await api.product.model(parseInt(this.data.id));
        if(data.bannerImgs) {
            this.setData({ 
                product: data,
                bannerImgs: data.bannerImgs.split(','),
                otherImgs: data.otherImgs.split(','),
                token: wx.getStorageSync('token')
            });
        }
        if(wx.getStorageSync('token')) {
            let count = await api.cart.countAll();
            this.setData({ countAll: count });
        }
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
        if(wx.getStorageSync('token')) {
            let count = await api.cart.countAll();
            this.setData({ countAll: count });
        }
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

    },
    onPageScroll: function(e) {
        if(e.scrollTop >= 100 && this.data.rocketHide)
            this.setData({ rocketHide: false });
        if(e.scrollTop < 100 && !this.data.rocketHide)
            this.setData({ rocketHide: true });
        if(e.scrollTop > 100 && !this.data.topShow) {
            this.setData({ topShow: true });
        }
        if(e.scrollTop < 100 && this.data.topShow) {
            this.setData({ topShow: false });
        }
        if(e.scrollTop > 5150) {
            this.setData({ activeItem: 4 });
        } else if(e.scrollTop > 1240) {
            this.setData({ 
                activeItem: 3,
                titleShow: true
            });
        } else if(e.scrollTop > 800) {
            this.setData({ 
                activeItem: 2,
                titleShow: false
            });
        } else {
            this.setData({ 
                activeItem: 1,
                titleShow: false
            });
        }
    }
})