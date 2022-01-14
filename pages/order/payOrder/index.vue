<template>
	<view class="page">
		<headerNav :value="navbar"></headerNav>
		<view class="header">
			<view class="order-no">订单编号：{{order_no}}</view>
			<view class="order-price">￥<text>{{money.split('.')[0]}}</text>.{{money.split('.')[1]}}</view>
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
		getOrderDetail, getCenter, payOrder
	} from '../../../config/api.js'
	export default {
		data() {
			return {
				navbar: {
					title: '支付订单',
					custom: false,
				},
				money: "",
				order_no: "",
				id: "",
				balance: "",
				current: 3, // 支付模式,1微信,2支付宝,3余额
				service_id: ""
			}
		},
		onLoad(option) {
			this.id = option.id
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
			fetch() {
				let data = {
					key: this.id
				}
				uni.showLoading({
					title: '加载中'
				})
				getOrderDetail(data).then((res) => {
					this.money = res.pay_money
					this.order_no = res.order_num
					this.service_id = res.service_id
					uni.hideLoading()
				})
			},
			toDeposit(){
				uni.navigateTo({
					url: '/pages/deposit/index/index'
				})
			},
			payOrder(){
				let data = {
					key: this.id,
					type: this.current,
					order_no: this.order_no
				}
				payOrder(data).then((res) => {
					this.$refs.uToast.show({
						type: 'success',
						message: '支付成功',
					})
					if(this.service_id == 1){
						uni.removeStorageSync('HJKJ-washSelectedGoods')
					} else if(this.service_id == 10){
						uni.removeStorageSync('HJKJ-fruitSelectedGoods')
					} else{
						uni.removeStorageSync('HJKJ-hairdress')
					}
					setTimeout(function(){
						uni.navigateTo({
							url: '/pages/order/index/index?index=0'
						})
					}, 1500)
				})
			}
		}
	}
</script>

<style scoped>
	.page {
		min-height: 100vh;
		background: #f5f5f5;
		padding: 0 12px;
	}

	.order-no {
		font-size: 14px;
		text-align: center;
		margin-top: 12px;
		color: #666;
	}

	.order-price {
		color: #ff0000;
		text-align: center;
		font-size: 30px;
		margin-top: 8px;
	}

	.order-price text {
		font-size: 34px;
		font-size: 55px;
	}
.withdraw{
	padding-top: 60px;
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
		margin-top: 10px;
		left: 0;
	}

	.to-bank {
		height: 44px;
		line-height: 44px;
		font-size: 14px;
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
	.withdraw-content-go{
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
