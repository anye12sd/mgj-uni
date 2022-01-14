const http = uni.$u.http

// post请求，获取菜单
export const postMenu = (params, config = {}) => http.post('user/Operate/feedback', params, config)

// 根据手机号获取验证码
export const getCode = (data) => http.get('api/sms/send', {params: data})

// 根据手机号和验证码登录
export const postLogin = (params, config = {}) => http.post('user/login/login', params, config)

// 刷新token
export const refreshToken = (data) => http.get('user/Rtoken/getNewToken', {params:data})

// 获取菜单
export const getMenu = (data) => http.get('/user/Shop/index', {params:data})

// 获取菜单的推荐列表
export const getRecommend = (data) => http.get('/user/shop/indexPageGoods', {params:data})

// 获取商品详情
export const getGoodsDetail = (data) => http.get('/user/shop/goodsInfo', {params:data})

// 获取某模块下的分类
export const getCategory = (data) => http.get('/user/ajax/getCategory', {params:data})

// 获取商品列表（洗衣和生鲜超市板块）
export const getGoodsList = (data) => http.get('/user/shop/getGoods', {params:data})

// 获取商品列表（除上述两板块）
export const getGoodsListByservice = (data) => http.get('/user/shop/getgoodsByservice', {params:data})

// 获取常见问题
export const getFAQ = (data) => http.get('/user/Operate/question', {params:data})

// 获取关于我们
export const getAbout = (data) => http.get('/user/Operate/about', {params:data})

// 获取订单列表
export const getOrderList = (data) => http.get('/user/centre/orderList', {params:data})

// 获取订单详情
export const getOrderDetail = (data) => http.get('/user/centre/orderDetails', {params:data})

// 添加编辑地址
export const postAddAddress = (params, config = {}) => http.post('/user/address/addAddress', params, config)

// 获取地址列表
export const getAddressList = (data) => http.get('/user/address/lists', {params: data})

// 获取第一条地址
export const getFirstAddress = (data) => http.get('/user/address/getDefault', {params: data})

// 设置默认地址
export const postSetDefault = (params, config = {}) => http.post('/user/address/setDefaultAddress', params, config)

// 删除地址
export const postDelAddress = (params, config = {}) => http.post('/user/address/delAdress', params, config)

// 洗衣配送的时间数据
export const getWashDeliveryTime = (data) => http.get('/user/shop/getWashDeliveryTime', {params: data})

// 订单页获取加盟店信息
export const getShopInfo = (data) => http.get('/user/shop/shopInfo', {params: data})

// 获取加盟店列表
export const getShopList = (data) => http.get('/user/login/getShop', {params: data})

// 洗衣订单配送费（根据用户地址）
export const getExpressCost = (params, config = {}) => http.post('/user/home/expressCost', params, config)

// 下单页面可用优惠券
export const getUsableCoupon = (params, config = {}) => http.post('/user/coupon/usable', params, config)

// 优惠券列表
export const getCouponList = (data) => http.get('/user/Coupon/lists', {params: data})

// 可获取优惠券列表
export const fetchCoupon = (data) => http.get('/user/Coupon/receiveHall', {params: data})

// 可获取优惠券列表
export const getCoupon = (data) => http.get('/user/Coupon/receiveCoupon', {params: data})

// 美容美业养生下单
export const beautyCreateOrder = (params, config = {}) => http.post('/user/home/beautyCreateOrder', params, config)

// 创建洗衣定单
export const washCreateOrder = (params, config = {}) => http.post('/user/home/createOrder', params, config)

// 个人中心首页
export const getCenter = (data) => http.get('/user/centre/index', {params: data})

// 会员中心首页
export const getVipCenter = (data) => http.get('/user/VipCentre/statistics', {params: data})

// 开通会员
export const openVip = (params, config = {}) => http.post('/user/VipCentre/openVip', params, config)

// 个人中心余额明细
export const getBalanceLog = (data) => http.get('/user/centre/balanceRecord', {params: data})

// 个人中心可提现余额
export const getBalance = (data) => http.get('/user/pay/getBalance', {params: data})

// 获取充值套餐
export const getRecharge = (data) => http.get('/user/home/getRecharge', {params: data})

// 充值下单和支付
export const payRecharge = (params, config = {}) => http.post('/user/home/payRecharge', params, config)

// 意见反馈
export const feedback = (params, config = {}) => http.post('/user/Feedback/feedback', params, config)

// 商家联盟获取用户信息
export const getUserInfo = (data) => http.get('/user/UnionOrder/userInfo', {params: data})

// 用户取消订单
export const backOrder = (data) => http.get('/user/home/backOrder', {params: data})

// 调取支付
export const payOrder = (params, config = {}) => http.post('/user/pay/payOrder', params, config)

// 商家联盟首页菜单
export const getUnionIndex = (data) => http.get('/user/Union/index', {params: data})

// 商家联盟搜索条件
export const getUnionMap = (data) => http.get('/user/Union/getSearchMap', {params: data})

// 商家联盟商家信息
export const getUnionShopInfo = (data) => http.get('/user/Union/storeInfo', {params: data})

// 商家联盟获取用户信息
export const getUnionUserInfo = (data) => http.get('/user/UnionOrder/userInfo', {params: data})

// 商家联盟支付
export const paymentOrder = (params, config = {}) => http.post('/user/UnionOrder/paymentOrder', params, config)