import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Database, ShieldCheck, ShieldAlert } from 'lucide-react'
import { FiKey, FiPlayCircle, FiUserPlus, FiPackage, FiCheckCircle } from 'react-icons/fi'
import { api, type ApiResult } from '../lib/api'
import { TerminalPanel } from '../components/TerminalPanel'
import { LearningSidebar } from '../components/LearningSidebar'
import { PrimaryButton, SecondaryButton } from '../components/Button'
import { useI18n } from '../i18n'

export function OverexposedEndpointsPage() {
  const [logs, setLogs] = useState<ApiResult<unknown>[]>([])
  const { t } = useI18n()
  const navigate = useNavigate()

  const [loginName, setLoginName] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  const [newUserName, setNewUserName] = useState('guest_demo')
  const [newUserPassword, setNewUserPassword] = useState('guest_password')
  const [userId, setUserId] = useState('1')
  const [usernameToCheck, setUsernameToCheck] = useState('admin')

  const [itemName, setItemName] = useState('Nowy element')
  const [itemUserId, setItemUserId] = useState('1')
  const [itemId, setItemId] = useState('1')

  const [permissionLevel, setPermissionLevel] = useState('3')
  const [permissionUserId, setPermissionUserId] = useState('1')
  const [permissionId, setPermissionId] = useState('1')
  const [endpointSection, setEndpointSection] = useState<'users' | 'items'>('users')

  const lastStatus = useMemo(() => logs[0], [logs])
  const learningSections = useMemo(
    () => [
      {
        id: 'what-is',
        title: t('sql.learn.sections.whatIs.title'),
        content: t('sql.learn.sections.whatIs.content'),
      },
      {
        id: 'consequences',
        title: t('sql.learn.sections.consequences.title'),
        content: t('sql.learn.sections.consequences.content'),
      },
      {
        id: 'prevention',
        title: t('sql.learn.sections.prevention.title'),
        content: t('sql.learn.sections.prevention.content'),
        code: t('sql.learn.sections.prevention.code'),
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
        endpoint: t('sql.unknownEndpoint'),
      })
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:ml-80 lg:max-w-[calc(100%-20rem)] lg:px-8">
      <LearningSidebar
        moduleTitle={t('sql.title')}
        tabLabel={t('sql.learn.tabLabel')}
        panelTitle={t('sql.learn.panelTitle')}
        sections={learningSections}
        prevLabel={t('sql.learn.prev')}
        nextLabel={t('sql.learn.next')}
        closeLabel={t('sql.learn.close')}
        openSectionLabel={t('sql.learn.openSection')}
      />

      <header
        className="animate-fade-up flex w-full flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"
        style={{ animationDelay: '40ms' }}
      >
        <div>
          <p className="mb-1 text-xs uppercase tracking-[0.15em] text-orange-600">{t('sql.module')}</p>
          <h1 className="text-3xl font-bold text-neutral-100 sm:text-4xl">{t('sql.title')}</h1>
        </div>
        <SecondaryButton onClick={() => navigate('/')} className="w-fit bg-neutral-950" size="sm">
          <ArrowLeft size={16} /> {t('sql.back')}
        </SecondaryButton>
      </header>

      <section className="animate-fade-up rounded-2xl border border-orange-600/40 bg-gradient-to-r from-orange-700/20 via-orange-700/10 to-transparent p-5 sm:p-6" style={{ animationDelay: '90ms' }}>
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600">
          <ShieldAlert size={18} /> {t('sql.eduMode')}
        </p>
        <p className="mt-2 max-w-4xl text-sm leading-relaxed text-neutral-200 sm:text-base">
          {t('sql.eduText')}
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <article className="animate-fade-up rounded-2xl border border-neutral-800 bg-neutral-950/70 p-5 sm:p-6" style={{ animationDelay: '140ms' }}>
            <h2 className="mb-4 inline-flex items-center gap-2 text-lg font-semibold text-neutral-100">
              <FiKey className="text-orange-600" /> {t('sql.loginDemo')}
            </h2>
            <p className="mb-4 text-sm text-neutral-400">{t('sql.loginHint')}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm text-neutral-300">
                {t('sql.loginLabel')}
                <input
                  value={loginName}
                  onChange={(event) => setLoginName(event.target.value)}
                  autoComplete="off"
                  className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-100 outline-none ring-orange-600/50 focus:ring"
                />
              </label>
              <label className="text-sm text-neutral-300">
                {t('sql.passwordLabel')}
                <input
                  value={loginPassword}
                  onChange={(event) => setLoginPassword(event.target.value)}
                  type="password"
                  autoComplete="new-password"
                  className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-100 outline-none ring-orange-600/50 focus:ring"
                />
              </label>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <PrimaryButton
                type="button"
                onClick={() => runAction(() => api.login({ name: loginName, password: loginPassword }))}
                size="sm"
              >
                <FiPlayCircle /> {t('sql.callLogin')}
              </PrimaryButton>
              <SecondaryButton type="button" onClick={() => runAction(() => api.checkUsername(loginName))} size="sm">
                {t('sql.checkConstraint')}
              </SecondaryButton>
            </div>
          </article>

          <article className="animate-fade-up rounded-2xl border border-neutral-800 bg-neutral-950/70 p-5 sm:p-6" style={{ animationDelay: '210ms' }}>
            <h2 className="mb-4 inline-flex items-center gap-2 text-lg font-semibold text-neutral-100">
              <Database size={18} className="text-orange-600" /> {t('sql.endpointLab')}
            </h2>
            <p className="mb-4 text-sm text-neutral-400">{t('sql.endpointLabHint')}</p>

            <div className="mb-4 flex flex-wrap gap-2">
              {endpointSection === 'users' ? (
                <PrimaryButton type="button" onClick={() => setEndpointSection('users')} size="xs">
                  {t('sql.labUsersTab')}
                </PrimaryButton>
              ) : (
                <SecondaryButton type="button" onClick={() => setEndpointSection('users')} size="xs">
                  {t('sql.labUsersTab')}
                </SecondaryButton>
              )}

              {endpointSection === 'items' ? (
                <PrimaryButton type="button" onClick={() => setEndpointSection('items')} size="xs">
                  {t('sql.labItemsTab')}
                </PrimaryButton>
              ) : (
                <SecondaryButton type="button" onClick={() => setEndpointSection('items')} size="xs">
                  {t('sql.labItemsTab')}
                </SecondaryButton>
              )}
            </div>

            {endpointSection === 'users' ? (
              <div className="rounded-xl border border-neutral-800 bg-neutral-900/70 p-4">
                <p className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-neutral-200">
                  <FiUserPlus className="text-orange-600" /> {t('sql.users')}
                </p>
                <div className="space-y-3">
                  <div className="animate-fade-up rounded-lg border border-neutral-800/80 bg-neutral-950/60 p-3" style={{ animationDelay: '40ms' }}>
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-neutral-400">POST /users/</p>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      <label className="text-xs text-neutral-300">
                        {t('sql.fieldUserName')}
                        <input
                          value={newUserName}
                          onChange={(event) => setNewUserName(event.target.value)}
                          placeholder={t('sql.userNamePlaceholder')}
                          className="mt-1 w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm"
                        />
                      </label>
                      <label className="text-xs text-neutral-300">
                        {t('sql.fieldUserPassword')}
                        <input
                          value={newUserPassword}
                          onChange={(event) => setNewUserPassword(event.target.value)}
                          placeholder={t('sql.userPasswordPlaceholder')}
                          className="mt-1 w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm"
                        />
                      </label>
                    </div>
                    <PrimaryButton
                      type="button"
                      onClick={() => runAction(() => api.createUser({ name: newUserName, password: newUserPassword }))}
                      className="mt-2 rounded-md"
                      size="xs"
                    >
                      {t('sql.createUserAction')}
                    </PrimaryButton>
                  </div>

                  <div className="animate-fade-up rounded-lg border border-neutral-800/80 bg-neutral-950/60 p-3" style={{ animationDelay: '110ms' }}>
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-neutral-400">GET /users/{'{id}'}</p>
                    <label className="mt-2 block text-xs text-neutral-300">
                      {t('sql.fieldUserId')}
                      <input
                        value={userId}
                        onChange={(event) => setUserId(event.target.value)}
                        placeholder={t('sql.userIdPlaceholder')}
                        className="mt-1 w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm"
                      />
                    </label>
                    <SecondaryButton type="button" onClick={() => runAction(() => api.getUser(Number(userId) || 1))} className="mt-2 rounded-md" size="xs">
                      {t('sql.getUserAction')}
                    </SecondaryButton>
                  </div>

                  <div className="animate-fade-up rounded-lg border border-neutral-800/80 bg-neutral-950/60 p-3" style={{ animationDelay: '180ms' }}>
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-neutral-400">GET /users/usernameConstraint</p>
                    <label className="mt-2 block text-xs text-neutral-300">
                      {t('sql.fieldUsernameToCheck')}
                      <input
                        value={usernameToCheck}
                        onChange={(event) => setUsernameToCheck(event.target.value)}
                        placeholder={t('sql.usernameCheckPlaceholder')}
                        className="mt-1 w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm"
                      />
                    </label>
                    <SecondaryButton
                      type="button"
                      onClick={() => runAction(() => api.checkUsername(usernameToCheck))}
                      className="mt-2 rounded-md"
                      size="xs"
                    >
                      {t('sql.checkUsernameAction')}
                    </SecondaryButton>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-neutral-800 bg-neutral-900/70 p-4">
                <p className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-neutral-200">
                  <FiPackage className="text-orange-600" /> {t('sql.itemsAndPermissions')}
                </p>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="animate-fade-up rounded-lg border border-neutral-800/80 bg-neutral-950/60 p-3" style={{ animationDelay: '40ms' }}>
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-neutral-400">POST /items/</p>
                    <div className="mt-2 space-y-2">
                      <label className="text-xs text-neutral-300">
                        {t('sql.fieldItemName')}
                        <input
                          value={itemName}
                          onChange={(event) => setItemName(event.target.value)}
                          placeholder={t('sql.itemNamePlaceholder')}
                          className="mt-1 w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm"
                        />
                      </label>
                      <label className="text-xs text-neutral-300">
                        {t('sql.fieldItemUserId')}
                        <input
                          value={itemUserId}
                          onChange={(event) => setItemUserId(event.target.value)}
                          placeholder={t('sql.itemUserIdPlaceholder')}
                          className="mt-1 w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm"
                        />
                      </label>
                    </div>
                    <PrimaryButton
                      type="button"
                      onClick={() => runAction(() => api.createItem({ name: itemName, user_id: Number(itemUserId) || 1 }))}
                      className="mt-2 rounded-md"
                      size="xs"
                    >
                      {t('sql.createItemAction')}
                    </PrimaryButton>
                  </div>

                  <div className="animate-fade-up rounded-lg border border-neutral-800/80 bg-neutral-950/60 p-3" style={{ animationDelay: '110ms' }}>
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-neutral-400">GET /items/{'{id}'}</p>
                    <label className="mt-2 block text-xs text-neutral-300">
                      {t('sql.fieldItemId')}
                      <input
                        value={itemId}
                        onChange={(event) => setItemId(event.target.value)}
                        placeholder={t('sql.itemIdPlaceholder')}
                        className="mt-1 w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm"
                      />
                    </label>
                    <SecondaryButton type="button" onClick={() => runAction(() => api.getItem(Number(itemId) || 1))} className="mt-2 rounded-md" size="xs">
                      {t('sql.getItemAction')}
                    </SecondaryButton>
                  </div>

                  <div className="animate-fade-up rounded-lg border border-neutral-800/80 bg-neutral-950/60 p-3" style={{ animationDelay: '180ms' }}>
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-neutral-400">POST /permissions/</p>
                    <div className="mt-2 space-y-2">
                      <label className="text-xs text-neutral-300">
                        {t('sql.fieldPermissionLevel')}
                        <input
                          value={permissionLevel}
                          onChange={(event) => setPermissionLevel(event.target.value)}
                          placeholder={t('sql.permissionLevelPlaceholder')}
                          className="mt-1 w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm"
                        />
                      </label>
                      <label className="text-xs text-neutral-300">
                        {t('sql.fieldPermissionUserId')}
                        <input
                          value={permissionUserId}
                          onChange={(event) => setPermissionUserId(event.target.value)}
                          placeholder={t('sql.permissionUserIdPlaceholder')}
                          className="mt-1 w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm"
                        />
                      </label>
                    </div>
                    <PrimaryButton
                      type="button"
                      onClick={() =>
                        runAction(() =>
                          api.createPermission({
                            permission: Number(permissionLevel) || 1,
                            user_id: Number(permissionUserId) || 1,
                          }),
                        )
                      }
                      className="mt-2 rounded-md"
                      size="xs"
                    >
                      {t('sql.createPermissionAction')}
                    </PrimaryButton>
                  </div>

                  <div className="animate-fade-up rounded-lg border border-neutral-800/80 bg-neutral-950/60 p-3" style={{ animationDelay: '250ms' }}>
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-neutral-400">GET /permissions/{'{id}'}</p>
                    <label className="mt-2 block text-xs text-neutral-300">
                      {t('sql.fieldPermissionId')}
                      <input
                        value={permissionId}
                        onChange={(event) => setPermissionId(event.target.value)}
                        placeholder={t('sql.permissionIdPlaceholder')}
                        className="mt-1 w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm"
                      />
                    </label>
                    <SecondaryButton
                      type="button"
                      onClick={() => runAction(() => api.getPermission(Number(permissionId) || 1))}
                      className="mt-2 rounded-md"
                      size="xs"
                    >
                      {t('sql.getPermissionAction')}
                    </SecondaryButton>
                  </div>

                  <div className="animate-fade-up rounded-lg border border-neutral-800/80 bg-neutral-950/60 p-3 md:col-span-2" style={{ animationDelay: '320ms' }}>
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-neutral-400">GET /health</p>
                    <SecondaryButton type="button" onClick={() => runAction(() => api.health())} className="mt-2 rounded-md" size="xs">
                      {t('sql.healthAction')}
                    </SecondaryButton>
                  </div>
                </div>
              </div>
            )}
          </article>
        </div>

        <div className="space-y-4">
          <div className="animate-fade-up rounded-xl border border-neutral-800 bg-neutral-950/70 p-4 text-sm" style={{ animationDelay: '260ms' }}>
            <p className="inline-flex items-center gap-2 font-medium text-neutral-100">
              <ShieldCheck size={17} className="text-orange-600" /> {t('sql.lastResponse')}
            </p>
            <p className="mt-2 text-neutral-300">
              {lastStatus
                ? `${lastStatus.method} ${lastStatus.endpoint} -> [${lastStatus.status}] ${lastStatus.ok ? t('common.ok') : t('common.error')}`
                : t('sql.noHistory')}
            </p>
            <p className="mt-2 inline-flex items-center gap-2 text-xs text-neutral-400">
              <FiCheckCircle /> {t('sql.helperText')}
            </p>
          </div>

          <div className="animate-fade-up" style={{ animationDelay: '320ms' }}>
            <TerminalPanel
              title={t('sql.terminalTitle')}
              subtitle={t('sql.terminalSubtitle')}
              logs={logs}
            />
          </div>
        </div>
      </section>
    </main>
  )
}
