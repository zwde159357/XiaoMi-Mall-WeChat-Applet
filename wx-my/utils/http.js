let alwaysPendingPromise = new Promise(() => {});
let baseUrl = 'http://192.168.110.100:1314';
let defaultOptions = { method: 'GET', header: {} };

function http(options, withLoading = true) {
    // 确定正确的路径
    options.url = baseUrl + options.url;
    // 合并配置，确定最后的配置
    options = Object.assign({}, defaultOptions, options);
    options.header.authorization = wx.getStorageSync('token');
    if(withLoading)
        wx.showLoading({ title: '加载中...', modal: true });
    return new Promise((resolve, reject) => {
        wx.request({
            ...options,
            success: res => {
                let { code, data, msg } = res.data;
                switch(code) {
                    case 200:
                        // 若存在authorization，更新token
                        if(res.header.authorization) {
                            try {
                                    wx.setStorageSync('token', res.header.authorization);
                                } catch(e) {};
                        }
                        resolve(data);
                        break;
                    case 401:
                        wx.login({
                            success: async res => {
                                const token = await http({ url: '/user/login/' + res.code });
                                wx.setStorageSync('token', token);
                            }
                        });
                        break;
                    case 199:
                    case 500:
                    case 404:
                        wx.showToast({
                            title: msg,
                            icon: 'none'
                        });
                        return alwaysPendingPromise;
                }
            },
            fail: error => {
                wx.showToast({
                    title: error.errMsg,
                    icon: 'none'
                });
                return alwaysPendingPromise;
            },
            complete: res => {
                if(withLoading) wx.hideLoading();
            },
        });
    });

}

module.exports = http;