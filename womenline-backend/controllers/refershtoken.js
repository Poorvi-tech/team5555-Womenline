const jwt = require('jsonwebtoken');
exports.refertoken =  (req, res) => {
    const refreshToken = req.cookies.refreshToken; 

    if (!refreshToken) {
        return res.status(401).json({ message: "No refresh token provided" });
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        // If the refresh token is valid, issue a new access token
        const newAccessToken = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Send the new access token in the response
        res.json({ accessToken: newAccessToken });
    });
};