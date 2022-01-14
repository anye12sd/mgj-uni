<template>
	<view class="foot-nav flex">
		<view class="index flex-1" :class="{'active': url === 'index'}" @click="toUrl('/pages/index/index')">
			首页
		</view>
		<view class="order flex-1" @click="toUrl('/pages/union/index/index')"></view>
		<view class="mine flex-1" @click="toUrl('/pages/mine/index/index')" :class="{'active': url === 'mine'}">
			我的
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			url: {
				// 瀑布流数据
				type: String,
				required: true,
				default: function() {
					return 'index';
				}
			},
		},
		data() {
			return {

			}
		},
		methods:{
			toUrl(url){
				let pagearr = getCurrentPages();
				let currentPage = pagearr[pagearr.length - 1];
				if(currentPage.__page__.path == url){
					return
				}
				uni.navigateTo({
					url: url + '?id=1' //跳转路径
				})
			}
		}
	}
</script>

<style scoped>
	.foot-nav {
		width: 100%;
		font-size: 12px;
		color: #999;
		height: 60px;
		background: #fff;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		text-align: center;
		box-shadow: 0px -3px 6px rgba(0, 0, 0, 0.08);
		z-index: 1000;
	}
	.index {
		background: url(../static/img/index@2x.png) no-repeat center;
		background-size: 25px;
		width: 25px;
		height: 25px;
		margin-top: 8px;
		line-height: 75px;
	}

	.index.active {
		color: #FF8C4E;
		background: url(../static/img/index-active@2x.png) no-repeat center;
		background-size: 25px;
	}

	.order {
		background: url(../static/img/order@2x.png) no-repeat center;
		background-size: 63px;
		width: 63px;
		height: 63px;
		margin-top: -20px;
	}

	.mine {
		background: url(../static/img/mine@2x.png) no-repeat center;
		background-size: 25px;
		width: 25px;
		height: 25px;
		margin-top: 8px;
		line-height: 75px;
	}

	.mine.active {
		background: url(../static/img/mine-active@2x.png) no-repeat center;
		background-size: 25px;
		color: #FF8C4E;
	}
</style>
