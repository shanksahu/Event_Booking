function responseHandler(res, result) {
  let { success, statusCode, data, errors, message } = result
  const response = { success, statusCode, data, errors, message };
  if (data !== undefined && data !== null) {
    response.data = data;
  }
  if (errors !== undefined && errors !== null) {
    response.errors = errors;
  }
  res.status(statusCode).json(response);
}

function responseStructure(code,success,message, data,){
    return {
              statusCode:code,
              success:success,
              message:message,
              data:data,
            }
} 

module.exports = {responseStructure, responseHandler};
