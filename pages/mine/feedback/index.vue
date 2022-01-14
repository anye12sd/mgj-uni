<template>
	<view class="page">
		<headerNav :value="navbar"></headerNav>
		<view class="title">意见反馈</view>
		<textarea class="textarea" v-model="content" placeholder="请留下宝贵的建议意见"></textarea>
		<view class="btn" @click="submit">提交</view>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import {feedback, getCenter} from '../../../config/api.js'
	export default{
		data() {
			return {
				navbar:{
					title: '意见反馈',
					custom: false
				},
				content: '',
				phone: "",
				real_name: ""
			}
		},
		onLoad(){
			this.fetch()
		},
		methods:{
			fetch(){
				getCenter().then((res) => {
					console.log(res)
				})
			},
			submit(){
				if(!this.content){
					this.$refs.uToast.show({
						type: 'error',
						message: '请先填写反馈',
					})
				}
				let data = {
					content: this.content,
					phone: this.phone,
					real_name: this.real_name
				}
				feedback(data).then((res) => {
					this.$refs.uToast.show({
						type: 'success',
						message: '提交成功，感谢您的建议',
					})
				})
			}
		}
	}
</script>

<style scoped>
	.page{
		padding:0 12px;
		min-height: calc(100vh - 0px);
		background: #f5f5f5;
	}
	.title{
		font-size: 14px;
		color: #999;
		margin-top: 12px;
		margin-bottom: 12px;
	}
	.textarea{
		font-size: 14px;
		color: #666;
		width: auto;
		height: 100px;
		background: #fff;
		padding: 12px;
	}
	.btn{
		font-size: 16px;
		color: #fff;
		height: 50px;
		line-height: 50px;
		text-align: center;
		background: linear-gradient(90deg, #FC6767 0%, #FF8C4E 100%);
		border-radius: 50px;
		margin-top: 40px;
	}
</style>
