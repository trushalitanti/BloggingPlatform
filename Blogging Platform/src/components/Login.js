import React, { useState } from 'react';
import { TextField, Button, Typography, makeStyles, Select, MenuItem, FormControl, InputLabel } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  loginContainer: {
    maxWidth: '400px',
    margin: 'auto',
    padding: theme.spacing(3),
    backgroundColor: '#f0f0f0',
    borderRadius: theme.spacing(1),
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    marginTop: '50px',
  },
  header: {
    marginBottom: '16px',
    color: '#2c3e50',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  textField: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  formControl: {
    width: '100%',
  },
  button: {
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '12px',
    fontSize: '16px',
    borderRadius: '4px',
    '&:hover': {
      backgroundColor: '#34495e',
    },
  },
  error: {
    color: 'red',
    marginTop: '8px',
  },
  link: {
    color: '#2c3e50',
    textDecoration: 'none',
    marginTop: '16px',
  },
  linkHover: {
    textDecoration: 'underline',
  },
}));

function Login() {
  const classes = useStyles();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usertype, setUsertype] = useState('student');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, usertype }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      const responseData = await response.json();
      sessionStorage.setItem('usertype', responseData.data.user.usertype);
      sessionStorage.setItem('username', responseData.data.user.username);
      window.location.href = '/';
    } catch (error) {
      console.error('Error logging user:', error.message);
      setError(error.message);
    }
  };

  return (
    <div className={classes.loginContainer}>
      <Typography variant="h5" className={classes.header}>Login</Typography>
      <form onSubmit={handleSubmit} className={classes.form}>
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className={classes.textField}
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={classes.textField}
        />
        <FormControl className={classes.formControl}>
          <InputLabel>User Type</InputLabel>
          <Select
            value={usertype}
            onChange={(e) => setUsertype(e.target.value)}
            required
          >
            <MenuItem value="student">Student</MenuItem>
            <MenuItem value="faculty">Faculty</MenuItem>
            <MenuItem value="staff">Staff</MenuItem>
            <MenuItem value="moderator">Moderator</MenuItem>
            <MenuItem value="administrator">Administrator</MenuItem>
          </Select>
        </FormControl>
        <Button type="submit" className={classes.button}>Login</Button>
        {error && <Typography variant="body2" className={classes.error}>{error}</Typography>}
        <Typography variant="body2">
          <strong>New User? <a href="/register" className={classes.link}>Register here!</a></strong>
        </Typography>
      </form>
    </div>
  );
}

export default Login;

