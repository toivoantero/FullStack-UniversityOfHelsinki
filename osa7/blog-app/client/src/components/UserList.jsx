import Blog from "./Blog";
import { Link } from "react-router-dom";
import { useUsers } from '../store'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const UserList = () => {
    const users = useUsers()

    return (
        <div>
            <h2>Users</h2>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 900 }}>Name</TableCell>
                            <TableCell sx={{ fontWeight: 900 }} align="right">Username</TableCell>
                            <TableCell sx={{ fontWeight: 900 }} align="right">Blogs&nbsp;created</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow
                                key={user.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    <Link to={`/users/${user.id}`}>
                                        {user.name}
                                    </Link>

                                </TableCell>
                                <TableCell align="right">{user.username}</TableCell>
                                <TableCell align="right">{user.blogs.length}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default UserList;
