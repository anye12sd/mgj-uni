<template>
	<view class="page" v-if="center.user">
		<headerNav :value="navbar"></headerNav>
		<view class="header flex">
			<view class="header-img">
				<image mode="widthFix" :src="center.user.avatar"></image>
			</view>
			<view class="header-info">
				<view class="header-name">{{center.user.nickname}}</view>
				<view class="register-time">注册会员: {{center.user.create_time.split(" ")[0]}}</view>
			</view>
			<view class="header-time flex-1" @click="toVipCenter()">
				<view class="isVip"></view>
			</view>
		</view>
		<view class="content">
			<view class="account">
				<view class="account-title">账户余额</view>
				<view class="account-content flex">
					<view class="account-num">
						<view class="account-num-int">{{center.user.balance.split(".")[0]}}</view>
						<view class="account-num-float">.{{center.user.balance.split(".")[1]}}</view>
					</view>
					<view class="account-btn flex-1">
						<view class="account-btn-btn" @click="toDeposit()">
							充值
						</view>
					</view>
				</view>
				<view class="account-more" @click="toAccountDetail()">
					查看账户明细
				</view>
			</view>
			<view class="order-nav flex">
				<view class="all-order order-view" @click="toOrder(0)">全部订单
					<!-- <view class="order-num">10</view> -->
				</view>
				<view class="wait-order order-view" @click="toOrder(1)">待支付
					<!-- <view class="order-num">10</view> -->
				</view>
				<view class="paid-order order-view" @click="toOrder(2)">已支付
					<!-- <view class="order-num">10</view> -->
				</view>
				<view class="assess-order order-view" @click="toOrder(3)">待评价
					<!-- <view class="order-num">10</view> -->
				</view>
			</view>
			<view class="coupon-nav flex">
				<view class="flex-1" @click="toAddress()">
					<view class="coupon-nav-title">我的地址</view>
					<view class="coupon-nav-content flex">
						<view class="coupon-nav-content-left">{{center.address || 0}}个</view>
						<view class="coupon-nav-content-right coupon-nav-content-right-location flex-1"></view>
					</view>
				</view>
				<view class="flex-1" @click="toConpon()">
					<view class="coupon-nav-title">我的优惠券</view>
					<view class="coupon-nav-content flex">
						<view class="coupon-nav-content-left">{{center.address || 0}}个</view>
						<view class="coupon-nav-content-right coupon-nav-content-right-coupon flex-1"></view>
					</view>
				</view>
				<view class="flex-1" @click="toPush()">
					<view class="coupon-nav-title">我的推广</view>
					<view class="coupon-nav-content flex">
						<view class="coupon-nav-content-left">{{center.address || 0}}个</view>
						<view class="coupon-nav-content-right coupon-nav-content-right-push flex-1"></view>
					</view>
				</view>
			</view>
			<view class="content-link">
				<view class="content-link-list content-link-contact">联系客服</view>
				<view class="content-link-list content-link-question" @click="toFAQ()">常见问题</view>
				<view class="content-link-list content-link-about" @click="toAbout()">关于我们</view>
				<view class="content-link-list content-link-feedback" @click="toFeedback()">意见反馈</view>
			</view>
		</view>
		<footerNav :url="'mine'"></footerNav>
	</view>
</template>

<script>
	import {
		getCenter
	} from '../../../config/api.js'
	import footerNav from '../../../components/footer-nav.vue'
	export default {
		components: {
			footerNav
		},
		data() {
			return {
				navbar:{
					title: '个人中心',
					custom: false
				},
				center: {}
			}
		},
		onLoad() {
			this.fetch()
		},
		methods: {
			fetch() {
				uni.showLoading({
					title: '加载中'
				});
				getCenter().then((res) => {
					console.log(res)
					this.center = res
					uni.hideLoading()
				})
			},
			toAccountDetail() {
				uni.navigateTo({
					url: '/pages/mine/accountDetail/index'
				})
			},
			toOrder(index) {
				uni.navigateTo({
					url: '/pages/order/index/index?index=' + index
				})
			},
			toVipCenter(){
				uni.navigateTo({
					url: '/pages/mine/vip/index'
				})
			},
			toConpon() {
				uni.navigateTo({
					url: '/pages/coupon/index/index'
				})
			},
			toAddress() {
				uni.navigateTo({
					url: '/pages/mine/address/index'
				})
			},
			toFAQ() {
				uni.navigateTo({
					url: '/pages/mine/FAQ/index'
				})
			},
			toAbout() {
				uni.navigateTo({
					url: '/pages/mine/about/index'
				})
			},
			toPush() {
				uni.navigateTo({
					url: '/pages/mine/push/index'
				})
			},
			toFeedback() {
				uni.navigateTo({
					url: '/pages/mine/feedback/index'
				})
			},
			toDeposit(){
				uni.navigateTo({
					url: '/pages/deposit/index/index'
				})
			}
		}
	}
</script>

