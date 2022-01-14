<template>
	<view class="page" v-if="shopInfo.shop">
		<headerNav :value="navbar"></headerNav>
		<view class="header-img">
			<image :src="shopInfo.shop.banner" mode="widthFix"></image>
		</view>
		<view class="info">
			<view class="info-header">{{shopInfo.shop.name}}</view>
			<view class="info-time">营业时间： {{shopInfo.shop.work_time1 + ':00' }}-{{shopInfo.shop.work_time2 + ':00' }}</view>
			<view class="info-time info-tel">联系方式： {{shopInfo.shop.tel }}</view>
			<view class="info-time info-address">{{shopInfo.shop.a_name + shopInfo.shop.address}}</view>
		</view>
		<view class="service">
			<view class="service-title">
				服务类目
			</view>
			<view class="service-box flex">
				<view class="service-list" v-for="(item, index) in shopInfo.service" :key="index">
					{{item.name}}
				</view>
			</view>
		</view>
		<view class="comment">
			<view class="comment-title">用户评论</view>
			<view class="comment-content">
				<view class="comment-header flex">
					<image src="../../../static/img/avatar@2x.png"></image>
					<view class="comment-name">用户昵称</view>
				</view>
				<view class="comment-text">用户评论</view>
				<view class="comment-time">2012.02.02</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {getShopInfo} from '../../../config/api.js'
	export default{
		data() {
			return {
				navbar:{
					title: '门店信息',
					custom: false
				},
				shopInfo: {}
			}
		},
		onLoad(option){
			this.fetch(option.id)
		},
		methods: {
			fetch(id){
				let data = {
					shop_key: id
				}
				uni.showLoading({
					title: '加载中'
				});
				getShopInfo(data).then((res) => {
					this.shopInfo = res
					uni.hideLoading()
				})
			}
		}
	}
</script>

<style scoped>
	.page {
		min-height: calc(100vh - 44px);
		background: #f5f5f5;
		padding: 0 12px;
	}
	.header-img{
		padding-top: 14px;
	}
	.header-img image{
		width: 100%;
		border-radius: 4px;
	}
	.info{
		background: #fff;
		padding: 12px;
		margin-top: 6px;
		border-radius: 4px;
	}
	.info-header{
		background: url(../../../static/img/shop-header-img@2x.png) no-repeat left;
		background-size: 23px;
		line-height: 23px;
		padding-left: 33px;
		font-weight: bold;
		color: #000;
		font-size: 16px;
	}
	.info-time{
		font-size: 14px;
		color: #000;
		margin-top: 6px;
	}
	.info-tel{
		margin-top: 24px;
	}
	.info-address{
		position: relative;
	}
	.info-address::after{
		content: "";
		background: url(../../../static/img/location.png) no-repeat center;
		background-size: 25px;
		width: 25px;
		height: 25px;
		transform: rotate(-90deg);
		display: inline-block;
		position: absolute;
		right: 0;
	}
	.service{
		background: #fff;
		padding: 12px;
		margin-top: 6px;
	}
	.service-title{
		font-size: 14px;
		color: #000;
		font-weight: bold;
	}
	.service-box{
		flex-wrap: wrap;
	}
	.service-list{
		padding: 4px 14px;
		font-size: 12px;
		color: #1a1a1a;
		background: #e6e6e6;
		border-radius: 30px;
		margin-top: 12px;
		margin-right: 12px;
	}
	.comment{
		background: #fff;
		padding: 12px;
		margin-top: 6px;
	}
	.comment-title{
		font-weight: bold;
		background: #fff;
		font-size: 14px;
		padding-bottom: 12px;
		border-bottom: 1px solid #f5f5f5;
	}
	.comment-content{
		padding-top: 12px;
	}
	.comment-header image{
		width: 36px;
		height: 36px;
	}
	.comment-name{
		margin-left: 7px;
		color: #000;
		font-size: 12px;
	}
	.comment-text{
		margin-top: 6px;
		color: #000;
		font-size: 12px;
	}
	.comment-time{
		color: #ccc;
		font-size: 11px;
		margin-top: 8px;
	}
</style>
