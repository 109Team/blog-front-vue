<template>
	<section class="post-list-wapper">
		<div class="list-header">
			<a-button class="editable-add-btn" @click="onCreate">新建</a-button>
		</div>
		<div class="list-content">
			<a-table
				:dataSource="postList"
				:columns="columns"
				:rowKey="'_id'"
				:pagination="{ 'pageSize': 7}"
			>
				<template slot="__id" slot-scope="text, record">
					<p>{{record.index + 1}}</p>
				</template>
				<template slot="status" slot-scope="text">
					<p :style="{'color': statusArray[text]['color']}">{{statusArray[text]['label']}}</p>
				</template>
				<template slot="update_time" slot-scope="text">
					<p>{{text | dateString}}</p>
				</template>
				<template slot="operation" slot-scope="text, record">
					<a href="javascript:;" class="edit-btn" @click="onEdit(record._id)">编辑</a>
					<a-popconfirm
						v-if="postList.length && ~[1,2].indexOf(record.status)"
						cancelText="取消"
						okText="确认"
						:title="`确认${record.status === 2 ? '永久': ''}删除?`"
						@confirm="() => onDelete(record, record.index)"
					>
						<a v-if="record.status === 1" style="color: #ceb4be;" href="javascript:;">删除</a>
						<a v-else style="color: #ff0000;" href="javascript:;">永久删除</a>
					</a-popconfirm>
					<a-popconfirm
						v-if="postList.length && record.status === 0"
						cancelText="取消"
						okText="确认"
						title="确认发布?"
						@confirm="() => onPublish(record, record.index)"
					>
						<a style="color:#2bc39d;" href="javascript:;">发布</a>
					</a-popconfirm>
				</template>
			</a-table>
		</div>
	</section>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Table, Button, Popconfirm, message } from "ant-design-vue";
import "ant-design-vue/dist/antd.css";

import { Post } from "@/model/post";

// 注册三方组件
function registerComponent(components: Array<any>): void {
	components.forEach(item => Vue.use(item));
}
registerComponent([Table, Button, Popconfirm]);

@Component({
	filters: {
		dateString(value: Date): string {
			return new Date(value).toLocaleString();
		}
	}
})
export default class Posts extends Vue {
	public postList: Post[] = [];
	public statusArray: Array<object> = [
		{ color: "#0000ff", label: "草稿中" },
		{ color: "#28cebb", label: "已发布" },
		{ color: "#9e3d3d", label: "已删除" }
	];
	public columns: any[] = [
		{
			title: "编号",
			dataIndex: "__id",
			scopedSlots: { customRender: "__id" }
		},
		{
			title: "标题",
			dataIndex: "title",
			width: "20%"
		},
		{
			title: "状态",
			dataIndex: "status",
			scopedSlots: { customRender: "status" }
		},
		{
			title: "更新时间",
			dataIndex: "update_time",
			scopedSlots: { customRender: "update_time" }
		},
		{
			title: "操作",
			dataIndex: "operation",
			width: "30%",
			scopedSlots: { customRender: "operation" }
		}
	];
    public currentPage: number = 1;
    public total: number = 0;
	private created() {
		let _params = { pageNum: this.currentPage };
		this.getData(_params);
    }
    
    private getData(params: object){
        this.$API.getAllPosts(params).then((res: any) => {
			if (res.code == 200) {
                let _data = res.data.data || [];
                this.total = res.data.allCount;
                this.dealData(_data);
			} else {
				this.catchHttpError(res);
			}
		});
    }

	private dealData(data: Post[]) {
        this.postList = [...this.postList,...data];
        console.log(this.postList, data);
        
		this.postList = this.postList.map((item: any, index: any) => {
			item.index = index;
			return item;
		});
	}

	private catchHttpError(res: any): void {
		message.error(res.msg);
	}

	public onDelete(record: Post, index: number): void {
		if (record.status === 1) {
			this.$API.updatePost(record._id, { status: 2 }).then(res => {
				if (res.code == 200) {
					Vue.set(
						this.postList,
						index,
						Object.assign({}, record, { status: 2 })
					);
				}
			});
		} else {
			this.$API.deletePost(record._id).then(res => {
				if (res.code == 200) {
					this.postList = this.postList
						.filter(item => item._id !== record._id)
						.map((item: any, index: any) => {
							item.index = index;
							return item;
						});
				}
			});
		}
	}

	public onPublish(record: Post, index: number): void {
		this.$API.updatePost(record._id, { status: 1 }).then(res => {
			if (res.code == 200) {
				Vue.set(
					this.postList,
					index,
					Object.assign({}, record, { status: 1 })
				);
			}
		});
	}

	public onEdit(id: string): void {
		this.$router.push({ name: "edit", params: { postId: id } });
	}

	public onCreate(): void {
		this.$router.push({ name: "edit" });
	}

	public onPageChange(e: number): void {
        this.currentPage = e;
        console.log(e);
        
        let _params = { pageNum: this.currentPage };
		this.getData(_params);
	}
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/theme.scss";
.post-list-wapper {
	width: 100%;
	height: 100%;
	position: relative;
	.list-header {
		height: 70px;
		width: 100%;
		padding: 18px;
		text-align: left;
	}
	.list-content {
		width: calc(100% - 32px);
		height: calc(100% - 86px);
		margin: 0 16px 16px;
		.edit-btn {
			margin-right: 30px;
		}
	}
}
</style>