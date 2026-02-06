import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState, useEffect } from 'react';

const sections = [
  { title: 'Academic Resources', id: 'academic-resources' },
  { title: 'Career Services', id: 'career-services' },
  { title: 'Campus', id: 'campus' },
  { title: 'Culture', id: 'culture' },
  { title: 'Local Community Resources', id: 'local-community-resources' },
  { title: 'Social', id: 'social' },
  { title: 'Sports', id: 'sports' },
  { title: 'Health and Wellness', id: 'health-and-wellness' },
  { title: 'Technology', id: 'technology' },
  { title: 'Travel', id: 'travel' },
  { title: 'Alumni', id: 'alumni' },
];

const defaultTheme = createTheme();

export default function Blog() {
  const navigate = useNavigate();
  const users=localStorage.getItem('users')
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
    { src: '/images/photo1.jpeg', text: 'Academic Resources' },
    { src: '/images/photo2.jpeg', text: 'Career Services' },
    { src: '/images/photo3.jpeg', text: 'Campus' },
    { src: '/images/photo4.jpeg', text: 'Culture' },
    { src: '/images/photo5.jpeg', text: 'Local Community Resources' },
    { src: '/images/photo6.jpeg', text: 'Social' },
    { src: '/images/photo7.jpeg', text: 'Sports' },
    { src: '/images/photo8.jpeg', text: 'Health and Wellness' },
    { src: '/images/photo9.jpeg', text: 'Technology' },
    { src: '/images/photo10.jpeg', text: 'Travel' },
    { src: '/images/photo11.jpeg', text: 'Alumni' },
  ];
  

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 1000); // 1 second

    return () => clearInterval(interval);
  }, []);

  // Updated to navigate to dynamic route based on the section id
  const handleSectionClick = (id) => {
    navigate(`/view-post-grid/${id}`);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
        <main>
          <div style={{ marginLeft: '24px', width: 'calc(100% - 48px)' }}>
            <div style={{ position: 'relative', width: '100%', height: '500px', overflow: 'hidden' }}>
            {/* Image */}
            <img
              src={images[currentImageIndex].src}
              alt="Carousel Image"
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }}
            />
            {/* Text Overlay */}
            <div
              style={{
                position: 'absolute',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '5px',
                fontSize: '20px',
                fontWeight: 'bold',
              }}
            >
              {images[currentImageIndex].text}
            </div>
          </div>
          <div className='mainbody-text'
            style={{
              marginTop: '40px',
              padding: '30px',
              backgroundColor: '#f5f5f5',
              borderRadius: '10px',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Typography variant="h4" style={{ fontWeight: 'bold', marginBottom: '20px' }}>
              Discover, Learn, and Connect
            </Typography>
            <Typography variant="body1" style={{ fontSize: '18px', lineHeight: '1.8', color: '#333' }}>
              Welcome to our blogging platform—a space designed to share knowledge, exchange ideas, and inspire innovation. 
              Whether you’re an aspiring writer, an expert in your field, or a curious reader, you'll find a collection of engaging content that enriches learning and fosters discussion.
            </Typography>
            <br />
            <Typography variant="body1" style={{ fontSize: '18px', lineHeight: '1.8', color: '#333' }}>
              Here, you can explore thought-provoking articles, academic insights, personal experiences, and industry trends. 
              Join our community of passionate thinkers and contribute to meaningful conversations that make an impact. 
              Whether it’s technology, education, culture, or career guidance, we’ve got something for everyone.
            </Typography>
            <br />
            <Typography variant="body1" style={{ fontSize: '18px', lineHeight: '1.8', color: '#333' }}>
              Let’s collaborate, learn, and grow together. Start your journey with us today!
            </Typography>
          </div>
          </div>
        </main>
    </ThemeProvider>
  );
}