const symptomLogService = require('../services/symptomLog.service');

const listSymptoms = async (req, res, next) => {
  try {
    const symptoms = await symptomLogService.listSymptoms();
    res.status(200).json({ success: true, data: symptoms });
  } catch (error) {
    next(error);
  }
};

const listLogs = async (req, res, next) => {
  try {
    const data = await symptomLogService.listSymptomLogs(
      req.user.userId,
      req.query
    );
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

const createLog = async (req, res, next) => {
  try {
    const log = await symptomLogService.createSymptomLog(
      req.user.userId,
      req.body
    );
    res.status(201).json({ success: true, data: log });
  } catch (error) {
    next(error);
  }
};

const getLog = async (req, res, next) => {
  try {
    const log = await symptomLogService.getSymptomLog(
      req.user.userId,
      req.params.id
    );
    res.status(200).json({ success: true, data: log });
  } catch (error) {
    next(error);
  }
};

const updateLog = async (req, res, next) => {
  try {
    const log = await symptomLogService.updateSymptomLog(
      req.user.userId,
      req.params.id,
      req.body
    );
    res.status(200).json({ success: true, data: log });
  } catch (error) {
    next(error);
  }
};

const deleteLog = async (req, res, next) => {
  try {
    await symptomLogService.deleteSymptomLog(
      req.user.userId,
      req.params.id
    );
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createLog,
  deleteLog,
  getLog,
  listLogs,
  listSymptoms,
  updateLog,
};
