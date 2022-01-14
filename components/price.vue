<template>
	<view>
		<view class="sign">￥</view>
		<view class="num">{{price.split(".")[0]}}.</view>
		<view class="quote">{{price.split(".")[1]}}</view>
	</view>
</template>

<script>
	export default {
		props: {
			price: {
				type: [String],
				default: ''
			}
		}
	}
</script>

<style>
	.sign{
		display: inline-block;
		font-size: 12px;
		color: #ff0000;
		font-weight: bold;
	}
	.num {
		font-size: 16px;
		color: #ff0000;
		display: inline-block;
		font-weight: bold
	}

	.quote {
		font-weight: bold;
		font-size: 12px;
		color: #ff0000;
		display: inline-block;
	}
</style>
