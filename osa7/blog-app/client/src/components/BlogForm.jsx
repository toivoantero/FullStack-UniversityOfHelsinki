import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Stack } from "@mui/material";
import { useNotificationActions, useBlogActions } from "../store";
import { useField } from "../hooks";

const BlogForm = () => {
  const navigation = useNavigate();
  const { add } = useBlogActions();
  const { setNotification } = useNotificationActions();
  const title = useField({ label: "title", size: "small" });
  const author = useField({ label: "author", size: "small" });
  const url = useField({ label: "url", size: "small" });

  const addBlog = async (e) => {
    e.preventDefault();
    add({ title: title.value, author: author.value, url: url.value });
    setNotification({
      message: `a new blog ${title.value} by ${author.value} added`,
    });
    setTimeout(() => {
      setNotification({ message: null });
    }, 25000);
    navigation("/");
    e.target.reset();
  };

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <Stack spacing={2} sx={{ maxWidth: 400 }}>
          <TextField {...title} />
          <TextField {...author} />
          <TextField {...url} />
          <Button
            type="submit"
            variant="contained"
            sx={{ alignSelf: "flex-start" }}
          >
            create
          </Button>
        </Stack>
      </form>
    </div>
  );
};

export default BlogForm;
