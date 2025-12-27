// Standardized response format for all API endpoints
function successResponse(data, message = null) {
    return {
        success: true,
        data: data,
        ...(message && { message })
    };
}

function errorResponse(error, statusCode = 400) {
    return {
        success: false,
        error: typeof error === 'string' ? error : error.message || 'An error occurred'
    };
}

module.exports = {
    successResponse,
    errorResponse
};
