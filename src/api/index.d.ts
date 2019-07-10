interface API{
    getAllPosts: () => Promise<any>;
    createAPost: (post: object) => Promise<any>;
    getPost: (id: string) => Promise<any>;
    updatePost: (id: string, post: object) => Promise<any>;
    deletePost: (id: string) => Promise<any>;
}

export default API
