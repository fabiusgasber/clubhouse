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

const findUserById = async (id) => {
    try {
        const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
        return rows[0];
    } catch (error) {
        throw new Error (`findUserById: ${error.message}`);
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
};

const promoteToAdmin = async (id) => {
    try {
        await pool.query("UPDATE users SET status = 'admin' WHERE id = $1", [id]);
    } catch (error) {
        throw new Error (`promoteToAdmin: ${error.message}`);
    }
};

const addMessage = async (userId, title, message) => {
    try {
        await pool.query("INSERT INTO messages(user_id, title, text) VALUES ($1, $2, $3)", [userId, title, message]);
    } catch (error) {
        throw new Error (`addMessage: ${error.message}`);
    }
};

const getMessages = async () => {
    try {
        const { rows } = await pool.query(
            `SELECT first_name, last_name, title, text, timestamp 
            FROM users 
            JOIN messages ON(users.id=messages.user_id)
            ORDER BY messages.timestamp DESC;`
        );
        return rows;
    } catch (error) {
        throw new Error (`getMessages: ${error.message}`);
    }
};

const cancelMembership = async (id) => {
    try {
        await pool.query("UPDATE users SET status = 'user' WHERE id = $1", [id]);
    } catch (error) {
        throw new Error (`cancelMembership: ${error.message}`);
    }
};

const cancelAdmin = async (id) => {
    try {
        await pool.query("UPDATE users SET status = 'member' WHERE id = $1", [id]);
    } catch (error) {
        throw new Error (`cancelAdmin: ${error.message}`);
    }
};

const deleteAccount = async (id) => {
    try {
        await pool.query("DELETE FROM users WHERE id = $1", [id]);
    } catch (error) {
        throw new Error (`deleteAccount: ${error.message}`);
    }
};

module.exports = {
    findUserByEmail,
    findUserById,
    addUser,
    promoteToMember,
    addMessage,
    getMessages,
    promoteToAdmin,
    cancelAdmin,
    cancelMembership,
    deleteAccount,
};