const Farmer = require("../models/farmer");

// POST /api/farmers/login - Login or register farmer
exports.loginFarmer = async (req, res) => {
  try {
    const { name, mobile, aadhaar, village, district } = req.body;

    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: "Mobile number is required",
      });
    }

    // Clean mobile number (digits only)
    const cleanMobile = String(mobile).replace(/\D/g, "").slice(-10);

    // Check if farmer already exists
    let farmer = await Farmer.findOne({ mobile: cleanMobile });

    if (!farmer) {
      // Generate a unique sequential farmer ID
      const count = await Farmer.countDocuments();
      const farmerId = `F${1001 + count}`;

      farmer = new Farmer({
        name: name || "Farmer",
        mobile: cleanMobile,
        farmerId,
        village: village || "Bhagalpur",
        district: district || "Bihar",
      });

      await farmer.save();
    } else if (name && farmer.name !== name) {
      // Update name if changed
      farmer.name = name;
      await farmer.save();
    }

    res.json({
      success: true,
      message: "Login successful",
      data: {
        farmerId: farmer.farmerId,
        name: farmer.name,
        mobile: farmer.mobile,
        village: farmer.village,
        district: farmer.district,
      },
    });
  } catch (error) {
    console.error("Farmer login error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to login/register farmer",
      error: error.message,
    });
  }
};

// GET /api/farmers/:farmerId - Get farmer profile
exports.getFarmer = async (req, res) => {
  try {
    const { farmerId } = req.params;
    const farmer = await Farmer.findOne({
      $or: [{ farmerId }, { mobile: farmerId }],
    });

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: "Farmer not found",
      });
    }

    res.json({
      success: true,
      data: farmer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
