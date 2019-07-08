<template>
	<div class="home">
		<div class="nav">
			<div class="logo"></div>
			<nav-bar :nav-list="navList" class="nav-bar" :position="'left'"></nav-bar>
		</div>
		<div class="content">
			<transition name="fade">
				<router-view/>
			</transition>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import { NavBarItem } from "@/model/navbarItem";
import NavBar from "@/components/navbar.component.vue";

@Component({
	components: {
		NavBar
	}
})
export default class Home extends Vue {
	public navList: NavBarItem[] = [];

	private init(): void {
		
	}

	private beforeCreate() {
		this.navList = [
			{
				id: 1,
				label: "主页",
				route: "/home"
			},
			{
				id: 3,
				label: "分类",
				route: "/home/categrey"
			}
		];
	}
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/theme.scss";
.home {
	display: flex;
	flex-direction: center;
	width: 100%;
	min-height: 100%;
	background: $homeBgColor;
	background-color: #f8f5f1;
	background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2V0h2v20h2v2H20v-1.5zM0 20h2v20H0V20zm4 0h2v20H4V20zm4 0h2v20H8V20zm4 0h2v20h-2V20zm4 0h2v20h-2V20zm4 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2z' fill='%23050209' fill-opacity='0.01' fill-rule='evenodd'/%3E%3C/svg%3E");
}
.nav {
	width: 100%;
	height: $navH;
	background: #141e30; // for backend
	background: $navBgColor;
	box-shadow: 0 3px 40px 10px rgba($navColor, 0.08);
	color: $navColor;
	position: fixed;
	z-index: 100;
	display: flex;
	.logo {
		width: $navH * 3;
		height: $navH;
		background-image: url("../../assets/img/logo.png");
		background-position: center;
		background-size: cover;
	}
	.nav-bar {
		width: calc(100% - #{$navH * 3});
	}
}
.content {
	width: 100%;
	height: 100%;
	overflow: hidden;
	position: relative;
	left: 50%;
	padding-top: $navH;
	transform: translateX(-50%);
}
@media screen and (min-width: 1200px) {
	.content {
		max-width: 66%;
	}
}
@media screen and (min-width: 960px) and (max-width: 1200px) {
	.content {
		max-width: 76%;
	}
}
@media screen and (max-width: 960px) {
	.content {
		max-width: 100%;
	}
}
</style>

