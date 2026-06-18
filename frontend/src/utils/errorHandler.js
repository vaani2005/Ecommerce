/**
 * Extract validation errors from API response
 * @param {Error} error - Axios error object
 * @returns {Object} { fieldErrors: {}, message: "" }
 */
export const getErrorDetails = (error) => {
  const response = error.response;

  if (!response) {
    return {
      fieldErrors: {},
      message: "Network error. Please check your connection.",
    };
  }

  const data = response.data;

  // Handle validation errors (400)
  if (response.status === 400 && data.errors) {
    return {
      fieldErrors: data.errors,
      message: data.message || "Validation failed",
    };
  }

  // Handle other HTTP errors
  if (data.message) {
    return {
      fieldErrors: {},
      message: data.message,
    };
  }

  // Fallback error message
  const statusMessages = {
    401: "Unauthorized. Please login again.",
    403: "You don't have permission to perform this action.",
    404: "Resource not found.",
    409: "Conflict. This resource may already exist.",
    500: "Server error. Please try again later.",
  };

  return {
    fieldErrors: {},
    message: statusMessages[response.status] || `Error: ${response.statusText}`,
  };
};

/**
 * Format field error message
 * @param {Array|String} errors - Error messages
 * @returns {String} Formatted error message
 */
export const formatFieldError = (errors) => {
  if (Array.isArray(errors)) {
    return errors[0]; // Return first error message
  }
  return errors || "Invalid field";
};

/**
 * Check if a field has errors
 * @param {Object} fieldErrors - Field errors object
 * @param {String} fieldName - Field name
 * @returns {Boolean}
 */
export const hasFieldError = (fieldErrors, fieldName) => {
  return fieldErrors && fieldErrors[fieldName];
};

/**
 * Get error message for a field
 * @param {Object} fieldErrors - Field errors object
 * @param {String} fieldName - Field name
 * @returns {String}
 */
export const getFieldError = (fieldErrors, fieldName) => {
  if (!fieldErrors || !fieldErrors[fieldName]) {
    return "";
  }
  return formatFieldError(fieldErrors[fieldName]);
};
