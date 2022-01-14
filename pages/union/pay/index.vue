<template>
	<view class="page">
		<headerNav :value="navbar"></headerNav>
		<view class="content">
			<view class="title">付款金额</view>
			<view class="input-box">
				<view class="input-box-cancel" v-if="shouInputCancel" @click="cancalValue()"></view>
				<input type="digit" v-model="value" placeholder="请输入金额" class="content-input" confirm-type="done"
					placeholder-class="content-input-placeholader" @input="input" />
			</view>
			<view class="shop-name">商家信息：{{shop_info.name}}</view>
			<view class="shop-discount">商家折扣：{{parseFloat(shop_info.user_discount) * 0.1}}折</view>
			<view class="shop-discount">实付：{{trulyPayed}} 元</view>
			<view class="shop-hint">提示：实付金额不能小于0.01元</view>
		</view>
		<view class="withdraw">
			<view class="withdraw-content">
				<view class="to-wechat radio" :class="{'active': current == 1}" @click="toSelect(1)">
					微信支付
				</view>
			</view>
			<view class="withdraw-content">
				<view class="to-bank radio" :class="{'active': current == 3}" @click="toSelect(3)">
					余额支付
				</view>
				<view class="card-select flex">
					<view>
						账户余额：￥{{balance}}
					</view>
					<view class="withdraw-content-go" @click="toDeposit()">
						前往充值
					</view>
				</view>
			</view>
		</view>
		<u-toast ref="uToast"></u-toast>
		<view class="confirm" @click="payOrder()">确认支付</view>
	</view>
</template>

<script>
	import {
		getUnionShopInfo, getCenter, paymentOrder,getUnionUserInfo
	} from '../../../config/api.js'
	export default {
		data() {
			return {
				navbar: {
					title: '支付下单',
					custom: false,
				},
				shouInputCancel: false,
				value: "",
				shop_id: "",
				shop_info: {},
				balance: "",
				trulyPayed: 0,
				current: 3, // 支付模式,1微信,2支付宝,3余额
			}
		},
		onLoad(option) {
			this.shop_id = option.id
			this.fetchUser()
			this.fetch()
			this.getBalance()
		},
		methods: {
			toSelect(id){
				if(id == this.current){
					return
				}
				this.current = id
			},
			toDeposit(){
				uni.navigateTo({
					url: '/pages/deposit/index/index'
				})
			},
			fetchUser() {
				uni.showLoading({
					title: '加载中'
				})
				getUnionUserInfo().then((res) => {
					console.log(res)
					uni.hideLoading()
				})
			},
			fetch() {
				let data = {
					key: this.shop_id
				}
				uni.showLoading({
					title: '加载中'
				})
				getUnionShopInfo(data).then((res) => {
					console.log(res)
					this.shop_info = res
					uni.hideLoading()
				})
			},
			getBalance(){
				let data = {
					order_num: this.id
				}
				uni.showLoading({
					title: '加载中'
				})
				getCenter(data).then((res) => {
					this.balance = res.user.balance
					uni.hideLoading()
				})
			},
			input(e) {
				let discount = parseFloat(this.shop_info.user_discount) * 0.01
				this.trulyPayed = (this.value * discount).toFixed(2)
				if (e.detail.value.length) {
					this.shouInputCancel = true
				} else {
					this.shouInputCancel = false
				}
			},
			cancalValue() {
				this.value = ""
				this.trulyPayed = 0
				this.shouInputCancel = false
			},
			payOrder(){
				console.log(this.value)
				if(!this.value){
					this.$refs.uToast.show({
						type: 'error',
						message: '请输入金额',
					})
					return
				}
				let data = {
					key: this.shop_id,
					money: this.trulyPayed
				}
				paymentOrder(data).then((res) => {
					console.log(res)
				})
			}
		}
	}
</script>

<style scoped>
	.page {
		height: 100vh;
		background: #f5f5f5;
		padding: 0 12px;
	}

	.content {
		padding: 12px;
		background: #fff;
		border-radius: 4px;
		margin-top: 14px;
	}

	.title {
		color: #1A1A1A;
		font-size: 16px;
		font-weight: bold;
	}

	.content-input {
		font-size: 30px;
		color: #FF0000;
		height: 60px;
		line-height: 60px;
		padding: 0 20px;
	}

	.input-box {
		position: relative;
		border-bottom: 1px solid #E6E6E6;
	}

	.input-box:before {
		content: "￥";
		font-size: 26px;
		color: #FF0000;
		display: inline-block;
		position: absolute;
		top: 12px;
		left: -5px;
	}

	.input-box-cancel {
		width: 18px;
		height: 18px;
		display: inline;
		position: absolute;
		top: 22px;
		right: 0;
		z-index: 10;
	}

	.input-box-cancel:after {
		content: "";
		background: url(../../../static/img/input-clear@2x.png)no-repeat center;
		display: inline-block;
		background-size: 18px;
		width: 18px;
		height: 18px;
		position: absolute;
		top: 0;
		right: 0
	}

	/deep/ .content-input-placeholader {
		font-size: 18px;
	}

	.shop-name {
		margin-top: 14px;
		color: #1A1A1A;
		font-size: 11px;
	}

	.shop-discount {
		margin-top: 5px;
		color: #1A1A1A;
		font-size: 11px;
	}
	
	.shop-hint{
		color: #FF0000;
		margin-top: 5px;
		font-size: 11px;
	}

	.withdraw {
		padding-top: 6px;
	}

	.withdraw-content {
		padding: 0 12px;
		background: #fff;
		margin-top: 12px;
		border-radius: 4px;
	}

	.to-wechat {
		height: 44px;
		line-height: 44px;
		font-size: 16px;
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
		margin-top: 10px;
		left: 0;
	}

	.to-bank {
		height: 44px;
		line-height: 44px;
		font-size: 16px;
		color: #1a1a1a;
		position: relative;
		padding-left: 30px;
	}

	.to-bank::before {
		content: "";
		background: url(../../../static/img/purse@2x.png) no-repeat center;
		background-size: 22px;
		display: inline-block;
		width: 22px;
		height: 22px;
		position: absolute;
		margin-top: 10px;
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
		margin-top: 12px;
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
		margin-top: 12px;
		right: 0;
	}

	.card-select {
		height: 40px;
		line-height: 40px;
		font-size: 12px;
		color: #999;
		padding-left: 30px;
		border-top: 1px solid #f5f5f5;
		position: relative;
		justify-content: space-between;
	}

	.withdraw-content-go {
		font-size: 12px;
		color: #1a1a1a;
		padding-right: 22px;
	}

	.card-select:after {
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
		right: 8px;
		top: 16px
	}

	.confirm {
		height: 50px;
		line-height: 50px;
		background: linear-gradient(90deg, #FC6767 0%, #FF8C4E 100%);
		font-size: 16px;
		color: #fff;
		text-align: center;
		border-radius: 50px;
		margin-top: 100px;
	}
</style>
