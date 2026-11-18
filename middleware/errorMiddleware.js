const errorHandler = (err, req, res, next) => {
    // Use the status set by the controller, or by Express itself (e.g. 400 for invalid JSON)
    const statusCode = res.statusCode >= 400
        ? res.statusCode
        : err.status || (err.name === "ValidationError" ? 400 : 500);
    res.status(statusCode);
    res.json({
        title: getErrorTitle(statusCode),
        message: err.message,
        stackTrace: err.stack,
    });
};

const getErrorTitle = (statusCode) => {
    switch (statusCode) {
        case 400:
            return "Validation Failed";
        case 401:
            return "Unauthorized";
        case 403:
            return "Forbidden";
        case 404:
            return "Not Found";
        case 500:
        default:
            return "Server Error";
    }
};

module.exports = errorHandler;