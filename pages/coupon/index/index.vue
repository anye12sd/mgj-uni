<template>
	<view class="page">
		<headerNav :value="navbar"></headerNav>
		<u-tabs :current="current" @change="tabChange" :list="list" lineWidth="30" lineColor="#FF8C4E" :activeStyle="{
								color: '#000',
								fontWeight: 'normal',
								fontSize: '14px',
							}" :inactiveStyle="{
								color: '#666',
								fontSize: '14px',
							}" itemStyle="padding: 12px">
		</u-tabs>
		<view class="content">
			<view class="more-coupon" @click="getConpon()">
				<image mode="widthFix" src="../../../static/img/get-discount-coupon.png"></image>
			</view>
			<view class="list flex" v-for="(item, index) in couponList" :key="index">
				<view class="coupon-amount" :class="{'coupon-used': !current == 0}">
					<view class="coupon-amount-num"><text>￥</text>{{item.amount}}</view>
					<view class="coupon-amount-condition">施太洗衣</view>
				</view>
				<view class="coupon-info flex-1">
					<view class="coupon-info-name">{{item.title}}</view>
					<view class="coupon-info-condition">满{{item.with_amount}}可使用</view>
					<view class="coupon-info-time" v-if="item.etime">{{item.btime.toLocaleString()}} - {{item.etime.toLocaleString()}}</view>
					<view class="coupon-info-time" v-else>无期限</view>
					<view class="coupon-info-time-btn" v-if="current == 0" @click="toUse(item)">立即使用</view>
					<view class="coupon-info-time-used" v-if="current == 1">已使用</view>
					<view class="coupon-info-time-used" v-if="current == 2">已过期</view>
				</view>
			</view>
		</view>
		<view class="no-coupon" v-if="couponShow">
			<image mode="widthFix" src="../../../static/img/noCoupon@2x.png"></image>
		</view>
		<view class="dixian" v-if="dixianShow">我也是有底线的</view>
	</view>
</template>

<script>
	import {getCouponList,getUsableCoupon} from '../../../config/api.js'
	export default {
		data() {
			return {
				navbar:{
					title: '我的优惠券',
					custom: false
				},
				type: 1,
				list: [{
					name: '可使用',
				}, {
					name: '已使用'
				}, {
					name: '已过期'
				}],
				couponList: [],
				current: 0,
				needBack: "",
				dixianShow: true,
				couponShow: false
			}
		},
		onShow(){
			let pagearr = getCurrentPages();
				let currentPage = pagearr[pagearr.length - 1];
				this.needBack = currentPage.options.needBack
				if(this.needBack){
					this.getUsableCoupon()
				}else{
					this.getConponList()
				}
		},
		methods: {
			tabChange(e){
				this.current = e.index
				this.type = e.index + 1
				this.couponList = []
				// 有needback参数则表示从下单页面调过来，需要跳转回去
				if((this.needBack == 1 || this.needBack == 10) && this.type == 1){
					this.getUsableCoupon()
				}else{
					this.getConponList()
				}
			},
			toUse(item){
				let pagearr = getCurrentPages();
					let currentPage = pagearr[pagearr.length - 1];
					let prevPage = pagearr[pagearr.length - 2]; //上一页页面实例
					prevPage.$vm.couponDetail = item; //修改上一页data里面的sercode参数值
					let needBack = currentPage.options.needBack
					if(needBack){
						uni.navigateBack(1)
						return
					}
				uni.navigateTo({
					url: '/pages/index/index'
				})
			},
			getUsableCoupon(){
				this.couponList = uni.getStorageSync('HJKJ-coupon')
					if(!this.couponList.length){
						this.couponShow = true
						this.dixianShow = false
						return
					}
					this.dixianShow = true
					this.couponShow = false
			},
			getConponList(){
				uni.showLoading({
					title: '加载中'
				})
				let data = {
					type: this.type
				}
				getCouponList(data).then((res) => {
					if(!res.length){
						this.couponShow = true
						this.dixianShow = false
						uni.hideLoading()
						return
					}
					this.dixianShow = true
					this.couponShow = false
					this.couponList = this.couponList.concat(res)
					uni.hideLoading()
				})
			},
			getConpon(){
				uni.navigateTo({
					url: '/pages/coupon/getCoupon/index'
				})
			}
		}
	}
</script>

<style scoped>
	.page {
		min-height: calc(100vh - 56px);
		background: #f5f5f5;
		padding: 0 12px;
		padding-bottom: 12px;
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
	.content{
		margin-top: 7px;
	}
	.more-coupon{
		width: 100%;
	}
	.more-coupon image{
		width: 100%;
	}
	.list{
		border-radius: 10px;
		background: #fff;
		margin-top: 12px;
		box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
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
		margin-top: 19px;
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
		margin-top: 15px;
	}
	.coupon-info-condition{
		font-size: 14px;
		color: #999;
		margin-top: 8px;
	}
	.coupon-info-time{
		font-size: 11px;
		color: #999;
		margin-top:6px;
		padding-bottom: 6px;
	}
	.coupon-info-time-btn{
		position: absolute;
		right: 12px;
		top: 38px;
		padding: 6px 8px;
		background: #FF8C4E;
		color: #fff;
		font-size: 12px;
		border-radius: 5px;
	}
	.coupon-info-time-used{
		font-size: 14px;
		color: #999;
		-webkit-transform: matrix(0.71, -0.99, 0.99, 0.71, 0, 0);
		transform: matrix(0.71, -0.99, 0.99, 0.71, 0, 0);
		position: absolute;
		right: 21px;
		top: 23px;
		width: 50px;
		height: 50px;
		line-height: 50px;
		text-align: center;
		border: 1px solid #e6e6e6;
		border-radius: 50%;
	}
	.coupon-info-time-used:before{
		content: "";
		width: 64px;
		height: 64px;
		border: 2px solid #e6e6e6;
		border-radius: 50%;
		display: block;
		position: absolute;
		left: -9px;
		top: -9px;
	}
</style>
