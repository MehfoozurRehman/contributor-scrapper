# contributor-scrapper

A small Node.js script that opens a GitHub user's repositories page in a visible browser and collects each repository's name and link.

**Status:** Stub. The repo is one 85-line script with no tests and no output file, and it has not been run against the current GitHub page layout in this review.

## The problem

Getting a list of someone's public repositories means scrolling through paginated GitHub pages by hand. The script automates that: it asks for a username, walks every page of the repositories tab, and collects the names and URLs.

## What it does

- Prompts for a GitHub username in the terminal with `inquirer`.
- Opens `github.com/<username>?tab=repositories` in a non-headless Chrome window through `puppeteer`.
- Reads each repository's name and link from the `#user-repositories-list` section.
- Clicks the "next page" control and repeats until the control is disabled, pausing 2 seconds between pages.
- Logs the collected list to the console. Nothing is written to a file.

## How it's built

- Node.js ES modules (`"type": "module"`) with two runtime dependencies: `puppeteer` for browser automation and `inquirer` for the prompt.
- A single `main()` function drives the flow. Page-side extraction runs inside `page.evaluate`, and the pagination loop runs on the Node side.
- The file also contains a commented-out Instagram scraping sketch, which is not used.

## Running it locally

```bash
npm install
npm run dev    # runs: node index.js
```

Puppeteer downloads a Chromium build during install. The browser opens visibly, so a display is required.

## What's left

- The script does not close the browser, so the Chrome window stays open after the list is printed.
- It uses `page.waitForTimeout`, which may not exist in the pinned Puppeteer version. A plain `setTimeout` delay would be safer. This has not been run to confirm.
- It depends on GitHub's current HTML (`#user-repositories-list`, `.next_page`), which can change without notice.
- Results are only printed. Writing them to a JSON or CSV file is not implemented.
- There is no error handling for unknown usernames or for pages where the selectors are missing.
- The commented-out Instagram code should be removed or moved out of the script.
- There are no tests.
