<template>
    <ul>
        <li v-for="item in initedNavList" 
            v-bind:key="item.id"
            
            @click="itemClick(item)">{{item.label}}
        </li>
        <li ref="activedEle" class="active-item" :style="activedStyle"></li>
    </ul>
</template>


<script lang="ts">
import { Component, Vue, Prop} from 'vue-property-decorator';

import { NavBarItem } from '@/model/navbarItem';

@Component
export default class NavBar extends Vue {
    @Prop(Array) public navList!: NavBarItem[];

    public initedNavList: NavBarItem[] = [];
    public activedStyle: object|null = null;

    constructor() {
        super();
    }

    private created() {
        this.initedNavList = this.initNavList(this.navList);
        this.activedStyle = this.getActivedEleLeftStyle();
    }

    private initNavList(list: NavBarItem[] = []) :NavBarItem[]{
        if(!list.length) return [];
        let _tag = false, i;
        for(i=0; i<list.length; i++){
            if(list[i].actived){
                _tag = true;
                continue;
            }
            if(_tag){
                list[i].actived = false;
            }
        }
        if(!_tag){
            list[0].actived = true;
        }
        return [...list];
    }

    public itemClick(item: NavBarItem) :void{
        if(item.href){
            location.href = item.href;
        }else if(item.route){
            this.$router.push(item.route);
        }else if(item.fn){
            item.fn(item);
        }
        this.initedNavList.map(_item => _item.id === item.id ? _item.actived = true : _item.actived = false);
        this.initedNavList = [...this.initedNavList];
        this.activedStyle = this.getActivedEleLeftStyle();
    }

    public getActivedEleLeftStyle() :object{
        let _el: any = this.$refs.activedEle;
        if(!_el || !_el.offsetWidth) {
            return {
                "transform": "translateX(0)"
            };
        };
        let _index: number = this.initedNavList.findIndex(item => item.actived === true);
        return {
            "transform": "translateX(" + (_el.offsetWidth || 0) * _index + "px)"
        };
    }
}
</script>

<style lang="scss" scoped>
@import "../assets/theme.scss";
ul{
    display: flex;
    width: 100%;
    margin: 0;
    padding: 0;
    height: $navH;
    position: relative;
}
ul li{
    list-style: none;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100px;
    cursor: pointer;
}
li.active-item{
    position: absolute;
    bottom: 0;
    transform: translateX(0);
    height: 3px;
    background: #6fbf1f;
    transition: all .3s ease-in-out;
}
</style>

