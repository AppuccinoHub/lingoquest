# Free lesson connection for LingoQuest

This folder is a Cloudflare Worker. It is the connection behind **Generate a lesson** on the teacher studio.

It uses **Cloudflare Workers AI**, which is included with the free Workers plan. There is no separate AI account and no API key. The model runs on Cloudflare. The default model is `@cf/mistralai/mistral-small-3.1-24b-instruct`. You can change `AI_MODEL` in `wrangler.toml` to another model on the free plan.

Nothing in this folder has been deployed. You deploy it once, from your own free Cloudflare account.

## What stays free

- Choose the **Workers Free** plan.
- Do **not** add a credit card or other payment method. A card is only for the paid plan. If a page asks for one, leave that page.
- The free plan includes **10,000 Neurons a day** for Workers AI. When they are used up, generation stops until the next day (midnight UTC). Cloudflare does not charge you for going over the free amount unless you are on the paid plan.
- This Worker also stops at **30 lessons a day** (`DAILY_REQUEST_CAP`). That cap is on purpose, so a normal teaching day stays inside the free Neuron allowance for this model. Do not raise it above 30.
- Each answer is limited to about **3,500 tokens** (`MAX_OUTPUT_TOKENS`).
- There is also a short pause after several requests in one hour (`RATE_LIMIT_PER_WINDOW`, default 10 per hour, per teacher passcode and per network).

The app checks the lesson on your computer. The Worker does not grade the JSON. That keeps the Worker inside the free plan's small CPU allowance.

## What the teacher passcode is

The passcode is a password **you invent**. It is not an API key.

- The Worker stores it as a secret. It is not written in this folder.
- You type the same passcode once in LingoQuest, under **Connection**. The browser saves it on that device only, and sends it with each Generate.
- The public website address is not the lock. Anyone can pretend to be the website. The passcode is the lock.
- Generate sends only the topic, the level, and the language. It does not send student names, scores, or progress.

## One-time setup

You need a free Cloudflare account and Node.js on a computer. You do not need a billing method.

1. Sign up at [https://dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up). Confirm your email.
2. If Cloudflare asks you to pick a plan, choose **Free**. Skip any step that asks for a credit card.
3. On your computer, open a terminal in the `worker` folder of this project.
4. Log in:

   ```bash
   npx wrangler login
   ```

   A browser window opens. Approve access for the free account.

5. Create the small counter that enforces the daily cap:

   ```bash
   npx wrangler kv namespace create LIMITS
   ```

   The command prints an id. Open `wrangler.toml` and replace `REPLACE_WITH_KV_NAMESPACE_ID` with that id. Leave the rest of the file as it is.

6. Invent a long teacher passcode (a sentence you can remember is fine) and save it on the Worker. The terminal will ask you to paste it. It is not stored in the project files.

   ```bash
   npx wrangler secret put TEACHER_ACCESS_TOKEN
   ```

7. Publish the connection:

   ```bash
   npx wrangler deploy
   ```

   Wrangler prints an address that looks like `https://lingoquest-generate.<your-name>.workers.dev`. Copy it.

8. Open the live teacher studio: [https://appuccinohub.github.io/lingoquest/teacher/](https://appuccinohub.github.io/lingoquest/teacher/). Use this public site. A copy running on your own computer is blocked by the browser.
9. Under **Connection**, paste the worker address and the same teacher passcode. Click **Save connection**.
10. Enter a topic and a level, then click **Generate lesson**. The first run can take a little while. Each success is a new lesson on that device. Older lessons and student progress are left alone.

If Generate says the free limit has been reached, wait until tomorrow. Do not add a payment method to get more.

## Changing the model

In `wrangler.toml`, `AI_MODEL` is the only model setting. After you edit it, run `npx wrangler deploy` again. Pick a text model that Cloudflare lists for Workers AI. A larger model uses the free Neuron allowance faster.

## If something fails

| Message | What to do |
| --- | --- |
| Teacher passcode was not accepted | The passcode in Connection must match `TEACHER_ACCESS_TOKEN`. Run `npx wrangler secret put TEACHER_ACCESS_TOKEN` again, then save the new passcode in the app. |
| Daily cap storage is not set up | Repeat the `kv namespace create` step and put the id in `wrangler.toml`, then deploy again. |
| Today's free limit | Wait until the next UTC day, or you have already made 30 requests. A lesson the checker rejected can count as two requests. |
| Free model did not answer | Wait a minute and try Generate again. The free service is sometimes busy. |
