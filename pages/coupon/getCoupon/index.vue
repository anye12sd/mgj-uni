<template>
	<view class="page">
		<headerNav :value="navbar"></headerNav>
		<view class="get-more-coupon">
			<image class="get-more-coupon-img" mode="widthFix" src="../../../static/img/get-more-coupon@2x.png"></image>
		</view>
		<view class="list flex" v-for="(item, index) in couponList" :key="index">
			<view class="coupon-amount">
				<view class="coupon-amount-num"><text>￥</text>{{item.amount}}</view>
				<view class="coupon-amount-condition">{{item.used_text}}</view>
			</view>
			<view class="coupon-info flex-1">
				<view class="coupon-info-name">{{item.title}}</view>
				<view class="coupon-info-condition">{{item.remarks}}</view>
				<view class="coupon-info-time">{{item.time_text}}</view>
			</view>
			<view v-if="item.is_receive == 1" class="coupon-info-time-btn" @click="getCoupon(item.id)">立即领取</view>
			<view v-else class="coupon-info-time-btn coupon-info-time-btn-unabled">不可领取</view>
		</view>
		<view class="no-coupon" v-if="couponShow">
			<image mode="widthFix" src="../../../static/img/noCoupon@2x.png"></image>
		</view>
		<view class="dixian" v-if="dixianShow">我也是有底线的</view>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import {fetchCoupon, getCoupon} from '../../../config/api.js'
	export default{
		data(){
			return {
				navbar:{
					title: '领券中心',
					custom: false
				},
				couponList: [],
				last_page: 0,
				page: 1,
				dixianShow: false,
				couponShow: false,
			}
		},
		onLoad(){
			this.getUsableCoupon()
		},
		methods: {
			getUsableCoupon(){
				uni.showLoading({
					title: '加载中'
				})
				fetchCoupon().then((res) => {
					if(res.total == 0){
						this.couponShow = true
						uni.hideLoading()
						return
					}
					this.couponList = this.couponList.concat(res.data)
					this.last_page = res.last_page
					uni.hideLoading()
				})
			},
			getCoupon(id){
				uni.showLoading({
					title: '加载中'
				})
				getCoupon({coupon_key: id}).then((res) => {
					console.log(res)
					this.$refs.uToast.show({
						type: 'success',
						message: '领取成功',
					})
					uni.hideLoading()
					this.page = 1
					this.couponList = []
					this.getUsableCoupon()
				})
			},
			onReachBottom() {
				if (this.page == this.last_page) {
					return
				}
				this.page = this.page + 1
				this.getUsableCoupon()
			},
		}
	}
</script>

<style scoped>
	.page{
		min-height: calc(100vh - 44px);
		background: #f5f5f5;
	}
	.no-coupon{
		width: 185px;
		height: 135px;
		margin: 0 auto;
		margin-top: 18vh;
	}
	.no-coupon image{
		width: 100%;
	}
	.get-more-coupon{
		width: 100%;
	}
	.get-more-coupon-img{
		width: 100%;
	}
	.list{
		border-radius: 10px;
		background: #fff;
		box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
		margin: 0 12px;
		margin-top: 12px;
	}
	.coupon-amount{
		width: 113px;
		text-align: center;
		font-size: 28px;
		font-weight: bold;
		color: #FF8C4E;
		border-right: 3px dashed #999;
		padding-bottom: 22px;
		position: relative;
	}
	.coupon-amount:before{
		position: absolute;
		content: "";
		width: 7px;
		height: 100%;
		background-color: #FF8C4E;
		left: 0;
		border-radius: 10px 0 0 10px ;
	}
	.coupon-used{
		color: #999
	}
	.coupon-used:before{
		background-color: #999;
	}
	.coupon-amount-num{
		margin-top: 26px;
	}
	.coupon-amount text{
		font-size: 14px;
		font-weight: normal;
		margin-right: 3px;
	}
	.coupon-amount-condition{
		font-size: 12px;
		font-weight: normal;
		margin-left: 8px;
	}
	.coupon-info{
		margin-left: 24px;
		position: relative;
	}
	.coupon-info-name{
		font-weight: bold;
		font-size: 16px;
		color: #333;
		margin-top: 12px;
	}
	.coupon-info-condition{
		font-size: 14px;
		color: #999;
		margin-top: 8px;
	}
	.coupon-info-time{
		font-size: 11px;
		color: #999;
		margin-top: 6px;
		padding-bottom: 6px;
	}
	.coupon-info-time-btn{
		padding: 6px 8px;
		background: #FF8C4E;
		color: #fff;
		font-size: 12px;
		border-radius: 5px;
		display: inline-block;
		height: fit-content;
		margin-top: 42px;
		margin-right: 12px;
	}
	.coupon-info-time-btn-unabled{
		background: #999;
		color: #fff;
	}
</style>
