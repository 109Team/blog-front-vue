import HTTP from './http';

const API = {
    getAllPosts(): Promise<any>{
        return HTTP.get('/posts');
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