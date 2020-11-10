const http = require("./utils/http.js");

App({
    globalData: {
        api: {
            category: {
                list: fid => http({ url: '/category/list/' + fid })
            },
            product: {
                list: data => http({ method: 'POST', url: '/product/list', data }, false),
                model: id => http({ url: '/product/model/' + id })
            },
            user: {
                login: data => http({ method: 'POST', url: '/user/login_pwd', data })
            },
            cart: {
                countAll: data => http({ url: '/cart/total' }),
                add: data => http({ method: 'POST', url: '/cart/add', data }),
                list: data => http({ method: 'POST', url: '/cart/list'}),
                increase: id => http({ method: 'POST', url: '/cart/increase/' + id }),
                decrease: id => http({ method: 'POST', url: '/cart/decrease/' + id }),
                remove: data => http({ method: 'POST', url: '/cart/remove', data }),
                list_ids: data => http({ method: 'POST', url: '/cart/list_ids', data })
            },
            address: {
                get_default: data => http({ url: '/address/get_default' }),
                list: data => http({ url: '/address/list' }),
                add: data => http({ method: 'POST', url: '/address/add', data }),
                update: data => http({ method: 'POST', url: '/address/update', data }),
                set_default: id => http({ url: '/address/set_default/' + id }),
                remove: id => http({ url: '/address/remove/' + id })
            },
            order: {
                confirm: data => http({ method: 'POST', url: '/order/confirm', data}),
                account: id => http({ url: '/order/account/' + id }),
                pay: id => http({ url: '/order/pay/' + id }),
                all: data => http({ url: '/order/list_all' }),
                remove: id => http({ url: '/order/remove/' + id })
            },
            user: {
                login: code => http({ url: '/user/login/' + code }),
                user_info: data => http({ url: '/user/user_info' }),
                update_name: name => http({ url: '/user/update_name/' + name })
            }
        }
    },
    observe: function(Page) {
        let obj = Page.data;
        let propertys = Object.keys(Page.watch);
        propertys.forEach(pro => {
            var _value = Page.data[pro];
            Object.defineProperty(obj, pro, {
                set: value => {
                    if(_value !== value) {
                        Page.watch[pro].call(Page, value, _value);
                        _value = value;
                    }
                },
                get: () => _value
            });
        });
    },
    login: function() {
        wx.login({
            success: async res => {
                const token = await this.globalData.api.user.login(res.code);
                wx.setStorageSync('token', token);
            }
        })
    },
    onLaunch: function() {
        this.login();
    }
});