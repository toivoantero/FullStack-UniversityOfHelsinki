import { useState, useEffect } from "react";
import { Routes, Route, Link, useMatch, useNavigate } from "react-router-dom";
import { Container, AppBar, Toolbar, Button, Typography } from "@mui/material";
import BlogList from "./components/BlogList";
import Login from "./components/Login";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import Notification from "./components/Notification";
import ErrorBoundary from "./components/ErrorBoundary";
import { useNotificationActions } from "./store";
import { useBlogActions } from "./store";
import { useBlogs } from './store'
import { useUser } from './store'
import { useUserActions } from "./store";

const App = () => {
  const navigation = useNavigate();
  const blogs = useBlogs()
  const user = useUser()
  const { setNotification } = useNotificationActions()
  const { initialize } = useBlogActions()
  const { logout, keepUser } = useUserActions()

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    keepUser()
  }, [keepUser])
  /*
    useEffect(() => {
      const userJSON = window.localStorage.getItem("loggedBlogappUser");
      const user = JSON.parse(userJSON);
      console.log("USER: ", user)
      console.log("P USER: ", persistentUser)
  
      if (user) {
        console.log("ONNII", user)
        blogService.setToken(user.token);
      }
    }, []);
  */

  const match = useMatch("/blogs/:id");
  const blog = match ? blogs.find((b) => b.id === match.params.id) : null;

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Blog App
          </Typography>
          <Button
            color="inherit"
            component={Link}
            to="/"
            sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.2)" } }}
          >
            blogs
          </Button>
          {!user ? (
            <Button
              color="inherit"
              component={Link}
              to="/login"
              sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.2)" } }}
            >
              login
            </Button>
          ) : (
            <>
              <Button
                color="inherit"
                component={Link}
                to="/create"
                sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.2)" } }}
              >
                new blog
              </Button>
              <Button
                color="inherit"
                onClick={() => {
                  logout()
                  navigation("/");
                }}
                sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.2)" } }}
              >
                logout
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Notification />

      <Routes>
        <Route
          path="/*"
          element={
            <ErrorBoundary key="nonexistingroute">
              <h1>404 - Page not found</h1>
            </ErrorBoundary>
          }
        />
        <Route
          path="/"
          element={
            <ErrorBoundary key="bloglist">
              <BlogList />
            </ErrorBoundary>
          }
        />
        <Route
          path="/blogs"
          element={
            <ErrorBoundary key="bloglist">
              <BlogList />
            </ErrorBoundary>
          }
        />
        <Route
          path="/blogs/:id"
          element={
            <ErrorBoundary key="blogview">
              <Blog
                blog={blog}
              />
            </ErrorBoundary>
          }
        />
        <Route
          path="/login"
          element={
            <ErrorBoundary key="login">
              <Login />
            </ErrorBoundary>
          }
        />
        <Route
          path="/create"
          element={
            <ErrorBoundary key="create">
              <BlogForm />
            </ErrorBoundary>
          }
        />
      </Routes>
    </Container>
  );
};

export default App;
