const {responseHandler} = require('./responseHandler');
const { validationResult } = require('express-validator');

const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      
      return responseHandler(res, 
         {
              statusCode:422,
              sucess:false,
              message:'Validation error',
              errors:errors.array(),
            }
    )
  }
    next();
  };
};

module.exports = {
  validate
};
