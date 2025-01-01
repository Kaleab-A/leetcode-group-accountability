import { Router } from 'express';
import {
  createGroup,
  joinGroup,
  removeUser,
  getGroup,
  refreshGroupStats
} from '../controllers/group.controller';

const router = Router();

router.post('/', createGroup); // POST /api/groups => create a new group
router.get('/:groupID', getGroup); // GET /api/groups/:groupID => get group data
router.post('/:groupID/join', joinGroup); // POST /api/groups/:groupID/join => add user
router.delete('/:groupID/user/:username', removeUser); // DELETE /api/groups/:groupID/user/username => remove user
router.post('/:groupID/refresh', refreshGroupStats); // POST /api/groups/:groupID/refresh => refresh stats

export default router;