<style scoped>
	.page {
		background: #f5f5f5;
	}

	.header {
		height: 108px;
		background: linear-gradient(90deg, #FC6767 0%, #FF8C4E 100%);
		padding: 12px
	}

	.header-img {
		width: 60px;
		height: 60px;
	}

	.header-img image {
		border-radius: 50%;
		width: 100%;
	}

	.header-info {
		margin-left: 6px;
	}

	.header-name {
		font-weight: bold;
		font-size: 21px;
		color: #fff;
	}

	.isVip {
		float: right;
		background: url(../../../static/img/isVip@2x.png) no-repeat center;
		background-size: 100px;
		width: 100px;
		height: 62px;
	}

	.header-time {
		position: relative;
	}

	.register-time {
		margin-top: 6px;
		font-size: 12px;
		color: #fff;
	}

	.content {
		margin-top: -50px;
		padding: 0 12px;
		border-radius: 4px;
		padding-bottom: 80px;
	}

	.account {
		padding: 18px;
		background: #fff;
		border-radius: 4px;
	}

	.account-title {
		font-size: 14px;
		color: #000;
		display: inline-block;
		background: url(../../../static/img/cash@2x.png) no-repeat right;
		background-size: 10px;
		padding-right: 15px;
	}

	.account-num {
		padding: 12px 0;
	}

	.account-num-int {
		font-size: 31px;
		font-weight: bold;
		color: #000;
		display: inline-block;
	}

	.account-num-float {
		font-size: 14px;
		font-weight: bold;
		color: #000;
		display: inline-block;
	}

	.account-btn {
		position: relative;
	}

	.account-btn-btn {
		position: absolute;
		text-align: center;
		font-size: 12px;
		line-height: 24px;
		width: 43px;
		height: 24px;
		border: 1px solid #FF8C4E;
		border-radius: 4px;
		color: #FF8C4E;
		right: 0;
		top: 24px
	}

	.account-more {
		font-size: 11px;
		color: #999;
		text-align: center;
		padding-top: 10px;
		border-top: 1px solid #f5f5f5;
	}

	.order-nav {
		margin-top: 12px;
		justify-content: space-between;
		background: #fff;
		height: 95px;
		padding: 0 12px;
		border-radius: 4px;
	}

	.all-order {
		background: url(../../../static/img/all-order@2x.png) no-repeat center;
		background-size: 30px;
		height: 30px;
		font-size: 12px;
		color: #666;
		margin-top: 20px;
		line-height: 85px;
	}

	.paid-order {
		background: url(../../../static/img/paid-order@2x.png) no-repeat center;
		background-size: 30px;
		height: 30px;
		font-size: 12px;
		color: #666;
		margin-top: 20px;
		line-height: 85px;
	}

	.wait-order {
		background: url(../../../static/img/wait-order@2x.png) no-repeat center;
		background-size: 30px;
		height: 30px;
		font-size: 12px;
		color: #666;
		margin-top: 20px;
		line-height: 85px;
	}

	.assess-order {
		background: url(../../../static/img/assess-order@2x.png) no-repeat center;
		background-size: 30px;
		height: 30px;
		font-size: 12px;
		color: #666;
		margin-top: 20px;
		line-height: 85px;
	}

	.order-view {
		position: relative
	}

	.order-num {
		position: absolute;
		width: 18px;
		height: 18px;
		font-size: 10px;
		color: #fff;
		background: #ff0000;
		border-radius: 50%;
		text-align: center;
		line-height: 18px;
		top: -8px;
		right: -4px
	}

	.coupon-nav {
		padding: 10px 12px 22px;
		margin-top: 12px;
		background: #fff;
		justify-content: space-between;
		border-radius: 4px;
	}

	.coupon-nav .flex-1 {
		margin-left: 24px;
	}

	.coupon-nav .flex-1:nth-child(1) {
		margin-left: 0px;
	}

	.coupon-nav-title {
		font-size: 14px;
		color: #000;
	}

	.coupon-nav-content {
		justify-content: space-between;
	}

	.coupon-nav-content-left {
		font-size: 12px;
		color: #FF8C4E;
		margin-top: 18px;
	}

	.coupon-nav-content-right-location {
		background: url(../../../static/img/location@2x.png) no-repeat right;
		background-size: 24px;
		height: 24px;
		width: 24px;
		margin-top: 8px;
	}

	.coupon-nav-content-right-coupon {
		background: url(../../../static/img/coupon@2x.png) no-repeat right;
		background-size: 24px;
		height: 24px;
		width: 24px;
		margin-top: 8px;
	}

	.coupon-nav-content-right-push {
		background: url(../../../static/img/push@2x.png) no-repeat right;
		background-size: 24px;
		height: 24px;
		width: 24px;
		margin-top: 8px;
	}

	.content-link {
		border-radius: 4px;
		background: #fff;
		margin-top: 12px;
	}

	.content-link-list {
		color: #1a1a1a;
		font-size: 14px;
		padding: 15px 0 15px 37px;
		border-top: 1px solid #f5f5f5;
		position: relative;
	}

	.content-link .content-link-list:nth-child(1) {
		border-top: 0;
	}

	.content-link .content-link-list:after {
		content: " ";
		display: inline-block;
		height: 8px;
		width: 8px;
		border-width: 1px 1px 0 0;
		border-color: #c5c5c5;
		border-style: solid;
		-webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
		transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
		position: absolute;
		right: 20px;
		margin-top: 5px
	}

	.content-link-contact {
		background: url(../../../static/img/lianxikefu@2x.png) no-repeat 12px;
		background-size: 15px;
		height: 15px;
		line-height: 15px;
	}

	.content-link-question {
		background: url(../../../static/img/changjianwenti@2x.png) no-repeat 12px;
		background-size: 15px;
		height: 15px;
		line-height: 15px;
	}

	.content-link-about {
		background: url(../../../static/img/guanyuwomen@2x.png) no-repeat 12px;
		background-size: 15px;
		line-height: 15px;
		height: 15px;
	}

	.content-link-feedback {
		background: url(../../../static/img/feedback@2x.png) no-repeat 12px;
		background-size: 15px;
		line-height: 15px;
		height: 15px;
	}
</style>
