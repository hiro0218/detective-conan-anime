import fs from "fs";

const getStories = async () => {
  return await fetch("https://www.ytv.co.jp/conan/data/case.json")
    .then((res) => res.json())
    .then((res) => {
      const stories = res.reverse();
      const data = [];

      stories.map((story) => {
        // リマスター版は除く
        if (!!story.data.episode && !story.data.episode.includes("R") && !story.data.episode.includes("SP")) {
          data.push({
            num: story.data.episode,
            date: story.data.oa_date,
            title: story.data.title,
            url:
              "https://www.ytv.co.jp/conan/archive/k" +
              story.calendar_date.replace(/-/gi, "") +
              ".html",
          });
        }
      });

      return data;
    });
};

const main = async () => {
  // 取得
  const stories = await getStories();

  // 書き込み
  fs.writeFileSync("./dist/data.json", JSON.stringify(stories, null, 2));
};

main();
