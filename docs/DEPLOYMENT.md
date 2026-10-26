# Local, GitHub & Vercel Guide / 本地运行、GitHub 与 Vercel 部署

## 1. Local run / 本地运行

```bash
git clone <your-repository-url>
cd globalgtm-ai
npm install
cp .env.example .env.local
npm run dev
```

Visit `http://localhost:3000`. Leave both environment values blank to use example mode only.

## 2. Enable optional AI mode / 启用可选 AI 模式

Edit `.env.local`:

```dotenv
OPENAI_API_KEY=your_server_side_key
OPENAI_MODEL=a_model_available_to_your_account
```

Restart the development server. Never use `NEXT_PUBLIC_OPENAI_API_KEY`; that would expose the secret to browsers. Never commit `.env.local`.

## 3. Quality gate / 提交前质量门槛

```bash
npm test
npm run typecheck
npm run build
git status
```

Confirm that `.env.local`, `.next` and `node_modules` are absent from `git status`.

## 4. Create a GitHub repository / 创建 GitHub 仓库

```bash
git init
git add .
git commit -m "feat: launch GlobalGTM AI MVP"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/globalgtm-ai.git
git push -u origin main
```

Recommended repository settings:

- Description: `Evidence-first AI copilot for cross-border market-entry decisions.`
- Topics: `nextjs`, `typescript`, `ai`, `gtm`, `market-research`, `portfolio`.
- Add three screenshots to the README after deployment.
- Protect `main` once collaborators are added.

## 5. Deploy to Vercel / 部署到 Vercel

1. Sign in to Vercel and choose **Add New → Project**.
2. Import the GitHub repository.
3. Keep Framework Preset as **Next.js** and the default build command.
4. Deploy once without secrets to verify example mode.
5. In **Project Settings → Environment Variables**, add `OPENAI_API_KEY` and `OPENAI_MODEL` only if AI mode is needed.
6. Redeploy and test `/api/market-data?country=MYS` and the AI review button.

The World Bank connector needs outbound HTTPS. If an organization policy blocks it, the UI will show unavailable and will not fabricate a fallback value.

## 6. Secret and cost controls / 密钥与成本控制

- Set an API project budget and usage alert.
- Use a model appropriate to your account and latency/cost target.
- Keep `store: false` unless a reviewed product requirement changes it.
- Add rate limiting and authentication before sharing a key-backed public demo widely.
- Rotate a key immediately if it appears in Git history; deleting the line is not enough.

## 7. Release checklist / 发布清单

- [ ] Automated tests pass from a clean install.
- [ ] TypeScript check and production build pass.
- [ ] Example/live/proposed labels are visible.
- [ ] No secrets or real customer data are committed.
- [ ] Mobile and desktop flows are manually checked.
- [ ] AI failure preserves the non-AI workflow.
- [ ] Export remains locked before human review.
- [ ] README contains final live URL and screenshots.
