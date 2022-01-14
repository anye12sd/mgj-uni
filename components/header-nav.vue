<template>
	<view>
		<view class="header flex">
			<template v-if="!value.custom">
				<view class="back-btn" @click="toback()"></view>
				<view class="header-title flex-1">{{value.title}}</view>
				<view></view>
			</template>
			<template v-else-if="value.type == 'index'">
				<view class="location" @click="toSelectShop()">
					{{address.name}}
				</view>
			</template>
			<template v-else-if="value.type == 'login'">
				<view class="header-title flex-1">{{value.title}}</view>
				<view></view>
			</template>
			<template v-else-if="value.type == 'search'">
				<view class="back-btn" @click="toback()"></view>
				<view class="union-search-box">
					<u-search placeholder="酒店服务" v-model="search" height="44" :showAction="false" @search="toSearch()" @clear="toSearch()" @focus="openSearchPage()"></u-search>
				</view>
				<view></view>
			</template>
		</view>
		<view class="SearchPage" v-if="showSearchPage">
			<u-popup :show="showSearchPage" @close="closeSearchPage" mode="top">
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
		<view class="cheater"></view>
	</view>
</template>

<script>
	export default {
		name: 'headerNav',
		props: {
			value: {
				type: Object,
				required: false,
				default: function() {
					return {};
				}
			},
			address: {
				type: Object,
				required: false,
				default: function() {
					return {};
				}
			},
		},
		data(){
			return{
				search: "",
				showSearchPage: false,
				searchHistory: [],
			}
		},
		methods: {
			toback() {
				// #ifdef APP-PLUS
				uni.navigateBack({
					delta: 1
				})
 				// #endif
				// #ifdef H5
				history.back()
				// #endif
			},
			toSelectShop() {
				uni.navigateTo({
					url: '/pages/shop/list/index'
				})
			},
			toSearch(){
				this.$emit("search", this.search)
				this.showSearchPage = false
				if(this.search){
					if(!this.searchHistory.includes(this.search)){
						this.searchHistory.push(this.search)
						uni.setStorageSync('HJKJ-searchHistory', this.searchHistory)
					}
				}
			},
			openSearchPage(){
				this.showSearchPage = true
				this.searchHistory = uni.getStorageSync('HJKJ-searchHistory') || []
			},
			closeSearchPage() {
				this.showSearchPage = false
			},
			historyClick(item){
				this.$emit("search", item)
				this.showSearchPage = false
			}
		}
	}
</script>

<style scoped>
	.header {
		height: calc(44px + var(--status-bar-height));
		background: linear-gradient(90deg, #FC6767 0%, #FF8C4E 100%);
		position: fixed;
		left: 0;
		right: 0;
		z-index: 100;
		padding: 0 12px;
		line-height: calc(44px + var(--status-bar-height) + 1px);
		justify-content: space-between;
	}

	.back-btn {
		display: inline-block;
		height: 10px;
		width: 10px;
		border-width: 0 0 1px 1px;
		border-color: #fff;
		border-style: solid;
		-webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
		transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
		margin-top: calc(16px + (var(--status-bar-height) * 0.5));
		margin-left: 2px;
		position: absolute;
	}

	.header-title {
		line-height: calc(44px + var(--status-bar-height));
		font-size: 16px;
		color: #fff;
		text-align: center;
	}

	.location {
		font-size: 18px;
		color: #fff;
		background: url(../static/img/location-white@2x.png)no-repeat left;
		background-size: 12px;
		padding-left: 16px;
		position: relative;
	}

	.location::after {
		content: "";
		position: absolute;
		display: inline-block;
		height: 8px;
		width: 8px;
		border-width: 1px 1px 0 0;
		border-color: #fff;
		border-style: solid;
		-webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
		transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
		margin-top: calc(18px + (var(--status-bar-height) * 0.5));
		margin-left: 2px;
	}
	
	.union-search-box{
		margin: 0 auto;
	}

	.cheater {
		height: calc(44px + var(--status-bar-height));
	}
	
	.SearchPage {
		position: fixed;
		top: 94px;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 10;
	}
	.search-history{
		padding: 12px;
		margin-top: calc(44px + var(--status-bar-height));
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
</style>
