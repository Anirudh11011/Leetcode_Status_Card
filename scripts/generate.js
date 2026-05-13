import axios from "axios";
import fs from "fs";

const username = "anirudh11011";

const query = `
query getUserProfile($username: String!) {
  matchedUser(username: $username) {
    username
    submitStatsGlobal {
      acSubmissionNum {
        difficulty
        count
      }
    }
    profile {
      ranking
      reputation
    }
  }
}
`;

async function fetchStats() {
  const res = await axios.post(
    "https://leetcode.com/graphql",
    {
      query,
      variables: { username }
    },
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );

  return res.data.data.matchedUser;
}

function generateSVG(user) {
  const stats = user.submitStatsGlobal.acSubmissionNum;

  const easy = stats.find(x => x.difficulty === "Easy")?.count || 0;
  const medium = stats.find(x => x.difficulty === "Medium")?.count || 0;
  const hard = stats.find(x => x.difficulty === "Hard")?.count || 0;

  return `
<svg width="400" height="220" xmlns="http://www.w3.org/2000/svg">
<style>
.title { fill: white; font-size: 24px; font-weight: bold; }
.text { fill: #ccc; font-size: 18px; }
.bg { fill: #0d1117; }
</style>

<rect width="100%" height="100%" class="bg"/>

<text x="20" y="40" class="title">LeetCode Stats</text>

<text x="20" y="90" class="text">Easy: ${easy}</text>
<text x="20" y="130" class="text">Medium: ${medium}</text>
<text x="20" y="170" class="text">Hard: ${hard}</text>

<text x="20" y="210" class="text">Ranking: ${user.profile.ranking}</text>
</svg>
`;
}

async function main() {
  const user = await fetchStats();
  const svg = generateSVG(user);

  fs.mkdirSync("assets", { recursive: true });
  fs.writeFileSync("assets/leetcode.svg", svg);

  console.log("SVG updated");
}

main();
