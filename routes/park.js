import { Router } from "express";
import { createReport, getAllReports } from "../public/javascripts/reports.js";
import { fetchParks } from "../public/javascripts/apidata.js";
export const router = Router();
router.route("/").get(async (req, res) => {
  res.render("home", {
    title: "Park Finder",
  });
});

router.route("/reports").get(async (req, res) => {
  try {
    const reports = await getAllReports();
    res.render("reports", {
      title: "Reports",
      reports,
    });
  } catch (e) {
    res.status(500).send(e);
  }
});



router.route("/submit-report").post(async (req, res) => {
  const { parkName, reportContent } = req.body;
  try {
    await createReport(parkName, reportContent);
    res.redirect("/reports");
  } catch (e) {
    res.status(400).send(e);
  }
});

router.route("/nat").get(async (req, res) => {
  const stateCode = req.query.state || "NJ"; 
  try {
    const parks = await fetchParks(stateCode); 
    res.render("nat", {
      title: `Parks in ${stateCode}`,
      parks, 
    });
  } catch (e) {
    res.status(500).send("Error fetching parks: " + error.message);
  }
})

export default router;
