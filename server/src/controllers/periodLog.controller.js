const periodLogService = require('../services/periodLog.service');

const list = async (req, res, next) => {
  try {
    const periodLogs = await periodLogService.listPeriodLogs(
      req.user.userId,
      req.params.cycleId
    );
    res.status(200).json({ success: true, data: periodLogs });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const periodLog = await periodLogService.createPeriodLog(
      req.user.userId,
      req.params.cycleId,
      req.body
    );
    res.status(201).json({ success: true, data: periodLog });
  } catch (error) {
    next(error);
  }
};

const get = async (req, res, next) => {
  try {
    const periodLog = await periodLogService.getPeriodLog(
      req.user.userId,
      req.params.cycleId,
      req.params.periodLogId
    );
    res.status(200).json({ success: true, data: periodLog });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const periodLog = await periodLogService.updatePeriodLog(
      req.user.userId,
      req.params.cycleId,
      req.params.periodLogId,
      req.body
    );
    res.status(200).json({ success: true, data: periodLog });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    await periodLogService.deletePeriodLog(
      req.user.userId,
      req.params.cycleId,
      req.params.periodLogId
    );
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  get,
  list,
  remove,
  update,
};
