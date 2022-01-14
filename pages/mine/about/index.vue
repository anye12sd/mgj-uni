<template>
	<view class="page">
		<headerNav :value="navbar"></headerNav>
		<view style=" padding-top: 12px;">
			<rich-text :nodes="node"></rich-text>
		</view>
	</view>
</template>

<script>
	import {getAbout} from '../../../config/api.js'
	export default{
		data(){
			return {
				navbar:{
					title: '关于我们',
					custom: false
				},
				node: ''
			}
		},
		onLoad(){
			this.fetch()
		},
		methods: {
			fetch(){
				uni.showLoading({
					title: '加载中'
				});
				getAbout().then((res) => {
					this.node = res
					uni.hideLoading();
				})
			}
		}
	}
</script>

<style scoped>
	.page{
		padding: 12px;
		padding-top: 0;
	}
</style>
