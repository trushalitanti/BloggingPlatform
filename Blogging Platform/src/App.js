import Blog from './components//Blog.js';
import './App.css';
import Register from './components/Register';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'; 
import Login from './components/Login'
import CreatePost from './components/CreatePost';
import PostList from './components/PostList';
import Admin from './components/Admin';
import AllPosts from './components/AllPosts';
import Header from './components/Header';
// import Blog from './components/Blog'
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Footer from './components/Footer';
import Search from './components/Search'
import TopicPage from './components/TopicPage';
import RecommendActivity from './components/RecommendActivity.js';
// import { AlertProvider } from './AlertContext';
// import Alert from './Alert';

const defaultTheme = createTheme();
const sections = [
  { title: 'Academic Resources', url: 'Academic Resources' },
  { title: 'Career Services', url: 'Career Services' },
  { title: 'Campus', url: 'Campus' },
  { title: 'Culture', url: 'Culture' },
  { title: 'Local Community Resources', url: 'Local Community Resources' },
  { title: 'Social', url: 'Social' },
  { title: 'Sports', url: 'Sports' },
  { title: 'Health and Wellness', url: 'Health and Wellness' },
  { title: 'Technology', url: 'Technology' },
  { title: 'Travel', url: 'Travel' },
  { title: 'Alumni', url: 'Alumni' },
];
function App() {
  return (
    <>
    <Router>
    <ThemeProvider theme={defaultTheme}>
    <CssBaseline />
    <Container maxWidth="lg">
    <Header title="IIT Blogging" sections={sections} /> 
    {/* <AlertProvider> */}
        <Routes>
          <Route>
          <Route path="/" element={<Blog />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/createPost" element={<CreatePost />} />
          <Route path="/feed" element={<PostList />} />
          <Route path="/search" element={<Search />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/allPosts" element={<AllPosts />} />
          <Route path="/:topic" element={<TopicPage />} />
          <Route path='/recommendactivity' element={<RecommendActivity/>} />
          {/* <Alert /> */}
          </Route>
        </Routes>
      {/* </AlertProvider> */}
    </Container>
    </ThemeProvider>
    </Router>
    <Footer
        title="Footer"
        description="Something here to give the footer a purpose!"
      />
    </>
    // <Router>
    // </Router>

  );
}

export default App;
