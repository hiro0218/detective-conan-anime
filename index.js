const fetch = require("node-fetch");
const fs = require("fs-extra");

// story.json
const oldStories = async () => {
  return await fetch("https://www.ytv.co.jp/conan/data/story.json")
    .then((res) => res.json())
    .then((res) => {
      const stories = res.item.reverse();
      const data = [];

      stories.map((story) => {
        // 話数が飛んでいるものに追加する
        /// 怪盗キッドの瞬間移動魔術
        if (story.oaDateId === "20081020") story.story_num = "515";
        /// 名探偵コナンスペシャル　『風林火山　迷宮の鎧武者』
        if (story.oaDateId === "20081103") story.story_num = "516";

        data.push({
          num: story.story_num,
          date:
            story.oaDateId.substring(0, 4) +
            "/" +
            story.oaDateId.substring(4, 6) +
            "/" +
            story.oaDateId.substring(6, 8),
          title: story.title,
          url: "https://www.ytv.co.jp/conan/archive/" + story.url,
        });
      });

      return data;
    });
};

// case.json
const newStories = async () => {
  return await fetch("https://www.ytv.co.jp/conan/data/case.json")
    .then((res) => res.json())
    .then((res) => {
      const stories = res.reverse();
      const data = [];

      stories.map((story) => {
        // リマスター版は除く
        if (!story.data.episode.includes("R")) {
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
  const older = await oldStories();
  const newer = await newStories();

  // 結合
  const stories = [...older, ...newer];

  // 書き込み
  fs.writeJsonSync("./dist/data.json", stories);
};

main();
