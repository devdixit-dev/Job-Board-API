export const CheckEmployer = async (req, res, next) => {
  try {
    const user = req.user;

    if (user.userRole === 'employer') {
      next();
    }
    else {
      return res.status(400).json({
        message: 'Unauthorized access denied'
      });
    }
  }
  catch(err) {
    console.log(err);
    return res.status(500).json({
      message: `Error checking employer - ${err}`
    });
  }
}

export const CheckEmployee = async (req, res, next) => {
  try {
    const user = req.user;

    if (user.userRole === 'employee') {
      next();
    }
    else {
      return res.status(400).json({
        message: 'Unauthorized access denied'
      });
    }
  }
  catch(err) {
    console.log(err);
    return res.status(500).json({
      message: `Error checking employee - ${err}`
    });
  }
}