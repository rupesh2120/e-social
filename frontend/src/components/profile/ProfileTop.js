import React from "react";
import PropTypes from "prop-types";

const ProfileTop = ({
	profile: {
		status,
		company,
		location,
		website,
		social,
		user: { name, avatar },
	},
}) => {
	return (
		<div className="profile-top bg-primary p-2">
			<img className="round-img my-1" src={avatar} alt="" />
			<h1 className="large">{name}</h1>
			<p className="lead">
				{status} {company ? <span> at {company}</span> : null}
			</p>
			<p>{location ? <span>{location}</span> : null}</p>
			<div className="icons my-1">
				{website ? (
					<a href={website} target="_blank" rel="noopener noreferrer">
						<i className="fas fa-globe fa-2x" />
					</a>
				) : null}
				{social && social.facebook && (
					<a
						//key={key}
						href={social.facebook}
						target="_blank"
						rel="noopener noreferrer"
					>
						<i className={"fab fa-facebook fa-2x"}></i>
					</a>
				)}
				{social && social.youtube && (
					<a
						//key={key}
						href={social.youtube}
						target="_blank"
						rel="noopener noreferrer"
					>
						<i className={"fab fa-youtube fa-2x"}></i>
					</a>
				)}
				{social && social.linkedin && (
					<a
						//key={key}
						href={social.linkedin}
						target="_blank"
						rel="noopener noreferrer"
					>
						<i className={"fab fa-linkedin fa-2x"}></i>
					</a>
				)}
				{social && social.instagram && (
					<a
						//key={key}
						href={social.instagram}
						target="_blank"
						rel="noopener noreferrer"
					>
						<i className={"fab fa-instagram fa-2x"}></i>
					</a>
				)}
				{/* {social
					? Object.entries(social)
							.filter(([_, value]) => value)
							.map(([key, value]) => (
								<a
									key={key}
									href={value}
									target="_blank"
									rel="noopener noreferrer"
								>
									<i className={`fab fa-${key} fa-2x`}></i>
								</a>
							))
					: null} */}
			</div>
		</div>
	);
};

ProfileTop.propTypes = {
	profile: PropTypes.object.isRequired,
};

export default ProfileTop;
