import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ShieldAlert, ShieldCheck } from 'lucide-react'
import { FiCheckCircle, FiKey } from 'react-icons/fi'
import { api, type ApiResult, type JwtTokenResponse } from '../lib/api'
import { TerminalPanel } from '../components/TerminalPanel'
import { LearningSidebar } from '../components/LearningSidebar'
import { PrimaryButton, SecondaryButton } from '../components/Button'
import { useI18n } from '../i18n'

export function JwtModulePage() {
  const [logs, setLogs] = useState<ApiResult<unknown>[]>([])
  const { t } = useI18n()
  const navigate = useNavigate()

  const [jwtLoginName, setJwtLoginName] = useState('admin')
  const [jwtLoginPassword, setJwtLoginPassword] = useState('admin_password')
  const [jwtToken, setJwtToken] = useState('')
  const [jwtCompareUserId, setJwtCompareUserId] = useState('1')
  const [jwtProtectedUserId, setJwtProtectedUserId] = useState('1')
  const [jwtCompareItemId, setJwtCompareItemId] = useState('1')
  const [jwtProtectedItemId, setJwtProtectedItemId] = useState('1')

  const lastStatus = useMemo(() => logs[0], [logs])
  const learningSections = useMemo(
    () => [
      {
        id: 'jwt-what-is',
        title: t('jwt.learn.sections.whatIs.title'),
        content: t('jwt.learn.sections.whatIs.content'),
      },
      {
        id: 'jwt-creation',
        title: t('jwt.learn.sections.creation.title'),
        content: t('jwt.learn.sections.creation.content'),
        code: t('jwt.learn.sections.creation.code'),
      },
      {
        id: 'jwt-usage',
        title: t('jwt.learn.sections.usage.title'),
        content: t('jwt.learn.sections.usage.content'),
        code: t('jwt.learn.sections.usage.code'),
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
        method: 'GET',
        endpoint: t('jwt.unknownEndpoint'),
      })
    }
  }

  const runJwtTokenAction = async () => {
    try {
      const result = await api.createJwtToken({
        name: jwtLoginName,
        password: jwtLoginPassword,
      })
      pushLog(result)

      if (result.ok && result.data && typeof result.data === 'object' && 'access_token' in result.data) {
        setJwtToken((result.data as JwtTokenResponse).access_token)
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : t('common.unknownError')
      pushLog({
        ok: false,
        status: 0,
        data: { detail: message },
        method: 'POST',
        endpoint: '/users/token',
      })
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:ml-80 lg:max-w-[calc(100%-20rem)] lg:px-8">
      <LearningSidebar
        moduleTitle={t('jwt.title')}
        tabLabel={t('jwt.learn.tabLabel')}
        panelTitle={t('jwt.learn.panelTitle')}
        sections={learningSections}
        prevLabel={t('jwt.learn.prev')}
        nextLabel={t('jwt.learn.next')}
        closeLabel={t('jwt.learn.close')}
        openSectionLabel={t('jwt.learn.openSection')}
      />

      <header
        className="animate-fade-up flex w-full flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"
        style={{ animationDelay: '40ms' }}
      >
        <div>
          <p className="mb-1 text-xs uppercase tracking-[0.15em] text-orange-600">{t('jwt.module')}</p>
          <h1 className="text-3xl font-bold text-neutral-100 sm:text-4xl">{t('jwt.title')}</h1>
        </div>
        <SecondaryButton onClick={() => navigate('/')} className="w-fit bg-neutral-950" size="sm">
          <ArrowLeft size={16} /> {t('jwt.back')}
        </SecondaryButton>
      </header>

      <section className="animate-fade-up rounded-2xl border border-orange-600/40 bg-gradient-to-r from-orange-700/20 via-orange-700/10 to-transparent p-5 sm:p-6" style={{ animationDelay: '90ms' }}>
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600">
          <ShieldAlert size={18} /> {t('jwt.eduMode')}
        </p>
        <p className="mt-2 max-w-4xl text-sm leading-relaxed text-neutral-200 sm:text-base">{t('jwt.eduText')}</p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <article className="animate-fade-up rounded-2xl border border-neutral-800 bg-neutral-950/70 p-5 sm:p-6" style={{ animationDelay: '140ms' }}>
            <h2 className="mb-4 inline-flex items-center gap-2 text-lg font-semibold text-neutral-100">
              <FiKey className="text-orange-600" /> {t('jwt.jwtTitle')}
            </h2>
            <p className="mb-4 text-sm text-neutral-400">{t('jwt.jwtHint')}</p>

            <div className="animate-fade-up mb-4 rounded-lg border border-neutral-800/80 bg-neutral-950/60 p-3" style={{ animationDelay: '40ms' }}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-neutral-400">{t('jwt.jwtCredentialsTitle')}</p>
              <div className="grid gap-2 sm:grid-cols-2">
                <label className="text-xs text-neutral-300">
                  {t('jwt.jwtLoginLabel')}
                  <input
                    value={jwtLoginName}
                    onChange={(event) => setJwtLoginName(event.target.value)}
                    placeholder={t('jwt.jwtLoginPlaceholder')}
                    className="mt-1 w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm"
                  />
                </label>
                <label className="text-xs text-neutral-300">
                  {t('jwt.jwtPasswordLabel')}
                  <input
                    value={jwtLoginPassword}
                    onChange={(event) => setJwtLoginPassword(event.target.value)}
                    placeholder={t('jwt.jwtPasswordPlaceholder')}
                    className="mt-1 w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm"
                  />
                </label>
              </div>

              <div className="mt-2 flex flex-wrap gap-2">
                <PrimaryButton type="button" onClick={runJwtTokenAction} className="rounded-md" size="xs">
                  {t('jwt.jwtCreateTokenAction')}
                </PrimaryButton>
              </div>

              <label className="mt-3 block text-xs text-neutral-300">
                {t('jwt.jwtTokenLabel')}
                <textarea
                  value={jwtToken}
                  onChange={(event) => setJwtToken(event.target.value)}
                  placeholder={t('jwt.jwtTokenPlaceholder')}
                  rows={3}
                  className="mt-1 w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-xs"
                />
              </label>
              {jwtToken ? <p className="mt-1 text-xs text-green-400">{t('jwt.jwtTokenStored')}</p> : null}
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="animate-fade-up rounded-lg border border-neutral-800/80 bg-neutral-950/60 p-3" style={{ animationDelay: '110ms' }}>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-neutral-400">{t('jwt.jwtStandardColumn')}</p>

                <label className="mt-2 block text-xs text-neutral-300">
                  {t('jwt.jwtCompareUserId')}
                  <input
                    value={jwtCompareUserId}
                    onChange={(event) => setJwtCompareUserId(event.target.value)}
                    placeholder={t('jwt.jwtCompareUserIdPlaceholder')}
                    className="mt-1 w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm"
                  />
                </label>
                <SecondaryButton
                  type="button"
                  onClick={() => runAction(() => api.getSensitiveUserStandard(Number(jwtCompareUserId) || 1))}
                  className="mt-2 rounded-md"
                  size="xs"
                >
                  {t('jwt.jwtReadUserStandardAction')}
                </SecondaryButton>

                <label className="mt-3 block text-xs text-neutral-300">
                  {t('jwt.jwtCompareItemId')}
                  <input
                    value={jwtCompareItemId}
                    onChange={(event) => setJwtCompareItemId(event.target.value)}
                    placeholder={t('jwt.jwtCompareItemIdPlaceholder')}
                    className="mt-1 w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm"
                  />
                </label>
                <SecondaryButton
                  type="button"
                  onClick={() => runAction(() => api.getItemOwnerStandard(Number(jwtCompareItemId) || 1))}
                  className="mt-2 rounded-md"
                  size="xs"
                >
                  {t('jwt.jwtReadItemStandardAction')}
                </SecondaryButton>
              </div>

              <div className="animate-fade-up rounded-lg border border-orange-700/60 bg-orange-950/20 p-3" style={{ animationDelay: '180ms' }}>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-orange-500">{t('jwt.jwtProtectedColumn')}</p>

                <label className="mt-2 block text-xs text-neutral-300">
                  {t('jwt.jwtCompareUserId')}
                  <input
                    value={jwtProtectedUserId}
                    onChange={(event) => setJwtProtectedUserId(event.target.value)}
                    placeholder={t('jwt.jwtCompareUserIdPlaceholder')}
                    className="mt-1 w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm"
                  />
                </label>

                <SecondaryButton
                  type="button"
                  onClick={() => runAction(() => api.getSensitiveUserJwtById(Number(jwtProtectedUserId) || 1, jwtToken))}
                  className="mt-2 rounded-md"
                  size="xs"
                >
                  {t('jwt.jwtReadUserJwtAction')}
                </SecondaryButton>

                <label className="mt-3 block text-xs text-neutral-300">
                  {t('jwt.jwtCompareItemId')}
                  <input
                    value={jwtProtectedItemId}
                    onChange={(event) => setJwtProtectedItemId(event.target.value)}
                    placeholder={t('jwt.jwtCompareItemIdPlaceholder')}
                    className="mt-1 w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm"
                  />
                </label>

                <SecondaryButton
                  type="button"
                  onClick={() => runAction(() => api.getItemOwnerJwt(Number(jwtProtectedItemId) || 1, jwtToken))}
                  className="mt-2 rounded-md"
                  size="xs"
                >
                  {t('jwt.jwtReadItemJwtAction')}
                </SecondaryButton>
              </div>
            </div>
          </article>
        </div>

        <div className="space-y-4">
          <div className="animate-fade-up rounded-xl border border-neutral-800 bg-neutral-950/70 p-4 text-sm" style={{ animationDelay: '260ms' }}>
            <p className="inline-flex items-center gap-2 font-medium text-neutral-100">
              <ShieldCheck size={17} className="text-orange-600" /> {t('jwt.lastResponse')}
            </p>
            <p className="mt-2 text-neutral-300">
              {lastStatus
                ? `${lastStatus.method} ${lastStatus.endpoint} -> [${lastStatus.status}] ${lastStatus.ok ? t('common.ok') : t('common.error')}`
                : t('jwt.noHistory')}
            </p>
            <p className="mt-2 inline-flex items-center gap-2 text-xs text-neutral-400">
              <FiCheckCircle /> {t('jwt.helperText')}
            </p>
          </div>

          <div className="animate-fade-up" style={{ animationDelay: '320ms' }}>
            <TerminalPanel title={t('jwt.terminalTitle')} subtitle={t('jwt.terminalSubtitle')} logs={logs} />
          </div>
        </div>
      </section>
    </main>
  )
}
