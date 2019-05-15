export interface Post{
    _id: string;
    author: string;
    categrey: any[];
    comments: any[];
    content: string;
    create_time: Date;
    desc: string;
    img_url: string;
    keywards: string[];
    meta_data: {views: number; likes: number; unlikes: number; comments: number;};
    origin: number;
    status: number;
    tags: string[];
    title: string;
    type: number;
    update_time: Date;
    words_count: number;
}