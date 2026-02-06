import React, { useState, useEffect } from 'react';
import { Typography, Button, TextField, Divider, FormControlLabel, Switch, InputAdornment } from '@material-ui/core';
import { useParams } from 'react-router-dom';

const TopicPage = () => {
  const { topic } = useParams();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [un, setUn] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [generatedReplies, setGeneratedReplies] = useState({});
  const [autoReplyState, setAutoReplyState] = useState({});
  const [searchTopicInput, setSearchTopicInput] = useState(''); // State to hold the search topic input value
  


  useEffect(() => {
    let u = sessionStorage.getItem('username');
    setUn(u);
    fetchPosts();
    fetchUserSubscriptions();
  }, [topic]);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/topicposts?topic=${encodeURIComponent(topic)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data = await response.json();
      setPosts(data.data);
    } catch (error) {
      console.error('Error fetching posts:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // const fetchUserSubscriptions = async () => {
  //   try {
  //     const response = await fetch('http://localhost:8000/api/users/subscriptions', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ username: sessionStorage.getItem('username') }),
  //     });
  //     if (!response.ok) {
  //       throw new Error('Failed to fetch user subscriptions');
  //     }
  //     const userData = await response.json();
  //     const userSubscriptions = userData.data || [];
  //     setIsSubscribed(userSubscriptions.includes(topic));
  //   } catch (error) {
  //     console.error('Error fetching user subscriptions:', error.message);
  //   }
  // };

  const fetchUserSubscriptions = async () => {
    const username = sessionStorage.getItem('username');  // Get the username from sessionStorage
    try {
      const response = await fetch(`http://localhost:8000/api/users/${username}/subscriptions`, {
        method: 'GET',  // Use GET method to retrieve subscriptions
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch user subscriptions');
      }
      const userData = await response.json();
      const userSubscriptions = userData.data || [];  // Default to an empty array if undefined
      setIsSubscribed(userSubscriptions.includes(topic));
    } catch (error) {
      console.error('Error fetching user subscriptions:', error.message);
    }
  };
  
    // Function to search topic
    const searchTopic = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/searchTopic?query=${encodeURIComponent(searchTopicInput)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch search results');
        }
        const data = await response.json();
        setPosts(data.data);
      } catch (error) {
        console.error('Error searching topics:', error);
      }
    };

  const handleSubscription = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/users/${un}/subscribe/${topic}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: un }),
      });

      if (!response.ok) {
        throw new Error(isSubscribed ? 'Failed to unsubscribe' : 'Failed to subscribe');
      }

      setIsSubscribed(!isSubscribed);
    } catch (error) {
      console.error('Error managing subscription:', error.message);
    }
  };

  const handleReplySubmit = async (postId, replyContent) => {
    const date = new Date().toISOString();
    try {
      const response = await fetch(`http://localhost:8000/api/posts/${postId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: un,
          content: replyContent,
          date: date,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit reply');
      }

      fetchPosts();
    } catch (error) {
      console.error('Error submitting reply:', error.message);
    }
  };

  const handleReplyChange = (postId, value) => {
    setGeneratedReplies((prevReplies) => ({
      ...prevReplies,
      [postId]: value,
    }));
  };

  const handleAutoReplyToggle = (postId) => {
    setAutoReplyState((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId], // Toggle the state for this post
    }));
  };

  const generateReply = async (postId, postContent) => {
    if (!autoReplyState[postId]) {
      console.log("Auto-reply is disabled for this post. No reply generated.");
      setGeneratedReplies((prevReplies) => ({
        ...prevReplies,
        [postId]: '', // Clear the reply when disabled
      }));
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/generate-reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: postContent }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate reply');
      }

      const data = await response.json();
      setGeneratedReplies((prevReplies) => ({
        ...prevReplies,
        [postId]: data.reply,
      }));
    } catch (error) {
      console.error('Error generating reply:', error);
    }
  };

  return (
    <div style={{ maxWidth: 'none', margin: 'auto', padding: '20px', backgroundColor: '#f4f4f9', borderRadius: '10px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
      <Typography variant="h4" align="center" style={{ marginBottom: '20px', fontWeight: 'bold' }}>{topic}</Typography>
      
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <Button
          variant="contained"
          color={isSubscribed ? 'secondary' : 'primary'}
          onClick={handleSubscription}
          style={{ padding: '10px 20px', fontSize: '16px' }}
        >
          {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
        </Button>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
      <TextField
        label="Search topic"
        variant="outlined"
        value={searchTopicInput}
        onChange={(e) => setSearchTopicInput(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={searchTopic} style={{ marginLeft: '10px' }}>
        Search
      </Button>
      </div>

      {isLoading ? (
        <Typography variant="body1" align="center" style={{ fontSize: '18px', color: '#777' }}>Loading...</Typography>
      ) : (
        posts.length === 0 ? (
          <Typography variant="body1" align="center" style={{ fontSize: '18px', color: '#777' }}>No posts available</Typography>
        ) : (
          posts.map((post) => (
            <div key={post._id} style={{ marginBottom: '30px', backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0px 3px 8px rgba(0, 0, 0, 0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px', fontSize: '18px', fontWeight: 'bold'
                }}>
                  {post._source.creator.charAt(0)}
                </div>
                <div>
                  <Typography variant="h6" style={{ marginBottom: '4px', fontWeight: 'bold' }}>{post._source.title}</Typography>
                  <Typography variant="body2" color="textSecondary" style={{ fontSize: '14px' }}>{post._source.creator} - {new Date(post._source.date).toLocaleString()}</Typography>
                </div>
              </div>
              <Typography variant="body1" style={{ marginBottom: '16px', fontSize: '16px', color: '#333' }}>{post._source.content}</Typography>

              {post._source.replies.length > 0 && (
                <div style={{ marginLeft: '30px', marginBottom: '16px' }}>
                  {post._source.replies.map((reply) => (
                    <div key={reply.id} style={{ marginBottom: '12px', backgroundColor: '#f7f7f7', padding: '12px', borderRadius: '8px' }}>
                      <Typography variant="body2" style={{ fontWeight: 'bold', fontSize: '14px' }}>{reply.userId}</Typography>
                      <Typography variant="body1" style={{ fontSize: '14px', color: '#555' }}>{reply.content}</Typography>
                      <Typography variant="caption" style={{ display: 'block', marginTop: '6px', color: '#999' }}>{new Date(reply.date).toLocaleString()}</Typography>
                    </div>
                  ))}
                </div>
              )}

              <Divider style={{ marginBottom: '16px' }} />
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const replyContent = e.target.replyContent.value;
                  handleReplySubmit(post._id, replyContent);
                  e.target.replyContent.value = '';
                }}
                style={{ display: 'flex', flexDirection: 'column' }}
              >
                <FormControlLabel
                  control={<Switch checked={autoReplyState[post._id] || false} onChange={() => handleAutoReplyToggle(post._id)} />}
                  label="Enable Auto-Reply"
                  style={{ marginBottom: '12px' }}
                />
                <TextField
                  name="replyContent"
                  variant="outlined"
                  placeholder="Write a reply..."
                  fullWidth
                  multiline
                  value={generatedReplies[post._id] || ''}
                  onChange={(e) => handleReplyChange(post._id, e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => generateReply(post._id, post._source.content)}
                          disabled={!autoReplyState[post._id]}
                          style={{ marginTop: '8px', padding: '8px 16px' }}
                        >
                          Generate Reply
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                  style={{ marginBottom: '12px' }}
                />
                <Button type="submit" variant="contained" color="primary" style={{ padding: '8px 16px', fontSize: '16px' }}>
                  Reply
                </Button>
              </form>
            </div>
          ))
        )
      )}
    </div>
  );
};

export default TopicPage;
