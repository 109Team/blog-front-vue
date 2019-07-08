<template>
	<section class="post-list-wapper">
		<transition-group name="fade" tag="ul" class="post-list-content">
			<li
				class="list-item"
				v-for="(item, index) in postList"
				v-bind:key="item._id"
				:style="{'transition-delay': `${index * 50}ms`}"
			>
				<img :src="item.img_url" :alt="item.title" class="item-img">
				<div class="item-content">
					<div class="item-info">
						<h2>{{item.title}}</h2>
						<p>{{item.desc}}</p>
					</div>
					<span class="read-more" @click="showPostDetail(item._id)">阅读更多</span>
				</div>
			</li>
		</transition-group>
	</section>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import { Post } from "@/model/post";
@Component
export default class Posts extends Vue {
	public postList: Post[] = [];

	private beforeCreate() {
		this.$API.getAllPosts().then((data: any) => {
			this.postList = data.data || [];
		});
	}

	// 路由到详情
	public showPostDetail(postId: string): void {
		this.$router.push(`/home/post/${postId}`);
	}
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/theme.scss";
.post-list-wapper {
	width: 100%;
	height: 100%;
	position: relative;
	& {
		.post-list-content {
			width: 100%;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			padding: 0;
			position: relative;
			& {
				.list-item {
					position: relative;
					list-style: none;
					margin: 15px;
					text-align: left;
					box-sizing: border-box;
					display: flex;
					background: $postItemBgColor;
					width: 100%;
					height: 220px;
					box-shadow: 0 0 15px 1px rgba($Color-2-hex, 0.05);
					transition: all 0.3s ease-in;
					overflow: hidden;
					& {
						.item-img {
							width: 50%;
							min-width: 50%;
							object-fit: none;
							object-position: center;
						}
						.item-content {
							width: 50%;
							display: flex;
							flex-direction: column;
							justify-content: center;
							align-items: center;
							transition: all 0.2s ease-in;
							position: relative;
							& {
								.item-info {
									width: 100%;
									height: 100%;
									position: relative;
									display: flex;
									flex-direction: column;
									justify-content: center;
									align-items: center;
									transition: all 0.2s ease-in;
								}
								.read-more {
									position: absolute;
									width: 100%;
									height: 100%;
									top: 0;
									left: 0;
									display: flex;
									justify-content: center;
									align-items: center;
									font-size: 40px;
									opacity: 0;
									filter: opacity(0);
									transition: all 0.2s ease-in;
									cursor: pointer;
									color: $Color-4-hex;
								}
							}
						}
					}
				}

				@media screen and (min-width: 540px) {
					.list-item:nth-child(odd) {
						flex-direction: row;
					}
					.list-item:nth-child(even) {
						flex-direction: row-reverse;
					}
					.list-item:hover {
						box-shadow: 0 0 15px 1px rgba($Color-2-hex, 0.15);
						.item-content {
							transform: scaleX(1.05);
							.item-info {
								filter: blur(8px);
							}
							.read-more {
								opacity: 1;
								filter: opacity(100);
							}
						}
					}
				}

				@media screen and (max-width: 540px) {
					.list-item {
						height: 360px;
						flex-direction: column;
						& {
							.item-img {
								width: 100%;
								height: 50%;
							}
							.item-content {
								width: 100%;
								height: 50%;
								.read-more {
									opacity: 1;
									filter: opacity(100);
									font-size: 18px;
									justify-content: flex-end;
									align-items: flex-end;
									padding: 5px 10px;
									box-sizing: border-box;
								}
							}
						}
					}
				}
			}
		}
	}
}
</style>


