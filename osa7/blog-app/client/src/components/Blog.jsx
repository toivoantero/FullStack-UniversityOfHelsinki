import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrorBoundary from "./ErrorBoundary";
import { useBlogActions, useNotificationActions, useUser } from "../store";
import { useField } from "../hooks";
import CommentIcon from "@mui/icons-material/Comment";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Link,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

const Blog = ({ blog }) => {
  const navigation = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { deleteBlog, like, comment } = useBlogActions();
  const { setNotification } = useNotificationActions();
  const user = useUser();
  const content = useField({ label: "comment", size: "small" });

  if (!blog) {
    return (
      <ErrorBoundary key="nonexistingblog">
        <h1>404 - Page not found</h1>
      </ErrorBoundary>
    );
  }

  const canBeRemoved = () => user && user.username === blog.user.username;

  const handleDelete = () => {
    try {
      deleteBlog(blog.id);
      setNotification({
        message: `Blog ${blog.title} by ${blog.author} removed`,
      });
      setTimeout(() => {
        setNotification({ message: null });
      }, 25000);
      setConfirmOpen(false);
      navigation("/");
    } catch (error) {
      console.log("Error while trying to delete a blog", error);
    }
  };

  const addLike = () => {
    try {
      like(blog);
    } catch (error) {
      console.log("Error while trying to like a blog:", error);
    }
  };

  const addComments = (e) => {
    e.preventDefault();
    comment({ content: content.value, blog: blog });
    setNotification({ message: `a new comment added` });
    setTimeout(() => {
      setNotification({ message: null });
    }, 25000);
    e.target.reset();
  };

  return (
    <Card sx={{ mt: 2, maxWidth: 600 }} className="blog">
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {blog.title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          by {blog.author}
        </Typography>

        <Link
          href={blog.url}
          target="_blank"
          rel="noopener"
          display="block"
          sx={{ mb: 1 }}
        >
          {blog.url}
        </Link>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          Added by {blog.user.name}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
          <Typography variant="body1">{blog.likes} likes</Typography>
          {user && (
            <Button
              size="small"
              variant="outlined"
              onClick={() => addLike(blog)}
            >
              like
            </Button>
          )}
          {canBeRemoved() && (
            <Button
              size="small"
              variant="outlined"
              color="error"
              onClick={() => setConfirmOpen(true)}
            >
              remove
            </Button>
          )}
        </Box>

        <Typography style={{ marginTop: "40px" }} variant="h6">
          comments
        </Typography>

        <form onSubmit={addComments}>
          <TextField {...content} />
          <Button
            type="submit"
            variant="contained"
            sx={{ alignSelf: "flex-start", marginLeft: 2 }}
          >
            add comment
          </Button>
        </form>

        <List>
          {blog.comments.map((comment) => (
            <ListItem key={comment.id}>
              <ListItemIcon>
                <CommentIcon />
              </ListItemIcon>
              <ListItemText primary={comment.content} />
            </ListItem>
          ))}
        </List>
      </CardContent>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Remove blog</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Remove blog <strong>{blog.title}</strong> by {blog.author}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            remove
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default Blog;
