import React, { useState } from 'react';
import { TextField, Button, Typography, makeStyles, Select, MenuItem, FormControl, InputLabel, Link } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  registrationContainer: {
    maxWidth: '500px',
    margin: '50px auto',
    padding: theme.spacing(4),
    backgroundColor: '#ffffff',
    borderRadius: theme.spacing(2),
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e0e0e0',
  },
  header: {
    textAlign: 'center',
    fontSize: '2rem',
    color: '#2c3e50',
    marginBottom: theme.spacing(3),
    fontWeight: 'bold',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
  input: {
    padding: '12px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    '&:focus': {
      borderColor: '#2c3e50',
    },
  },
  select: {
    padding: '12px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    '&:focus': {
      borderColor: '#2c3e50',
    },
  },
  button: {
    backgroundColor: '#2c3e50',
    color: '#fff',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '8px',
    padding: '14px',
    fontSize: '18px',
    '&:hover': {
      backgroundColor: '#0056b3',
    },
  },
  error: {
    color: 'red',
    fontSize: '14px',
    textAlign: 'center',
    marginTop: '10px',
  },
  link: {
    textAlign: 'center',
    marginTop: '15px',
    fontSize: '14px',
  },
}));

function Registration() {
  const classes = useStyles();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [repassword, setRepassword] = useState('');
  const [usertype, setUsertype] = useState('student');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password validation
    if (password !== repassword) {
      setError('Passwords do not match!');
      return;
    }

    try {
      // Make API call to register user
      const response = await fetch('http://localhost:8000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, repassword, usertype }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      // Registration successful, redirect to the login page
      window.location.href = '/login';
    } catch (error) {
      console.error('Error registering user:', error.message);
      setError('Error registering user. Please try again.');
    }
  };

  return (
    <div className={classes.registrationContainer}>
      <Typography className={classes.header}>Create Account</Typography>
      {error && <Typography className={classes.error}>{error}</Typography>}

      <form onSubmit={handleSubmit} className={classes.form}>
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className={classes.input}
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={classes.input}
        />
        <TextField
          label="Re-Password"
          type="password"
          value={repassword}
          onChange={(e) => setRepassword(e.target.value)}
          required
          className={classes.input}
        />
        <FormControl className={classes.select}>
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

        <Button type="submit" className={classes.button}>Create User</Button>
        <Typography className={classes.link}>
          Already have an account? <Link component={RouterLink} to="/login">Login here</Link>.
        </Typography>
      </form>
    </div>
  );
}

export default Registration;

