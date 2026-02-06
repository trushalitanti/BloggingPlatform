import React from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';

export default function Footer({ title, description }) {
  return (
    <footer
      style={{
        backgroundColor: '#2c3e50', 
        color: '#ecf0f1', 
        padding: '40px 0',
        marginTop: '60px', 
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="h6" align="center" style={{ fontWeight: 'bold', fontSize: '24px' }}>
          {title}
        </Typography>

        <Typography
          variant="body2"
          align="center"
          style={{
            fontSize: '16px',
            marginTop: '10px',
            marginBottom: '20px',
            opacity: '0.8',
          }}
        >
          {description}
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" align="center" style={{ opacity: '0.7', fontSize: '14px' }}>
              <strong>Quick Links</strong>
            </Typography>
            <ul style={{ listStyleType: 'none', padding: 0, textAlign: 'center' }}>
              <li><Link href="/" color="inherit">Home</Link></li>
              <li><Link href="/about" color="inherit">About Us</Link></li>
              <li><Link href="/contact" color="inherit">Contact</Link></li>
              <li><Link href="/privacy" color="inherit">Privacy Policy</Link></li>
            </ul>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="body2" align="center" style={{ opacity: '0.7', fontSize: '14px' }}>
              <strong>Follow Us</strong>
            </Typography>
            <ul style={{ listStyleType: 'none', padding: 0, textAlign: 'center' }}>
              <li><Link href="https://www.facebook.com" color="inherit">Facebook</Link></li>
              <li><Link href="https://www.twitter.com" color="inherit">Twitter</Link></li>
              <li><Link href="https://www.instagram.com" color="inherit">Instagram</Link></li>
              <li><Link href="https://www.linkedin.com" color="inherit">LinkedIn</Link></li>
            </ul>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="body2" align="center" style={{ opacity: '0.7', fontSize: '14px' }}>
              <strong>Contact</strong>
            </Typography>
            <ul style={{ listStyleType: 'none', padding: 0, textAlign: 'center' }}>
              <li><span>Email: info@bloggingplatform.com</span></li>
              <li><span>Phone: +1 234 567 890</span></li>
            </ul>
          </Grid>
        </Grid>

        <Typography
          variant="body2"
          align="center"
          style={{
            marginTop: '30px',
            fontSize: '14px',
            opacity: '0.6',
          }}
        >
          © {new Date().getFullYear()} Blogging Platform. All rights reserved.
        </Typography>
      </Container>
    </footer>
  );
}
