<template>
	<view class="page">
		<headerNav :value="navbar"></headerNav>
		<view class="order-assess">
			<view class="order-assess-header flex">
				<image mode="widthFix" src="../../../static/img/shop-img@2x.png"></image>
				<view class="order-assess-title">普通版预约报名</view>
			</view>
			<view class="rate-box flex">
				<view class="rate-text">描述相符</view>
				<rate class="rate" :value="descValue" @rateChange="descChange"></rate>
			</view>
			<view class="">
				<textarea class="rate-textarea" :maxlength="-1" confirm-type="done" placeholder="从多个角度评价，可以帮助更多想买的人" />
			</view>
			<view class="img-upload-box">
				<view class="">
					图片上传
				</view>
			</view>
		</view>
		<view class="shop-assess">
			<view class="shop-assess-name">
				丽阳街二店
			</view>
			<view class="shop-assess-address">莲都区山山梦想城</view>
			<view class="rate-box flex">
				<view class="rate-text">服务态度</view>
				<rate class="rate" :value="serviceValue" @rateChange="serviceChange"></rate>
			</view>
			<view class="rate-box flex">
				<view class="rate-text">配送服务</view>
				<rate class="rate" :value="deliverValue" @rateChange="deliverChange"></rate>
			</view>
		</view>
		<view class="submit-btn">发布</view>
	</view>
</template>

<script>
	import rate from '../../../components/rate.vue'
	export default {
		components: {
			rate
		},
		data() {
			return {
				navbar:{
					title: '订单评价',
					custom: false
				},
				descValue: 1,
				serviceValue: 1,
				deliverValue: 1
			}
		},
		methods: {
			descChange(e) {
				this.descValue = e
			},
			serviceChange(e) {
				this.serviceValue = e
			},
			deliverChange(e) {
				this.deliverValue = e
			},
		}
	}
</script>

<style scoped>
	.page {
		min-height: calc(100vh - 68px);
		background: #f5f5f5;
		padding: 12px;
	}

	.order-assess {
		border-radius: 4px;
		background: #fff;
		padding: 12px;
	}

	.order-assess-header image {
		width: 55px;
		height: 55px;
	}

	.order-assess-title {
		margin-left: 8px;
		color: #1a1a1a;
		font-size: 14px;
	}

	.rate-box {
		color: #999;
		font-size: 14px;
		margin-top: 12px;
	}

	.rate {
		margin-left: 10px;
	}

	.rate-textarea {
		margin-top: 12px;
		font-size: 11px;
		color: #999;
		padding-top: 12px;
		height: 100px;
	}
	.shop-assess{
		padding: 12px;
		background: #Fff;
		margin-top: 6px;
		border-radius: 4px;
	}
	.shop-assess-name{
		color: #000;
		font-size: 14px;
		background: url(../../../static/img/shop-header-img@2x.png) no-repeat left;
		background-size: 25px;
		padding-left: 37px;
		height: 25px;
		line-height: 25px;
	}
	.shop-assess-address{
		margin-top: 6px;
		color: #999;
		font-size: 12px;
	}
	.submit-btn{
		height: 50px;
		line-height: 50px;
		background: linear-gradient(90deg, #FC6767 0%, #FF8C4E 100%);
		color: #fff;
		font-size: 16px;
		margin-top: 60px;
		border-radius: 80px;
		text-align: center;
	}
</style>
