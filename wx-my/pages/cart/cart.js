const { globalData: { api }, observe } = getApp();

Page({
    data: {
        showTop: false,         // 是否显示头部
        list: [],               // 购物车中的商品
        countAll: 0,            // 总商品数量
        account: 0,             // 商品总价格
        isEdit: false,          // 是否需要编辑
        isBuyAllChecked: true,  // 购买是否全选
        isDelAllChecked: false  // 删除是否全选

    },
 
    /* 计算商品总数量和总价格 */
    _updateData: function() {
        let countAll = 0, account = 0;
        this.data.list.filter(item => item.isBuyChecked).forEach(item => {
            countAll += item.count;
            account += item.count * item.price;
        });
        this.setData({ countAll, account });
    },

    /* 商品数量增加 */
    increaseHandler: async function(e) {
        console.log(e);
        let it = e.currentTarget.dataset.item;
        let i = this.data.list.findIndex(item => item.id === it.id);
        let temp = "list[" + i + "].count";
        this.setData({ [temp]: it.count + 1 }); 'list[i].count'
        await api.cart.increase(it.id);
        this._updateData();
    },

    /* 商品数量减少*/
    decreaseHandler: async function(e) {
        let it = e.currentTarget.dataset.item;
        let i = this.data.list.findIndex(item => item.id === it.id);
        let temp = "list[" + i  + "].count";
        this.setData({ [temp]: it.count - 1 });
        await api.cart.decrease(it.id);
        this._updateData();
    },

    /* 开始编辑商品 */
    beginEdit: function() { this.setData({ isEdit: !this.data.isEdit }); },
    
    /* 购买是否全选 */
    checkAllBuy: function() {
        this.setData({ isBuyAllChecked: !this.data.isBuyAllChecked });
        this.data.list.forEach((item, i) => {
            let temp = "list[" + i  + "].isBuyChecked";
            this.setData({ [temp]: this.data.isBuyAllChecked });
        });
        this._updateData();
    },

    /* 删除是否全选 */
    checkAllDel: function() {
        this.setData({ isDelAllChecked: !this.data.isDelAllChecked });
        this.data.list.forEach((item, i) => {
            let temp = "list[" + i  + "].isDelChecked";
            this.setData({ [temp]: this.data.isDelAllChecked });
        });
        this._updateData();
    },
    
    /* 单个购买勾选 */
    checkBuy: function(e) {
        let it = e.currentTarget.dataset.item;
        let i = this.data.list.findIndex(item => item.id === it.id);
        let temp = "list[" + i  + "].isBuyChecked";
        this.setData({ [temp]: !it.isBuyChecked });
        if(this.data.list.every(item => item.isBuyChecked))
            this.setData({ isBuyAllChecked: true });
        if(this.data.list.some(item => !item.isBuyChecked))
            this.setData({ isBuyAllChecked: false });
        this._updateData();
    },

    /* 单个删除勾选 */
    checkDel: function(e) {
        let it = e.currentTarget.dataset.item;
        let i = this.data.list.findIndex(item => item.id === it.id);
        let temp = "list[" + i  + "].isDelChecked";
        this.setData({ [temp]: !it.isDelChecked });
        if(this.data.list.every(item => item.isDelChecked))
            this.setData({ isDelAllChecked: true });
        if(this.data.list.some(item => !item.isDelChecked))
            this.setData({ isDelAllChecked: false });
        this._updateData();
    },

    /* 删除选中的商品 */
    remove: async function() {
        let delList = [];
        let list = this.data.list;
        list.forEach(item => {
            if(item.isDelChecked) { delList.push(item.id); }
        });

        if(delList.length === 0) { 
            wx.showToast({ title: '未选择要删除的商品,请选择', icon: 'none' });
            return;
        }
        await api.cart.remove({ ids: delList });
        delList.forEach(item => {
            let i = list.findIndex(it => it.id === item);
            list.splice(i, 1);
            console.log(list);
        });
        this.setData({ list });
        wx.showToast({ title: '删除成功!', icon: 'success' });
    },

    /* 购买选中的商品 */
    settle: function() {
        let buyList = [];
        let list = this.data.list;
        list.forEach(item => {
            if(item.isBuyChecked) { buyList.push(item.id); }
        });

        // if(buyList.length === 0) {
        //     wx.showToast({ title: '请选择商品', icon: 'none' });
        //     return;
        // }
        buyList.forEach(item => {
            let i = list.findIndex(it => it.id === item.id);
            list.splice(i, 1);
        });
        this.setData({ list });
        wx.navigateTo({ url: '/pages/order_confirm/order_confirm?ids=' + buyList });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        let list = await api.cart.list();
        list.forEach(it => { it.isBuyChecked = true; it.isDelChecked = false; });
        this.setData({ list });
        this._updateData();
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
        let list = await api.cart.list();
        list.forEach(it => { it.isBuyChecked = true; it.isDelChecked = false; });
        this.setData({ list });
        this._updateData();
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
        if(e.scrollTop > 50 && !this.data.showTop) {
            this.setData({ showTop: true });
        }
        if(e.scrollTop < 50 && this.data.showTop) {
            this.setData({ showTop: false });
        }
    }
})