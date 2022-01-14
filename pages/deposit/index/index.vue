<template>
	<view class="page">
		<headerNav :value="navbar"></headerNav>
		<view class="top-header"></view>
		<view class="top-box">
			<view class="top-box-sum">{{balance}}</view>
			<view class="top-box-text">账户余额</view>
		</view>
		<view class="deposit-box">
			<view class="deposit-box-title">请选择充值金额</view>
			<view class="deposit-box-content flex">
				<view class="deposit-list" :class="{'active': selectChargeId == item.id}"
					v-for="(item, index) in chargeList" :key="index" @click="selectCharge(item)">
					<view class="deposit-list-title">{{item.give_money}}</view>
					<view class="deposit-list-text">售价{{item.pay_money}}元</view>
				</view>
			</view>
		</view>
		<view class="deposit-way">
			<view class="deposit-box-title">请选择充值方式</view>
			<view class="deposit-way-content">
				<view class="withdraw-content">
					<view class="to-wechat radio" :class="{'active': current == 0}" @click="toSelect(0)">
						微信支付
					</view>
				</view>
				<!-- 					<view class="withdraw-content">
						<view class="to-bank radio" :class="{'active': current == 1}" @click="toSelect(1)">
							银行卡支付
						</view>
					</view> -->
			</view>
		</view>
		<view class="sureDeposit" @click="sureDeposit()">确认支付</view>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import {
		getCenter,
		getRecharge,
		payRecharge
	} from '../../../config/api.js'
	export default {
		data() {
			return {
				navbar: {
					title: '我要充值',
					custom: false
				},
				current: 0,
				balance: 0,
				chargeList: [],
				selectChargeId: 0
			}
		},
		onLoad() {
			this.fetch()
			this.getRecharge()
		},
		methods: {
			fetch() {
				uni.showLoading({
					title: '加载中'
				})
				getCenter().then((res) => {
					this.balance = res.user.balance
					uni.hideLoading()
				})
			},
			getRecharge() {
				uni.showLoading({
					title: '加载中'
				})
				getRecharge().then((res) => {
					if (!res.length) {
						uni.hideLoading()
						return
					}
					this.chargeList = res
					this.selectChargeId = res[0].id
					uni.hideLoading()
				})
			},
			toSelect(id) {
				if (id == this.current) {
					return
				}
				this.current = id
			},
			selectCharge(item) {
				this.selectChargeId = item.id
			},
			sureDeposit() {
				if (!this.selectChargeId) {
					this.$refs.uToast.show({
						type: 'error',
						message: '请先选择充值套餐',
					})
					return
				}
				let data = {
					key: this.selectChargeId
				}
				uni.showLoading({
					title: '加载中'
				})
				payRecharge(data).then((res) => {
					console.log(res)
					let orderInfo = res
					uni.hideLoading()
					uni.requestPayment({
						provider: 'wxpay',
						orderInfo: orderInfo,
						success: function(res) {
							console.log('success:' + JSON.stringify(res));
						},
						fail: function(err) {
							console.log('支付失败')
							console.log('fail:' + JSON.stringify(err));
						},
						complete: function(res) {
							console.log('xxxxxxxxxxxxxxxxxx---complete')
						}
					});
				})
			}
		}
	}
</script>

<style scoped>
	.page {
		min-height: calc(100vh - 80px);
		background: #f5f5f5;
		padding: 0 12px;
		padding-bottom: 80px;
	}

	.top-header {
		height: 60px;
		background: linear-gradient(90deg, #FC6767 0%, #FF8C4E 100%);
		margin: 0 -12px;
	}

	.top-box {
		padding: 12px;
		background: #fff;
		text-align: center;
		border-radius: 4px;
		margin-top: -40px;
	}

	.top-box-sum {
		font-size: 24px;
		color: #000;
		font-weight: bold;
		position: relative;
		display: inline-block;
		background: url(../../../static/img/cash@2x.png) no-repeat right 13px;
		background-size: 13px;
		padding-right: 20px;
	}

	.top-box-text {
		font-size: 12px;
		color: #999;
		font-weight: bold;
		margin-top: 8px;
	}

	.deposit-box {
		padding: 12px;
		border-radius: 4px;
		background: #fff;
		margin-top: 6px;
	}

	.deposit-box-title {
		font-size: 14px;
		color: #000;
		padding-bottom: 12px;
		border-bottom: 1px solid #f5f5f5;
	}

	.deposit-list {
		border: 1px solid #ccc;
		border-radius: 4px;
		padding: 12px;
		width: calc(50vw - 56px);
		margin-top: 12px;
		position: relative
	}

	.deposit-list.active {
		border-color: #FF8C4E;
	}

	.deposit-list.active::after {
		content: "";
		display: block;
		background: url(../../../static/img/deposit@2x.png)no-repeat right;
		position: absolute;
		background-size: 21px;
		width: 21px;
		height: 21px;
		top: -1px;
		right: -1px;
	}

	.deposit-list:nth-child(even) {
		margin-left: 12px;
	}

	.deposit-box-content {
		font-size: 12px;
		color: #999;
		flex-wrap: wrap;
	}

	.deposit-list-title {
		font-size: 14px;
		color: #000;
		margin-bottom: 1px;
		background: url(../../../static/img/cash@2x.png) no-repeat right 7px;
		background-size: 9px;
		display: inline-block;
		padding-right: 14px;
	}

	.deposit-way {
		padding: 12px;
		border-radius: 4px;
		background: #fff;
		margin-top: 6px;
	}

	.deposit-way-content .withdraw-content {
		padding: 12px 0;
		background: #fff;
		border-radius: 4px;
	}

	.deposit-way-content .withdraw-content:nth-child(0) {
		border-bottom: 1px solid #f5f5f5;
	}

	.to-wechat {
		font-size: 14px;
		color: #1a1a1a;
		position: relative;
		padding-left: 30px;
	}

	.to-wechat::before {
		content: "";
		background: url(../../../static/img/wechat.png) no-repeat center;
		background-size: 22px;
		display: inline-block;
		width: 22px;
		height: 22px;
		position: absolute;
		left: 0;
	}

	.to-bank {
		font-size: 14px;
		color: #1a1a1a;
		position: relative;
		padding-left: 30px;
	}

	.to-bank::before {
		content: "";
		background: url(../../../static/img/bank-card.png) no-repeat center;
		background-size: 22px;
		display: inline-block;
		width: 22px;
		height: 22px;
		position: absolute;
		left: 0;
	}

	.radio::after {
		content: "";
		display: inline-block;
		background: url(../../../static/img/checkbox.png) no-repeat center;
		background-size: 20px;
		width: 20px;
		height: 20px;
		position: absolute;
		right: 0;
	}

	.radio.active::after {
		content: "";
		display: inline-block;
		background: url(../../../static/img/checkbox-active.png) no-repeat center;
		background-size: 20px;
		width: 20px;
		height: 20px;
		position: absolute;
		right: 0;
	}

	.sureDeposit {
		background: linear-gradient(90deg, #FC6767 0%, #FF8C4E 100%);
		height: 50px;
		line-height: 50px;
		color: #fff;
		font-size: 16px;
		text-align: center;
		border-radius: 50px;
		position: fixed;
		bottom: 15px;
		left: 12px;
		right: 12px;
	}
</style>
