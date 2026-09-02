# Official course map - learn-when-ai-with-phoebe

**Course:** When AI, When Not - the routing skill: which work goes to a dashboard, which to classic ML, which to GenAI, and what each choice really costs.
**Positioning (Phoebe's brief, 2026-09-02):** emphasize the value of BI and classic ML - not everything needs AI. Identify the best-suited cases to leverage AI and save cost. "Don't use a nuclear weapon to kill a mosquito."
**Arc:** single-track 6 sessions, running artifact = a routing playbook applied to Cadence (an AI note-taker startup, the aidm-series through-line company) and its 10-workload ops backlog.
**Bucket:** `ai` (d2, audience both). Palette: signal amber (#B45309 ramp) + slate contrast (#334155).
**Seams:** `learn-ai-literacy` teaches what AI is; this course teaches when to reach for it. `learn-metric-decomposition` owns the driver-tree method (s2 links to it). `learn-model-evaluation` owns metric design. Parked `learn-decision-intelligence` = decisions FROM data; this = tool-choice decisions.
**Build mode:** course-taking loop PAUSED - built direct from verified sources.

## Source universe (verified 2026-09-02 by research agent; every claim checked to URL)

| # | Source | Exact citation | Usable claim | Honesty caveat (MUST carry) | Maps to |
|---|--------|----------------|--------------|------------------------------|---------|
| 1 | MIT Project NANDA | Challapally, Pease, Raskar, Chari, *The GenAI Divide: State of AI in Business 2025*, July 2025. https://mlq.ai/media/quarterly_decks/v0.1_State_of_AI_in_Business_2025_Report.pdf | 95% of enterprise GenAI pilots showed no measurable P&L impact despite $30-40B invested; only ~5% of custom pilots created significant value. 52 interviews + 153 leader surveys + 300 deployments. | NOT peer-reviewed; lead author says the divide is a LEARNING GAP in orgs/tools, not model failure - winners pick one pain point and execute. Same report documents a thriving "shadow AI economy". Teach as "pilots fail to cross into P&L", never "AI is useless". | s1, s6 |
| 2 | RAND | Ryseff, De Bruhl, Newberry, *The Root Causes of Failure for Artificial Intelligence Projects and How They Can Succeed*, RR-A2680-1, Aug 2024. https://www.rand.org/pubs/research_reports/RRA2680-1.html | "By some estimates, more than 80 percent of AI projects fail - twice the rate of failure for IT projects that do not involve AI." Root cause #1 (~84% of industry interviewees): leadership misunderstanding of the problem to be solved. 65 practitioner interviews. | RAND CITES external estimates ("by some estimates"), it did not measure 80% itself. Say "RAND cites estimates", never "RAND found". | s1 |
| 3 | Goldman Sachs | *Top of Mind* Issue 129, "Gen AI: Too Much Spend, Too Little Benefit?", 25 Jun 2024. https://www.goldmansachs.com/insights/top-of-mind/gen-ai-too-much-spend-too-little-benefit | Covello: ~$1T AI capex "with little to show for it so far"; AI "isn't designed to solve the complex problems that would justify the costs." Acemoglu in same issue: <5% of tasks automated, ~0.9% GDP over a decade. | Debate-format report - Briggs/Rangan/Sheridan argue the bull side in the SAME document. Cite as "Goldman airs both sides; Covello is the skeptic". | s1, s5 |
| 4 | Monica Rogati | "The AI Hierarchy of Needs", Hackernoon, 12 Jun 2017. https://hackernoon.com/the-ai-hierarchy-of-needs-18f111fcc007 | Pyramid bottom-up: COLLECT -> MOVE/STORE -> EXPLORE/TRANSFORM -> AGGREGATE/LABEL -> LEARN/OPTIMIZE -> AI/DEEP LEARNING. AI is the self-actualization tip; you need food/water/shelter first. | Layer labels accurate to her diagram; page resisted automated fetch - eyeball once before printing labels as verbatim quotes. | s1, s2 |
| 5 | Official API pricing | Anthropic https://platform.claude.com/docs/en/about-claude/pricing + OpenAI https://developers.openai.com/api/docs/pricing, fetched 2026-09-02 | Per 1M tokens in/out: Claude Sonnet 5 $2/$10 (simulator uses this), Opus 5 $5/$25, Haiku 4.5 $1/$5; gpt-5.6-terra $2/$12, gpt-5-mini $0.25/$2. Batch 50% off, cache hits 0.1x. | Date-stamp everything "as of Sept 2026". Newer tokenizers produce ~30% more tokens for same text across generations. | s2, s5, simulator |
| 6 | BigQuery pricing | https://cloud.google.com/bigquery/pricing | On-demand $6.25 per TiB scanned, first 1 TiB/month FREE. Course math: 10 GB scan = ~$0.06; same 10 GB as LLM input at $5/MTok = ~$12,500+. | Prices move; date-stamp. | s2, simulator |
| 7 | Google Rules of ML | Zinkevich, *Rules of Machine Learning*, Google Developers. https://developers.google.com/machine-learning/guides/rules-of-ml | Rule #1 verbatim: "Don't be afraid to launch a product without machine learning." Also: "If you think that machine learning will give you a 100% boost, then a heuristic will get you 50% of the way there." | Rule #1 wording confirmed verbatim; re-check the heuristic line against live page before pull-quoting. | s1, s3 |
| 8 | Kozyrkov | "When not to use machine learning or AI", Towards Data Science. https://medium.com/data-science/when-not-to-use-machine-learning-or-ai-8185650f6a29 | Don't use ML for problems solvable directly - anything "defined by human-made rules in the first place"; ML is for when you cannot articulate the rules and have data to learn them. | "The simplest solution that works" is a fair PARAPHRASE, not verbatim - never quote-mark it. Original early-2020s; archive shows 2025 republish. | s1, s2 |
| 9 | Tabular evidence stack | (a) Grinsztajn, Oyallon, Varoquaux, NeurIPS 2022 D&B, arXiv:2207.08815. (b) McElfresh et al., NeurIPS 2023 D&B, arXiv:2305.02997. (c) Bordt, Nori, Caruana et al., COLM 2024, arXiv:2404.06209 | (a) Across 45 datasets tree-based models remain SOTA on medium-sized (~10K sample) TYPICAL tabular data. (b) 176 datasets: GBDT vs NN wins vary by profile, lightly-tuned GBDT strongest default; tuning matters more than algorithm. (c) LLMs memorized popular tabular datasets verbatim - pre-cutoff benchmark wins are contamination. | (a) is scoped: TYPICAL + medium-sized, not "trees always win". No single canonical "LLM vs XGBoost" headline study exists - use the 3-paper stack. | s3 |
| 10 | Cascade case: Checkr | Computerworld, "Checkr ditches GPT-4 for a smaller GenAI model". https://www.computerworld.com/article/3541362/checkr-ditches-gpt-4-for-a-smaller-genai-model-streamlines-background-checks.html | GPT-4 ~$12k/mo -> fine-tuned Llama-3-8B under $800 (~5x cheaper), latency ~15s -> 0.15-0.5s (~30x), accuracy on messy class ~55-72% -> 85-90%+. | Small-model-replaces-frontier, NOT regex-replaces-LLM. Vendor (Predibase) involved in telling - quote Computerworld version. | s4, s5 |
| 11 | Cascade case: Google proxy models | Google Cloud Blog, "More than 100x Faster & Cheaper LLM-Powered SQL Queries with Proxy Models". https://cloud.google.com/blog/products/data-analytics/more-than-100x-faster-and-cheaper-llm-powered-sql-queries-with-proxy-models | Replacing majority of per-row LLM calls in analytical SQL with lightweight proxies: >100x cost/latency reduction. Escalate to the LLM only when needed. | - | s4, s5, s6 |
| 12 | Energy per query | Google, "Measuring the environmental impact of AI inference", Aug 2025 + arXiv:2508.15734; Epoch AI Feb 2025 https://epoch.ai/gradient-updates/how-much-energy-does-chatgpt-use; EPRI May 2024 | Measured median Gemini text prompt = 0.24 Wh / 0.03 gCO2e / 0.26 mL water; per-prompt energy fell 33x in 12 months. Epoch: typical GPT-4o query ~0.3 Wh. | The circulating "2.9 Wh per ChatGPT query, 10x a Google search" (EPRI 2024 / de Vries lineage) is SUPERSEDED by measured ~0.24-0.3 Wh. Teach the correction itself. Median != mean; agentic/long-context far heavier. | s5 |

## The simulator: router-live.js (canon numbers, verified in engine 2026-09-02)

10 Cadence workloads; kinds: det (deterministic - logic verifiable, definition alignable), pat (structured prediction), jud (judgment/language). Baseline = the 2026 default chaos: metrics sent to the LLM (hype), language work stuck on keyword tooling (legacy). Dashboard answers are REAL JS aggregations over the embedded seeded dataset; LLM answers are a deterministic teaching model of documented failure modes; prices are real (sources 5, 6). Honesty rail printed in the widget.

Counters: API + query bill / true monthly cost (adds cleanup of silently-wrong numbers at $330 each = 6 analyst-hours, verify labor $220 when you check checkable LLM answers, and eval+monitoring upkeep $40 per probabilistic workload once S5 is on) / answers you can trust /10 / silently wrong.

| Config | Bill | True cost | Trusted | Silent-wrong |
|---|---|---|---|---|
| Baseline (2026 default) | $5 | $2,315 | 0/10 | 7 |
| +S1 triage question | $5 | $225 | 0/10 | 0 (caught, not fixed) |
| +S2 free tier first | $4 | $224 | 4/10 | 0 |
| +S3 classic ML check | $62 | $62 | 7/10 | 0 |
| +S4 GenAI fit test | $176 | $176 | 10/10 | 0 |
| +S5 full cost | $176 | $416 | 10/10 | 0 |
| ANTI (AI-everything) from baseline | $119 | $2,429 | 3/10 | 7 |
| ANTI on full config | $119 | $739 | 3/10 | 0 |

Teaching beats: S1 cuts true cost 10x WITHOUT trusting anything more (knowing what is checkable converts silent-wrong to caught-wrong). S3 is the cheapest trustworthy config ($62 - BI + classic ML doing almost everything). S4 spends real money where LLMs genuinely win and it is WORTH it. S5 makes the number go UP honestly (evals + monitoring are part of the price). The anti-lever pays MORE to trust LESS, in every configuration.

## Per-session coverage

| # | Session | Teaches | Primary sources | Coverage |
|---|---|---|---|---|
| s1 | The triage question | Why "should we use AI" is the wrong first question; the two-question test (logic verifiable? definition aligned?); det/pat/jud triage; failure base rates and what actually causes them | 1, 2, 3, 7, 8 | ✓ |
| s2 | The almost-free tier | BI, SQL, rules; verified-once-then-free economics; $0.06 vs $12,500 math; the hierarchy of needs; when a dashboard IS the product | 4, 5, 6, 8 | ✓ |
| s3 | When classic ML wins | Structured prediction; the tabular evidence stack; cheap inference; backtestability; heuristic-first (Rule #1) | 7, 9 | ✓ |
| s4 | When GenAI wins | Unstructured language, judgment, generation; the cascade pattern (rules -> small model -> frontier, escalate only when needed); Checkr + Google proxy cases | 10, 11 | ✓ |
| s5 | The cost and risk math | Token math on real prices; true cost = bill + evals + monitoring + cleanup; error-cost asymmetry; energy corrections; Goldman debate | 3, 5, 6, 10, 12 | ✓ |
| s6 | The routing playbook | The full decision tree; route-the-backlog capstone on the simulator; portfolio triage; when to revisit a routing decision | 1, 11 + all | ✓ |

## Hard rails / honesty

- Never teach "95% fail" as model failure - it is org execution, per the report's own lead author (source 1 caveat).
- Never say "RAND found 80%" - RAND cites estimates (source 2 caveat).
- Grinsztajn is scoped to typical, medium-sized tabular data (source 9 caveat).
- The 2.9 Wh energy figure is superseded - teach the correction (source 12).
- All prices date-stamped "as of Sept 2026".
- The simulator's LLM answers are a teaching model; the dashboard numbers and all cost math are real. Say it on the page.
- This is NOT an anti-AI course: s4 spends real money on GenAI where it wins, and the final config keeps 3 LLM workloads. The lesson is routing, not refusal.

## Not covered by design

- Prompt engineering, RAG, agent architecture (own courses in the ai bucket).
- Build-vs-buy vendor evaluation beyond the cascade principle.
- Model governance sign-off design (parked learn-model-risk course).
- Fine-tuning economics beyond the Checkr case.

**Re-verify before delivery:** API prices (move often); the Rogati layer labels against the live page; the Zinkevich heuristic pull-quote.
