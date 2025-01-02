import axios from 'axios';

const API_BASE = 'http://localhost:4000/api/groups';

export async function createGroup(groupName?: string) {
  const response = await axios.post(API_BASE, { groupName });
  return response.data; // { message, groupID }
}

export async function joinGroup(groupID: string, username: string) {
  const response = await axios.post(`${API_BASE}/${groupID}/join`, { username });
  return response.data;
}

export async function getGroup(groupID: string) {
  const response = await axios.get(`${API_BASE}/${groupID}`);
  return response.data; // entire group data
}

export async function removeUser(groupID: string, username: string) {
  const response = await axios.delete(`${API_BASE}/${groupID}/user/${username}`);
  return response.data;
}

export async function refreshGroupStats(groupID: string) {
  const response = await axios.post(`${API_BASE}/${groupID}/refresh`);
  return response.data;
}
