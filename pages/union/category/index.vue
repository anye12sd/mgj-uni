<template>
	<view class="page">
		<headerNav :value="navbar" @search="getSearch"></headerNav>
		<view class="header flex">
			<view class="header-left flex-1" :class="{'header-active': current == 1}" @click="showFilter(1)"><text class="header-content">全部分类</text></view>
			<view class="header-right flex-1" :class="{'header-active': current == 2}" @click="showFilter(2)"><text class="header-content">距离</text></view>
		</view>
		<view class="SearchPage" v-if="showSearchPage">
			<u-popup :show="showSearchPage" @close="closeSearchPage" mode="top">
				<view class="filter-cate" v-if="current == 1">
					<view class="filter-cate-list" :class="{'active': cate_id == 0}" @click="filterCate(0)">
						全部分类
					</view>
					<view class="filter-cate-list" :class="{'active': cate_id == item.id}" v-for="(item,index) in cateList" :key="index" @click="filterCate(item.id)">
						{{item.category_name}}
					</view>
				</view>
				<view class="filter-distance" v-else-if="current == 2">
					<view class="fliter-dis" :class="{'active': distanceIndex == 0}" @click="filterDis(0)">全城</view>
					<view class="fliter-dis" v-for="(item,key,index) in distanceList" :class="{'active': key == distanceIndex}" :key="index" @click="filterDis(key)">{{item}}</view>
				</view>
			</u-popup>
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
	import {getUnionMap, getUnionIndex} from '../../../config/api.js'
	export default {
		data() {
			return {
				navbar: {
					title: '',
					custom: true,
					type: 'search'
				},
				current: 0,
				showSearchPage: false,
				cate_id: 0,
				distanceList: [],
				distanceIndex: 0,
				lng: '',
				lat: '',
				search: '',
				page: 1,
				last_page: 0,
				storeList: [],
				cateList: [],
				dixianShow: false
			}
		},
		onLoad(option){
			this.cate_id = option.cate
			this.fetch()
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
						that.fetchList()
						uni.hideLoading()
					},
					error: function(err) {
						uni.hideLoading()
						console.log(err)
					}
				});
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
			fetch(){
				uni.showLoading({
					title: '加载中'
				})
				getUnionMap().then((res) => {
					this.distanceList = res.dis
					uni.hideLoading()
				})
			},
			fetchList(){
				let data = {
					lng: this.lng,
					lat: this.lat,
					search: this.search,
					cate: this.cate_id,
					page: this.page,
					dis: this.distanceIndex
				}
				uni.showLoading({
					title: '加载中'
				})
				getUnionIndex(data).then((res) => {
					if(!this.cateList.length){
						this.cateList = res.cate
					}
					this.last_page = res.storeList.last_page
					this.storeList = this.storeList.concat(res.storeList.data)
					uni.hideLoading()
				})
			},
			showFilter(id){
				if(this.current == id){
					this.current = 0
					this.showSearchPage = false
					return
				}
				this.current = id
				this.showSearchPage = true
			},
			filterDis(id){
				if(this.distanceIndex == id){
					this.current = 0
					this.showSearchPage = false
					return
				}
				this.page = 1
				this.current = 0
				this.storeList = []
				this.distanceIndex = id
				this.showSearchPage = false
				this.fetchList()
			},
			filterCate(id){
				if(this.cate_id == id){
					this.current = 0
					this.showSearchPage = false
					return
				}
				this.page = 1
				this.current = 0
				this.storeList = []
				this.cate_id = id
				this.showSearchPage = false
				this.fetchList()
			},
			closeSearchPage(){
				this.current = 0
				this.showSearchPage = false
			},
			onReachBottom() {
				if (this.page == this.last_page) {
					this.dixianShow = true
					return
				}
				this.page = this.page + 1
				this.fetchList()
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
		background: #f5f5f5;
		min-height: 100vh;
		padding: 0 12px;
	}
	.header{
		height: 50px;
		line-height: 50px;
		text-align: center;
		font-size: 14px;
		color: #242424;
		box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.08);
		margin: 0 -12px;
		background: #fff;
		z-index: 11;
		position: fixed;
		top: calc(44px + var(--status-bar-height));
		left: 0;
		right: 0;
	}
	.header-content{
		background: url(../../../static/img/down@2x.png) no-repeat right 22px;
		display: inline-block;
		background-size: 9px;
		padding-right: 15px;
	}
	.header-active .header-content{
		background: url(../../../static/img/up_active@2x.png) no-repeat right 22px;
		color: #FF8C4E;
		background-size: 9px;
		padding-right: 15px;
		display: inline-block;
	}

	.SearchPage {
		position: fixed;
		top: calc(44px + var(--status-bar-height));
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 10;
	}
	.filter-distance{
		margin-top: calc(94px + var(--status-bar-height));
		padding: 12px;
		text-align: center;
	}
	.fliter-dis{
		font-size: 14px;
		color: #666;
		padding-top: 12px
	}
	.fliter-dis:nth-child(1){
		padding-top: 0
	}
	.fliter-dis.active{
		color: #FF8C4E;
	}
	.filter-cate{
		margin-top: calc(94px + var(--status-bar-height));
		padding: 12px;
		text-align: left;
	}
	.filter-cate-list{
		font-size: 14px;
		color: #666;
		padding-top: 12px
	}
	.filter-cate-list:nth-child(1){
		padding-top: 0
	}
	.filter-cate-list.active{
		color: #FF8C4E;
		background: url(../../../static/img/cate-selected@2x.png)no-repeat right 16px;
		background-size: 15px;
	}
	.store-box{
		margin-top: calc(60px + var(--status-bar-height));
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
