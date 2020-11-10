const { globalData: { api } } = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        defaultAvatar: './user_default.jpg',
        profile: {
            nick_name: '',
            avatar: '',
            avatar2: ''
        },
        preview: {
            show: false,
            src: ''
        }
    },

    /* 绑定昵称 */
    setName: function(e) { this.setData({ 'profile.nick_name': e.detail.value }); },

    /* 选择上传照片 */
    chooseImage: function() {
        wx.chooseImage({
          count: 1,
          sourceType: ["album", "camera"],
          success: res => {
              this.setData({ 'profile.avatar2': res.tempFilePaths[0] });
          }
        })
    },

    /* 预览图片 */
    previewImage: function() {
        if(this.data.defaultAvatar) {
            this.setData({ preview: { show: true, src: this.data.profile.avatar2 } });
        }
        
    },

    /* 恢复图片 */
    resumeImage: function() {
        this.setData({ preview: { show: false, src: '' }, 'profile.avatar2': this.data.profile.avatar });
    },

    /* 退出预览 */
    quitImage: function() {
        this.setData({ preview: { show: false, src: '' } });
    },

    /* 更新个人资料 */
    updateUserInfo: async function() {
        if(this.data.profile.avatar2 !== '') {
            wx.uploadFile({
                filePath: this.data.profile.avatar2,
                name: 'file',
                url: 'http://192.168.110.100:1314/user/update',
                formData: this.data.profile,
                header: {
                    'authorization': wx.getStorageSync('token'),
                    'content-type': "multipart/form-data"
                },
                success: res => {
                    wx.showToast({ title: '更新成功', icon: 'success' });
                    wx.navigateBack();
                },
                fail: res => {
                    wx.showToast({ title: '更新失败', icon: 'none' });
                }
            });
        } else {
            // 调用另外的http请求就可以了
            await api.user.update_name(this.data.profile.nick_name);
            wx.showToast({ title: '更新成功', icon: 'success' });
            wx.navigateBack();
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let profile = JSON.parse(options.userInfo);
        profile.avatar2 = '';
        this.setData({ profile });
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