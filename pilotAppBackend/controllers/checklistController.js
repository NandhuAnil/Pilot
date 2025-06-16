const fs = require('fs');
const path = require('path');
const checklistFile = path.join(__dirname, '../database/checklistData.json');

const getChecklistData = () => {
  const data = fs.readFileSync(checklistFile, 'utf8');
  return JSON.parse(data);
};

// Save JSON file
const saveChecklistData = (data) => {
  fs.writeFileSync(checklistFile, JSON.stringify(data, null, 2));
};

// POST /api/checklist/save
exports.saveChecklist = (req, res) => {
  const { username, pilotInfo, weatherReport, checklist } = req.body;

  if (!username || !pilotInfo || !weatherReport || !Array.isArray(checklist)) {
    return res.status(400).json({ message: 'Invalid or missing data' });
  }

  const allData = getChecklistData();

  if (!allData[username]) {
    allData[username] = [];
  }

  allData[username].push({ pilotInfo, weatherReport, checklist });
  saveChecklistData(allData);

  res.status(200).json({ message: 'Data saved successfully' });
};

// GET /api/checklist/:username
exports.getChecklist = async (req, res) => {
  const username = req.params.username;
  const allData = await getChecklistData();

  if (!allData[username]) {
    return res.status(404).json({ message: 'No data found for user' });
  }

  res.status(200).json({ username, data: allData[username] });
};

exports.getAllChecklists = async (req, res) => {
  try {
    const allData = getChecklistData(); // not await — it's sync
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(allData);
  } catch (error) {
    console.error("Error getting checklists:", error);
    res.status(500).json({ message: "Error reading checklist data" });
  }
};
