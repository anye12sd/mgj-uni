<template>
	<view class="page">
		<headerNav :value="navbar"></headerNav>
		<view class="box" v-if="!showNoAddress">
			<view class="list" v-for="(item, index) in addressList" :key="index" @click="addressSelected(item)">
				<view class="list-title">
					{{item.take_name}} {{item.phone}}
				</view>
				<view class="list-address">
					{{item.address + item.detail}}
				</view>
				<view class="list-footer flex">
					<view class="list-footer-left">
						<template v-if="item.is_default == 1">
							<label class="radio active">
								<radio value="r1" :checked="true" color="#FF8C4E" style="transform:scale(0.7)"
									disabled="true" />已设为默认
							</label>
						</template>
						<template v-else>
							<label class="radio">
								<radio value="r1" :checked="false" color="#999" style="transform:scale(0.7)"
									disabled="true" @click.stop="setDefault(item.id)" />设为默认
							</label>
						</template>
					</view>
					<view class="list-footer-right flex">
						<view class="list-footer-right-del" @click.stop="toDel(item.id)">删除</view>
						<view class="list-footer-right-change" @click.stop="toEdit(item)">修改</view>
					</view>
				</view>
			</view>
		</view>
		<view class="no-address" v-else>
			<image mode="widthFix" src="../../../static/img/no-address@2x.png"></image>
		</view>
		<view class="add-address-btn" @click="toAdd">新增我的地址</view>
		<u-toast ref="uToast"></u-toast>
		<view>
			<u-modal :show="delShow" @confirm="confirm" :closeOnClickOverlay="true" :showCancelButton="true"
				confirmColor="#FF8C4E" @cancel="delShow = false">
				<view class="slot-content">
					确定删除该地址吗
				</view>
			</u-modal>
		</view>
	</view>
</template>

<script>
	import {
		getAddressList,
		postSetDefault,
		postDelAddress
	} from '../../../config/api.js'
	export default {
		data() {
			return {
				navbar:{
					title: '我的地址',
					custom: false
				},
				showNoAddress: false,
				addressList: [],
				delShow: false,
				id: "",
				needBack: ""
			}
		},
		onLoad() {
			
		},
		onShow() {
			this.fetch()
			let pagearr = getCurrentPages();//获取应用页面栈
				let currentPage = pagearr[pagearr.length - 1];//获取当前页面信息
				console.log('option:' , currentPage.options)//获取页面传递的信息
				this.needBack = currentPage.options.needBack
		},
		methods: {
			fetch() {
				uni.showLoading({
					title: '加载中'
				})
				getAddressList().then((res) => {
					if (!res.length) {
						this.showNoAddress = true
					}
					this.addressList = res
					uni.hideLoading();
				})
			},
			setDefault(id) {
				uni.showLoading({
					title: '加载中'
				})
				let data = {
					key: id
				}
				postSetDefault(data).then((res) => {
					uni.hideLoading()
					this.$refs.uToast.show({
						type: 'success',
						message: '修改成功',
					})
					this.fetch()
				})
			},
			toDel(id) {
				this.id = id
				this.delShow = true
			},
			confirm() {
				this.delShow = false
				uni.showLoading({
					title: '加载中'
				})
				let data = {
					key: this.id
				}
				postDelAddress(data).then((res) => {
					uni.hideLoading()
					this.$refs.uToast.show({
						type: 'success',
						message: '删除成功',
					})
					this.fetch()
				})
			},
			toEdit(item) {
				uni.navigateTo({
					url: '/pages/mine/newAddress/index?item=' + JSON.stringify(item)
				})
			},
			toAdd() {
				uni.navigateTo({
					url: '/pages/mine/newAddress/index'
				})
			},
			addressSelected(item) {
				if (!this.needBack) {
					return
				}
				let pages = getCurrentPages(); //获取所有页面栈实例列表
				let prevPage = pages[pages.length - 2]; //上一页页面实例
				prevPage.$vm.addressDetail = item; //修改上一页data里面的sercode参数值
				uni.navigateBack({ //uni.navigateTo跳转的返回，默认1为返回上一级
					delta: 1
				});
			}
		}
	}
</script>

<style scoped>
	.page {
		padding: 12px;
		background: #f5f5f5;
		min-height: calc(100vh - 12px);
		padding-top: 0;
		border-radius: 4px;
	}

	.box {
		padding-bottom: 62px;
	}

	.list {
		padding: 12px;
		background: #fff;
		margin-top: 12px;
	}

	.list-title {
		font-size: 16px;
		color: #000;
	}

	.list-address {
		font-size: 14px;
		color: #666;
		margin-top: 11px;
	}

	.radio {
		color: #999;
		font-size: 14px;
	}

	.radio.active {
		color: #FF8C4E;
		font-size: 14px;
	}

	.list-footer {
		margin-top: 24px;
		line-height: 25px;
		justify-content: space-between;
	}

	.list-footer-right {
		font-size: 14px;
		color: #999;
	}

	.list-footer-right-change {
		margin-left: 12px;
	}

	.add-address-btn {
		position: fixed;
		bottom: 12px;
		height: 50px;
		line-height: 50px;
		left: 12px;
		right: 12px;
		background: linear-gradient(90deg, #FC6767 0%, #FF8C4E 100%);
		text-align: center;
		font-size: 16px;
		color: #fff;
		border-radius: 60px;
	}

	.no-address {
		width: 215px;
		height: 130px;
		position: fixed;
		top: 33vh;
		left: 0;
		right: 0;
		margin: 0 auto
	}

	.no-address image {
		width: 100%;
	}
</style>
