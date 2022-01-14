<template>
	<view class="html-content">
		<headerNav :value="navbar" :address="addressDetail"></headerNav>
		<view class="top-header"></view>
		<!-- banner -->
		<view class="header-swiper">
			<u-swiper :list="list" keyName="img" @click="bannerClick" @change="e => current = e.current"
				:autoplay="true" height="160">
				<view slot="indicator" class="indicator">
					<view class="indicator__dot" v-for="(item, index) in list" :key="index"
						:class="[index === current && 'indicator__dot--active']">
					</view>
				</view>
			</u-swiper>
		</view>

		<!-- 消息 -->
		<view class="header-news">
			<view class="uni-padding-wrap">
				<view class="page-section swiper">
					<view class="page-section-spacing">
						<swiper class="swiper" :autoplay="autoplay" :interval="interval" :duration="duration"
							:vertical="true">
							<template v-for="(item, index) in newsList">
								<swiper-item :key="index">
									<view class="swiper-item">{{item}}</view>
								</swiper-item>
							</template>
						</swiper>
					</view>
				</view>
			</view>
		</view>

		<!-- 导航 -->
		<view class="nav">
			<view class="nav-list">
				<swiper class="swiper-nav" :indicator-dots="true" :autoplay="false" :duration="duration">
					<swiper-item class="nav-list-swiper-item flex" :key="index" v-for="(item, index) in Math.ceil(moduleList.length/10)">
						<template v-if="index<Math.ceil(moduleList.length/10) - 1">
							<view v-for="(item1, index1) in 10" class="nav-list-content" @click="toProductList(moduleList[index*10 + index1])" :key="index*10 + index1">
								<image style="width: 60px; height: 60px;" :src="moduleList[index*10 + index1].img"
									@error="imageError">
								</image>
								<view class="nav-list-content-text">{{moduleList[index*10 + index1].name}}</view>
							</view>
						</template>
						<template v-else> 
							<view v-for="(item1, index1) in moduleList.length%10" class="nav-list-content" @click="toProductList(moduleList[index*10 + index1])" :key="index*10 + index1">
								<image style="width: 60px; height: 60px;" :src="moduleList[index*10 + index1].img"
									@error="imageError">
								</image>
								<view class="nav-list-content-text">{{moduleList[index*10 + index1].name}}</view>
							</view>
						</template>
					</swiper-item>
				</swiper>
			</view>

			<!-- <view class="nav-list flex">
				<template v-for="(item, index) in moduleList">
					<view class="nav-list-content" :key="index" @click="toProductList(item)">
						<image style="width: 60px; height: 60px;" mode="widthFix" :src="item.img" @error="imageError">
						</image>
						<view>{{item.name}}</view>
					</view>
				</template>
			</view> -->
		</view>
		<view class="area flex">
			<image class="area-img1" mode="widthFix" @click="toUnion" src="../../static/img/activity@2x.png" @error="imageError"></image>
			<image class="area-img2" mode="widthFix" @click="toDeposit" src="../../static/img/chongzhi@2x.png" @error="imageError"></image>
		</view>
		<view class="newGoods">
			<view class="newGoods-title">新品推荐</view>
			<view class="newGoods-subtitle">新品上新精品推荐~</view>
			<view class="newGoods-content flex">
				<template v-for="(item, index) in new_goods">
					<view :key="index" class="newGoods-box">
						<image class="newGoods-img" mode="widthFix" :src="item.img" @error="imageError"></image>
						<price :price="item.price"></price>
					</view>
				</template>
			</view>
		</view>

		<!-- 推荐标题 -->
		<!--  #ifdef APP-PLUS -->
		<u-sticky :offsetTop="44 + StatusBar">
		<!--  #endif -->
		<!--  #ifdef H5 -->
		<u-sticky :offsetTop="0">
		<!--  #endif -->
			<view class="recommend">
				<view class="recommend-title flex">
					<view class="flex-1" :class="recommendIndex === 1?'active':''" @click="toRecommend(1)">管家推荐</view>
					<view class="flex-1" :class="recommendIndex === 2?'active':''" @click="toRecommend(2)">今日特价</view>
				</view>
			</view>
		</u-sticky>
		<!-- <view class="recommend" :class="{'st':true,'sticky-fixed':isF}">
			<view class="recommend-title flex">
				<view class="flex-1" :class="recommendIndex === 1?'active':''" @click="toRecommend(1)">管家推荐</view>
				<view class="flex-1" :class="recommendIndex === 2?'active':''" @click="toRecommend(2)">今日特价</view>
			</view>
		</view> -->

		<!-- 推荐内容 -->
		<view class="recommend-content">
			<uWaterfall :value="recommendValue.data" :recommendIndex="recommendIndex"></uWaterfall>
		</view>

		<!-- 回到顶部 -->
		<u-back-top :scroll-top="scrollTop" icon="../../static/img/toTop@2x.png" :iconStyle="iconStyle" right="12">
		</u-back-top>

		<view class="dixian" v-if="dixianShow">我也是有底线的</view>
		<footerNav :url="'index'"></footerNav>
		<u-overlay :show="push_show">
			<view class="warp">
				<image class="warp-img" mode="widthFix" :src="push_list.image" @error="imageError"></image>
			</view>
			<view class="warp-btn">
				<image class="warp-btn-img" mode="widthFix" src="../../static/img/close@2x.png" @error="imageError"
					@click="push_show = false"></image>
			</view>
		</u-overlay>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import uWaterfall from '../../components/u-waterfall.vue'
	import price from '../../components/price.vue'
	import footerNav from '../../components/footer-nav.vue'
	import {
		getMenu,
		postMenu,
		getRecommend,
		getShopList
	} from '../../config/api.js';
	export default {
		components: {
			price,
			uWaterfall,
			footerNav
		},
		data() {
			return {
				navbar: {
					title: '首页',
					custom: true,
					type: 'index'
				},
				barheight: this.StatusBar,
				addressDetail: {},
				list: [],
				newsList: [],
				moduleList: [],
				new_goods: [],
				push_list: [],
				current: 0,
				autoplay: true,
				interval: 2000,
				duration: 500,
				recommendIndex: 1,
				push_show: false,
				page: 1,
				recommendValue: {data: []},
				resetShop: true, //从商店列表返回会重新刷新商店，需要禁止，
				scrollTop: 0,
				iconStyle: {
					width: "40px",
					height: "40px"
				},
				dixianShow: false
			}
		},
		onShow() {
			if(!uni.getStorageSync('HJKJ-shop_id')){
				this.getShopList()
			}else{
				this.addressDetail = uni.getStorageSync('HJKJ-shop_id')
				this.fetch()
			}
			if(!this.resetShop){
				this.page = 1
			}
			this.fetchRecommend()
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
			//#ifdef H5
			this.isF = true
			// #endif
			// #ifndef H5
			if (this.yuanH > e.scrollTop) {
				this.isF = false
			} else {
				this.isF = true
			}
			// #endif
		},
		methods: {
			// 获取用户所在经纬度
			getShopList() {
				let that = this
				uni.getLocation({
					type: 'wgs84',
					geocode: true,
					success: function(res) {
						that.lng = res.longitude
						that.lat = res.latitude
						that.getShop(res)
						// uni.request({
						// 	url: '/TencentGet/?location=' + res.latitude + ',' + res.longitude + '&key=XWUBZ-M7PKW-USHRD-RRGJ3-D7HG2-C2FMK',
						// 	method: 'GET'
						// }).then((res) => {
						// 	console.log('/TencentGet/?location=' + res.latitude + ',' + res.longitude + '&key=XWUBZ-M7PKW-USHRD-RRGJ3-D7HG2-C2FMK')
						// 	console.log(res)
						// })
					}
				});
			},
			toDeposit(){
				uni.navigateTo({
					url: '/pages/deposit/index/index'
				})
			},
			toUnion(){
				uni.navigateTo({
					url: '/pages/union/index/index'
				})
			},
			// 获取用户所在位置第一个商店
			getShop(item) {
				uni.showLoading({
					title: '加载中'
				})
				let data = {
					lng: item.longitude,
					lat: item.latitude,
					dis: 0,
				}
				getShopList(data).then((res) => {
					console.log(res)
					if (res.length == 0) {
						this.$refs.uToast.show({
							type: 'error',
							message: '该地区暂无门店',
						})
						return
					}
					this.addressDetail = res[0]
					uni.setStorageSync("HJKJ-shop_id", this.addressDetail)
					this.fetch()
					uni.hideLoading()
				})
			},
			// 获取首页菜单
			fetch() {
				let data = {
					shop_key: uni.getStorageSync('HJKJ-shop_id').id
				}
				getMenu(data).then((res) => {
					this.list = res.banner
					this.newsList = res.horn
					this.moduleList = res.module
					this.new_goods = res.new_goods
					this.push_list = res.push
					if (res.push.is_open == 1) {
						this.push_show = true
					}
				})
			},
			bannerClick(e) {
				if (this.list[0].url.length) {
					console.log('有url')
				} else {
					console.log('无url')
				}
			},
			// 获取首页商品列表
			fetchRecommend() {
				let data = {
					shop_key: uni.getStorageSync('HJKJ-shop_id').id,
					page: this.page,
					type: this.recommendIndex
				}
				uni.showLoading({
					title: '加载中'
				});
				getRecommend(data).then((res) => {
					if (this.page == res.last_page || res.total == 0) {
						this.dixianShow = true
					}
					this.recommendValue = res
					uni.hideLoading();
				})
			},
			onReachBottom() {
				if (this.page == this.recommendValue.last_page) {
					return
				}
				this.page = this.page + 1
				this.fetchRecommend()
			},
			// 点击推荐时重新获取商品
			toRecommend(type) {
				if (this.recommendIndex == type) {
					return
				}
				this.dixianShow = false
				this.recommendIndex = type
				this.page = 1
				this.fetchRecommend()
			},
			toProductList(item) {
				uni.navigateTo({
					url: item.web_route + '?id=' + item.id //跳转路径
				})
			},
			imageError() {

			}
		}
	}
