const cycleService = require('../services/cycle.service');

const getCycles = async (req, res, next) => {
  try {
    const data = await cycleService.listCycles(req.user.userId, req.query);
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const createCycle = async (req, res, next) => {
  try {
    const cycle = await cycleService.createCycle(req.user.userId, req.body);
    res.status(201).json({
      success: true,
      data: cycle,
    });
  } catch (error) {
    next(error);
  }
};

const getCycleById = async (req, res, next) => {
  try {
    const cycle = await cycleService.getCycle(req.user.userId, req.params.id);
    res.status(200).json({
      success: true,
      data: cycle,
    });
  } catch (error) {
    next(error);
  }
};

const updateCycle = async (req, res, next) => {
  try {
    const cycle = await cycleService.updateCycle(
      req.user.userId,
      req.params.id,
      req.body
    );
    res.status(200).json({
      success: true,
      data: cycle,
    });
  } catch (error) {
    next(error);
  }
};

const deleteCycle = async (req, res, next) => {
  try {
    await cycleService.deleteCycle(req.user.userId, req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCycle,
  deleteCycle,
  getCycleById,
  getCycles,
  updateCycle,
};
