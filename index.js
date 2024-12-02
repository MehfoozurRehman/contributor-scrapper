import puppeteer from "puppeteer";
import inquirer from "inquirer";

// const scrape = async () => {
//   const browser = await puppeteer.launch({ headless: false });

//   const page = await browser.newPage();

//   await page.goto("https://www.instagram.com/");
// };

// scrape();

const main = async () => {
  const inquiry = await inquirer.prompt([
    {
      type: "input",
      name: "username",
      message: "Enter your github username",
    },
  ]);

  console.log(inquiry);

  const browser = await puppeteer.launch({ headless: false });

  const page = await browser.newPage();

  await page.goto(
    `https://www.github.com/${inquiry.username}?tab=repositories`
  );

  await page.setViewport({
    width: 1920,
    height: 1080,
  });

  //user-repositories-list wait for it
  await page.waitForSelector("#user-repositories-list");

  const reposList = [];

  const getRepoDetails = async () => {
    return await page.evaluate(() => {
      const repos = document.querySelectorAll("#user-repositories-list ul li");

      const reposList = [];

      repos.forEach((repo) => {
        const repoName = repo.querySelector("h3 a").innerText;
        const repoLink = repo.querySelector("h3 a").href;

        reposList.push({
          name: repoName,
          link: repoLink,
        });
      });

      return reposList;
    });
  };
  let loadMoreEnabled = true;

  while (loadMoreEnabled) {
    const list = await getRepoDetails();
    reposList.push(...list);

    loadMoreEnabled = await page.evaluate(() => {
      const loadMore = document.querySelector(".next_page");

      if (loadMore && !loadMore.classList.contains("disabled")) {
        loadMore.click();
        return true;
      }

      return false;
    });

    await page.waitForTimeout(2000);
  }

  console.log(reposList);
};

main();
