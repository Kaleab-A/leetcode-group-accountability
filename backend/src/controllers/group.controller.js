"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshGroupStats = exports.getGroup = exports.removeUser = exports.joinGroup = exports.createGroup = void 0;
const group_model_1 = __importDefault(require("../models/group.model"));
const uuid_1 = require("uuid");
const axios_1 = __importDefault(require("axios"));
// CREATE a new group
const createGroup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const groupID = (0, uuid_1.v4)().split('-')[0]; // short snippet of a UUID, or use a custom approach
        const groupName = req.body.groupName || 'New Group';
        const newGroup = yield group_model_1.default.create({
            groupID,
            groupName
        });
        res.status(201).json({
            message: 'Group created',
            groupID: newGroup.groupID
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
});
exports.createGroup = createGroup;
// JOIN a group
const joinGroup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { groupID } = req.params;
        const { username } = req.body;
        const group = yield group_model_1.default.findOne({ groupID });
        if (!group) {
            res.status(404).json({ error: 'Group not found' });
            return;
        }
        // Check if user already exists
        const existingMember = group.members.find(m => m.username === username);
        if (existingMember) {
            // Instead of returning 400, just respond with success & let frontend "log in" the user
            res.status(200).json({
                message: 'User already in group. Logging in user...',
                groupID
            });
            return;
        }
        // Otherwise, create minimal member info
        group.members.push({
            username,
            totalSolved: 0,
            acceptanceRate: 0,
            ranking: 0,
            submissionCalendar: {}
        });
        yield group.save();
        res.status(200).json({
            message: 'User added to group',
            groupID
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.joinGroup = joinGroup;
// REMOVE user from group
const removeUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { groupID, username } = req.params;
        const group = yield group_model_1.default.findOne({ groupID });
        if (!group) {
            res.status(404).json({ error: 'Group not found' });
            return;
        }
        group.members = group.members.filter(m => m.username !== username);
        yield group.save();
        res.status(200).json({ message: 'User removed', groupID });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.removeUser = removeUser;
// GET group data (for dashboard, etc.)
const getGroup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { groupID } = req.params;
        const group = yield group_model_1.default.findOne({ groupID });
        if (!group) {
            res.status(404).json({ error: 'Group not found' });
        }
        res.status(200).json(group);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.getGroup = getGroup;
// REFRESH stats for all members in a group
const refreshGroupStats = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { groupID } = req.params;
        const group = yield group_model_1.default.findOne({ groupID });
        if (!group) {
            res.status(404).json({ error: 'Group not found' });
            return;
        }
        // For each member, fetch new data from LeetCode stats
        for (const member of group.members) {
            const url = `https://leetcode-stats-api.herokuapp.com/${member.username}`;
            try {
                const response = yield axios_1.default.get(url);
                const data = response.data;
                console.log(`Fetched stats for user ${member.username}`, data);
                // Update member fields
                member.totalSolved = data.totalSolved || member.totalSolved;
                member.acceptanceRate = data.acceptanceRate || member.acceptanceRate;
                member.ranking = data.ranking || member.ranking;
                // submissionCalendar is an object, we can replace or merge
                member.submissionCalendar = data.submissionCalendar || {};
            }
            catch (err) {
                console.error(`Failed to update stats for user ${member.username}`, err);
                // Continue to next user
            }
        }
        yield group.save();
        res.status(200).json({ message: 'Group stats refreshed', groupID });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.refreshGroupStats = refreshGroupStats;
