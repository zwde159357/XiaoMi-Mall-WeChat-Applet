const { globalData: { api } } = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        address: [],
    },

    /* 开始新增地址 */
    beginAdd: function() {
        let mode = true;
        let model = {
            id: 0,
            receiveName: '',
            receivePhone: '',
            receiveRegion: '',
            receiveDetail: '',
            isDefault: 0   
        }
        wx.navigateTo({
            url: '/pages/address_edit/address_edit',
            events: {
                endAdd: async data => {
                    this.data.address.push(data);
                    if(data.isDefault) {
                        await api.address.set_default(data.id);
                        this.data.address.forEach(item => item.isDefault = 0);
                        this.data.address.find(item => item.id === data.id).isDefault = 1;
                    }
                    this.setData({ address: [...this.data.address] });
                }
            },
            success: res => {
                res.eventChannel.emit('beginAdd', { mode, model });
            }
        });
    },

    /* 开始修改地址 */
    beginEdit: function(e) {
        let item = e.currentTarget.dataset.item;
        let mode = false;
        let model = {
            id: item.id,
            receiveName: item.receiveName,
            receivePhone: item.receivePhone,
            receiveRegion: item.receiveRegion,
            receiveDetail: item.receiveDetail,
            isDefault: item.isDefault   
        };
        wx.navigateTo({
            url: '/pages/address_edit/address_edit',
            events: {
                 endUpdate: async data => {
                    let i = this.data.address.findIndex(it => it.id == data.id);
                    if(data.isDelete) { 
                        this.data.address.splice(i, 1);
                    } else {
                        this.data.address.splice(i, 1, data);
                        if(model.isDefault) {
                            await api.address.set_default(model.id);
                            this.data.address.forEach(item => item.isDefault = 0);
                            this.data.address.find(item => item.id === data.id).isDefault = 1;
                        }
                    }
                    this.setData({ address: JSON.parse(JSON.stringify(this.data.address)) });
                 }
            },
            success: res => {
                res.eventChannel.emit('beginUpdate', { mode, model });
            }
         });
    },

    /* 返回上一页面 */
    goBack: function() { wx.navigateBack({ delta: 1 }); },

    /* 返回订单确认页面 */
    backOrderConfirm: function(e) {
        let pages = getCurrentPages();
        let prevPage = pages[pages.length - 2];
        if(!prevPage) return;
        if(prevPage.route.indexOf('pages/order_confirm/order_confirm') !== - 1) {
            let id = parseInt(e.currentTarget.dataset.id);
            let address = this.data.address.find(item => item.id === id);
            const eventChannel = this.getOpenerEventChannel();
            eventChannel.emit('getNewAddress', { ...address });
            wx.navigateBack();
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        let address = await api.address.list();
        this.setData({ address });
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