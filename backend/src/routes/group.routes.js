"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const group_controller_1 = require("../controllers/group.controller");
const router = (0, express_1.Router)();
router.post('/', group_controller_1.createGroup); // POST /api/groups => create a new group
router.get('/:groupID', group_controller_1.getGroup); // GET /api/groups/:groupID => get group data
router.post('/:groupID/join', group_controller_1.joinGroup); // POST /api/groups/:groupID/join => add user
router.delete('/:groupID/user/:username', group_controller_1.removeUser); // DELETE /api/groups/:groupID/user/username => remove user
router.post('/:groupID/refresh', group_controller_1.refreshGroupStats); // POST /api/groups/:groupID/refresh => refresh stats
exports.default = router;
