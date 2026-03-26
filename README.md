# Vitti ASX Intelligence Center

Welcome to the **Vitti ASX Intelligence Center**! 

This is an automated tool designed to help you instantly understand what is happening on the Australian Securities Exchange (ASX), even if you have zero trading experience.

Every day, hundreds of companies release official announcements on the stock market. Reading through all of these dense, financial PDFs is impossible. This tool does the hard work for you.

---

## What This Tool Does For You

1. **Auto-Fetches the News:** It automatically pulls all the latest official announcements from the ASX.
2. **AI Summaries:** Instead of reading a 50-page PDF, Artificial Intelligence reads it instantly and gives you 3 simple bullet points explaining what happened.
3. **Flags "Market Sensitive" News:** The ASX literally tells us if a piece of news is expected to move the stock price. We put a bright **red flashing dot** next to these so you know what is important.
4. **Highlights "Bullish" News:** Our AI analyzes the news. If it thinks the news is positive and good for the company's future, it adds a green **▲ BULLISH** badge.
5. **Organizes Everything:** It sorts the news into categories like "Dividends", "Results", or "Mergers", making it incredibly easy to browse.

---

## How to Use the Dashboard

Using the dashboard is as simple as browsing a regular website. 

1. **Open the Dashboard:** Once the website is running, open it in your web browser.
2. **Pick a Date:** On the left side, choose the date you want to look at. The dashboard updates automatically.
3. **Focus Mode:** If you only want to see the most important, price-moving news, flip the **"Market Sensitive"** switch on the left. All the boring stuff will disappear!
4. **Search:** Need to find news about a specific company (like BHP)? Just type "BHP" into the search bar at the top right.

---

## How to Start the Dashboard (For Beginners)

If you have downloaded this folder to your computer and want to start it up:

1. Open your computer's terminal (or Command Prompt).
2. Navigate to this folder.
3. Type the following command and press Enter:
   ```bash
   npm run dev
   ```
4. Open your web browser (like Chrome or Safari) and go to: `http://localhost:3000`

*That's it! The dashboard will appear and automatically refresh every 5 minutes to fetch the latest AI-summarized news.*

---

## For Developers & Technical Users

If you are a programmer looking to understand how the underlying AI pipeline and Next.js Architecture works, please see our detailed documentation:

- [High-Level Design (HLD)](docs/HLD.md)
- [Low-Level Design (LLD)](docs/LLD.md)

---
*Created by [Tushar Bhardwaj](https://minianonlink.vercel.app/tusharbhardwaj) for automated market intelligence.*
