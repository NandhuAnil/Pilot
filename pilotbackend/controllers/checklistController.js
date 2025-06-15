const fs = require('fs');
const path = require('path');
const checklistFile = path.join(__dirname, '../database/checklistData.json');

// Read JSON file
const getChecklistData = () => {
  const data = fs.readFileSync(checklistFile, 'utf8');
  return JSON.parse(data);
};

// Save JSON file
const saveChecklistData = (data) => {
  try {
    fs.writeFileSync(checklistFile, JSON.stringify(data, null, 2));
    console.log('✅ Checklist data saved');
  } catch (err) {
    console.error('❌ Error writing checklist file:', err);
  }
};

// POST /api/checklist/save
exports.saveChecklist = async (req, res) => {
  const { username, pilotInfo, weatherReport, checklist } = req.body;

  if (!username || !pilotInfo || !weatherReport || !Array.isArray(checklist)) {
    return res.status(400).json({ message: 'Invalid or missing data' });
  }

  const allData = await getChecklistData();

  if (!allData[username]) {
    allData[username] = [];
  }

  allData[username].push({ pilotInfo, weatherReport, checklist });
  saveChecklistData(allData);

  res.status(200).json({ message: 'Data saved successfully' });
};

// GET /api/checklist/:username
exports.getChecklist = async (req, res) => {
  const { username } = req.params;
  const allData = await getChecklistData();

  const userEntries = allData[username];

  if (!userEntries || userEntries.length === 0) {
    return res.status(404).json({ message: 'No checklist found for user' });
  }

  const latestEntry = userEntries[userEntries.length - 1];
  return res.status(200).json(latestEntry); // 🔁 return the object directly
};

exports.getAllChecklists = (req, res) => {
  try {
    const allData = getChecklistData();
    res.status(200).json(allData);
  } catch (error) {
    res.status(500).json({ message: "Error reading checklist data" });
  }
};