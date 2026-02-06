import React, { useState, useEffect } from 'react';
import { Typography, Table, TableHead, TableBody, TableRow, TableCell, Button, CircularProgress, makeStyles } from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';

const useStyles = makeStyles((theme) => ({
  userListContainer: {
    maxWidth: 800,
    margin: 'auto',
    padding: theme.spacing(3),
    textAlign: 'center', // Center alignment
  },
  table: {
    marginTop: theme.spacing(2),
  },
  tableHeader: {
    fontWeight: 'bold',
    textAlign: 'center', // Center alignment for table header
  },
  tableCell: {
    textAlign: 'center', // Center alignment for table cells
  },
  pagination: {
    marginTop: theme.spacing(3),
    display: 'flex',
    justifyContent: 'center',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(4),
  },
  button: {
    textTransform: 'none', // Prevents button text from being capitalized
    borderRadius: 20, // Rounded button edges
    padding: theme.spacing(1.5, 4), // Adjust padding for button size
    boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)', // Add shadow effect
    backgroundColor: theme.palette.primary.main, // Use primary color for button background
    color: theme.palette.common.white, // Use white color for button text
    '&:hover': {
      backgroundColor: theme.palette.primary.dark, // Darker color on hover
    },
  },
}));

const UserList = () => {
  const classes = useStyles();
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5); // Number of users per page
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setIsLoading(false);
      if (Array.isArray(data)) {
        setUsers(data); // If data is an array, set it as users
      } else if (data && data.data && Array.isArray(data.data)) {
        setUsers(data.data); // If data is nested inside a "data" property, set that as users
      } else {
        throw new Error('Invalid data format received from API');
      }
    } catch (error) {
      console.error('Error fetching users:', error.message);
      setIsLoading(false);
    }
  };

  const disableUser = async (username) => {
    try {
      const response = await fetch('http://localhost:8000/api/disable-login', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to disable user login');
      }

      fetchUsers();
  
      return true;
    } catch (error) {
      console.error('Error disabling user login:', error.message);
      return false;
    }
  };

  // Get current users
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // Change page
  const handlePageChange = (event, pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className={classes.userListContainer}>
      <Typography variant="h4">Users List</Typography>
      {isLoading ? (
        <div className={classes.loading}>
          <CircularProgress />
        </div>
      ) : (
        <>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableHeader}>Name</TableCell>
                <TableCell className={classes.tableHeader}>Usertype</TableCell>
                <TableCell className={classes.tableHeader}>Disabled</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentUsers.map(user => (
                <TableRow key={user.username}>
                  <TableCell className={classes.tableCell}>{user.username}</TableCell>
                  <TableCell className={classes.tableCell}>{user.usertype}</TableCell>
                  <TableCell className={classes.tableCell}>
                    <Button className={classes.button} onClick={() => disableUser(user.username)}>
                      {user.isLogin && user.isLogin === true ? 'Disable' : 'Enable'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className={classes.pagination}>
            <Pagination
              count={Math.ceil(users.length / usersPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              variant="outlined"
              shape="rounded"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default UserList;