</script>

<style scoped>
	.html-content{
		min-height: calc(100vh - 80px);
		padding-bottom: 80px;
	}
	.top-header {
		height: 60px;
		background: linear-gradient(90deg, #FC6767 0%, #FF8C4E 100%);
		margin: 0 -12px;
	}

	swiper {
		height: 30px;
		line-height: 30px;
		color: #1a1a1a;
		font-size: 12px;
		background-color: #f5f5f5;
		border-radius: 4px;
		margin-top: 12px;
	}

	swiper-item {
		height: 30px;
		line-height: 30px;
	}

	.header-swiper {
		margin-top: -55px;
	}
	.nav-list{
		width: 100%;
		overflow: hidden;
		height: 220px;
	}

	.swiper-nav {
		width: 100%;
		height: 195px;
		background: #fff;
	}
	
	.header-news .page-section .swiper {
		background-image: url(../../static/img/sound@2x.png);
		background-repeat: no-repeat;
		background-position-x: 12px;
		background-position-y: center;
		background-size: 11px;
		padding-left: 32px;
	}

	.nav-list-swiper-item {
		flex-wrap: wrap;
		text-align: center;
	}

	.nav-list-content {
		width: 20%;
		font-size: 12px;
		color: #1a1a1a;
		text-align: center;
		margin-top: 12px;
	}
	
	.nav-list-content-text{
		height: 16px;
		line-height: 16px;
		margin-top: -5px;
	}
	
	.swiper-nav /deep/ .uni-swiper-wrapper{
		overflow: inherit;
		overflow-x: clip;
	}
	
	.swiper-nav /deep/ .uni-swiper-dots-horizontal{
		bottom: -25px;
	}
	.swiper-nav /deep/ .uni-swiper-dot{
		background-color: #999 !important
	}
	.swiper-nav /deep/ .uni-swiper-dot-active{
		background-color: #FF8C4E !important
	}
	
	.area {
		margin-top: 20px;
	}

	.area-img1 {
		margin-right: 5px;
	}

	.area-img2 {
		margin-left: 5px;
	}

	.newGoods {
		padding: 12px;
		background: linear-gradient(180deg, rgba(255, 140, 78, 0.2) 0%, rgba(255, 140, 78, 0.04) 100%);
		border-radius: 4px;
		margin-top: 12px;
	}

	.newGoods-title {
		color: #1a1a1a;
		font-size: 16px;
		display: block;
	}

	.newGoods-subtitle {
		color: #999;
		font-size: 12px;
		display: block;
	}

	.newGoods-content {
		margin-top: 13px;
	}

	.newGoods-box {
		margin-right: 12px;
	}

	.newGoods-img {
		width: 73px;
	}

	.recommend {
		margin: 0 -12px;
		background: #fff;
		height: 100rpx;
		width: 100vw;
		line-height: 100rpx;
		z-index: 999;
	}

	.recommend-title .flex-1 {
		text-align: center;
		font-size: 16px;
		color: #666666;
	}

	.recommend-title .active {
		color: #1a1a1a;
		font-weight: bold;
		text-align: center;
		position: relative;
	}

	.st {
		height: 100rpx;
		width: 750rpx;
		background-color: #fff;
		z-index: 999;
		/* top: 300upx; */
	}

	.sticky-fixed {
		/* #ifdef H5 */
		position: sticky;
		top: 44px;
		/* #endif */
		/* #ifndef H5 */
		position: fixed;
		top: 0;
		/* #endif */
		z-index: 999;
		height: 50px;
		line-height: 50px;
		background: #fff;
	}

	.recommend-title .active::after {
		content: "";
		display: block;
		background: url(../../static/img/recommend@2x.png) no-repeat center;
		background-size: 10px;
		width: 10px;
		height: 4px;
		position: absolute;
		bottom: 8px;
		left: 0;
		right: 0;
		margin: 0 auto;
	}

	.recommend-content {
		margin: 0 -12px;
		padding-top: 10px;
		background-color: #f5f5f5;
	}

	.warp {
		position: relative;
		text-align: center;
		height: 100%;
	}

	.warp-img {
		position: absolute;
		width: 200px;
		top: 25%;
		left: 0;
		right: 0;
		margin: 0 auto;
	}

	.warp-btn-img {
		position: absolute;
		width: 30px;
		height: 30px;
		left: 0;
		right: 0;
		margin: 0 auto;
		top: calc(25% + 238px)
	}
</style>
<style lang="scss" scoped>
	.indicator {
		@include flex(row);
		justify-content: center;

		&__dot {
			height: 6px;
			width: 6px;
			border-radius: 100px;
			background-color: rgba(255, 255, 255, 0.35);
			margin: 0 5px;
			transition: background-color 0.3s;

			&--active {
				background-color: #ffffff;
			}
		}
	}
</style>
