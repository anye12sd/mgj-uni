<template>
	<view class="page">
		<headerNav :value="navbar"></headerNav>
		<!--  #ifdef APP-PLUS -->
		<u-sticky :offsetTop="44 + StatusBar">
			<!--  #endif -->
			<!--  #ifdef H5 -->
			<u-sticky :offsetTop="0">
				<!--  #endif -->
				<view class="search-box flex">
					<view class="distance-select flex">
						<view>距离：</view>
						<view class="distance" @click="select()">{{distanceValue}}</view>
					</view>
					<view class="flex-1">
						<u-search shape="round" v-model="searchTxt" :showAction="false" placeholder="请输入您的收货地址"
							@search="search()"></u-search>
					</view>
				</view>
				<view class="current" v-if="currentPosition">当前位置: <text>{{currentPosition.city + currentPosition.district + currentPosition.street}}</text></view>
				<view class="current" v-else>暂不能取得您的位置</view>
			</u-sticky>
			<view class="shop-list-box">
				<view class="shop-list flex" v-for="(item,index) in shopList" :key="index" @click="chooseShop(item)">
					<view class="shop-list-img">
						<image mode="widthFix" :src="item.img"></image>
					</view>
					<view class="shop-list-info flex-1">
						<view class="shop-list-info-name">{{item.name}}</view>
						<view class="shop-list-info-distance">{{item.address}}(距您{{item.distance}}km)</view>
					</view>
				</view>
			</view>
			<u-picker :show="show" :columns="columns" @confirm="confirm" @cancel="cancel"></u-picker>
			<view class="dixian" style="margin: 0" v-if="dixianShow">我也是有底线的</view>
	</view>
</template>

<script>
	import {
		getShopList
	} from '../../../config/api.js'
	export default {
		data() {
			return {
				navbar: {
					title: '加盟店列表',
					custom: false,
				},
				show: false,
				columns: [
					['全部', '1.0km', '2.0km', '3.0km']
				],
				barheight: this.StatusBar,
				distance: '',
				distanceValue: "全部",
				lng: "",
				lat: "",
				searchTxt: "",
				shopList: [],
				dixianShow: false,
				currentPosition: ""
			}
		},
		onLoad() {
			this.fetchGeo()
		},
		methods: {
			fetchGeo() {
				let that = this
				uni.showLoading({
					title: '正在获取经纬度'
				})
				uni.getLocation({
					type: 'wgs84',
					geocode: true,
					success: function(res) {
						console.log(res)
						that.currentPosition = res.address
						that.lng = res.longitude
						that.lat = res.latitude
						uni.hideLoading()
						that.fetch()
						// uni.request({
						// 	url: '/TencentGet/?location=' + res.latitude + ',' + res.longitude + '&key=XWUBZ-M7PKW-USHRD-RRGJ3-D7HG2-C2FMK',
						// 	method: 'GET'
						// }).then((res) => {
						// 	console.log(res)
						// 	this.currentPosition = res
						// })
					},
					error: function(err) {
						uni.hideLoading()
						console.log(err)
					}
				});
			},
			fetch() {
				uni.showLoading({
					title: '加载中'
				})
				let data = {
					lng: this.lng,
					lat: this.lat,
					dis: this.distance,
					search: this.searchTxt
				}
				getShopList(data).then((res) => {
					if (res.length == 0) {
						uni.hideLoading()
						return
					}
					this.dixianShow = true
					this.shopList = res
					uni.hideLoading()
				})
			},
			select() {
				this.show = true
			},
			confirm(e) {
				this.distanceValue = e.value[0]
				this.distance = e.indexs[0]
				this.show = false
				this.fetch()
			},
			search() {
				this.fetch()
			},
			cancel() {
				this.show = false
			},
			chooseShop(item) {
				let pagearr = getCurrentPages();
				let currentPage = pagearr[pagearr.length - 1];
				let prevPage = pagearr[pagearr.length - 2]; //上一页页面实例
				prevPage.$vm.addressDetail = item; //修改上一页data里面的sercode参数值
				prevPage.$vm.resetShop = false; //修改上一页data里面的sercode参数值
				let needBack = currentPage.options.needBack
				uni.setStorageSync("HJKJ-shop_id", item)
				// 选择商店时候需要把购物车商品缓存去掉
				uni.removeStorageSync('HJKJ-washSelectedGoods')
				uni.removeStorageSync('HJKJ-fruitSelectedGoods')
				uni.removeStorageSync('HJKJ-hairdress')
				//#ifdef APP-PLUS
				uni.navigateBack({
					delta: 1
				})
				//#endif
				//#ifdef H5
				history.back()
				//#endif
				// uni.navigateBack({
				// 	delta: 1
				// })
			}
		}
	}
</script>

<style scoped>
	.page {
		background: #f5f5f5;
		min-height: 100vh;
	}

	.search-box {
		font-size: 13px;
		height: 50px;
		line-height: 50px;
		color: #1a1a1a;
		padding: 0 12px;
		background: #fff;
	}

	.distance {
		position: relative;
	}

	.distance::after {
		position: absolute;
		content: " ";
		display: inline-block;
		height: 8px;
		width: 8px;
		border-width: 0 1px 1px 0;
		border-color: #999;
		border-style: solid;
		-webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
		transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
		right: -16px;
		top: 18px
	}

	.search-box .flex-1 {
		margin-left: 30px;
	}

	.current {
		border-top: 1px solid #999;
		font-size: 12px;
		color: #1a1a1a;
		padding: 0 12px;
		height: 50px;
		line-height: 50px;
		background: url(../../../static/img/location_fill.png)no-repeat 12px;
		background-size: 18px;
		padding-left: 34px;
		border-bottom: 8px solid #f5f5f5;
		background-color: #fff;
	}

	.current text {
		color: #ff0000;
		margin-left: 6px;
	}

	.shop-list-box {
		padding: 0 12px;
		background: #fff;
	}

	.shop-list {
		padding: 12px 0;
		border-bottom: 1px solid #f5f5f5;
	}

	.shop-list-img {
		width: 50px;
		height: 50px;
	}

	.shop-list-img image {
		width: 100%;
	}

	.shop-list-info {
		margin-left: 8px;
	}

	.shop-list-info-name {
		font-size: 14px;
		color: #1a1a1a;
	}

	.shop-list-info-distance {
		font-size: 12px;
		color: #999;
		margin-top: 15px;
		text-align: justify;
	}
</style>
