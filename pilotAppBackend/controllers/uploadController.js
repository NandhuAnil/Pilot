const path = require('path');

exports.uploadImage = (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

        return res.status(200).json({
            message: 'Image uploaded successfully',
            imageUrl: fileUrl,
            filename: req.file.filename,
        });
    } catch (error) {
        console.error('Image upload error:', error);
        return res.status(500).json({ message: 'Server error during upload' });
    }
};
