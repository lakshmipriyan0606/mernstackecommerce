export const checkToken = (token,res) => {
  if (!token) {
    return res.status(400).json({
      status: false,
      message: "Please login to access",
    });
  }
};


export const checkAdmin = (req,res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({
          status: false,
          message: "Unauthorized access",
        });
      }
}


