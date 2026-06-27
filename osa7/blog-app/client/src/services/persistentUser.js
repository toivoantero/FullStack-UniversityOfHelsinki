const getUser = () => {
  const userJSON = window.localStorage.getItem("loggedBlogappUser");
  return JSON.parse(userJSON);
};

const saveUser = (user) => {
  return window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
};

const removeUser = () => {
  return window.localStorage.removeItem("loggedBlogappUser");
};

export default { getUser, saveUser, removeUser };
