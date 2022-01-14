<template>
	<view class="page">
		<headerNav :value="navbar"></headerNav>
		<u-toast ref="uToast"></u-toast>
		<view class="info">
			<view class="info-list flex">
				<view class="label">姓名</view>
				<view class="input-box flex-1">
					<input v-model="form.take_name" class="input" type="text" placeholder="姓名" placeholder-style="color:#999">
				</view>
			</view>
			<view class="info-list flex">
				<view class="label"></view>
				<view class="input-box flex-1 flex">
					<view class="gender" :class="{'active': form.sex == 1}" @click="selectGender(1)">先生</view>
					<view class="gender" :class="{'active': form.sex == 2}" @click="selectGender(2)">女士</view>
				</view>
			</view>
			<view class="info-list flex">
				<view class="label">电话</view>
				<view class="input-box flex-1">
					<input  v-model="form.phone" class="input" type="number" placeholder="手机号码" placeholder-style="color:#999">
				</view>
			</view>
			<view class="info-list flex">
				<view class="label">地址</view>
				<view class="input-box flex-1">
					<view @click="wakeMap" class="input input-address">{{form.address || "请选择收货地址"}}</view>
				</view>
			</view>
			<view class="info-list flex">
				<view class="label">详细地址</view>
				<view class="input-box flex-1">
					<input v-model="form.detail" class="input" type="text" placeholder="例: 5楼303室" placeholder-style="color:#999">
				</view>
			</view>
		</view>
		<view class="default-box flex">
			<view class="label">设为默认</view>
			<view class="content">
				<u-switch
				v-model="form.is_default"
					space="2" activeColor="#FF8C4E" 
					inactiveColor="#ccc">
				</u-switch>
			</view>
		</view>
		<view class="submit-btn" @click="toSubmit">提交并使用</view>
	</view>
</template>

<script>
	import {postAddAddress} from '../../../config/api.js'
	export default {
		data() {
			return {
				navbar:{
					title: '新增地址',
					custom: false
				},
				form: {
					sex: 1,
					address: "",
					is_default: true,
					take_name: "",
					detail: "",
					phone: "",
					type: "add",
					key: "",
					lng: "",
					lat: "",
				}
			}
		},
		onLoad(option){
			let option1
			if(option.item){
				option1 = JSON.parse(option.item)
				this.form = {...option1}
				this.form.is_default = option1.is_default == 1 ? true : false 
				this.form.type = option1.id ? 'edit' : 'add'
				this.form.key = option1.id || ""
			}
		},
		methods: {
			selectGender(id) {
				if (this.form.sex == id) {
					return
				}
				this.form.sex = id
			},
			wakeMap() {
				uni.chooseLocation({
					success: (res) => {
						// console.log('位置名称：' + res.name);
						// console.log('详细地址：' + res.address);
						// console.log('纬度：' + res.latitude);
						// console.log('经度：' + res.longitude);
						this.form.address = res.address
						this.form.lat = res.latitude
						this.form.lng = res.longitude
					},
					fail: (err) => {
						this.$refs.uToast.show({
							type: 'error',
							message: '获取地址失败',
						})
					}
				})
			},
			toSubmit(){
				let regExp = /^1[23456789]\d{9}$/
				if(!this.form.take_name){
					this.$refs.uToast.show({
						type: 'default',
						message: '请填写姓名',
					})
					return
				}
				console.log(regExp.test(this.form.phone))
				if(!regExp.test(this.form.phone)){
					this.$refs.uToast.show({
						type: 'default',
						message: '请填写正确的手机号',
					})
					return
				}
				if(!this.form.address){
					this.$refs.uToast.show({
						type: 'default',
						message: '请选择地址',
					})
					return
				}
				if(!this.form.detail){
					this.$refs.uToast.show({
						type: 'default',
						message: '请填写详细地址',
					})
					return
				}
				let data = this.form
				uni.showLoading({
					title: '加载中'
				})
				postAddAddress(data).then((res) => {
					uni.navigateBack(1)
					uni.hideLoading()
				})
			}
		}
	}
</script>

<style scoped>
	.page {
		min-height: calc(100vh - 12px);
		padding: 12px;
		padding-top: 0;
		background: #f5f5f5;
	}

	.info {
		margin-top: 12px;
		background: #fff;
		padding: 0 12px
	}

	.info-list {
		padding: 14px 0;
		border-bottom: 1px solid #f5f5f5;
	}

	.info .info-list:nth-last-child(1) {
		border-bottom: 0;
	}

	.label {
		font-size: 14px;
		color: #000;
		width: 80px;
	}

	.input-box {
		font-size: 14px;
		color: #999;
		position: relative;
	}

	.input {
		font-size: 14px;
	}
	.input-address{
		padding-right: 20px;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box; // 作为弹性伸缩盒子模型显示。
		-webkit-box-orient: vertical; // 设置伸缩盒子的子元素排列方式--从上到下垂直排列
		-webkit-line-clamp: 1; // 显示的行
		
	}
	.input-address::after {
		content: " ";
		display: inline-block;
		height: 8px;
		width: 8px;
		border-width: 1px 1px 0 0;
		border-color: #999;
		border-style: solid;
		-webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
		transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
		position: absolute;
		right: 4px;
		top: 6px
	}

	.gender {
		width: 60px;
		height: 25px;
		border-radius: 3px;
		color: #000;
		font-size: 14px;
		text-align: center;
		line-height: 25px;
		background: #fff;
		border: 1px solid #707070
	}

	.input-box .gender:nth-child(2) {
		margin-left: 12px;
	}

	.gender.active {
		background: #FF8C4E;
		border-color: #FF8C4E;
		color: #fff;
	}
	.default-box{
		padding: 14px 12px;
		background: #fff;
		margin-top: 6px ;
		justify-content: space-between;
	}
	.default-box .label{
		line-height: 27px;
	}
	.submit-btn{
		position: fixed;
		bottom: 35px;
		left: 12px;
		right: 12px;
		background: linear-gradient(90deg, #FC6767 0%, #FF8C4E 100%);
		color: #fff;
		font-size: 16px;
		text-align: center;
		height: 50px;
		line-height: 50px;
		border-radius: 60px;
	}
</style>
