import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight} from 'lucide-react'
import { FiShield, FiTerminal } from 'react-icons/fi'
import { api, type ApiResult } from '../lib/api'
import { TerminalPanel } from '../components/TerminalPanel'
import { useI18n } from '../i18n'

export function LandingPage() {
  const [logs, setLogs] = useState<ApiResult<unknown>[]>([])
  const [titleVisible, setTitleVisible] = useState(false)
  const [descriptionVisible, setDescriptionVisible] = useState(false)
  const [modulesVisible, setModulesVisible] = useState(false)
  const { t } = useI18n()
  const navigate = useNavigate()

  useEffect(() => {
    setTitleVisible(false)
    setDescriptionVisible(false)
    setModulesVisible(false)
    const titleTimer = setTimeout(() => {
      setTitleVisible(true)
    }, 80)
    const descriptionTimer = setTimeout(() => {
      setDescriptionVisible(true)
    }, 340)
    const modulesTimer = setTimeout(() => {
      setModulesVisible(true)
    }, 560)

    return () => {
      clearTimeout(titleTimer)
      clearTimeout(descriptionTimer)
      clearTimeout(modulesTimer)
    }
  }, [t])

  useEffect(() => {
    const load = async () => {
      const health = await api.health()
      const username = await api.checkUsername('admin')
      setLogs([health, username])
    }

    load().catch((error: unknown) => {
      const message = error instanceof Error ? error.message : t('common.unknownError')
      setLogs([
        {
          ok: false,
          status: 0,
          data: { detail: message },
          method: 'GET',
          endpoint: t('landing.fallbackEndpoint'),
        },
      ])
    })
  }, [t])

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <section className="animate-fade-up grid gap-6 rounded-3xl border border-neutral-800/80 bg-neutral-950/70 p-6 shadow-2xl shadow-black/40 lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
        <div className="space-y-6">
          <p className="inline-flex items-center gap-2 rounded-full border border-orange-600/40 bg-orange-600/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-orange-600">
            <FiShield /> {t('landing.badge')}
          </p>

          <div className="space-y-6">
            <h1
              className={`text-3xl font-bold leading-tight text-neutral-100 transition-opacity duration-500 ease-out sm:text-4xl lg:text-5xl ${
                titleVisible ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {t('landing.title')}
            </h1>
            <p
              className={`max-w-2xl text-base leading-relaxed text-neutral-300 transition-opacity duration-500 ease-out sm:text-lg ${
                descriptionVisible ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {t('landing.description')}
            </p>
          </div>
        </div>

        <div className="animate-fade-up" style={{ animationDelay: '60ms' }}>
          <TerminalPanel
            title={t('landing.terminalTitle')}
            subtitle={t('landing.terminalSubtitle')}
            logs={logs}
          />
        </div>
      </section>

      <section
        className={`rounded-2xl border border-neutral-800 bg-neutral-900/70 p-5 text-sm text-neutral-300 transition-all duration-500 ease-out sm:p-6 ${
          modulesVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
        }`}
      >
        <h2 className="mb-3 inline-flex items-center gap-2 text-lg font-semibold text-neutral-100">
          <FiTerminal className="text-orange-600" /> {t('landing.modulesTitle')}
        </h2>
        <p className="mb-4 text-neutral-300">{t('landing.modulesText')}</p>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <button
            type="button"
            onClick={() => navigate('/tutorial/overexposed-endpoints')}
            className="group h-full rounded-xl border border-neutral-700 bg-neutral-950 p-4 text-left transition-colors duration-500 ease-out hover:border-orange-800 hover:shadow-[0_12px_32px_rgba(0,0,0,0.35)]"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-orange-600">{t('landing.moduleOneTag')}</p>
            <p className="mt-2 text-base font-semibold text-neutral-100">{t('landing.moduleOneTitle')}</p>
            <p className="mt-2 text-sm text-neutral-300">{t('landing.moduleOneText')}</p>
            <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-orange-600">
              {t('landing.moduleOpen')}
              <ChevronRight size={16} />
            </p>
          </button>

          <button
            type="button"
            onClick={() => navigate('/tutorial/jwt-auth')}
            className="group h-full rounded-xl border border-neutral-700 bg-neutral-950 p-4 text-left transition-colors duration-500 ease-out hover:border-orange-600 hover:shadow-[0_12px_32px_rgba(0,0,0,0.35)]"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-orange-600">{t('landing.moduleTwoTag')}</p>
            <p className="mt-2 text-base font-semibold text-neutral-100">{t('landing.moduleTwoTitle')}</p>
            <p className="mt-2 text-sm text-neutral-300">{t('landing.moduleTwoText')}</p>
            <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-orange-600">
              {t('landing.moduleOpen')}
              <ChevronRight size={16} />
            </p>
          </button>

          <button
            type="button"
            onClick={() => navigate('/tutorial/sql-injection')}
            className="group h-full rounded-xl border border-neutral-700 bg-neutral-950 p-4 text-left transition-colors duration-500 ease-out hover:border-orange-600 hover:shadow-[0_12px_32px_rgba(0,0,0,0.35)]"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-orange-600">{t('landing.moduleThreeTag')}</p>
            <p className="mt-2 text-base font-semibold text-neutral-100">{t('landing.moduleThreeTitle')}</p>
            <p className="mt-2 text-sm text-neutral-300">{t('landing.moduleThreeText')}</p>
            <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-orange-600">
              {t('landing.moduleOpen')}
              <ChevronRight size={16} />
            </p>
          </button>
        </div>
      </section>
    </main>
  )
}
