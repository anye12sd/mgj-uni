<template>
	<view class="page">
		<headerNav :value="navbar"></headerNav>
		<rich-text :nodes="node"></rich-text>
	</view>
</template>

<script>
	import {getFAQ} from '../../../config/api.js'
	export default{
		data(){
			return {
				navbar:{
					title: '常见问题',
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
				getFAQ().then((res) => {
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
		min-height: calc(100vh - 12px);
		padding-top: 0;
	}
</style>
