import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ShieldAlert, ShieldCheck } from 'lucide-react'
import { FiCheckCircle, FiKey } from 'react-icons/fi'
import { api, type ApiResult } from '../lib/api'
import { TerminalPanel } from '../components/TerminalPanel'
import { LearningSidebar } from '../components/LearningSidebar'
import { PrimaryButton, SecondaryButton } from '../components/Button'
import { useI18n } from '../i18n'

export function SqlInjectionModulePage() {
  const [logs, setLogs] = useState<ApiResult<unknown>[]>([])
  const { t } = useI18n()
  const navigate = useNavigate()

  const [login, setLogin] = useState('admin')
  const [password, setPassword] = useState('admin_password')

  const lastStatus = useMemo(() => logs[0], [logs])
  const queryPreview = useMemo(
    () => `SELECT id, name FROM Users WHERE name = '${login}' AND password = '${password}'`,
    [login, password],
  )

  const learningSections = useMemo(
    () => [
      {
        id: 'what-is',
        title: t('sqli.learn.sections.whatIs.title'),
        content: t('sqli.learn.sections.whatIs.content'),
      },
      {
        id: 'reverse-proxy',
        title: t('sqli.learn.sections.reverseProxy.title'),
        content: t('sqli.learn.sections.reverseProxy.content'),
      },
      {
        id: 'modsecurity',
        title: t('sqli.learn.sections.modsecurity.title'),
        content: t('sqli.learn.sections.modsecurity.content'),
        code: t('sqli.learn.sections.modsecurity.code'),
      },
    ],
    [t],
  )

  const pushLog = (result: ApiResult<unknown>) => {
    setLogs((prev) => [result, ...prev].slice(0, 30))
  }

  const runAction = async (action: () => Promise<ApiResult<unknown>>) => {
    try {
      const result = await action()
      pushLog(result)
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : t('common.unknownError')
      pushLog({
        ok: false,
        status: 0,
        data: { detail: message },
        method: 'POST',
        endpoint: t('sqli.unknownEndpoint'),
      })
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:ml-80 lg:max-w-[calc(100%-20rem)] lg:px-8">
      <LearningSidebar
        moduleTitle={t('sqli.title')}
        tabLabel={t('sqli.learn.tabLabel')}
        panelTitle={t('sqli.learn.panelTitle')}
        sections={learningSections}
        prevLabel={t('sqli.learn.prev')}
        nextLabel={t('sqli.learn.next')}
        closeLabel={t('sqli.learn.close')}
        openSectionLabel={t('sqli.learn.openSection')}
      />

      <header className="animate-fade-up flex w-full flex-col gap-3 lg:flex-row lg:items-center lg:justify-between" style={{ animationDelay: '40ms' }}>
        <div>
          <p className="mb-1 text-xs uppercase tracking-[0.15em] text-orange-600">{t('sqli.module')}</p>
          <h1 className="text-3xl font-bold text-neutral-100 sm:text-4xl">{t('sqli.title')}</h1>
        </div>
        <SecondaryButton onClick={() => navigate('/')} className="w-fit bg-neutral-950" size="sm">
          <ArrowLeft size={16} /> {t('sqli.back')}
        </SecondaryButton>
      </header>

      <section className="animate-fade-up rounded-2xl border border-orange-600/40 bg-gradient-to-r from-orange-700/20 via-orange-700/10 to-transparent p-5 sm:p-6" style={{ animationDelay: '90ms' }}>
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600">
          <ShieldAlert size={18} /> {t('sqli.eduMode')}
        </p>
        <p className="mt-2 max-w-4xl text-sm leading-relaxed text-neutral-200 sm:text-base">{t('sqli.eduText')}</p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <article className="animate-fade-up rounded-2xl border border-neutral-800 bg-neutral-950/70 p-5 sm:p-6" style={{ animationDelay: '140ms' }}>
            <h2 className="mb-4 inline-flex items-center gap-2 text-lg font-semibold text-neutral-100">
              <FiKey className="text-orange-600" /> {t('sqli.labTitle')}
            </h2>
            <p className="mb-4 text-sm text-neutral-400">{t('sqli.labHint')}</p>

            <div className="grid gap-2 sm:grid-cols-2">
              <label className="text-xs text-neutral-300">
                {t('sqli.loginLabel')}
                <input
                  value={login}
                  onChange={(event) => setLogin(event.target.value)}
                  className="mt-1 w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm"
                />
              </label>
              <label className="text-xs text-neutral-300">
                {t('sqli.passwordLabel')}
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="mt-1 w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm"
                />
              </label>
            </div>

            <div className="mt-3 rounded-lg border border-neutral-800 bg-neutral-900/60 p-3 text-xs text-neutral-300">
              <p className="font-semibold text-neutral-100">{t('sqli.safeExamplesTitle')}</p>
              <p className="mt-2">{t('sqli.safeExampleOne')}</p>
              <p>{t('sqli.safeExampleTwo')}</p>
              <p>{t('sqli.safeExampleThree')}</p>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <PrimaryButton
                type="button"
                onClick={() => runAction(() => api.sqliLoginSafe({ login, password }))}
                size="xs"
              >
                {t('sqli.callSafeLogin')}
              </PrimaryButton>
              <SecondaryButton
                type="button"
                onClick={() => runAction(() => api.sqliReverseProxyCheck({ login, password }))}
                size="xs"
              >
                {t('sqli.callProxyCheck')}
              </SecondaryButton>
            </div>
          </article>
        </div>

        <div className="space-y-4">
          <div className="animate-fade-up rounded-xl border border-neutral-800 bg-neutral-950/70 p-4 text-sm" style={{ animationDelay: '260ms' }}>
            <p className="inline-flex items-center gap-2 font-medium text-neutral-100">
              <ShieldCheck size={17} className="text-orange-600" /> {t('sqli.lastResponse')}
            </p>
            <p className="mt-2 text-neutral-300">
              {lastStatus
                ? `${lastStatus.method} ${lastStatus.endpoint} -> [${lastStatus.status}] ${lastStatus.ok ? t('common.ok') : t('common.error')}`
                : t('sqli.noHistory')}
            </p>
            <p className="mt-2 inline-flex items-center gap-2 text-xs text-neutral-400">
              <FiCheckCircle /> {t('sqli.helperText')}
            </p>
          </div>

          <div className="animate-fade-up" style={{ animationDelay: '320ms' }}>
            <TerminalPanel title={t('sqli.terminalTitle')} subtitle={t('sqli.terminalSubtitle')} logs={logs} />
          </div>

          <div className="animate-fade-up rounded-xl border border-neutral-800 bg-neutral-950/70 p-4 text-xs text-neutral-200" style={{ animationDelay: '360ms' }}>
            <p className="mb-2 font-semibold text-neutral-100">{t('sqli.queryPreviewTitle')}</p>
            <pre className="max-w-full overflow-x-auto whitespace-pre-wrap break-all">{queryPreview}</pre>
          </div>
        </div>
      </section>
    </main>
  )
}
