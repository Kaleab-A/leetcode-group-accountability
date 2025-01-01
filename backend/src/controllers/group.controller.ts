import { Request, RequestHandler, Response } from 'express';
import GroupModel from '../models/group.model';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

// CREATE a new group
export const createGroup: RequestHandler = async (req, res, next) => {
  try {
    const groupID = uuidv4().split('-')[0]; // short snippet of a UUID, or use a custom approach
    const groupName = req.body.groupName || 'New Group';

    const newGroup = await GroupModel.create({
      groupID,
      groupName
    });

    res.status(201).json({
      message: 'Group created',
      groupID: newGroup.groupID
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
      return;
  }
};

// JOIN group by groupID, add user
export const joinGroup: RequestHandler = async (req, res, next) => {
  try {
    const { groupID } = req.params;
    const { username } = req.body;

    const group = await GroupModel.findOne({ groupID });
    if (!group) {
        res.status(404).json({ error: 'Group not found' });
        return;
    }

    // Check if user already exists
    const existingMember = group.members.find(m => m.username === username);
    if (existingMember) {
      res.status(400).json({ error: 'User already in group' });
    }

    // Create minimal member info
    group.members.push({
      username,
      totalSolved: 0,
      acceptanceRate: 0,
      ranking: 0,
      submissionCalendar: {}
    });

    await group.save();
    res.status(200).json({ message: 'User added to group', groupID });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// REMOVE user from group
export const removeUser: RequestHandler = async (req, res, next) => {
  try {
    const { groupID, username } = req.params;
    const group = await GroupModel.findOne({ groupID });
    if (!group) {
        res.status(404).json({ error: 'Group not found' });
        return
    }

    group.members = group.members.filter(m => m.username !== username);
    await group.save();

    res.status(200).json({ message: 'User removed', groupID });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET group data (for dashboard, etc.)
export const getGroup: RequestHandler = async (req, res, next) => {
  try {
    const { groupID } = req.params;
    const group = await GroupModel.findOne({ groupID });
    if (!group) {
        res.status(404).json({ error: 'Group not found' });
    }

    res.status(200).json(group);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// REFRESH stats for all members in a group
export const refreshGroupStats: RequestHandler = async (req, res, next) => {
  try {
    const { groupID } = req.params;
    const group = await GroupModel.findOne({ groupID });
    if (!group) {
      res.status(404).json({ error: 'Group not found' });
      return;
    }

    // For each member, fetch new data from LeetCode stats
    for (const member of group.members) {
      const url = `https://leetcode-stats-api.herokuapp.com/${member.username}`;
      try {
        const response = await axios.get(url);
        const data = response.data;

        // Update member fields
        member.totalSolved = data.totalSolved || member.totalSolved;
        member.acceptanceRate = data.acceptanceRate || member.acceptanceRate;
        member.ranking = data.ranking || member.ranking;
        // submissionCalendar is an object, we can replace or merge
        member.submissionCalendar = data.submissionCalendar || {};
      } catch (err) {
        console.error(`Failed to update stats for user ${member.username}`, err);
        // Continue to next user
      }
    }

    await group.save();
    res.status(200).json({ message: 'Group stats refreshed', groupID });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
