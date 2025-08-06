exports.getChecklist = (req, res) => {
  const checklist = [
    { step: 1, description: "Check appointment details" },
    { step: 2, description: "Prepare consultation notes" },
    { step: 3, description: "Initiate video call" }
  ];
  res.status(200).json({ success: true, checklist });
};
