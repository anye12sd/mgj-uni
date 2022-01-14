<template>
	<view class="page">
		<headerNav :value="navbar"></headerNav>
		<view style="height: 12px;"></view>
		<template v-if="type == 1">
			<template v-if="deliverType == 1">
				<!-- 施太洗护上门取送页面 -->
				<view class="header flex">
					<view class="flex-1" :class="{'active': deliverType == 1}" @click="selectDeliverType(1)">上门取送</view>
					<view class="flex-1" :class="{'active': deliverType == 2}" @click="selectDeliverType(2)">自提自送</view>
				</view>
				<template v-if="addressDetail">
					<view class="address" @click="toSelectAddress">
						<view class="name">{{addressDetail.take_name}} {{addressDetail.phone}}</view>
						<view class="address-detail">{{addressDetail.address + addressDetail.detail}}</view>
					</view>
				</template>
				<template v-else>
					<view class="address noAddress" @click="toSelectAddress">
						<view class="noAddress-info">请选择取送地址</view>
					</view>
				</template>
				<view class="time-box">
					<view class="flex time-box-list arrow-right">
						<view class="label">取货时间</view>
						<view class="time-select flex-1" @click="selectGetTime">{{sendTime}}</view>
					</view>
					<view class="flex time-box-list arrow-right">
						<view class="label">送回时间</view>
						<view class="time-select flex-1">{{deleverTime}}</view>
					</view>
				</view>
				<view class="goods-show flex" @click="showGoodsList">
					<view class="goods-img flex-1">
						<image v-for="(item, index) in goodsList" :key="index" mode="widthFix" class="goods-img-img"
							:src="item.img"></image>
					</view>
					<view class="goods-text">共计{{goodsNum}}件</view>
				</view>
				<view class="price-info">
					<view class="price-info-list flex">
						<view class="price-info-list-label">
							洗护金额
						</view>
						<view class="price-info-list-price-red">
							￥{{goodsPrice}}
						</view>
					</view>
					<view class="price-info-list flex">
						<view class="price-info-list-label">
							取送费用
						</view>
						<view class="price-info-list-price-grey">
							￥{{runMoney}}
						</view>
					</view>
					<view class="price-info-list flex arrow-right">
						<view class="price-info-list-label">
							优惠券
						</view>
						<view class="price-info-list-coupon" @click="toSelectCoupon" v-if="!couponDetail.amount">
							{{couponNum ? '共'+couponNum+'张优惠券可用': '无可用优惠券'}}
						</view>
						<view v-else class="price-info-list-coupon" @click="toSelectCoupon">
							已优惠{{couponDetail.amount}}元
						</view>
					</view>
				</view>
				<view class="remark flex">
					<view class="remark-info-list-label">
						备注
					</view>
					<view class="flex-1">
						<u--textarea v-model="remark" placeholder="请输入内容" autoHeight class="textarea"></u--textarea>
					</view>
				</view>
				<u-popup :show="serviceSelectShow" @close="close" mode="bottom">
					<view class="service-select-box">
						<view class="service-select-title" @click="serviceSelectShow = false">选择上门取货时间</view>
						<view class="flex">
							<view class="flex-2 service-select-left">
								<scroll-view :scroll-top="leftScrollTop" :scroll-y="true" style="height: 251px;">
									<view v-for="(item, index) in deliveryTimeKey" class="service-select-left-list"
										@click="toSelectLeft(item, index)" :class="{'active': leftSelect == index}"
										:key="index">
										{{item}}
									</view>
								</scroll-view>
							</view>
							<view class="flex-5 service-select-right">
								<scroll-view :scroll-top="rightScrollTop" scroll-y="true" style="height: 251px;">
									<view v-for="(item, index) in deliveryTimeValue" class="service-select-right-list"
										@click="toSelectRight(item, index)" :class="{'active': rightSelect == index}"
										:key="index">
										{{item.date1}} - {{item.date2}}
									</view>
								</scroll-view>
							</view>
						</view>
					</view>
				</u-popup>
			</template>
			<template v-else>
				<!-- 施太洗护自提自送页面 -->
				<view class="header flex">
					<view class="flex-1" :class="{'active': deliverType == 1}" @click="selectDeliverType(1)">上门取送</view>
					<view class="flex-1" :class="{'active': deliverType == 2}" @click="selectDeliverType(2)">自提自送</view>
				</view>
				<view class="shop-info">
					<view class="shop-info-name">{{shopInfo.shop.name}}</view>
					<view class="shop-info-address">{{shopInfo.shop.address}}</view>
					<view class="shop-info-contact">联系方式：{{shopInfo.shop.tel}}</view>
					<view class="shop-info-time">营业时间：{{shopInfo.shop.work_time1}}:00 - {{shopInfo.shop.work_time2}}:00
					</view>
				</view>
				<view class="goods-show flex" @click="showGoodsList">
					<view class="goods-img flex-1">
						<image v-for="(item, index) in goodsList" :key="index" mode="widthFix" class="goods-img-img"
							:src="item.img"></image>
					</view>
					<view class="goods-text">共计{{goodsNum}}件</view>
				</view>
				<view class="price-info">
					<view class="price-info-list flex">
						<view class="price-info-list-label">
							洗护金额
						</view>
						<view class="price-info-list-price-red">
							￥{{goodsPrice}}
						</view>
					</view>
					<view class="price-info-list flex arrow-right">
						<view class="price-info-list-label">
							优惠券
						</view>
						<view class="price-info-list-coupon" @click="toSelectCoupon" v-if="!couponDetail.amount">
							{{couponNum ? '共'+couponNum+'张优惠券可用': '无可用优惠券'}}
						</view>
						<view v-else class="price-info-list-coupon" @click="toSelectCoupon">
							已优惠{{couponDetail.amount}}元
						</view>
					</view>
				</view>
				<view class="remark flex">
					<view class="remark-info-list-label">
						备注
					</view>
					<view class="flex-1">
						<u--textarea v-model="remark" placeholder="请输入内容" autoHeight class="textarea"></u--textarea>
					</view>
				</view>
			</template>
		</template>
		<template v-else-if="type == 10">
			<template v-if="addressDetail">
				<view class="address" @click="toSelectAddress">
					<view class="name">{{addressDetail.take_name}} {{addressDetail.phone}}</view>
					<view class="address-detail">{{addressDetail.address + addressDetail.detail}}</view>
				</view>
			</template>
			<template v-else>
				<view class="address noAddress" @click="toSelectAddress">
					<view class="noAddress-info">请选择取送地址</view>
				</view>
			</template>
			<view class="goods-show flex" @click="showGoodsList">
				<view class="goods-img flex-1">
					<image v-for="(item, index) in goodsList" :key="index" mode="widthFix" class="goods-img-img"
						:src="item.img"></image>
				</view>
				<view class="goods-text">共计{{goodsNum}}件</view>
			</view>
			<view class="price-info">
				<view class="price-info-list flex">
					<view class="price-info-list-label">
						商品总价格
					</view>
					<view class="price-info-list-price-red">
						￥{{goodsPrice}}
					</view>
				</view>
				<view class="price-info-list flex">
					<view class="price-info-list-label">
						取送费用
					</view>
					<view class="price-info-list-price-grey">
						￥{{runMoney}}
					</view>
				</view>
				<view class="price-info-list flex arrow-right">
					<view class="price-info-list-label">
						优惠券
					</view>
					<view class="price-info-list-coupon" @click="toSelectCoupon" v-if="!couponDetail.amount">
						{{couponNum ? '共'+couponNum+'张优惠券可用': '无可用优惠券'}}
					</view>
					<view v-else class="price-info-list-coupon" @click="toSelectCoupon">
						已优惠{{couponDetail.amount}}元
					</view>
				</view>
			</view>
			<view class="remark flex">
				<view class="remark-info-list-label">
					备注
				</view>
				<view class="flex-1">
					<u--textarea v-model="remark" placeholder="请输入内容" autoHeight class="textarea"></u--textarea>
				</view>
			</view>
		</template>
		<template v-else>
			<template v-if="addressDetail">
				<view class="address" @click="toSelectAddress">
					<view class="name">{{addressDetail.take_name}}{{addressDetail.sex == 1 ? '(先生)' : '(女士)'}}
						{{addressDetail.phone}}
					</view>
					<view class="address-detail">{{addressDetail.address + addressDetail.detail}}</view>
				</view>
			</template>
			<template v-else>
				<view class="address noAddress" @click="toSelectAddress">
					<view class="noAddress-info">请选择取送地址</view>
				</view>
			</template>
			<view class="select-time flex">
				<view class="price-info-list-label">
					上门时间
				</view>
				<view class="select-time-right flex-1">
					<view @click="openSelectTime" class="select-text">
						{{datetimePickerValue ? timeFormatter(datetimePickerValue) : '请选择上门时间'}}</view>
					<u-datetime-picker v-if="datetimePickerShow" :show="datetimePickerShow" :minDate="minDate"
						:maxDate="maxDate" @cancel="closeSelectTime" @confirm="confirmSelectTime"
						v-model="datetimePickerValue" mode="datetime">
					</u-datetime-picker>
				</view>
			</view>
			<view class="hint">
				<view class="hint-red">注：此时间为到达您选择的地址的时间！</view>
				<view class="hint-grey">请预留足够的时间享受您选择的服务！</view>
			</view>
			<view class="price-info">
				<view class="price-info-list flex">
					<view class="price-info-list-label">
						套餐价格
					</view>
					<view class="price-info-list-price-red">
						￥{{goodsPrice}}
					</view>
				</view>
				<view class="price-info-list flex arrow-right">
					<view class="price-info-list-label">
						优惠券
					</view>
					<view class="price-info-list-coupon" @click="toSelectCoupon" v-if="!couponDetail.amount">
						{{couponNum ? '共'+couponNum+'张优惠券可用': '无可用优惠券'}}
					</view>
					<view v-else class="price-info-list-coupon" @click="toSelectCoupon">
						已优惠{{couponDetail.amount}}元
					</view>
				</view>
			</view>
			<view class="remark flex">
				<view class="remark-info-list-label">
					备注
				</view>
				<view class="flex-1">
					<u--textarea v-model="remark" placeholder="请输入内容" autoHeight class="textarea"></u--textarea>
				</view>
			</view>
		</template>
		<view class="order-confirm flex">
			<view>
				<view class="flex">
					<view class="total-num-text">总计</view>
					<view class="discounted-num">￥{{(goodsFinalPrice - discountAmount).toFixed(2)}}</view>
					<view class="total-num">￥{{goodsPrice}}</view>
				</view>
				<view class="discount-num">已优惠{{couponDetail.amount || 0}}元</view>
			</view>
			<view class="order-btn" @click="submitOrder">
				确认下单
			</view>
		</view>
		<u-popup :show="goodsListShow" @close="goodsListClose" mode="bottom">
			<view class="goods-box">
				<view class="service-select-title" @click="goodsListShow = false">共计{{goodsNum}}件商品</view>
				<scroll-view :scroll-top="goodsScrollTop" :scroll-y="true" style="height: 251px;">
					<view v-for="(item, index) in goodsList" class="goods-list flex" :key="index">
						<view>
							<image mode="widthFix" :src="item.img" class="goods-list-img"></image>
						</view>
						<view>
							<view class="goods-name">{{item.name}}</view>
							<view class="goods-price">单价：￥{{item.price}}</view>
							<view class="goods-num">数量：{{item.num}}件</view>
						</view>
						<view class="goods-total flex-1">￥{{item.totalPrice}}</view>
					</view>
				</scroll-view>
			</view>
		</u-popup>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import {
		getWashDeliveryTime,
		getExpressCost,
		getUsableCoupon,
		getShopInfo,
		getFirstAddress,
		beautyCreateOrder,
		washCreateOrder
	} from '../../../config/api.js'
	export default {
		data() {
			return {
				navbar:{
					title: '下单结算',
					custom: false
				},
				type: 1, //type 1：施太洗护下单页面, 10：时令水果, 其它则为美业类的商品
				deliverType: 1,
				remark: "",
				sendTime: "请选择上门时间",
				deleverTime: "送回时间",
				addressDetail: "",
				deliveryTime: [],
				deliveryTimeKey: [],
				deliveryTimeValue: [],
				goodsList: [],
				goodsNum: "",
				goodsPrice: "", // 商品总价格
				couponNum: 0, // 可用优惠券数量
				couponList: [], // 可用优惠券列表
				discountAmount: 0, //优惠价格
				goodsFinalPrice: 0, // 商品除优惠券后价格
				serviceSelectShow: false,
				leftScrollTop: 0,
				rightScrollTop: 0,
				goodsScrollTop: 0,
				leftSelect: 0,
				rightSelect: 0,
				runMoney: 0, // 运费,
				goodsListShow: false,
				couponDetail: {},
				shopInfo: {},
				datetimePickerShow: false,
				datetimePickerValue: "",
				minDate: "",
				maxDate: "",
				btnClick: true,
				sendTime1: [],
				sendTime2: [],
			}
		},
		onLoad() {
			this.getShopInfo()
			this.getFirstAddress()
		},
		onShow() {
			let pagearr = getCurrentPages();
			let currentPage = pagearr[pagearr.length - 1];
			this.type = currentPage.options.type || currentPage.options.needBack
			if (this.type == 1) {
				// 施太洗护
				this.goodsList = uni.getStorageSync('HJKJ-washSelectedGoods')
			} else if (this.type == 10) {
				// 时令水果
				this.goodsList = uni.getStorageSync('HJKJ-fruitSelectedGoods')
			} else {
				// 美业类商品
				this.goodsList = [uni.getStorageSync('HJKJ-hairdress')]
			}
			this.getCost()
			this.discountAmount = parseFloat(this.couponDetail.amount || 0)
			this.getCoupon()
		},
		methods: {
			selectDeliverType(type) {
				if (this.deliverType == type) {
					return
				}
				if (type == 1) {
					this.goodsFinalPrice = (parseFloat(this.goodsPrice) + parseFloat(this.runMoney)).toFixed(2)
				} else {
					this.goodsFinalPrice = parseFloat(this.goodsPrice).toFixed(2)
				}
				this.deliverType = type
			},
			toSelectAddress() {
				uni.navigateTo({
					url: '/pages/mine/address/index?needBack=' + this.type
				})
			},
			getShopInfo() {
				uni.showLoading({
					title: '加载中'
				})
				let data = {
					shop_key: uni.getStorageSync('HJKJ-shop_id').id,
				}
				getShopInfo(data).then((res) => {
					this.shopInfo = res
					uni.hideLoading()
				})
			},
			getFirstAddress() {
				uni.showLoading({
					title: '加载中'
				})
				getFirstAddress().then((res) => {
					this.addressDetail = res
					uni.hideLoading()
				})
			},
			getCoupon() {
				uni.showLoading({
					title: '加载中'
				})
				let goods_key = {};
				this.goodsList.map((item => {
					goods_key[item.id] = item.num || 1
				}))
				let data = {
					shop_key: uni.getStorageSync('HJKJ-shop_id').id,
					goods: goods_key,
					service_key: this.type
				}
				getUsableCoupon(data).then((res) => {
					this.couponNum = res.length
					this.couponList = res
					uni.hideLoading()
				})
			},
			getCost() {
				let goods_key = {};
				let goods_num = 0,
					goods_price = 0
				this.goodsList.map((item => {
					goods_key[item.id] = item.num
					goods_num += item.num //商品数量
					goods_price += parseFloat(item.totalPrice) // 商品优惠后总价格
				}))
				this.goodsNum = goods_num
				this.goodsPrice = goods_price.toFixed(2)
				if (this.type == 1 || this.type == 10) {
					// 施太洗护和水果直接获取运费
					uni.showLoading({
						title: '加载中'
					})
					let data = {
						shop_key: uni.getStorageSync('HJKJ-shop_id').id,
						goods_key: goods_key
					}
					getExpressCost(data).then((res) => {
						this.runMoney = parseFloat(res.runMoney).toFixed(2)
						if (this.deliverType == 1) {
							this.goodsFinalPrice = (parseFloat(this.goodsPrice) + parseFloat(this.runMoney))
								.toFixed(2)
						}
						uni.hideLoading()
					})
				} else {
					this.goodsFinalPrice = this.goodsPrice
				}
			},
			openSelectTime() {
				this.datetimePickerShow = true
				this.minDate = new Date().getTime()
				this.maxDate = new Date().getTime() + 2592000000
			},
			closeSelectTime() {
				this.datetimePickerShow = false
			},
			confirmSelectTime(e) {
				this.datetimePickerValue = e.value
				this.datetimePickerShow = false
			},
			timeFormatter(e) {
				let year = new Date(e).getFullYear() + '-'
				let month = (new Date(e).getMonth() + 1 < 10 ? '0' + (new Date(e).getMonth() + 1) : new Date(e)
				.getMonth() + 1) + '-'
				let date = (new Date(e).getDate() < 10 ? '0' + new Date(e).getDate() : new Date(e).getDate()) + ' '
				let hour = (new Date(e).getHours() < 10 ? '0' + new Date(e).getHours() : new Date(e).getHours()) + ':'
				let minute = (new Date(e).getMinutes() < 10 ? '0' + new Date(e).getMinutes() : new Date(e).getMinutes())
				return year + month + date + hour + minute
			},
			selectGetTime() {
				uni.showLoading({
					title: '加载中'
				})
				let data = {
					shop_key: uni.getStorageSync('HJKJ-shop_id').id
				}
				getWashDeliveryTime(data).then((res) => {
					this.deliveryTime = res
					this.deliveryTimeKey = Object.keys(res)
					this.deliveryTimeValue = res[Object.keys(res)[0]]
					uni.hideLoading()
					this.serviceSelectShow = true
				})
			},
			close() {
				this.serviceSelectShow = false
			},
			showGoodsList() {
				this.goodsListShow = true
			},
			goodsListClose() {
				this.goodsListShow = false
			},
			toSelectLeft(item, index) {
				this.leftSelect = index
				this.deliveryTimeValue = Reflect.get(this.deliveryTime, item)
				this.rightSelect = 0
			},
			toSelectRight(item, index) {
				this.sendTime1 = [item.time1, item.time2]
				this.sendTime2 = [item.time1 + 432000, item.time2 + 432000]
				this.rightSelect = index
				let sendTime = item.time1 * 1000
				this.sendTime = new Date(sendTime).getFullYear() + "-" + (new Date(sendTime).getMonth() + 1) + "-" +
					new Date(sendTime).getDate() + " " + item.date1 + "-" + item.date2
				let deleverDate = item.time1 * 1000 + 432000000
				this.deleverTime = new Date(deleverDate).getFullYear() + "-" + (new Date(deleverDate).getMonth() + 1) +
					"-" + new Date(deleverDate).getDate() + " " + item.date1 + "-" + item.date2
				this.serviceSelectShow = false
			},
			toSelectCoupon() {
				uni.setStorageSync('HJKJ-coupon', this.couponList)
				uni.navigateTo({
					url: '/pages/coupon/index/index?needBack=' + this.type
				})
			},
			submitOrder() {
				if (this.type == 1) {
					// 施太洗护下单
					if(!this.sendTime1.length && this.deliverType == 1){
						this.$refs.uToast.show({
							type: 'error',
							message: '请选择上门时间',
						})
						return
					}
					if(!this.btnClick){
						return
					}
					this.btnClick = false
					let goods = {}
					this.goodsList.map((item => {
						goods[item.id] = item.num
					}))
					if(this.deliverType == 2){
						let date = Math.ceil(new Date().getTime() * 0.001)
						this.sendTime1 = [date, date + 3600]
						this.sendTime2 = [date + 82800, date + 86400]
					}
					let data = {
						service_key: this.type,
						shop_key: uni.getStorageSync('HJKJ-shop_id').id,
						mode: this.deliverType,
						goods: goods,
						address_id: this.addressDetail.id,
						user_mark: this.remark,
						time1: this.sendTime1,
						time2: this.sendTime2,
					}
					if (this.couponDetail) {
						data.coupon_id = this.couponDetail.id
					}
					uni.showLoading({
						title: '加载中'
					})
					washCreateOrder(data).then((res) => {
						// this.$refs.uToast.show({
						// 	type: 'success',
						// 	message: '订单创建成功',
						// })
						uni.navigateTo({
							url: '/pages/order/payOrder/index?id=' + res.order
						})
						// uni.removeStorageSync('HJKJ-washSelectedGoods')
						this.btnClick = true
						uni.hideLoading()
					}).catch((err) => {
						this.btnClick = true
						uni.hideLoading()
					})
				} else if (this.type == 10) {
					// 水果下单
					if(!this.btnClick){
						return
					}
					this.btnClick = false
					let time = Math.ceil(new Date().getTime()*0.001)
					let goods = {}
					this.goodsList.map((item => {
						goods[item.id] = item.num
					}))
					let data = {
						service_key: this.type,
						shop_key: uni.getStorageSync('HJKJ-shop_id').id,
						mode: 1,
						goods: goods,
						address_id: this.addressDetail.id,
						user_mark: this.remark,
						time1: [time, time + 432000],
						time2: [time, time + 432000]
					}
					if (this.couponDetail) {
						data.coupon_id = this.couponDetail.id
					}
					uni.showLoading({
						title: '加载中'
					})
					washCreateOrder(data).then((res) => {
						// this.$refs.uToast.show({
						// 	type: 'success',
						// 	message: '订单创建成功',
						// })
						uni.navigateTo({
							url: '/pages/order/payOrder/index?id=' + res.order
						})
						// uni.removeStorageSync('HJKJ-fruitSelectedGoods')
						this.btnClick = true
						uni.hideLoading()
					}).catch((err) => {
						this.btnClick = true
						uni.hideLoading()
					})
				} else {
					if (!this.datetimePickerValue) {
						this.$refs.uToast.show({
							type: 'error',
							message: '请选择上门时间',
						})
						return
					}
					if(!this.btnClick){
						return
					}
					this.btnClick = false
					uni.showLoading({
						title: '加载中'
					})
					// 美业类下单
					let goods = {}
					this.goodsList.map((item => {
						goods[item.id] = 1
					}))
					let data = {
						shop_key: uni.getStorageSync('HJKJ-shop_id').id,
						goods: goods,
						sub_time: this.datetimePickerValue * 0.001,
						user_mark: this.remark,
						address_id: this.addressDetail.id,
						service_key: this.type
					}
					if (this.couponDetail) {
						data.coupon_id = this.couponDetail.id
					}
					beautyCreateOrder(data).then((res) => {
						// this.$refs.uToast.show({
						// 	type: 'success',
						// 	message: '订单创建成功',
						// })
						uni.navigateTo({
							url: '/pages/order/payOrder/index?id=' + res.order
						})
						// uni.removeStorageSync('HJKJ-hairdress')
						this.btnClick = true
						uni.hideLoading()
					}).catch((err) => {
						this.btnClick = true
						uni.hideLoading()
					})
				}
			}
		}
	}
