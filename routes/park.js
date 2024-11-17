import {Router} from "express";
export const router = Router();
router.route("/").get(async(req, res) => {
    res.render('home', {
        title: 'Park Finder'
    });
});