const express = require("express");
const axios = require("axios");
const config = require("config");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const checkObjectId = require("../../middleware/checkObjectId");

const Profile = require("../../models/Profile");
const User = require("../../models/User");
const Post = require("../../models/Post");

router.get("/me", auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({
			user: req.user.id,
		}).populate("user", ["name", "avatar"]);

		if (!profile) {
			return res.status(400).json({ msg: "There is no profile for this user" });
		}

		res.json(profile);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

router.post(
	"/",
	auth,
	[
		check("status", "Status is required").notEmpty(),
		check("skills", "Skills is required").notEmpty(),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		// destructure the request
		const {
			company,
			website,
			location,
			bio,
			status,
			skills,
			youtube,
			twitter,
			instagram,
			linkedin,
			facebook,
		} = req.body;

		// build a profile
		const profileFields = {};
		profileFields.user = req.user.id;
		if (company) profileFields.company = company;
		if (website) profileFields.website = website;
		if (location) profileFields.location = location;
		if (bio) profileFields.bio = bio;
		if (status) profileFields.status = status;
		if (skills) {
			profileFields.skills = Array.isArray(skills)
				? skills
				: skills.split(",").map((skill) => " " + skill.trim());
		}

		// Build socialFields object
		profileFields.social = {};
		if (youtube) profileFields.youtube = youtube;
		if (twitter) profileFields.twitter = twitter;
		if (facebook) profileFields.facebook = facebook;
		if (linkedin) profileFields.linkedin = linkedin;
		if (instagram) profileFields.instagram = instagram;

		try {
			let profile = await Profile.findOne({ user: req.user.id });

			//update
			if (profile) {
				profile = await Profile.findOneAndUpdate(
					{ user: req.user.id },
					{ $set: profileFields },
					{ new: true }
				);

				return res.json(profile);
			}

			//Create
			profile = new Profile(profileFields);

			await profile.save();
			res.json(profile);
		} catch (err) {
			console.error(err.message);
			return res.status(500).send("Server Error");
		}
	}
);

router.get("/", async (req, res) => {
	try {
		const profiles = await Profile.find().populate("user", ["name", "avatar"]);
		res.json(profiles);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

router.get(
	"/user/:user_id",
	checkObjectId("user_id"),
	async ({ params: { user_id } }, res) => {
		try {
			const profile = await Profile.findOne({
				user: user_id,
			}).populate("user", ["name", "avatar"]);

			if (!profile) return res.status(400).json({ msg: "Profile not found" });

			return res.json(profile);
		} catch (err) {
			console.error(err.message);
			return res.status(500).json({ msg: "Server error" });
		}
	}
);

router.delete("/", auth, async (req, res) => {
	try {
		// Remove user posts
		await Post.deleteMany({ user: req.user.id }),
			// Remove profile
			await Profile.findOneAndRemove({ user: req.user.id });
		// Remove user
		await User.findOneAndRemove({ _id: req.user.id });

		res.json({ msg: "User deleted" });
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

router.put(
	"/experience",
	auth,
	[
		check("title", "Title is required").notEmpty(),
		check("company", "Company is required").notEmpty(),
		check("from", "From date is required and needs to be from the past")
			.notEmpty()
			.custom((value, { req }) => (req.body.to ? value < req.body.to : true)),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { title, company, location, from, to, current, description } =
			req.body;

		const newExp = {
			title,
			company,
			location,
			from,
			to,
			current,
			description,
		};

		try {
			const profile = await Profile.findOne({ user: req.user.id });

			profile.experience.unshift(newExp);

			await profile.save();

			res.json(profile);
		} catch (err) {
			console.error(err.message);
			res.status(500).send("Server Error");
		}
	}
);

router.delete("/experience/:exp_id", auth, async (req, res) => {
	try {
		const foundProfile = await Profile.findOne({ user: req.user.id });

		//Get remove index
		const removeIndex = foundProfile.experience
			.map((item) => item.id)
			.indexOf(req.params.exp_id);

		foundProfile.experience.splice(removeIndex, 1);

		await foundProfile.save();
		return res.status(200).json(foundProfile);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ msg: "Server error" });
	}
});

router.put(
	"/education",
	auth,
	[
		check("school", "School is required").notEmpty(),
		check("degree", "Degree is required").notEmpty(),
		check("fieldofstudy", "Field of study is required").notEmpty(),
		check("from", "From date is required and needs to be from the past")
			.notEmpty()
			.custom((value, { req }) => (req.body.to ? value < req.body.to : true)),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { school, degree, fieldofstudy, from, to, current, description } =
			req.body;

		const newEdu = {
			school,
			degree,
			fieldofstudy,
			from,
			to,
			current,
			description,
		};

		try {
			const profile = await Profile.findOne({ user: req.user.id });

			profile.education.unshift(newEdu);

			await profile.save();

			res.json(profile);
		} catch (err) {
			console.error(err.message);
			res.status(500).send("Server Error");
		}
	}
);

router.delete("/education/:edu_id", auth, async (req, res) => {
	try {
		const foundProfile = await Profile.findOne({ user: req.user.id });

		//Get remove index
		const removeIndex = foundProfile.education
			.map((item) => item.id)
			.indexOf(req.params.edu_id);

		foundProfile.education.splice(removeIndex, 1);

		await foundProfile.save();
		return res.status(200).json(foundProfile);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ msg: "Server error" });
	}
});

module.exports = router;
