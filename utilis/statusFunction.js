export const responseStatus = (res, statusCode, status, message, data) => {
//   console.log(res, statusCode, status, message, data, "###################");

  const determinedStatus = status !== undefined ? status : statusCode <= 201;

  switch (statusCode) {
    case 200:
      if (data) {
        return res.status(statusCode).json({
          status: determinedStatus,
          data: data,
          message: message,
        });
      } else {
        return res.status(statusCode).json({
          status: determinedStatus,
          message: message,
        });
      }

    case 201:
    case 400:
    case 403:
      return res.status(statusCode).json({
        status: determinedStatus,
        message: message,
      });

    default:
      return res.status(400).json({
        status: false,
        message: "Something went wrong",
      });
  }
};
