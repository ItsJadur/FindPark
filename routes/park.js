import { Router } from "express";
import { createReport, getAllReports } from "../public/javascripts/reports.js";
import { fetchParks } from "../public/javascripts/apidata.js";
import axios from "axios";
export const router = Router();
router.route("/").get(async (req, res) => {
	res.render("home", {
		title: "Park Finder",
	});
});

router.route("/reports").get(async (req, res) => {
	try {
        const { searchPark, sortBy, filterByDate } = req.query;
        // Build query parameters with defaults
        const queryParams = {
            searchPark: searchPark || '',
            sortBy: sortBy || 'date_desc',
            filterByDate: filterByDate || ''
        };
        const reports = await getAllReports(queryParams);
        res.render("reports", {
            title: "Reports",
            reports,
            searchPark: queryParams.searchPark,
            sortBy: queryParams.sortBy,
            filterByDate: queryParams.filterByDate
        });
    } catch (e) {
        console.error("Error fetching reports:", e);
        res.status(500).send("Internal Server Error");
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
	const limit = 10;
	const page = parseInt(req.query.page) || 1;
	const start = (page - 1) * limit;

	try {
		const parks = await fetchParks({ stateCode, limit, start });

		res.render("nat", {
			title: `Parks in ${stateCode}`,
			parks,
			state: stateCode,
			currentPage: page,
			nextPage: page + 1,
			prevPage: page > 1 ? page - 1 : null,
		});
	} catch (e) {
		console.log("Error fetching parks:", e);
		res.status(500).send("Error fetching parks: " + e.message);
	}
});

router.route("/nat/:parkCode").get(async (req, res) => {
	const parkCode = req.params.parkCode;
	try {
		const parks = await fetchParks({ parkCode });
		const park = parks[0];
		if (!park) {
			return res.status(404).send("Park not found");
		}

		res.render("natDetails", {
			title: park.fullName,
			park,
		});
	} catch (e) {
		console.log("Error fetching park details:", e);
		res.status(500).send("Error fetching park details: " + e.message);
	}
});

export default router;