</script>

<style scoped>
	.page {
		min-height: calc(100vh - 80px);
		padding: 0 12px;
		background: #f5f5f5;
		padding-bottom: 80px;
	}

	.header {
		font-size: 20px;
		color: #666;
		font-weight: bold;
		text-align: center;
		margin-bottom: 19px;
	}

	.header .flex-1 {
		padding: 10px 0;
	}

	.header .active {
		color: #000;
		background: url(../../../static/img/recommend@2x.png) no-repeat center 38px;
		background-size: 10px;
	}

	.address {
		background: #fff;
		padding: 12px;
		position: relative;
		border-radius: 4px;
	}

	.address::before {
		content: "";
		background: url(../../../static/img/location_fill.png) no-repeat left;
		background-size: 20px;
		width: 20px;
		height: 20px;
		display: block;
		position: absolute;
		top: 25px
	}

	.address::after {
		content: " ";
		display: inline-block;
		height: 8px;
		width: 8px;
		border-width: 1px 1px 0 0;
		border-color: #999;
		border-style: solid;
		-webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
		transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
		position: absolute;
		right: 12px;
		top: 30px
	}

	.noAddress::before {
		content: "";
		background: url(../../../static/img/location_fill.png) no-repeat left;
		background-size: 20px;
		width: 20px;
		height: 20px;
		display: block;
		position: absolute;
		top: 14px
	}

	.noAddress::after {
		content: " ";
		display: inline-block;
		height: 8px;
		width: 8px;
		border-width: 1px 1px 0 0;
		border-color: #999;
		border-style: solid;
		-webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
		transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
		position: absolute;
		right: 12px;
		top: 19px
	}

	.noAddress-info {
		color: #999;
		padding-left: 25px;
	}

	.name {
		font-size: 16px;
		color: #000;
		padding-left: 25px;
	}

	.address-detail {
		color: #666;
		font-size: 12px;
		margin-top: 6px;
		padding-left: 25px;
		padding-right: 25px;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box; // 作为弹性伸缩盒子模型显示。
		-webkit-box-orient: vertical; // 设置伸缩盒子的子元素排列方式--从上到下垂直排列
		-webkit-line-clamp: 1; // 显示的行
	}

	.time-box {
		margin-top: 6px;
		padding: 0 12px;
		background: #fff;
		border-radius: 4px;
	}

	.label {
		font-size: 14px;
		color: #000;
	}

	.time-box-list {
		padding: 14px 0;
	}

	.time-select {
		text-align: right;
		font-size: 14px;
		color: #999;
	}

	.time-box .time-box-list:nth-child(1) {
		border-bottom: 1px solid #f5f5f5
	}

	.arrow-right {
		position: relative;
		padding-right: 18px;
	}

	.arrow-right:after {
		content: " ";
		display: inline-block;
		height: 8px;
		width: 8px;
		border-width: 1px 1px 0 0;
		border-color: #999;
		border-style: solid;
		-webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
		transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
		position: absolute;
		right: 0px;
		margin-top: 6px;
	}

	.goods-show {
		padding: 14px 12px;
		background: #fff;
		margin-top: 6px;
		justify-content: space-between;
		border-radius: 4px;
		position: relative;
	}

	.goods-show:after {
		content: " ";
		display: inline-block;
		height: 8px;
		width: 8px;
		border-width: 1px 1px 0 0;
		border-color: #999;
		border-style: solid;
		-webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
		transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
		position: absolute;
		right: 12px;
		top: 33px;
	}

	.goods-text {
		font-size: 14px;
		color: #000;
		line-height: 45px;
		padding-right: 18px;
	}

	.goods-img-img {
		width: 45px;
		height: 45px;
		margin-right: 6px;
	}

	.goods-img {
		overflow: hidden;
		height: 45px;
	}

	.hint {
		margin: 5px 0;
		padding: 0 12px
	}

	.hint-red {
		font-size: 12px;
		color: #ff0000;
	}

	.hint-grey {
		font-size: 12px;
		color: #999;
	}

	.select-time {
		padding: 14px 12px;
		margin-top: 5px;
		background: #fff;
		font-size: 14px;
		border-radius: 4px;
		position: relative;
	}

	.select-time-right {
		padding-right: 18px;
		position: relative;
	}

	.select-time::after {
		content: " ";
		display: inline-block;
		height: 8px;
		width: 8px;
		border-width: 1px 1px 0 0;
		border-color: #999;
		border-style: solid;
		-webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
		transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
		position: absolute;
		right: 12px;
		margin-top: 5px;
	}

	.select-text {
		font-size: 14px;
		color: #999;
		text-align: right;
	}

	.price-info {
		padding: 0 12px;
		background: #fff;
		font-size: 14px;
		border-radius: 4px;
		margin-top: 6px;
		color: #000;
	}

	.price-info-list {
		justify-content: space-between;
		padding: 14px 0;
		border-bottom: 1px solid #f5f5f5;
	}

	.price-info-list-price-red {
		color: #ff0000;
	}

	.price-info-list-coupon {
		color: #999;
		padding-right: 18px;
	}

	.remark {
		padding: 14px 12px;
		background: #fff;
		font-size: 14px;
		border-radius: 4px;
		margin-top: 6px;
		color: #000;
	}

	.remark .remark-info-list-label {
		padding-right: 25px;
	}

	.textarea {
		padding: 0;
		color: #999;
		border: 0;
		text-align: right;
	}

	.order-confirm {
		padding: 12px;
		background: #fff;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		box-shadow: 0px -3px 6px rgba(0, 0, 0, 0.08);
		justify-content: space-between;
	}

	.order-confirm>view {
		padding-left: 12px;
	}

	.total-num-text {
		color: #000;
		font-size: 14px;
	}

	.discounted-num {
		font-size: 14px;
		color: #ff0000;
		padding-left: 5px;
	}

	.total-num {
		font-size: 12px;
		color: #999;
		text-decoration: line-through;
		padding-left: 5px;
		margin-top: 3px;
	}

	.discount-num {
		color: #000;
		font-size: 12px;
	}

	.order-btn {
		color: #fff;
		font-size: 16px;
		padding: 9px 38px !important;
		border-radius: 50px;
		background: linear-gradient(90deg, #FC6767 0%, #FF8C4E 100%);
		text-align: center;
	}

	.shop-info {
		padding: 12px;
		border-radius: 4px;
		background: #fff;
		font-size: 14px;
		color: #000;
	}

	.shop-info-name {
		font-size: 19px;
		padding-left: 37px;
		background: url(../../../static/img/shop-header-img@2x.png) no-repeat left;
		background-size: 25px;
		position: relative;
	}

	.shop-info-name:after {
		content: " ";
		display: inline-block;
		height: 8px;
		width: 8px;
		border-width: 1px 1px 0 0;
		border-color: #999;
		border-style: solid;
		-webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
		transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
		position: absolute;
		right: 0px;
		margin-top: 9px
	}

	.shop-info-address {
		margin-top: 11px;
		padding-bottom: 12px;
		border-bottom: 1px solid #f5f5f5;
	}

	.shop-info-contact {
		padding-top: 12px;
	}

	.shop-info-time {
		margin-top: 6px;
	}

	.service-select-box {
		max-height: 300px;
		background: #fff;
	}

	.service-select-title {
		font-size: 16px;
		color: #000;
		font-weight: bold;
		padding: 14px 0;
		text-align: center;
		position: relative;
	}

	.service-select-title:after {
		content: "";
		display: inline-block;
		background: url(../../../static/img/close-square@2x.png) no-repeat right;
		background-size: 16px;
		width: 16px;
		height: 16px;
		position: absolute;
		right: 12px;
		margin-top: 4px;
	}

	.service-select-left {
		font-size: 14px;
		color: #000;
		text-align: center;
		background: #E6E6E6;
	}

	.service-select-left-list {
		padding: 14px 0;
	}

	.service-select-left-list.active {
		background: #fff;
	}

	.service-select-right-list {
		padding: 14px 0;
		font-size: 14px;
		color: #999;
		padding-left: 28px;
	}

	.service-select-right-list.active {
		color: #FF8C4E;
		position: relative;
	}

	.service-select-right-list.active:after {
		content: " ";
		display: inline-block;
		height: 9px;
		width: 8px;
		border-width: 0 2px 2px 0;
		border-color: #FF8C4E;
		border-style: solid;
		-webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
		transform: matrix(0.71, 0.71, -1.11, 1.211, 0, 0);
		position: absolute;
		right: 34px;
	}

	.goods-box {
		max-height: 300px;
		background: #fff;
	}

	.service-select-title {
		font-size: 16px;
		color: #000;
		font-weight: bold;
		padding: 14px 0;
		text-align: center;
		position: relative;
	}

	.service-select-title:after {
		content: "";
		display: inline-block;
		background: url(../../../static/img/close-square@2x.png) no-repeat right;
		background-size: 16px;
		width: 16px;
		height: 16px;
		position: absolute;
		right: 12px;
		margin-top: 4px;
	}

	.goods-list {
		padding: 12px 24px;
	}

	.goods-list-img {
		width: 55px;
		height: 55px;
		border-radius: 4px;
	}

	.goods-name {
		font-size: 14px;
		color: #000;
		margin-left: 12px;
	}

	.goods-price {
		font-size: 14px;
		color: #000;
		margin-left: 12px;
	}

	.goods-num {
		font-size: 14px;
		color: #000;
		margin-left: 12px;
	}

	.goods-total {
		text-align: right;
		font-size: 16px;
		color: #000;
		padding-top: 22px;
	}
</style>
