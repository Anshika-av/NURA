const getCycles = async (req, res, next) => {
  try {
    res.status(501).json({
      success: false,
      message: 'Fetching cycles is not implemented yet',
    });
  } catch (error) {
    next(error);
  }
};

const createCycle = async (req, res, next) => {
  try {
    res.status(501).json({
      success: false,
      message: 'Creating a cycle is not implemented yet',
    });
  } catch (error) {
    next(error);
  }
};

const getCycleById = async (req, res, next) => {
  try {
    res.status(501).json({
      success: false,
      message: 'Fetching this cycle is not implemented yet',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCycles,
  createCycle,
  getCycleById,
};
