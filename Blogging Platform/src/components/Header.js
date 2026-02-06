import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';  
import Badge from '@mui/material/Badge';
import FetchRecommendation from './FetchRecommendation';

// Assuming alerts and subscriptions are imported or fetched from an API
import alertsData from './alerts.json';
import subscriptionsData from './subscription.json';

function Header(props) {
  const { sections, title } = props;
  const [un, setUname] = React.useState("");
  const [ut, setUtype] = React.useState("");
  const [alertCount, setAlertCount] = React.useState(0); 
  const [filteredAlerts, setFilteredAlerts] = useState([]); 
  const [showLatestPost, setShowLatestPost] = useState(false); 

  const navigate = useNavigate(); // Hook for programmatic navigation

  React.useEffect(() => {
    let un = sessionStorage.getItem('username');
    setUname(un);
    let ut = sessionStorage.getItem('usertype');
    setUtype(ut);

    // Load filtered alerts on component mount
    if (un) {
      filterAlertsForUser(un);
    }
  }, []);

  // Filter alerts based on user's subscriptions
  const filterAlertsForUser = (username) => {
    const userSubscriptions = subscriptionsData; // Your subscription data
    const userSubscribedTopics = Object.keys(userSubscriptions).filter((topic) => 
      userSubscriptions[topic].includes(username)
    );

    const relevantAlerts = alertsData.filter(alert =>
      userSubscribedTopics.includes(alert.topic)
    );

    setFilteredAlerts(relevantAlerts);
    setAlertCount(relevantAlerts.length); // Update alert count
  };

  const handleCreatePostClick = (e) => {
    e.preventDefault();
    setAlertCount(1); // Set the alert count
    setShowLatestPost(false); // Hide the latest post
    navigate("/createPost");
  };

  const handleAlertClick = (e) => {
    e.preventDefault();
    setAlertCount(0); // Reset the alert count to 0
    setShowLatestPost(true); // Show the latest post
  };


  return (
    <React.Fragment>
      {/* Main Toolbar */}
      <Toolbar sx={{ 
        borderBottom: 1, 
        borderColor: 'divider', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '12px 24px', 
        backgroundColor: '#fff', 
      }}>
        {/* <Button size="small">Subscribe</Button> */}
        <Typography
          component="h2"
          variant="h5"
          color="inherit"
          align="center"
          noWrap
          sx={{ 
            flex: 1, 
            fontWeight: 'bold', 
            color: '#000',
            fontSize: '24px', 
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
          }}
        >
          <Link href="/" color="inherit" underline="none">{title}</Link>
        </Typography>
        <IconButton sx={{ color: '#000' }}>
          <SearchIcon />
        </IconButton>
        {un && un.length > 0 ? (
          <div>
          <FetchRecommendation />
          <Link href="/login" color="inherit" underline="none">
            <Button variant="outlined" size="small" onClick={() => { sessionStorage.clear() }}>
              Log Out
            </Button>
          </Link>
          </div>
        ) : (
          <Link href="/register" color="inherit" underline="none">
            <Button variant="outlined" size="small">
              Sign up
            </Button>
          </Link>
        )}
      </Toolbar>

      {/* Navbar Section */}
      <Toolbar
        component="nav"
        variant="dense"
        sx={{
          justifyContent: 'center',
          alignItems: 'center',
          padding: '12px 24px',
          backgroundColor: '#2c3e50', // Dark background color
          display: 'flex',
          flexWrap: 'wrap',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Adding a subtle shadow for better depth
        }}
      >
        {sections.map((section) => (
          <Link
            color="inherit"
            noWrap
            key={section.title}
            variant="body2"
            href={section.url}
            sx={{
              display: 'flex',
              alignItems: 'center',
              margin: '8px 16px',
              padding: '10px 16px',
              borderRadius: '8px',
              fontWeight: '600', 
              color: '#fff', 
              fontSize: '16px',
              transition: 'all 0.3s ease',
              textDecoration: 'none !important',
              '&:hover': {
                color: '#3498db', 
                backgroundColor: '#34495e', 
              },
              '&:active': {
                color: '#1abc9c', 
              },
            }}
          >
            {section.title}
          </Link>
        ))}
      </Toolbar>

      {/* User Action Toolbar */}
      {un && un.length > 0 && (
        <Toolbar
          component="nav"
          variant="dense"
          sx={{
            alignItems: 'center',
            justifyContent: 'center', 
            overflowX: 'auto',
            backgroundColor: ut === 'administrator' ? '#cce7ff' : ut === 'moderator' ? '#d5f9d1' : '#f8f8f8', 
            padding: '12px 24px',
            borderRadius: '8px', 
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)', 
          }}
        >
          <Typography variant="body1" sx={{ paddingRight: '16px', fontSize: '16px', fontWeight: '500', color: '#333' }}>
            Hello, {un}
          </Typography>
          
          <Button
            variant="outlined"
            size="small"
            sx={{
              paddingRight: '10px',
              fontSize: '14px',
              fontWeight: '500',
              borderColor: '#3498db',
              color: '#3498db',
              '&:hover': {
                backgroundColor: '#3498db',
                color: '#fff',
              },
              marginRight: '20px', 
            }}
            onClick={handleCreatePostClick}
          >
            Create Post
          </Button>

     <Badge badgeContent={alertCount} color="error">
          <Button
            variant="outlined"
            size="small"
            sx={{
              paddingLeft: '10px',
              paddingRight: '10px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#e74c3c',
              '&:hover': {
                backgroundColor: '#e74c3c',
                color: '#fff',
              },
              marginRight: '20px', 
            }}
            onClick={handleAlertClick}
          >
            Alerts
          </Button>
        </Badge>
        

          <Button
            variant="outlined"
            size="small"
            sx={{
              paddingLeft: '10px',
              paddingRight: '10px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#9b59b6',
              '&:hover': {
                backgroundColor: '#9b59b6',
                color: '#fff',
              },
              marginRight: '20px', 
            }}
          >
            <Link href='/recommendActivity' color="inherit" underline="none">Recommend Activity</Link>
          </Button>

          {ut === 'administrator' && (
            <Button
              variant="outlined"
              size="small"
              sx={{
                paddingLeft: '10px',
                paddingRight: '10px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#f39c12',
                '&:hover': {
                  backgroundColor: '#f39c12',
                  color: '#fff',
                },
                marginRight: '20px', 
              }}
            >
              <Link href='/admin' color="inherit" underline="none">All Users</Link>
            </Button>
          )}

          {ut === 'moderator' && (
            <Button
              variant="outlined"
              size="small"
              sx={{
                paddingLeft: '10px',
                paddingRight: '10px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#8e44ad',
                '&:hover': {
                  backgroundColor: '#8e44ad',
                  color: '#fff',
                },
                marginRight: '20px', // Add space between buttons
              }}
            >
              <Link href='/allPosts' color="inherit" underline="none">All Posts</Link>
            </Button>
            
          )}
           
        </Toolbar>
        
      )}

        {showLatestPost && filteredAlerts.length > 0 && (
            <div>
              <h3>New Alerts for You:</h3>
              {filteredAlerts.map((alert, index) => (
                <div key={index}>
                  <p><strong>Topic:</strong> {alert.topic}</p>
                  <p>{alert.alert}</p>
                </div>
              ))}
            </div>
          )}

          </React.Fragment>
        );
      }

    Header.propTypes = {
      sections: PropTypes.arrayOf(
        PropTypes.shape({
          title: PropTypes.string.isRequired,
          url: PropTypes.string.isRequired,
        }),
      ).isRequired,
      title: PropTypes.string.isRequired,
    };

    export default Header;
