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
  const total = easy + medium + hard;

  const ranking = user.profile?.ranking ?? "N/A";

  const max = Math.max(easy, medium, hard, 1);

  const easyW = (easy / max) * 180;
  const mediumW = (medium / max) * 180;
  const hardW = (hard / max) * 180;

  return `
<svg width="520" height="280" viewBox="0 0 520 280" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0d1117"/>
      <stop offset="100%" stop-color="#161b22"/>
    </linearGradient>

    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#facc15"/>
      <stop offset="100%" stop-color="#f97316"/>
    </linearGradient>

    <filter id="shadow">
      <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#000" flood-opacity="0.35"/>
    </filter>
  </defs>

  <style>
    .title { fill: #ffffff; font: 700 26px Arial, sans-serif; }
    .subtitle { fill: #8b949e; font: 500 14px Arial, sans-serif; }
    .label { fill: #c9d1d9; font: 600 15px Arial, sans-serif; }
    .value { fill: #ffffff; font: 700 20px Arial, sans-serif; }
    .small { fill: #8b949e; font: 500 13px Arial, sans-serif; }
  </style>

  <rect width="520" height="280" rx="18" fill="url(#bg)"/>

  <text x="28" y="42" class="title">LeetCode Stats</text>
  <text x="28" y="64" class="subtitle">@${user.username}</text>

  <rect x="340" y="24" width="150" height="52" rx="14" fill="#21262d" filter="url(#shadow)"/>
  <text x="360" y="47" class="small">Ranking</text>
  <text x="360" y="68" class="value">#${ranking}</text>

  <circle cx="125" cy="155" r="62" fill="none" stroke="#30363d" stroke-width="16"/>
  <circle cx="125" cy="155" r="62" fill="none" stroke="url(#accent)" stroke-width="16"
    stroke-linecap="round"
    stroke-dasharray="260 390"
    transform="rotate(-90 125 155)"/>

  <text x="125" y="148" text-anchor="middle" class="small">Solved</text>
  <text x="125" y="176" text-anchor="middle" class="title">${total}</text>

  <rect x="235" y="105" width="230" height="118" rx="16" fill="#21262d" filter="url(#shadow)"/>

  <text x="255" y="133" class="label">Easy</text>
  <rect x="330" y="121" width="180" height="10" rx="5" fill="#30363d"/>
  <rect x="330" y="121" width="${easyW}" height="10" rx="5" fill="#22c55e"/>
  <text x="255" y="157" class="value">${easy}</text>

  <text x="255" y="181" class="label">Medium</text>
  <rect x="330" y="169" width="180" height="10" rx="5" fill="#30363d"/>
  <rect x="330" y="169" width="${mediumW}" height="10" rx="5" fill="#f59e0b"/>
  <text x="255" y="205" class="value">${medium}</text>

  <text x="255" y="229" class="label">Hard</text>
  <rect x="330" y="217" width="180" height="10" rx="5" fill="#30363d"/>
  <rect x="330" y="217" width="${hardW}" height="10" rx="5" fill="#ef4444"/>
  <text x="255" y="253" class="value">${hard}</text>

  <text x="28" y="252" class="subtitle">Auto-updated with GitHub Actions</text>
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
