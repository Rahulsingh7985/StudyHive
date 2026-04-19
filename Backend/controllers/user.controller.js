// controllers/user.controller.js

// 👉 Get current logged-in user
export const getCurrentUser = async (req, res) => {
  try {
    // req.user comes from authMiddleware (protect)
    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    res.status(200).json(req.user);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};