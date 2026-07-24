import React, { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LoadingSkeleton from './components/LoadingSkeleton'
import './styles/fontStyle.css'

const Home = lazy(() => import('./components/Home'))
const CategoryPage = lazy(() => import('./components/CategoryPage'))
const Blog = lazy(() => import('./components/Blog'))
const AskAI = lazy(() => import('./components/AskAI'))
const About = lazy(() => import('./components/About'))
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy'))
const Terms = lazy(() => import('./components/Terms'))
const Disclaimer = lazy(() => import('./components/Disclaimer'))
const Contact = lazy(() => import('./components/Contact'))
const CreatePost = lazy(() => import('./admin/CreatePost'))
const UserLogin = lazy(() => import('./admin/Login'))

const GoogleAuthWrapper = () => (
  <GoogleOAuthProvider clientId="410849405245-a0k9kkq4g3ssecl4fv5sukc0vhh3rrf4.apps.googleusercontent.com">
    <UserLogin />
  </GoogleOAuthProvider>
)

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-canvas-soft text-ink">
        <Navbar />
        <Suspense fallback={<LoadingSkeleton />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:name" element={<CategoryPage />} />
            <Route path="/blog/:id" element={<Blog />} />
            <Route path="/ask-ai" element={<AskAI />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin/login" element={<GoogleAuthWrapper />} />
            <Route path="/admin/panel" element={<CreatePost />} />
          </Routes>
        </Suspense>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
