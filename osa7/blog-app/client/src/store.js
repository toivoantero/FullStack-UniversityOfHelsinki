import { create } from 'zustand'
import blogService from './services/blogs'
import loginService from './services/login'
import persistentUserService from './services/persistentUser'
import userService from './services/users'

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
    users: [],
    actions: {
        keepUser: () => {
            const oldUser = persistentUserService.getUser()
            if (oldUser) {
                blogService.setToken(oldUser.token);
                set((state) => ({ ...state, user: oldUser }))
            }
        },
        login: async ({ username, password }) => {
            const newUser = await loginService.login({ username, password });
            set((state) => ({ ...state, user: newUser }))
            persistentUserService.saveUser(newUser)
            blogService.setToken(newUser.token);
        },
        logout: () => {
            set(() => ({ user: null }))
            persistentUserService.removeUser()
        },
        initializeUsers: async () => {
            const users = await userService.getAll()
            set(() => ({ users }))
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
export const useUsers = () => useUserStore((state) => state.users)
export const useUserActions = () => useUserStore((state) => state.actions)

