const express = require("express");
const axios = require("axios");
const fs = require("fs");
const app = express();
const port = 3000;
const path = require("path");

const api =
  "http://ch13.codemaldives.com/api/title-box?key=32476SDGFHDSJFG7834$3894738974!"; // Replace with your API URL

const fetchDataAndSave = async () => {
  try {
    const response = await axios.get(api);

    const {
      total_votes,
      total_valid,
      total_void,
      voted_percentage,
      counted_boxes,
      candidates,
    } = response.data;

    fs.writeFileSync("data/total_votes.txt", JSON.stringify(total_votes));
    fs.writeFileSync("data/total_valid.txt", JSON.stringify(total_valid));
    fs.writeFileSync("data/total_void.txt", JSON.stringify(total_void));
    fs.writeFileSync("data/counted_boxes.txt", JSON.stringify(counted_boxes));

    fs.writeFileSync(
      "data/voted_percentage.txt",
      JSON.stringify(voted_percentage)
    );

    candidates.forEach((candidate, index) => {
      const candidateDir = path.join(__dirname, `data/${candidate["id"]}`);

      if (!fs.existsSync(candidateDir)) {
        fs.mkdirSync(candidateDir);
      }

      fs.writeFileSync(
        `data/${candidate["id"]}/votes.txt`,
        JSON.stringify(candidate["votes"])
      );

      fs.writeFileSync(
        `data/${candidate["id"]}/percent.txt`,
        JSON.stringify(candidate["votes_percent"])
      );
    });
    const currentTime = new Date();
    const options = {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "Asia/Karachi", // Set the timezone to GMT+5 (Asia/Karachi)
    };

    const formatter = new Intl.DateTimeFormat("en-US", options);
    const formattedTime = formatter.format(currentTime);
    console.log("Data Saved: ", formattedTime);
  } catch (error) {
    console.error("Error fetching and saving data:", error);
    setTimeout(fetchDataAndSave, 15000);
  }
};

setInterval(fetchDataAndSave, 15000);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);

  fetchDataAndSave();
});
