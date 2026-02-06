const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');
const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://localhost:9201' });
const app = express();
const PORT = 8000;

app.use(express.json());
app.use(cors());


const USERS_FILE_PATH = path.join(__dirname, 'users.json');
const POSTS_FILE_PATH = path.join(__dirname, 'posts.json');
const SUBSCRIBE_FILE_PATH = path.join(__dirname, 'subscription.json');
const ALERTS_FILE_PATH = path.join(path.join(__dirname, 'alerts.json'), 'utf8');

//LOGIN
app.post('/api/login', async (req, res) => {
    const { username, password, usertype } = req.body;
  
    try {
      const userData = await fs.readFile(USERS_FILE_PATH, 'utf8');
      const users = JSON.parse(userData);
      
      // Find user with matching username and password
      const user = users.find(user => user.username === username && user.password === password && user.usertype === usertype);
      if(user.isLogin === false){
        res.status(401).json('Your login is disabled. Please contact Admin');
      }
      else if (user) {
        // User found, send user data in response
        res.json({ data: { user } });
      } else {
        // User not found, send error response
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } catch (error) {
      console.error('Error logging user:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

//REGISTER
app.post('/api/users', async (req, res) => {
  try {
    const { username, password, usertype } = req.body;
    const isLogin = true;
    console.log(req.body)
    // Read existing user data
    const userData = await fs.readFile(USERS_FILE_PATH, 'utf8');
    const users = JSON.parse(userData);

    // Add new user
    users.push({ username, password, usertype, isLogin });

    // Write updated user data
    await fs.writeFile(USERS_FILE_PATH, JSON.stringify(users, null, 2), 'utf8');

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error writing user data:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//Get all users

app.get('/api/users', async (req, res) => {
  try {
      const userData = await fs.readFile(USERS_FILE_PATH, 'utf8');
      const users = JSON.parse(userData);
      res.json({ data: users });
  } catch (error) {
      console.error('Error getting users:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to handle user subscriptions (both subscribe and unsubscribe)
app.post('/api/users/:username/subscribe/:topic', async (req, res) => {
  const { username, topic } = req.params;
  try {
    // Read the subscriptions data from the file
    let subscriptionsData = await fs.readFile(SUBSCRIBE_FILE_PATH, 'utf8');
    subscriptionsData = JSON.parse(subscriptionsData);

    // Check if the topic exists in the subscriptions data
    if (!subscriptionsData[topic]) {
      subscriptionsData[topic] = [];
    }

    // Check if the username is already subscribed to the topic
    const index = subscriptionsData[topic].indexOf(username);
    if (index !== -1) {
      // If the username is already subscribed, unsubscribe (remove from subscriptions)
      subscriptionsData[topic].splice(index, 1);
      res.json({ success: true, message: `User ${username} unsubscribed from topic ${topic}` });
    } else {
      // If the username is not subscribed, subscribe (add to subscriptions)
      subscriptionsData[topic].push(username);
      res.json({ success: true, message: `User ${username} subscribed to topic ${topic}` });
    }

    // Write the updated subscriptions data back to the file
    await fs.writeFile(SUBSCRIBE_FILE_PATH, JSON.stringify(subscriptionsData, null, 2));
  } catch (error) {
    console.error('Error managing subscription:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//Create new Alert

app.post('/api/alerts/new-post', async (req, res) => {
  const { topic, title, un } = req.body; // Extract topic, title, and user from request body

  try {
    // Read alerts data from alerts.json file
    let alertsData = await fs.readFile(path.join(__dirname, 'alerts.json'), 'utf8');
    alertsData = JSON.parse(alertsData); // Parse alerts data

    // Create new alert object
    const newAlert = { topic: topic, alert: `New post in topic ${topic} titled as "${title} by ${un}"` };

    // Add new alert to alerts data
    alertsData.push(newAlert);

    // Write updated alerts data back to alerts.json file
    await fs.writeFile(path.join(__dirname, 'alerts.json'), JSON.stringify(alertsData, null, 2), 'utf8');

    console.log(`Alert created for user ${un} for new post in topic ${topic} and titled as "${title}"`);

    res.status(200).json({ success: true, message: 'Alerts created for subscribers' });
  } catch (error) {
    console.error('Error creating alert:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});



app.get('/api/getAlerts', async (req, res) => {
  try {
    const username = req.query.username; // Get the username from the query parameters
    const alertsData = await fs.readFile('alerts.json', 'utf8'); // Read alerts data from the file
    const alerts = JSON.parse(alertsData); // Parse alerts data

    // Filter alerts for the specific user
    const userAlerts = alerts.filter(alert => alert.username === username);

    res.json(userAlerts); // Send filtered alerts back as response
  } catch (error) {
    console.error('Error getting alerts:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


app.post('/api/posts/new', async (req, res) => {
  const { topic, postId } = req.body;
  try {
    const postsData = await fs.readFile(POSTS_FILE_PATH, 'utf8');
    const posts = JSON.parse(postsData);
    const post = posts.find(post => post.id === postId && post.topic === topic);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json({ data: post });
  } catch (error) {
    console.error('Error getting new post:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/api/getPosts', async (req, res) => {
  try {
      // Fetch posts from Elasticsearch
      const response = await client.search({
          index: 'posts', // Index name where posts are stored
          body: {
              query: {
                  match_all: {} // Match all query to fetch all posts
              }
          }
      });

      // Extract hits from Elasticsearch response
      const posts = response.hits.hits;

      res.json({ data: posts });
  } catch (error) {
      console.error('Error getting posts:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

//Delete a post
app.delete('/api/deletePost/:postId', async (req, res) => {
  const { postId } = req.params; // Corrected to postId

  try {
    const postData = await fs.readFile(POSTS_FILE_PATH, 'utf8');
    let posts = JSON.parse(postData);

    // Find the post by ID
    const postIndex = posts.findIndex(post => post.id === postId); // Corrected to postId

    if (postIndex !== -1) {
      // Remove the post from the array
      posts.splice(postIndex, 1);

      // Save the updated posts data
      await fs.writeFile(POSTS_FILE_PATH, JSON.stringify(posts, null, 2), 'utf8');

      res.json({ message: `Post with ID ${postId} deleted successfully` }); // Corrected to postId
    } else {
      res.status(404).json({ error: 'Post not found' });
    }
  } catch (error) {
    console.error('Error deleting post:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.put('/api/disable-login', async (req, res) => {
  try {
    const { username } = req.body;
    console.log(username)
    const userData = await fs.readFile(USERS_FILE_PATH, 'utf8');
    let users = JSON.parse(userData);

    // Find the user by username
    const userIndex = users.findIndex(user => user.username === username);
    console.log(userIndex)

    if (userIndex !== -1) {
      // Toggle isLogin flag
      users[userIndex].isLogin = !users[userIndex].isLogin;

      // Save the updated users data
      await fs.writeFile(USERS_FILE_PATH, JSON.stringify(users, null, 2), 'utf8');

      res.json({ message: `isLogin flag toggled successfully for user ${username}` });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error toggling user login:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



//Elastic search

app.post('/api/posts', async (req, res) => {
  try {
      const { title, content, creator, date, topic } = req.body;
      console.log('here',req.body)
            // Generate unique post ID
      // const id = generateUniqueId();
      // Create new post object
       // id,
      const newPost = {
          title,
          content,
          creator,
          date,
          topic,
          replies: [] // Initialize replies array
      };

      // Index the new post in Elasticsearch
      const response = await client.index({
          index: 'posts', // Index name
          body: newPost
      });

      // Extract the generated postId from Elasticsearch response
      const { _id: postId } = response;

      res.status(201).json({ message: 'Post created successfully', postId });
  } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

  

app.post('/api/posts/:postId/reply', async (req, res) => {
  try {
      const { userId, content, date } = req.body;
      const postId = req.params.postId;

      const response = await client.get({
        index: 'posts',
        id: postId
      });
  
      // Check if the post exists
      if (!response._source) {
        return res.status(404).json({ error: 'Post not found' });
      }
  
      // Extract post data from the response
      const post = response._source;

      // Generate unique reply ID
      const replyId = generateUniqueId();

      // Add the new reply to the existing replies array
      if (!post.replies) {
          post.replies = [];
      }
      const newReply = { id: replyId, userId, content, date };
      post.replies.push(newReply);

      // Update the post in Elasticsearch with the new reply
      await client.update({
          index: 'posts',
          id: postId,
          body: {
              doc: {
                  replies: post.replies
              }
          }
      });

      res.status(201).json({ message: 'Reply added successfully', replyId });
  } catch (error) {
      console.error('Error replying to post:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


// API endpoint to search posts by topic
  app.get('/api/posts/search', async (req, res) => {
    try {
        const { topic } = req.query;

        // Construct Elasticsearch query to search for posts by topic
        const response = await client.search({
            index: 'posts', // Index name
            body: {
                query: {
                    match: {
                        topic: topic
                    }
                }
            }
        });

        // Extract search results from the Elasticsearch response
        const searchResults = response.hits.hits.map(hit => hit._source);

        res.status(200).json(searchResults);
    } catch (error) {
        console.error('Error searching posts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



app.get('/api/topicposts', async (req, res) => {
  try {
      const { topic } = req.query;

      // Search for posts by topic
      const response = await client.search({
          index: 'posts',
          body: {
              query: {
                  match: {
                      topic: topic
                  }
              }
          }
      });

      // Extract hits from search results
      const data = response.hits.hits;

      res.json({ data });
  } catch (error) {
      console.error('Error getting posts:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Express route handler for searching topics
app.get('/api/searchTopic', async (req, res) => {
  try {
    const { query } = req.query;

    // Search for posts whose topic title includes the entered text
    const response = await client.search({
      index: 'posts',
      body: {
        query: {
          match_phrase_prefix: {
            title: query
          }
        }
      }
    });

    // Extract hits from search results
    const data = response.hits.hits;

    res.json({ data });
  } catch (error) {
    console.error('Error searching topics:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to handle user subscriptions
// app.post('/api/users/:un/subscriptions', async (req, res) => {
//   try {
//       const { un } = req.params;
//       const { topic } = req.body;

//       // Read user data
//       const userData = await fs.readFile(USERS_FILE_PATH, 'utf8');
//       const users = JSON.parse(userData);

//       // Find the user with the provided username
//       const userIndex = users.findIndex(user => user.username === un);
//       if (userIndex === -1) {
//           return res.status(404).json({ error: 'User not found' });
//       }

//       // Add topic to subscriptions array of the found user
//       if (!users[userIndex].subscriptions.includes(topic)) {
//           users[userIndex].subscriptions.push(topic);
//       }

//       // Save updated user data
//       await fs.writeFile(USERS_FILE_PATH, JSON.stringify(users, null, 2), 'utf8');

//       res.status(200).json({ message: 'Subscribed to topic successfully' });
//   } catch (error) {
//       console.error('Error subscribing to topic:', error.message);
//       res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

app.get('/api/users/:un/subscriptions', async (req, res) => {
  try {
    const { un } = req.params;

    // Read user data
    const userData = await fs.readFile(USERS_FILE_PATH, 'utf8');
    const users = JSON.parse(userData);

    // Find the user
    const user = users.find(user => user.username === un);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Ensure the subscriptions array exists
    if (!user.subscriptions) {
      user.subscriptions = [];  // Default to an empty array if not defined
    }

    // Return user's subscriptions
    res.status(200).json({ data: user.subscriptions });
  } catch (error) {
    console.error('Error fetching subscriptions:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/api/generate-reply', async (req, res) => {
  const { prompt, includeStop } = req.body; 
  console.log('Received post content:', prompt); 

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer YOUR_OPENAI_API_KEY`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are an assistant that generates friendly, constructive reviews for blog posts.' },
          { role: 'user', content: `Here is a post: "${prompt}". Please write a one line review in a constructive, friendly, and positive manner about this post.` },
        ],
        max_tokens: 150,
        temperature: 0.7,
        presence_penalty: 0.6,
        top_p: 1,
        stop: includeStop ? ['\n'] : undefined,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('OpenAI Error:', data);
      throw new Error('Failed to generate reply');
    }

    res.json({ reply: data.choices[0].message.content.trim() });
  } catch (error) {
    console.error('Error generating reply:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/users/:un/subscriptions', async (req, res) => { // Change to GET
  try {
      const { un } = req.params;

      // Read user data
      const userData = await fs.readFile(USERS_FILE_PATH, 'utf8');
      const users = JSON.parse(userData);

      // Find the user
      const user = users.find(user => user.username === un);
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      // Return user's subscriptions
      res.status(200).json({ data: user.subscriptions || [] });
  } catch (error) {
      console.error('Error fetching subscriptions:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.delete('/api/users/:un/subscriptions', async (req, res) => {
  try {
      const { un } = req.params;
      const { topic } = req.body;

      // Read user data
      // const userData = await fs.readFile(`./userdata/${username}.json`, 'utf8');
      const userData = await fs.readFile(USERS_FILE_PATH, 'utf8')
      const user = JSON.parse(userData);

      // Remove topic from subscriptions array
      user.subscriptions = user.subscriptions.filter(sub => sub !== topic);

      // Save updated user data
      await fs.writeFile(USERS_FILE_PATH, JSON.stringify(user, null, 2), 'utf8');

      res.status(200).json({ message: 'Unsubscribed from topic successfully' });
  } catch (error) {
      console.error('Error unsubscribing from topic:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

  // Generate unique ID
function generateUniqueId() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
