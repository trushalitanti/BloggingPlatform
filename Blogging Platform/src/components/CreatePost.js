import { Button, Card, CardContent, MenuItem, Select, TextField, Typography, makeStyles } from '@material-ui/core';
import React, { useEffect, useState } from 'react';

const useStyles = makeStyles((theme) => ({
  formContainer: {
    width: '50%',
    margin: 'auto',
    marginTop: theme.spacing(5),
  },
  card: {
    padding: theme.spacing(3),
    boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.15)',
    borderRadius: theme.spacing(2),
    backgroundColor: '#f5f7fa',
  },
  inputField: {
    marginBottom: theme.spacing(3),
  },
  submitButton: {
    marginTop: theme.spacing(2),
    backgroundColor: '#0073e6',
    color: 'white',
    '&:hover': {
      backgroundColor: '#005bb5',
    },
  },
  successMessage: {
    marginTop: theme.spacing(2),
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    textAlign: 'center',
    fontWeight: 'bold',
  },
}));

function CreatePost() {
  const classes = useStyles();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [topic, setTopic] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [un, setUn] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    setUn(sessionStorage.getItem('username'));
  }, []);

  const createAlert = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/alerts/new-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ topic, title, un })
      });

      const data = await response.json();
      setMessage(response.ok ? data.message : `Error: ${data.message}`);
    } catch (error) {
      console.error('Error creating alert:', error);
      setMessage('Error creating alert. Please try again later.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const creator = sessionStorage.getItem('username');
    const date = new Date().toISOString();

    const postData = { title, content, creator, date, topic };

    try {
      const response = await fetch('http://localhost:8000/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
      });

      if (!response.ok) throw new Error('Failed to create post');

      setSuccessMessage('Post created successfully');
      createAlert();
      setTitle('');
      setContent('');
      setTopic('');
    } catch (error) {
      console.error('Error creating post:', error.message);
      setMessage('Error creating post. Please try again later.');
    }
  };

  return (
    <div className={classes.formContainer}>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>Create a New Post</Typography>
          {successMessage && <Typography className={classes.successMessage}>{successMessage}</Typography>}
          <form onSubmit={handleSubmit}>
            <TextField
              className={classes.inputField}
              label="Title"
              variant="outlined"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <TextField
              className={classes.inputField}
              label="Content"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
            <Select
              className={classes.inputField}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              displayEmpty
              fullWidth
              variant="outlined"
              required
            >
              <MenuItem value="" disabled>Select Topic</MenuItem>
              {['Academic Resources', 'Career Services', 'Campus', 'Culture', 'Local Community Resources', 'Social', 'Sports', 'Health and Wellness', 'Technology', 'Travel', 'Alumni'].map((t) => (
                <MenuItem key={t} value={t}>{t}</MenuItem>
              ))}
            </Select>
            <Button
              variant="contained"
              fullWidth
              className={classes.submitButton}
              type="submit"
            >
              Create Post
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default CreatePost;
