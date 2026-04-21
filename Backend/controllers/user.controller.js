export const getCurrentUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    const user = req.user;

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePic: user.profilePic?.url || "", // ✅ FIX
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};