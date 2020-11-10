const { globalData: { api } } = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        mode: false,            // false表示修改
        model: {
            id: 0,
            receiveName: '',
            receivePhone: '',
            receiveRegion: '',
            receiveDetail: '',
            isDefault: 0   
        }
    },

    /* 结束编辑 */
    endOperate: function() {
        wx.navigateBack();
    },

    /* 改变新增状态的默认地址 */
    setDefault: function(e) {
        if(parseInt(e.currentTarget.dataset.id) === 1) return;
        let id = e.currentTarget.dataset.id === '1' ? '0' : '1';
        this.setData({ ['model.isDefault']: parseInt(id) });
    },

    /* 设置收货人姓名 */
    setReceiveName: function(e) {
        this.setData({ ['model.receiveName']: e.detail.value });
    },

    /* 设置收货人电话 */
    setReceivePhone: function(e) {
        this.setData({ ['model.receivePhone']: e.detail.value });
    },

    /* 设置收货人地址 */
    setReceiveRegion: function(e) {
        this.setData({ ['model.receiveRegion']: e.detail.value });
    },

    /* 设置收货人街道 */
    setReceiveDetail: function(e) {
        this.setData({ ['model.receiveDetail']: e.detail.value });
    },

    /* 保存新增或修改结果 */
    save: async function() {
        const eventChannel = this.getOpenerEventChannel();
        if(this.data.mode) {
            let id = await api.address.add(this.data.model);
            this.data.model.id = id;
            eventChannel.emit('endAdd', { ...this.data.model });
            wx.showToast({ title: '新增地址成功！', icon: 'success' });
        }
        else {
            await api.address.update(this.data.model);
            eventChannel.emit('endUpdate', { ...this.data.model, isDelete: false });
            wx.showToast({ title: '修改地址成功！', icon: 'success' });
        }
        wx.navigateBack();
    },

    /* 删除收货地址 */
    remove: async function() {
        let id = this.data.model.id;
        await api.address.remove(id);
        const eventChannel = this.getOpenerEventChannel();
        eventChannel.emit('endUpdate', { id, isDelete: true });
        wx.showToast({ title: '删除地址成功！', icon: 'success' });
        wx.navigateBack();
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let eventChannel = this.getOpenerEventChannel();
        eventChannel.on('beginUpdate', data => {
            let { mode, model } = data;
            this.setData({ mode, model });
        });
        eventChannel.on('beginAdd', data => {
            let { mode, model } = data;
            this.setData({ mode, model });
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