const pool = require("./pool.js");
const bcrypt = require("bcryptjs");

const findUserByEmail = async (email) => {
    try {
        const { rows } = await pool.query("SELECT * FROM users WHERE LOWER(username) = LOWER($1)", [email]);
        return rows[0];
    } catch (error) {
        throw new Error (`findUserByEmail failed: ${error.message}`);
    }
};

const addUser = async (formData) => {
    try {
        const { firstName, lastName, email, password } = formData;
        const hashedPw = await bcrypt.hash(password, 10);
        await pool.query("INSERT INTO users(first_name, last_name, username, password, status) VALUES($1, $2, $3, $4, 'user')", [firstName, lastName, email, hashedPw])
    } catch (error) {
        throw new Error (`addUser failed: ${error.message}`);
    }
};

const promoteToMember = async (id) => {
    try {
        await pool.query("UPDATE users SET status = 'member' WHERE id = $1", [id]);
    } catch (error) {
        throw new Error (`promoteToMember: ${error.message}`);
    }
}

module.exports = {
    findUserByEmail,
    addUser,
    promoteToMember,
};