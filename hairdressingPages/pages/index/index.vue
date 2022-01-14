<template>
	<view class="page">
		<headerNav :value="navbar"></headerNav>
		<view class="header-nav flex">
			<view class="all-sort sort-triangle"
				:class="{'active_up':sort_active === 1,'active_down':sort_active === 2}" @click="sortAll()">综合排序</view>
			<view class="price-sort sort-triangle"
				:class="{'active_up':sort_active === 3,'active_down':sort_active === 4}" @click="sortPrice()">价格排序
			</view>
			<view class="service-sort flex-1" :class="{'active':service_active === 1}" @click="sortService()">服务筛选
			</view>
			<view class="search-icon" @click="searchPageShow()">
			</view>
		</view>
		<view class="service-select">
			<u-popup :show="serviceSelectShow" @close="closeServiceSelect" mode="top">
				<scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" @scroll="serviceScroll">
					<view class="service-select-view">
						<template v-for="(item, index) in serviceList">
							<view class="service-list-title" :key="index">
								{{item.name}}
							</view>
							<view class="service-list-subtitle-box flex" :key="item.name">
								<template v-for="(items, indexs) in item.children">
									<view class="service-list-subtitle"
										:class="{'active': serviceSelected.includes(items.id)}" :key="items.id"
										@click="joinServiceId(items.id)">
										{{items.name}}
									</view>
								</template>
							</view>
						</template>
					</view>
				</scroll-view>
				<view class="price-area-box">
					<view class="price-area-title">
						价格区间
					</view>
					<view class="price-area flex">
						<input type="number" class="price-area-input flex-1" placeholder="自定义最低价格" v-model="min_price">
						<input type="number" class="price-area-input price-area-input-right flex-1"
							placeholder="自定义最高价格" v-model="max_price">
					</view>
				</view>
				<view class="bottom-btn flex">
					<view class="bottom-btn-left flex-1" @click="reset()">重置</view>
					<view class="bottom-btn-right flex-1" @click="confirm()">确认</view>
				</view>
			</u-popup>
		</view>
		<view class="SearchPage" v-if="showSearchPage">
			<u-popup :show="showSearchPage" @close="closeSearchPage" mode="top">
				<view class="SearchPage-box flex">
					<u--input
						    placeholder="请输入你想要的服务内容 如:美甲"
						    prefixIcon="search"
						    prefixIconStyle="font-size: 22px;color: #909399"
							fontSize="12px" color="#999" border="none" shape="circle"
							style="background: #e6e6e6; padding: 0 10px"
							v-model="search_name"
							class="flex-1"
						></u--input>
						<view class="search-btn" @click="toSearch()">搜索</view>
				</view>
				<view class="search-history">
					<view class="search-history-title">搜索历史</view>
					<view class="search-history-content flex" v-if="searchHistory.length">
						<template v-for="(item, index) in searchHistory">
							<view class="search-history-list" :key="index" @click="historyClick(item)">{{item}}</view>
						</template>
					</view>
				</view>
			</u-popup>
		</view>
		<view class="content flex">
			<template v-for="(item, index) in goodsList">
				<view :key="index" class="list" @click="toGoodsDetail(item)">
					<view class="img">
						<image mode="widthFix" :src="item.img"></image>
					</view>
					<view class="info-box">
						<view class="name">{{item.name}}</view>
						<view class="price-box flex">
							<view class="price">
								<price :price="item.price"></price>
							</view>
							<view class="origin_price" v-if="item.original_price - item.price">
								已优惠{{item.original_price - item.price}}</view>
						</view>
						<view class="saled">已售 {{item.saled || 0}}</view>
					</view>
				</view>
			</template>
			<view class="dixian" v-if="dixianShow">我也是有底线的</view>
		</view>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import price from '../../../components/price.vue'
	import {
		getGoodsListByservice,
		getCategory
	} from '../../../config/api.js'
	export default {
		components: {
			price
		},
		data() {
			return {
				navbar:{
					title: '养生理疗',
					custom: false
				},
				scrollTop: 0,
				sort_active: 0, // 排序（综合向上=1 向下=2 价格向上=3 向下=4）
				service_active: 0, // 服务筛选
				dixianShow: false,
				last_page: 0,
				goodsList: [],
				serviceList: [],
				serviceSelected: [],
				service_key: 0,
				page: 1,
				min_price: undefined,
				max_price: undefined,
				search_name: "",
				serviceSelectShow: false,
				old: {
					serviceScroll: 0
				},
				showSearchPage: false,
				searchHistory: [],
				barheight: this.StatusBar,
			}
		},
		onLoad(option) {
			this.searchHistory = uni.getStorageSync('HJKJ-searchHistory') || []
			this.service_key = option.id
			this.fetch()
			this.fetchCategory()
		},
		methods: {
			fetch(confirm_data) {
				let data = {
					shop_key: uni.getStorageSync('HJKJ-shop_id').id,
					service_key: this.service_key,
					page: this.page,
					psort: this.sort_active || 1,
					search_name: this.search_name,
					categorys: this.serviceSelected.length ? this.serviceSelected.join("|") : [],
					min_price: this.min_price,
					max_price: this.max_price,
				}
				uni.showLoading({
					title: '加载中'
				});
				getGoodsListByservice(confirm_data || data).then((res) => {
					if (this.page == res.last_page || res.total == 0) {
						this.dixianShow = true
					}
					this.last_page = res.last_page
					this.goodsList = this.goodsList.concat(res.data)
					uni.hideLoading()
				})
			},
			fetchCategory() {
				let data = {
					service_key: this.service_key,
				}
				uni.showLoading({
					title: '加载中'
				});
				getCategory(data).then((res) => {
					this.serviceList = res
					uni.hideLoading();
				})
			},
			toGoodsDetail(goods){
				uni.navigateTo({
					url: '/pages/laundryDetails/hairdressDetail?type=' +this.service_key+ '&id=' + goods.id //跳转路径
				})
			},
			sortAll() {
				if (this.sort_active == 3 || this.sort_active == 4) {
					this.sort_active = 0
				}
				switch (this.sort_active) {
					case 0:
						this.sort_active = 1;
						break;
					case 1:
						this.sort_active = 2;
						break;
					case 2:
						this.sort_active = 0;
						break;
				}
				this.goodsList = []
				this.fetch()
			},
			sortPrice() {
				if (this.sort_active == 1 || this.sort_active == 2) {
					this.sort_active = 0
				}
				switch (this.sort_active) {
					case 0:
						this.sort_active = 3;
						break;
					case 3:
						this.sort_active = 4;
						break;
					case 4:
						this.sort_active = 0;
				}
				this.goodsList = []
				this.fetch()
			},
			sortService() {
				if (this.service_active) {
					this.service_active = 0
					this.serviceSelectShow = false
				} else {
					this.service_active = 1
					this.serviceSelectShow = true
				}
			},
			onReachBottom() {
				if (this.page == this.last_page) {
					return
				}
				this.page = this.page + 1
				this.fetch()
			},
			closeServiceSelect(){
				this.serviceSelectShow = false
				this.service_active = 0
			},
			closeSearchPage() {
				this.showSearchPage = false
			},
			serviceScroll: function(e) {
				this.old.serviceScroll = e.detail.scrollTop
			},
			joinServiceId(id) {
				if (this.serviceSelected.includes(id)) {
					this.serviceSelected.splice(this.serviceSelected.findIndex(item => item === id), 1)
				} else {
					this.serviceSelected.push(id)
				}
			},
			reset() {
				this.serviceSelected = []
				this.min_price = undefined
				this.max_price = undefined
			},
			confirm() {
				if ((this.min_price && !this.max_price) || (!this.min_price && this.max_price)) {
					this.$refs.uToast.show({
						type: 'error',
						message: '请完善价格区间',
					})
					return
				}
				if (this.min_price > this.max_price) {
					this.$refs.uToast.show({
						type: 'error',
						message: '请输入正确的价格区间',
					})
					return
				}
				if (this.min_price == 0) {
					this.$refs.uToast.show({
						type: 'error',
						message: '最小价格不能为0',
					})
					this.min_price = 1
					return
				}
				// 筛选完毕后要从第一页开始
				let data = {
					shop_key: uni.getStorageSync('HJKJ-shop_id').id,
					service_key: this.service_key,
					page: 1,
					psort: this.sort_active || 1,
					search_name: this.search_name,
					categorys: this.serviceSelected.length ? this.serviceSelected.join("|") : [],
					min_price: this.min_price,
					max_price: this.max_price,
				}
				this.fetch(data)
				this.goodsList = []
				this.serviceSelectShow = false
				this.service_active = 0
			},
			searchPageShow() {
				this.service_active = 0
				this.serviceSelectShow = false
				this.showSearchPage = true
			},
			toSearch(){
				let data = {
					shop_key: uni.getStorageSync('HJKJ-shop_id').id,
					service_key: this.service_key,
					page: 1,
					psort: this.sort_active || 1,
					search_name: this.search_name,
					categorys: this.serviceSelected.length ? this.serviceSelected.join("|") : [],
					min_price: this.min_price,
					max_price: this.max_price,
				}
				this.goodsList = []
				this.showSearchPage = false
				this.fetch(data)
				if(!this.searchHistory.includes(this.search_name)){
					this.searchHistory.push(this.search_name)
					uni.setStorageSync('HJKJ-searchHistory', this.searchHistory)
				}
			},
			historyClick(item){
				this.search_name = item
				this.toSearch()
			}
		}
	}
