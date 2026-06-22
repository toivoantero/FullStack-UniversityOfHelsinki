import { create } from 'zustand'
import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/persistentUser'

const useBlogStore = create((set, get) => ({
    blogs: [],
    actions: {
        initialize: async () => {
            const blogs = await blogService.getAll()
            set(() => ({ blogs }))
        },
        add: async (blog) => {
            const newBlog = await blogService.create(blog)
            set(state => ({ blogs: state.blogs.concat(newBlog) }))
        },
        like: async (blog) => {
            const likedBlog = { ...blog, likes: blog.likes + 1, user: blog.user.id }
            const updated = await blogService.update(likedBlog)
            set(
                state => ({
                    blogs: state.blogs.map(b =>
                        b.id === likedBlog.id ? updated : b
                    )
                }))
        },
        deleteBlog: async (id) => {
            await blogService.remove(id)
            set(
                state => ({
                    blogs: state.blogs.filter(b => b.id !== id)
                }))
        },
    }
}))

const useUserStore = create((set) => ({
    user: null,
    actions: {
        keepUser: () => {
            const oldUser = userService.getUser()
            if (oldUser) {
                blogService.setToken(oldUser.token);
                set((state) => ({ ...state, user: oldUser }))
            }
        },
        login: async ({ username, password }) => {
            const newUser = await loginService.login({ username, password });
            set((state) => ({ ...state, user: newUser }))
            userService.saveUser(newUser)
            blogService.setToken(newUser.token);
        },
        logout: async () => {
            set(() => ({ user: null }))
            userService.removeUser()
        },
    }
}))

const useNotificationStore = create((set) => ({
    notification: { message: null },
    actions: {
        setNotification: notificationContent => set(() => ({ notification: notificationContent }))
    },
}))

export const useNotifications = () => useNotificationStore()
export const useNotificationActions = () => useNotificationStore((state) => state.actions)
export const useBlogs = () => useBlogStore((state) => state.blogs)
export const useBlogActions = () => useBlogStore((state) => state.actions)
export const useUser = () => useUserStore((state) => state.user)
export const useUserActions = () => useUserStore((state) => state.actions)

