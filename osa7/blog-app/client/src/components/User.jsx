import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Card,
    CardContent,
    Typography,
    Button,
    Box,
    Link,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from "@mui/material";
import ErrorBoundary from "./ErrorBoundary";
import { useBlogActions } from "../store";
import { useNotificationActions } from "../store";

const User = ({ user }) => {

    if (!user) {
        return (
            <ErrorBoundary key="nonexistinguser">
                <h1>404 - Page not found</h1>
            </ErrorBoundary>
        );
    }

    return (
        <Card sx={{ mt: 2, maxWidth: 600 }} className="user">
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    {user.name}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    added blogs
                </Typography>
                <ul>
                    {user.blogs.map((b) => (
                        <li key={b.id}>{b.title}</li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
};

export default User;
