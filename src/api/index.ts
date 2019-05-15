import HTTP from './http';

const API = {
    getAllPosts(): Promise<object>{
        return HTTP.get('/posts');
    },

    createAPost(post: object): Promise<object>{
        return HTTP.post('/posts', post);
    },

    getPost(id: string): Promise<object>{
        return HTTP.get(`/post/${id}`);
    }
}

export default {
    ...API
}