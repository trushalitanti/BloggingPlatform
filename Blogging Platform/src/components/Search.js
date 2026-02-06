import React, { useState, useEffect } from 'react';
import { Typography, Button, makeStyles, TextField, Divider } from '@material-ui/core';
import human from './human.jpeg'; 

const useStyles = makeStyles((theme) => ({
  postListContainer: {
    maxWidth: '800px',
    margin: 'auto',
    padding: theme.spacing(3),
    backgroundColor: '#f0f0f0',
    borderRadius: theme.spacing(1),
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  },
  postCard: {
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    backgroundColor: '#ffffff',
    borderRadius: theme.spacing(1),
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  },
  postHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  creatorImage: {
    marginRight: theme.spacing(2),
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    objectFit: 'cover',
  },
  postTitle: {
    marginBottom: theme.spacing(1),
  },
  postInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(1),
    color: '#666666',
  },
  repliesSection: {
    marginBottom: theme.spacing(2),
  },
  replyInput: {
    width: 'calc(100% - 85px)',
    marginRight: theme.spacing(1),
  },
}));

function Search() {
  const classes = useStyles();
  const [topic, setTopic] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [un, setUn] = useState("");

  const fetchSearchResults = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/posts/search?topic=${topic}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const handleSearch = () => {
    fetchSearchResults();
  };

  return (
    <div className={classes.postListContainer}>
      <Typography variant="h4" align="center" gutterBottom>Feed</Typography>
      <div>
        <TextField
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter topic to search"
          fullWidth
        />
        
        <Button variant="contained" color="primary" onClick={handleSearch} style={{ marginTop:'5px'}}>Search</Button>
      </div>
      <ul>
        {searchResults.map(post => (
          <li key={post.id} className={classes.postCard}>
            <div className={classes.postHeader}>
              <img src={post.creatorImage || human} alt={post.creator} className={classes.creatorImage} />
              <div>
                <Typography variant="h6" className={classes.postTitle}>{post.title}</Typography>
                <div className={classes.postInfo}>
                  <Typography variant="body2" className="post-creator">Creator: {post.creator}</Typography> &nbsp;
                  <Typography variant="body2" className="post-date">Date: {new Date(post.date).toLocaleString()}</Typography>
                </div>
              </div>
            </div>
            <Typography variant="body1" className="post-content">{post.content}</Typography>
            <div className={classes.repliesSection}>
              {post.replies.map(reply => (
                <div key={reply.id} className="reply">
                  <p className="reply-creator">{reply.creator}</p> 
                  <p className="reply-content">{reply.content}</p>
                  <p className="reply-date">{new Date(reply.date).toLocaleString()}</p>
                </div>
              ))}
            </div>
            <Divider />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Search;
