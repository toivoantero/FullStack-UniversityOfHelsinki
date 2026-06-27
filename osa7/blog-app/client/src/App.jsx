import { useState, useEffect } from "react";
import { Routes, Route, Link, useMatch, useNavigate } from "react-router-dom";
import { Container, AppBar, Toolbar, Button, Typography } from "@mui/material";
import BlogList from "./components/BlogList";
import UserList from "./components/UserList";
import Login from "./components/Login";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import User from "./components/User";
import Notification from "./components/Notification";
import ErrorBoundary from "./components/ErrorBoundary";
import {
  useNotificationActions,
  useBlogActions,
  useBlogs,
  useUser,
  useUserActions,
  useUsers,
} from "./store";

const App = () => {
  const navigation = useNavigate();
  const blogs = useBlogs();
  const users = useUsers();
  const currentUser = useUser();
  const { setNotification } = useNotificationActions();
  const { initialize } = useBlogActions();
  const { logout, keepUser, initializeUsers } = useUserActions();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    initializeUsers();
  }, [initializeUsers]);

  useEffect(() => {
    keepUser();
  }, [keepUser]);

  const getOne = (object) => {
    const match = useMatch(`/${Object.keys(object)[0]}/:id`);
    return match
      ? Object.values(object)[0].find((thing) => thing.id === match.params.id)
      : null;
  };

  const blog = getOne({ blogs });
  const user = getOne({ users });

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
          <Button
            color="inherit"
            component={Link}
            to="/users"
            sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.2)" } }}
          >
            users
          </Button>
          {!currentUser ? (
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
                  logout();
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
              <Blog blog={blog} />
            </ErrorBoundary>
          }
        />
        <Route
          path="/users"
          element={
            <ErrorBoundary key="userlist">
              <UserList />
            </ErrorBoundary>
          }
        />
        <Route
          path="/users/:id"
          element={
            <ErrorBoundary key="userview">
              <User user={user} />
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
