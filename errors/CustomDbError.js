class CustomDbError extends Error {
    constructor(message, originalError, statusCode = 500){
        super(message);
        this.statusCode = statusCode;
        this.name = "DbError";
        this.originalError = originalError;
    }
}

module.exports = CustomDbError;