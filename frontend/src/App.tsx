import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { LandingPage } from './pages/LandingPage'
import { OverexposedEndpointsPage } from './pages/OverexposedEndpointsPage'
import { JwtModulePage } from './pages/JwtModulePage'
import { SqlInjectionModulePage } from './pages/SqlInjectionModulePage'
import { useI18n } from './i18n'
import { PrimaryButton, SecondaryButton } from './components/Button'

function App() {
  const { language, setLanguage, t } = useI18n()
  const location = useLocation()
  const isTutorialView = location.pathname.startsWith('/tutorial/')
  const currentYear = new Date().getFullYear()

  return (
    <div className="flex min-h-screen flex-col bg-neutral-950 text-neutral-100">
      {!isTutorialView ? (
        <header className="sticky top-0 z-40 border-b border-neutral-800/90 bg-neutral-950/90 backdrop-blur">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
            <div>
              <p className="text-sm font-semibold text-neutral-100">{t('app.title')}</p>
              <p className="text-xs text-neutral-400">{t('app.subtitle')}</p>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="text-neutral-300">{t('app.langLabel')}:</span>
              {language === 'pl' ? (
                <PrimaryButton type="button" onClick={() => setLanguage('pl')} className="rounded-md" size="xs">
                  {t('app.langPL')}
                </PrimaryButton>
              ) : (
                <SecondaryButton type="button" onClick={() => setLanguage('pl')} className="rounded-md" size="xs">
                  {t('app.langPL')}
                </SecondaryButton>
              )}
              {language === 'en' ? (
                <PrimaryButton type="button" onClick={() => setLanguage('en')} className="rounded-md" size="xs">
                  {t('app.langEN')}
                </PrimaryButton>
              ) : (
                <SecondaryButton type="button" onClick={() => setLanguage('en')} className="rounded-md" size="xs">
                  {t('app.langEN')}
                </SecondaryButton>
              )}
            </div>
          </div>
        </header>
      ) : null}

      <div className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/tutorial/overexposed-endpoints" element={<OverexposedEndpointsPage />} />
          <Route path="/tutorial/jwt-auth" element={<JwtModulePage />} />
          <Route path="/tutorial/sql-injection" element={<SqlInjectionModulePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      <footer className="border-t border-neutral-800/90 bg-neutral-950/90">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-4 text-xs text-neutral-400 sm:px-6 sm:text-sm lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>© {currentYear} BWIP Security Lab</p>
          <p className="lg:text-right">
            {t('app.credits')}: Patryk Kaczmarczyk, Rafał Szygenda, Aleksander Kwaśnioch, Szymon Kupis
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
