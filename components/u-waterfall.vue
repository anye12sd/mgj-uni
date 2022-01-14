<template>
	<view class="Index">
		<!-- 瀑布流布局列表 -->
		<view class="pubuBox">
			<view class="pubuItem">
				<view class="item-masonry" v-for="(item, index) in comList" :key="index" @click="toUrl(item)">
					<image :src="item.img" mode="widthFix"></image>
					<view class="listtitle">
						<!-- 这是没有高度的父盒子（下半部分） -->
						<view class="listtitle1">{{ item.name }}</view>
						<view class="listtitle2">
							<text>5.0分 | 已售0份</text>
						</view>
						<view class="listtitle3">
							<price class="price" :price="item.price"></price>
							<view class="originPrice">￥{{item.original_price}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import price from './price.vue'
	export default {
		name: "u-waterfall",
		components: {
			price
		},
		props: {
			value: {
				// 瀑布流数据
				type: Array,
				required: true,
				default: function() {
					return [];
				}
			},
			recommendIndex: {
				type: Number,
				required: false,
			},
		},
		data() {
			return {
				comList: [], //商品列表
			}
		},
		watch: {
			value(nVal, oVal) {
				// 取差值，即这一次数组变化新增的部分
				let startIndex = Array.isArray(oVal) && oVal.length > 0 ? oVal.length : 0;
				// 拼接上原有数据
				this.comList = this.comList.concat(nVal);
			},
			recommendIndex(nVal, oVal){
				this.comList = []
			}
		},
		methods: {
			toUrl(item) {
				uni.navigateTo({
					url: item.s_goods_info_url + '?id=' + item.id, //跳转路径
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	//瀑布

	.pubuBox {
		padding: 22rpx;
	}

	.pubuItem {
		display: flex;
		flex-wrap: wrap;
	}

	.item-masonry {
		width: calc(50vw - 16px);
		box-sizing: border-box;
		border-radius: 15rpx;
		overflow: hidden;
		background-color: #fff;
		break-inside: avoid;
		/*避免在元素内部插入分页符*/
		box-sizing: border-box;
		margin-bottom: 20rpx;
	}

	.pubuItem .item-masonry:nth-child(odd) {
		margin-right: 5px;
	}

	.pubuItem .item-masonry:nth-child(even) {
		margin-left: 5px;
	}

	.item-masonry image {
		width: 100%;
	}

	.listtitle {
		padding-left: 22rpx;
		padding-bottom: 22rpx;

		.listtitle1 {
			color: #1a1a1a;
			font-size: 14px;
			line-height: 39rpx;
			text-overflow: -o-ellipsis-lastline;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			line-clamp: 2;
			-webkit-box-orient: vertical;
			min-height: 39rpx;
			max-height: 78rpx;
		}

		.listtitle2 {
			color: #999999;
			font-size: 12px;
			padding-top: 2px;
		}

		.listtitle3 {
			font-size: 5px;
			font-size: 28rpx;
			padding-top: 3px;
		}

		.price {
			display: inline-block;
		}

		.originPrice {
			font-size: 22rpx;
			color: #999;
			text-decoration: line-through;
			display: inline-block;
			margin-left: 6px;
		}
	}

	.Index {
		width: 100%;
		height: 100%;
	}
</style>
