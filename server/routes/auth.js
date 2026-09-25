const express  = require('express');
const jwt      = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');
const { requireAdmin, requireSuperAdmin } = require('../middleware/auth');

const router = express.Router();

function jwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not configured');
  if (process.env.NODE_ENV === 'production' && secret.length < 32) {
    throw new Error('JWT_SECRET must contain at least 32 characters in production');
  }
  return secret;
}

// Bootstrap the first super admin only from deployment secrets.
async function ensureDefaultSuperAdmin() {
  try {
    const username = process.env.ADMIN_USERNAME?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;
    if (!username || !password) return;
    if (process.env.NODE_ENV === 'production' && password.length < 14) {
      throw new Error('ADMIN_PASSWORD must contain at least 14 characters in production');
    }

    const exists = await AdminUser.findOne({ username });
    if (!exists) {
      const superAdmin = new AdminUser({
        username,
        password,
        isSuperAdmin: true,
        permissions: 'view-write',
      });
      await superAdmin.save();
      console.log('Initial super admin created from environment configuration');
    }
  } catch (err) {
    console.error('Error ensuring default super admin:', err.message);
  }
}

// POST /api/auth/login - Login with username and password
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (typeof username !== 'string' || typeof password !== 'string' || !username.trim() || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    // Ensure default super admin exists
    await ensureDefaultSuperAdmin();

    const adminUser = await AdminUser.findOne({ username: username.trim().toLowerCase() });
    if (!adminUser || !adminUser.active) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordMatch = await adminUser.comparePassword(password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    adminUser.lastLogin = new Date();
    await adminUser.save();

    const token = jwt.sign(
      {
        adminUserId: adminUser._id,
        username: adminUser.username,
        isSuperAdmin: adminUser.isSuperAdmin,
        permissions: adminUser.permissions,
      },
      jwtSecret(),
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({ token, user: { username: adminUser.username, isSuperAdmin: adminUser.isSuperAdmin } });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/auth/verify - Check if a token is still valid
router.get('/verify', requireAdmin, (req, res) => {
  res.json({ valid: true, user: { username: req.adminUsername, isSuperAdmin: req.admin.isSuperAdmin } });
});

// ===== Super Admin Only Routes =====

// GET /api/auth/admins - Get all admin users (super admin only)
router.get('/admins', requireSuperAdmin, async (req, res) => {
  try {
    const admins = await AdminUser.find({})
      .select('-password')
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });
    res.json(admins);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch admins' });
  }
});

// POST /api/auth/admins - Create new admin user (super admin only)
router.post('/admins', requireSuperAdmin, async (req, res) => {
  try {
    const { username, password, permissions, isSuperAdmin } = req.body;
    
    if (typeof username !== 'string' || typeof password !== 'string' || !username.trim() || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }
    if (password.length < 12) {
      return res.status(400).json({ error: 'Password must contain at least 12 characters' });
    }

    const exists = await AdminUser.findOne({ username: username.toLowerCase() });
    if (exists) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const newAdmin = new AdminUser({
      username: username.trim().toLowerCase(),
      password,
      permissions: permissions || 'view-write',
      isSuperAdmin: isSuperAdmin || false,
      createdBy: req.adminId,
    });

    await newAdmin.save();
    res.json({ 
      message: 'Admin user created successfully',
      user: { username: newAdmin.username, isSuperAdmin: newAdmin.isSuperAdmin, permissions: newAdmin.permissions }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create admin user' });
  }
});

// PUT /api/auth/admins/:id - Update admin user (super admin only)
router.put('/admins/:id', requireSuperAdmin, async (req, res) => {
  try {
    const { password, permissions, isSuperAdmin, active } = req.body;
    
    const adminUser = await AdminUser.findById(req.params.id);
    if (!adminUser) {
      return res.status(404).json({ error: 'Admin user not found' });
    }

    if (password) adminUser.password = password;
    if (permissions) adminUser.permissions = permissions;
    if (typeof isSuperAdmin === 'boolean') adminUser.isSuperAdmin = isSuperAdmin;
    if (typeof active === 'boolean') adminUser.active = active;

    await adminUser.save();
    res.json({ message: 'Admin user updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update admin user' });
  }
});

// DELETE /api/auth/admins/:id - Delete admin user (super admin only)
router.delete('/admins/:id', requireSuperAdmin, async (req, res) => {
  try {
    if (req.params.id === req.adminId) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    await AdminUser.findByIdAndDelete(req.params.id);
    res.json({ message: 'Admin user deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete admin user' });
  }
});

module.exports = router;
