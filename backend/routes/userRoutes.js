const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  updateProfile,
  deleteUser,
  updateUserRole,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', protect, admin, getUsers);
router.put('/profile', protect, updateProfile);
router.route('/:id').get(protect, admin, getUserById).delete(protect, admin, deleteUser);
router.put('/:id/role', protect, admin, updateUserRole);

module.exports = router;
