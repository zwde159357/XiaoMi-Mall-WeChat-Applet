const { globalData: { api } } = getApp();

Page({
    data: {
        cid: 0,
        name: '',
        orderDir: 'asc',
        orderCol: 'price',
        begin: 0,
        pageSize: 6,
        list: [],
        isLoading: false,           // 标识当前是否处于ajax交互状态
        hasMore: true,              // 标识按当前条件查找商品还有没有更多
        rocketHide: true,          // 标识返回顶部的火箭是否显示
        showWithCard: true          // 是否以卡片形式展示
    },
    nameChangeHandler: function(e) {
        this.setData({ name: e.detail.value });
    },
    toggleOrderCol: function(e) {
        if(this.data.isLoading) {
            wx.showToast({
              title: '您的操作太频繁了..',
              icon: 'none'
            });
            return;
        }
        if(this.data.orderCol === e.currentTarget.dataset.col) return;
        this.setData({
            orderCol: e.currentTarget.dataset.col
        });
        this._updateProductList();
    },
    toggleOrderDir: function(e) {
        if(this.data.isLoading) {
            wx.showToast({
                title: '您的操作太频繁了..',
                icon: 'none'
              });
            return;
        }
        this.setData({
            orderDir: this.data.orderDir === 'asc' ? 'desc' : 'asc'
        });
        this._updateProductList();
    },
    showCard: function(e) {
        this.setData({ showWithCard: !this.data.showWithCard });
    },
    _updateProductList(isLoadMore = false) {
        this.setData({ isLoading: true });			// 进入loading状态
        if(!isLoadMore) {
            // this.rocketShow = false; // 根据是否加载更多来处理ul.product-list
            this.setData({ list: [], rocketHide: true });	
        }
        setTimeout( async () => {
            let list = await api.product.list({
                name: this.data.name,
                cid: this.data.cid,				// ES6技术，键值对简写
                orderCol: this.data.orderCol,
                orderDir: this.data.orderDir,
                begin: this.data.list.length,
                pageSize: this.data.pageSize
            });
            this.setData({
                isLoading: false,
                hasMore: list.length === this.data.pageSize,
                list: [...this.data.list, ...list]
            });
        }, 800);
    },

    gotoTop: function() { wx.pageScrollTo({ scrollTop: 0 }); },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({ cid: parseInt(options.id) });
        this._updateProductList();
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
        if(this.data.hasMore && !this.data.isLoading) {
            this._updateProductList(true);
        }
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
    }
});