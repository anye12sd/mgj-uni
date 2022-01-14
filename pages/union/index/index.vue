<template>
	<view class="page">
		<headerNav :value="navbar" @search="getSearch"></headerNav>
		<view class="nav">
			<view class="nav-list" :class="{'nav-list1': categoryList.length <= 5, 'nav-list2': categoryList.length <= 10}">
				<swiper class="swiper-nav" :indicator-dots="true" :autoplay="false">
					<swiper-item class="nav-list-swiper-item flex" :key="index"
						v-for="(item, index) in Math.ceil(categoryList.length/15)">
						<template v-if="index<Math.ceil(categoryList.length/15) - 1">
							<view v-for="(item1, index1) in 15" class="nav-list-content"
								@click="toUnionList(categoryList[index*15 + index1])" :key="index*15 + index1">
								<image style="width: 60px; height: 60px;"
									:src="categoryList[index*15 + index1].img" @error="imageError">
								</image>
								<view class="nav-list-content-text">{{categoryList[index*15 + index1].category_name}}</view>
							</view>
						</template>
						<template v-else>
							<view v-for="(item1, index1) in categoryList.length%15" class="nav-list-content"
								@click="toUnionList(categoryList[index*15 + index1])" :key="index*15 + index1">
								<image style="width: 60px; height: 60px;"
									:src="categoryList[index*15 + index1].img" @error="imageError">
								</image>
								<view class="nav-list-content-text">{{categoryList[index*15 + index1].category_name}}</view>
							</view>
						</template>
					</swiper-item>
				</swiper>
			</view>
		</view>
		<view class="store-box">
			<view class="store-list flex" v-for="(item,index) in storeList" :key="index" @click="toShopInfo(item)">
				<view class="store-list-img">
					<image :src="item.img"></image>
				</view>
				<view class="store-list-center">
					<view class="store-list-center-name">{{item.name}}</view>
					<view class="store-list-center-dis">距您直线{{(item.distance * 0.001).toFixed(2) || 0}}公里</view>
				</view>
				<view class="store-list-right flex-1">
					<view class="store-list-right-name">{{item.cate_name}}</view>
					<view class="store-list-right-tel">电话咨询</view>
				</view>
			</view>
		</view>
		<view class="dixian" v-if="dixianShow">我也是有底线的</view>
	</view>
</template>

<script>
	import {
		getUnionIndex
	} from '../../../config/api.js'
	export default {
		data() {
			return {
				navbar: {
					title: '',
					custom: true,
					type: 'search'
				},
				categoryList: [],
				storeList: [],
				lat: "",
				lng: "",
				search: "",
				cate: "",
				page: 1,
				dis: "",
				last_page: "",
				dixianShow: false
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
						that.lng = res.longitude
						that.lat = res.latitude
						uni.hideLoading()
						that.fetch()
					},
					error: function(err) {
						uni.hideLoading()
						console.log(err)
					}
				});
			},
			fetch() {
				let data = {
					lng: this.lng,
					lat: this.lat,
					search: this.search,
					cate: this.cate,
					page: this.page,
					dis: this.dis
				}
				uni.showLoading({
					title: '加载中'
				})
				getUnionIndex(data).then((res) => {
					if(!this.categoryList.length){
						this.categoryList = res.cate
					}
					this.last_page = res.storeList.last_page
					this.storeList = this.storeList.concat(res.storeList.data)
					uni.hideLoading()
				})
			},
			onReachBottom() {
				if (this.page == this.last_page) {
					this.dixianShow = true
					return
				}
				this.page = this.page + 1
				this.fetch()
			},
			getSearch(e) {
				this.search = e
				this.page = 1
				this.storeList = []
				this.fetch()
				if(!this.searchHistory.includes(this.search_name)){
					this.searchHistory.push(this.search_name)
					uni.setStorageSync('HJKJ-searchHistory', this.searchHistory)
				}
			},
			toUnionList(item){
				uni.navigateTo({
					url: '/pages/union/category/index?cate=' + item.id
				})
			},
			toShopInfo(item){
				uni.navigateTo({
					url: '/pages/union/shop/index?id=' + item.id
				})
			}
		}
	}
</script>

<style scoped>
	.page {
		min-height: 100vh;
		background: #f5f5f5;
	}
.nav{
	padding: 12px;
	background: #fff;
	padding-top: 0;
}
	.nav-list {
		width: 100%;
		overflow: hidden;
		height: 290px;
	}
	.nav-list2{
		height: 200px;
	}
	.nav-list1{
		height: 125px;
	}

	.nav-list .swiper-nav {
		width: 100%;
		height: 270px;
		background: #fff;
	}
	.nav-list2 .swiper-nav {
		height: 185px;
	}
	.nav-list1 .swiper-nav {
		height: 105px;
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
		padding-top: 12px;
	}

	.nav-list-content-text {
		height: 16px;
		line-height: 16px;
	}

	.nav-list /deep/ .uni-swiper-wrapper {
		overflow: inherit;
		overflow-x: clip;
	}

	.nav-list /deep/ .uni-swiper-dots-horizontal {
		bottom: -15px;
	}

	.swiper-nav /deep/ .uni-swiper-dot {
		background-color: #999 !important
	}

	.swiper-nav /deep/ .uni-swiper-dot-active {
		background-color: #FF8C4E !important
	}
	.store-box{
		padding: 0 12px;
	}
	.store-list{
		padding: 12px;
		background-color: #fff;
		border-radius: 4px;
		margin-top: 12px;
	}
	.store-list-img image{
		width: 90px;
		height: 90px;
		border-radius: 4px;
		margin-right: 12px;
	}
	.store-list-center-name{
		color: #1A1A1A;
		font-size: 15px;
		font-weight: bold;
	}
	.store-list-center-dis{
		color: #999;
		font-size: 11px;
		margin-top: 2px;
	}
	.store-list-right{
		text-align: right;
	}
	.store-list-right-name{
		color: #999;
		font-size: 10px;
	}
	.store-list-right-tel{
		height: 25px;
		line-height: 25px;
		background: linear-gradient(90deg, #FF8A4F 0%, #FD6F62 100%);
		text-align: center;
		width: 75px;
		border-radius: 4px;
		color: #fff;
		font-size: 12px;
		float: right;
		margin-top: 50px;
	}
</style>
