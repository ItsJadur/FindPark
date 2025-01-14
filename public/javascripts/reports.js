import { ObjectId } from "mongodb";
import { reports } from "../../config/mongoCollection.js";

export const createReport = async (parkName, reportContent) => {
	if (!parkName || !reportContent) {
		throw "Both parkName and reportContent need to be provided";
	}

	if (typeof parkName !== "string" || typeof reportContent !== "string") {
		throw "Both parkName and reportContent must be strings";
	}

	parkName = parkName.trim();
	reportContent = reportContent.trim();

	if (parkName.length === 0 || reportContent.length === 0) {
		throw "parkName and reportContent cannot be empty strings";
	}

	let newReport = {
		parkName,
		reportContent,
		date: new Date(),
	};

	const reportCollection = await reports();
	const insertInfo = await reportCollection.insertOne(newReport);
	if (!insertInfo.acknowledged || !insertInfo.insertedId) {
		throw "Could not add report";
	}

	return await reportCollection.findOne({ _id: insertInfo.insertedId });
};

export const getAllReports = async ({ searchPark, sortBy, filterByDate }) => {
    const reportCollection = await reports();
    let query = {};
    if (searchPark) {
        query.parkName = { $regex: searchPark, $options: 'i' };
    }
    if (filterByDate) {
        const date = new Date(filterByDate);
        // Set time to midnight to include the entire day
        date.setHours(0, 0, 0, 0);
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);
        query.date = {
            $gte: date,
            $lt: nextDay
        };
    }
    let sort = {};
    switch (sortBy) {
        case 'date_asc':
            sort.date = 1;
            break;
        case 'date_desc':
            sort.date = -1;
            break;
        case 'parkName_asc':
            sort.parkName = 1;
            break;
        case 'parkName_desc':
            sort.parkName = -1;
            break;
        default:
            sort.date = -1;
    }
    let reportList = await reportCollection.find(query).sort(sort).toArray();
    if (!reportList) throw "Could not get all reports";
    reportList = reportList.map((element) => {
        element._id = element._id.toString();
        return element;
    });
    return reportList;
};

export const getReport = async (reportId) => {
	if (!reportId) throw "You must provide an id to search for";
	if (typeof reportId !== "string") throw "Id must be a string";
	if (reportId.trim().length === 0)
		throw "Id cannot be an empty string or just spaces";
	reportId = reportId.trim();
	if (!ObjectId.isValid(reportId)) throw "Invalid object ID";
	const reportCollection = await reports();
	const report = await reportCollection.findOne({
		_id: new ObjectId(reportId),
	});
	if (report === null) throw "No report with that id";
	report._id = report._id.toString();
	return report;
};
