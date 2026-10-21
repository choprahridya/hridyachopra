import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Work from './pages/Work'
import About from './pages/About'
import Project from './pages/Project'
import NotFound from './pages/NotFound'

// Authoring tools exist only on the local dev server; they are not part of the public build.
const Lab = import.meta.env.DEV ? lazy(() => import('./authoring/Lab')) : null
const Dashboard = import.meta.env.DEV ? lazy(() => import('./authoring/Dashboard')) : null

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {import.meta.env.DEV && (
          <>
            <Route path="lab" element={<Suspense fallback={null}><Lab /></Suspense>} />
            <Route path="dashboard" element={<Suspense fallback={null}><Dashboard /></Suspense>} />
          </>
        )}
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="work" element={<Work />} />
          <Route path="work/:slug" element={<Project />} />
          <Route path="about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  )
}
