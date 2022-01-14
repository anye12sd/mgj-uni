<template>
	<view class="page">
		<headerNav :value="navbar"></headerNav>
		<view class="shop-img">
			<image mode="widthFix" :src="shop_info.banner"></image>
		</view>
		<view class="shop-content">
			<view class="shop-name">{{shop_info.name}}</view>
			<view class="shop-address">地址：{{shop_info.c_name + shop_info.a_name + shop_info.address}}</view>
			<view class="shop-tel">联系电话：{{shop_info.tel}}</view>
			<view class="shop-map">
				<map style="width: 100%; height: 140px;" :latitude="shop_info.lat" :longitude="shop_info.lng"
					:scale="16" :markers="marker">
				</map>
			</view>
		</view>
		<view class="footer">
			<view class="tel">电话咨询</view>
			<view class="pay" @click="toPay()">立即支付</view>
		</view>
	</view>
</template>

<script>
	import {
		getUnionShopInfo
	} from '../../../config/api.js'
	export default {
		data() {
			return {
				navbar: {
					title: '商家信息',
					custom: false,
				},
				shop_id: "",
				shop_info: {},
				marker: [{
					id: 0,
					latitude: '', //纬度
					longitude: '', //经度
					iconPath: '../../../static/img/location_fill.png', //显示的图标        
				}],
			}
		},
		onLoad(option) {
			this.shop_id = option.id
			this.fetch()
		},
		methods: {
			fetch() {
				let data = {
					key: this.shop_id
				}
				uni.showLoading({
					title: '加载中'
				})
				getUnionShopInfo(data).then((res) => {
					this.shop_info = res
					this.marker[0].latitude = res.lat
					this.marker[0].longitude = res.lng
					uni.hideLoading()
				})
			},
			toPay(){
				uni.navigateTo({
					url: '/pages/union/pay/index?id=' + this.shop_id
				})
			}
		}
	}
</script>

<style scoped>
	.page {
		min-height: calc(100vh - 70px);
		background: #f5f5f5;
		padding-bottom: 70px;
	}

	.shop-img {
		width: 100%;
	}

	.shop-img image {
		width: 100%;
	}

	.shop-content {
		margin: 0 12px;
		margin-top: 10px;
		border-radius: 4px;
		background-color: #fff;
		padding: 12px;
		color: #1A1A1A;
	}

	.shop-name {
		font-size: 16px;
		font-weight: bold;
	}

	.shop-address {
		font-size: 11px;
		margin-top: 10px;
	}

	.shop-tel {
		font-size: 11px;
		margin-top: 4px;
	}

	.shop-map {
		margin-top: 20px;
		width: 100%;
	}
	.footer{
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background: #fff;
		box-shadow: 0px -3px 6px rgba(0, 0, 0, 0.08);
		height: 60px;
		line-height: 60px;
		font-size: 16px;
		color: #fff;
		text-align: right;
		padding: 0 12px;
	}
	.footer .tel{
		display: inline-block;
		height: 41px;
		line-height: 41px;
		border-radius: 40px;
		width: 120px;
		text-align: 120px;
		background: linear-gradient(90deg, #FC6767 0%, #FF8C4E 100%);
		text-align: center;
		margin-right: 15px;
	}
	.footer .pay{
		display: inline-block;
		height: 41px;
		line-height: 41px;
		border-radius: 40px;
		width: 120px;
		text-align: 120px;
		background: linear-gradient(90deg, #FC6767 0%, #FF8C4E 100%);
		text-align: center;
	}
</style>
