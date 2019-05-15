interface API{
    getAllPosts: () => Promise<object>;
    createAPost: (post: object) => Promise<object>;
    getPost: (id: string) => Promise<object>;
}

export default
    API
