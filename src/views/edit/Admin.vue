<template>
	<div class="admin">
		<div class="nav">
			<div class="logo"></div>
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
export default class Admin extends Vue {
	public navList: NavBarItem[] = [];

	private beforeCreate() {
	}

}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/theme.scss";
.admin {
	display: flex;
	flex-direction: center;
	width: 100%;
	height: 100%;
	background: $Color-3-hex;
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
	height: calc(100% - #{$navH});
	overflow: hidden;
	position: relative;
	left: 50%;
	padding-top: $navH;
	transform: translateX(-50%);
}
</style>