</script>

<style scoped>
	.page {
		background: #f5f5f5;
		height: 100vh;
	}

	.header-nav {
		position: fixed;
		top: calc(44px + var(--status-bar-height));
		left: 0;
		right: 0;
		height: 50px;
		line-height: 50px;
		background: #fff;
		padding: 0 12px;
		font-size: 14px;
		color: #1a1a1a;
		box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.08);
		z-index: 10;
	}

	.sort-triangle {
		position: relative;
	}

	.sort-triangle:before {
		content: "";
		display: block;
		background: url(../../../static/img/up@2x.png) no-repeat center;
		background-size: 7px;
		width: 7px;
		height: 5px;
		position: absolute;
		right: -10px;
		top: 19px
	}

	.sort-triangle:after {
		content: "";
		display: block;
		background: url(../../../static/img/down@2x.png) no-repeat center;
		background-size: 7px;
		width: 7px;
		height: 7px;
		position: absolute;
		right: -10px;
		top: 27px
	}

	.all-sort.active_up,
	.all-sort.active_down,
	.price-sort.active_up,
	.price-sort.active_down {
		color: #FF8C4E
	}

	.all-sort.active_up:before {
		content: "";
		display: block;
		background: url(../../../static/img/up_active@2x.png) no-repeat center;
		background-size: 7px;
		width: 7px;
		height: 5px;
		position: absolute;
		right: -10px;
		top: 19px
	}

	.all-sort.active_down:after {
		content: "";
		display: block;
		background: url(../../../static/img/down_active@2x.png) no-repeat center;
		background-size: 7px;
		width: 7px;
		height: 7px;
		position: absolute;
		right: -10px;
		top: 26px
	}

	.price-sort.active_up:before {
		content: "";
		display: block;
		background: url(../../../static/img/up_active@2x.png) no-repeat center;
		background-size: 7px;
		width: 7px;
		height: 5px;
		position: absolute;
		right: -10px;
		top: 19px
	}

	.price-sort.active_down:after {
		content: "";
		display: block;
		background: url(../../../static/img/down_active@2x.png) no-repeat center;
		background-size: 7px;
		width: 7px;
		height: 7px;
		position: absolute;
		right: -10px;
		top: 26px
	}

	.price-sort {
		margin-left: 24px;
	}

	.service-sort {
		text-align: right;
		position: relative;
	}

	.service-sort.active {
		color: #FF8C4E
	}

	.service-sort:after {
		content: "";
		display: block;
		background: url(../../../static/img/down@2x.png) no-repeat center;
		background-size: 7px;
		width: 7px;
		height: 7px;
		position: absolute;
		right: -10px;
		top: 23px
	}

	.service-sort.active:after {
		content: "";
		display: block;
		background: url(../../../static/img/down_active@2x.png) no-repeat center;
		background-size: 7px;
		width: 7px;
		height: 7px;
		position: absolute;
		right: -10px;
		top: 22px
	}

	.search-icon {
		content: "";
		display: block;
		background: url(../../../static/img/search@2x.png) no-repeat right 19px;
		background-size: 13px;
		width: 13px;
		height: 50px;
		padding-left: 36px;
		position: relative;
	}

	.search-icon:before {
		content: "|";
		display: block;
		position: absolute;
		color: #ccc;
		left: 20px;
	}

	.content {
		padding: 12px;
		padding-top: 50px;
		background: #F5F5F5;
		flex-wrap: wrap;
	}

	.content .list:nth-child(even) {
		margin-left: 11px
	}

	.content .list {
		margin-top: 12px;
		width: calc(50vw - 18px);
	}

	.content .list .img image {
		width: 100%;
	}

	.name {
		background: #fff;
		font-weight: bold;
		font-size: 14px;
		color: #242424;
		padding: 12px;
		padding-bottom: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box; // 作为弹性伸缩盒子模型显示。
		-webkit-box-orient: vertical; // 设置伸缩盒子的子元素排列方式--从上到下垂直排列
		-webkit-line-clamp: 2; // 显示的行
	}

	.price-box {
		background: #fff;
		padding: 6px 12px;
		padding-bottom: 0;
		justify-content: space-between
	}

	.saled {
		background: #fff;
		padding: 6px 12px;
		font-size: 12px;
		color: #999;
	}

	.origin_price {
		padding: 3px 6px;
		color: #ff0000;
		background: rgba(255, 0, 0, .1);
		font-size: 10px;
		border-radius: 15px;
	}

	.service-select {
		position: fixed;
		top: 94px;
		z-index: 9;
	}

	.SearchPage {
		position: fixed;
		top: 94px;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 8;
	}
	.SearchPage-box {
		margin-top: calc(44px + var(--status-bar-height));
		padding: 12px;
		font-size: 16px;
		font-weight: bold;
		color: #000;
		padding-bottom: 0;
		padding: 12px
	}
	.search-btn{
		font-size: 14px;
		color: #242424;
		margin-left: 12px;
		line-height: 24px;
		font-weight: normal;
	}
	.search-history{
		padding: 12px;
	}
	.search-history-title{
		font-weight: bold;
		color: #242424;
		font-size: 16px;
	}
	.search-history-content{
		flex-wrap: wrap;
	}
	.search-history-list{
		margin-top: 12px;
		margin-right: 12px;
		padding: 4px 14px;
		border-radius: 15px;
		color: #242424;
		font-size: 12px;
		background: #e6e6e6;
	}

	.service-select-view {
		margin-top: calc(94px + var(--status-bar-height));
		padding: 12px;
		font-size: 16px;
		font-weight: bold;
		color: #000;
		padding-bottom: 0;
	}

	.service-list-subtitle-box {
		flex-wrap: wrap;
		padding-bottom: 12px;
		border-bottom: 1px solid #e6e6e6;
	}

	.service-list-title {
		margin-top: 12px;
	}

	.service-select-view .service-list-title:nth-child(1) {
		margin-top: 0;
	}

	.service-list-subtitle {
		padding: 4px 14px;
		color: #242424;
		background-color: #e6e6e6;
		border-radius: 30px;
		font-size: 12px;
		margin-top: 12px;
		margin-right: 16px;
		font-weight: normal;
	}

	.service-list-subtitle.active {
		padding: 4px 14px;
		color: #fff;
		background-color: #FF8C4E;
		border-radius: 30px;
		font-size: 12px;
		margin-top: 12px;
		margin-right: 16px;
		font-weight: normal;
	}

	.scroll-Y {
		height: 50vh;
	}

	.price-area-title {
		font-size: 16px;
		font-weight: bold;
		color: #000;
		padding: 12px
	}

	.price-area-input {
		height: 36px;
		line-height: 36px;
		color: #999;
		font-size: 12px;
		text-align: center;
		background: #e6e6e6;
		border-radius: 30px;
	}

	.price-area {
		padding: 0 12px;
		position: relative;
	}

	.price-area-input-right {
		margin-left: 31px;
	}

	.price-area:before {
		content: "";
		display: block;
		position: absolute;
		top: 18px;
		left: calc(50% - 9px);
		width: 18px;
		height: 1px;
		background: #ccc;
	}

	.bottom-btn {
		padding: 10px 12px;
		border-top: 1px solid #e6e6e6;
		margin-top: 12px;
	}

	.bottom-btn-left,
	.bottom-btn-right {
		height: 40px;
		line-height: 40px;
		font-size: 16px;
		color: #242424;
		text-align: center;
		border-radius: 30px;
		background: #E6E6E6;
	}

	.bottom-btn-right {
		margin-left: 31px;
		background: linear-gradient(90deg, #FC6767 0%, #FF8C4E 100%);
		color: #fff;
	}
</style>
