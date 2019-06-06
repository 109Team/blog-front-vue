<template>
    <ul>
        <li>分类1</li>
        <li>分类2</li>
        <li>分类3</li>
        <li>分类4</li>
        <li>分类5</li>
    </ul>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Categrey extends Vue{
    
}
</script>

<style lang="scss" scoped>
ul{
    width: 100%;
	height: 100%;
    position: relative;
    overflow: hidden;
}
</style>

