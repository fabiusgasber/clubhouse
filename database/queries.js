const CustomDbError = require("../errors/CustomDbError.js");
const CustomNotFoundError = require("../errors/CustomNotFoundError.js");
const pool = require("./pool.js");
const bcrypt = require("bcryptjs");

const findUserByEmail = async (email) => {
    try {
        const { rows } = await pool.query("SELECT * FROM users WHERE LOWER(username) = LOWER($1)", [email]);
        return rows[0];
    } catch (error) {
        throw new CustomDbError("could not fetch user with provided email", error);
    }
};

const findUserById = async (id) => {
    try {
        const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
        if(!rows.length) throw new CustomNotFoundError("could not find user in database")
        return rows[0];
    } catch (error) {
        if (error instanceof CustomNotFoundError) throw error;
        throw new CustomDbError("findUserById failed", error);
    }
};

const addUser = async (formData) => {
    try {
        const { firstName, lastName, email, password } = formData;
        const hashedPw = await bcrypt.hash(password, 10);
        await pool.query("INSERT INTO users(first_name, last_name, username, password, status) VALUES($1, $2, $3, $4, 'user')", [firstName, lastName, email, hashedPw])
    } catch (error) {
        if (error.code === "23505") {
            throw new CustomDbError("email already exists", error, 409);
        } else {
        throw new CustomDbError("could not add user to database", error, 500);
        }
    }
};

const promoteToMember = async (id) => {
    try {
        await pool.query("UPDATE users SET status = 'member' WHERE id = $1", [id]);
    } catch (error) {
        throw new CustomDbError("could not promote user to member", error);
    }
};

const promoteToAdmin = async (id) => {
    try {
        await pool.query("UPDATE users SET status = 'admin' WHERE id = $1", [id]);
    } catch (error) {
        throw new CustomDbError("could not promote user to admin", error);
    }
};

const addMessage = async (userId, title, message) => {
    try {
        await pool.query("INSERT INTO messages(user_id, title, text) VALUES ($1, $2, $3)", [userId, title, message]);
    } catch (error) {
        throw new CustomDbError("could not add message to database", error);
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
        throw new CustomDbError("could not find messages in database", error);
    }
};

const cancelMembership = async (id) => {
    try {
        await pool.query("UPDATE users SET status = 'user' WHERE id = $1", [id]);
    } catch (error) {
        throw new CustomDbError("could not cancel membership", error);
    }
};

const cancelAdmin = async (id) => {
    try {
        await pool.query("UPDATE users SET status = 'member' WHERE id = $1", [id]);
    } catch (error) {
        throw new CustomDbError("could not cancel administratorship", error);
    }
};

const deleteAccount = async (id) => {
    try {
        await pool.query("DELETE FROM users WHERE id = $1", [id]);
    } catch (error) {
        throw new CustomDbError("could not delete account from database", error);
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