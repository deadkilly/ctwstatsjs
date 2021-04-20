
const NICKNAME_REGEX = /^[a-zA-Z0-9_]{3,16}$/;
const isValidNickname = string => NICKNAME_REGEX.test(string);

module.exports = {
	isValidNickname
};
