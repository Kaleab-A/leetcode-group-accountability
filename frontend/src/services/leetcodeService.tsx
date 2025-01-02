import axios from 'axios';

const LEETCODE_API = 'https://leetcode-stats-api.herokuapp.com';

export async function getLeetCodeStats(username: string) {
  const url = `${LEETCODE_API}/${username}`;
  const response = await axios.get(url);
  return response.data;
}
