import { useState } from 'react'
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { RequireAuth } from './components/layout/RequireAuth'
import { ShortcutsHelp } from './components/layout/ShortcutsHelp'
import { GlobalSearch } from './components/search/GlobalSearch'
import { useEasterEggs } from './components/easter-eggs/EasterEggManager'
import { useShortcut } from './hooks/useKeyboardShortcuts'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { RoadmapPage } from './pages/RoadmapPage'
import { ContestsPage } from './pages/ContestsPage'
import { ContestDetailPage } from './pages/ContestDetailPage'
import { EntrancePage } from './pages/EntrancePage'
import { EntranceDetailPage } from './pages/EntranceDetailPage'
import { ProblemPage } from './pages/ProblemPage'
import { RankingPage } from './pages/RankingPage'
import { ProfilePage } from './pages/ProfilePage'
import { AdminPage } from './pages/AdminPage'
import { LearningPage } from './pages/LearningPage'
import { TemplatesPage } from './pages/TemplatesPage'
import { TechniquesPage } from './pages/TechniquesPage'
import { SourcesPage } from './pages/SourcesPage'
import { HiddenPage } from './pages/HiddenPage'

function AnimatedRoutes(props: ReturnType<typeof useEasterEggs>['api']) {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <DashboardPage />
            </RequireAuth>
          }
        />
        <Route
          path="/roadmap"
          element={
            <RequireAuth>
              <RoadmapPage onLevelComplete={props.triggerLevelComplete} />
            </RequireAuth>
          }
        />
        <Route
          path="/roadmap/:topicId"
          element={
            <RequireAuth>
              <RoadmapPage onLevelComplete={props.triggerLevelComplete} />
            </RequireAuth>
          }
        />
        <Route
          path="/contests"
          element={
            <RequireAuth>
              <ContestsPage />
            </RequireAuth>
          }
        />
        <Route
          path="/contests/:contestId"
          element={
            <RequireAuth>
              <ContestDetailPage />
            </RequireAuth>
          }
        />
        <Route
          path="/entrance"
          element={
            <RequireAuth>
              <EntrancePage />
            </RequireAuth>
          }
        />
        <Route
          path="/entrance/:examId"
          element={
            <RequireAuth>
              <EntranceDetailPage />
            </RequireAuth>
          }
        />
        <Route
          path="/problem/:slug"
          element={
            <RequireAuth>
              <ProblemPage onThreeWA={props.triggerThreeWA} />
            </RequireAuth>
          }
        />
        <Route
          path="/ranking"
          element={
            <RequireAuth>
              <RankingPage />
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <ProfilePage />
            </RequireAuth>
          }
        />
        <Route
          path="/learning"
          element={
            <RequireAuth>
              <LearningPage />
            </RequireAuth>
          }
        />
        <Route
          path="/learning/templates"
          element={
            <RequireAuth>
              <TemplatesPage />
            </RequireAuth>
          }
        />
        <Route
          path="/techniques"
          element={
            <RequireAuth>
              <TechniquesPage />
            </RequireAuth>
          }
        />
        <Route
          path="/sources"
          element={
            <RequireAuth>
              <SourcesPage />
            </RequireAuth>
          }
        />
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <AdminPage />
            </RequireAuth>
          }
        />
        <Route
          path="/hidden"
          element={
            <RequireAuth>
              <HiddenPage unlocked={props.hiddenUnlocked} />
            </RequireAuth>
          }
        />
      </Routes>
    </AnimatePresence>
  )
}

function ChromeShell() {
  const { api, overlays } = useEasterEggs()
  const [searchOpen, setSearchOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const location = useLocation()

  useShortcut('ctrl+k', (e) => {
    e.preventDefault()
    setSearchOpen(true)
  }, true)
  useShortcut('shift+/', () => setHelpOpen(true))

  const isLogin = location.pathname === '/login'

  return (
    <>
      {!isLogin && (
        <Navbar
          onOpenSearch={() => setSearchOpen(true)}
          onLogoClick={api.triggerLogoSpin}
          ratingHoverCount={0}
          onRatingHover={api.noteRatingHover}
          hiddenUnlocked={api.hiddenUnlocked}
          logoStarBadge={api.logoStarBadge}
        />
      )}
      <AnimatedRoutes {...api} />
      {!isLogin && <Footer />}
      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
      <ShortcutsHelp open={helpOpen} onClose={() => setHelpOpen(false)} />
      {overlays}
    </>
  )
}

export default function App() {
  return (
    <HashRouter>
      <ChromeShell />
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'toast-dark',
          style: {
            background: 'var(--bg-surface)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-glow)',
          },
        }}
      />
    </HashRouter>
  )
}
