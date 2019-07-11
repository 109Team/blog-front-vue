import HTTP from './http';

const API = {
    getAllPosts(params?: object): Promise<any>{
        return HTTP.get('/posts', params);
    },

    createAPost(post: object): Promise<any>{
        return HTTP.post('/posts', post);
    },

    getPost(id: string): Promise<any>{
        return HTTP.get(`/posts/${id}`);
    },

    updatePost(id: string, post: object): Promise<any>{
        return HTTP.put(`/posts/${id}`, post);
    },
    
    deletePost(id: string): Promise<any>{
        return HTTP.delete(`/posts/${id}`);
    }
}

export default {
    ...API
}