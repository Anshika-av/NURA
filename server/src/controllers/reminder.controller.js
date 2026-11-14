const reminderService = require('../services/reminder.service');

const list = async (req, res, next) => {
  try {
    const data = await reminderService.listReminders(req.user.userId, req.query);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const reminder = await reminderService.createReminder(
      req.user.userId,
      req.body
    );
    res.status(201).json({ success: true, data: reminder });
  } catch (error) {
    next(error);
  }
};

const get = async (req, res, next) => {
  try {
    const reminder = await reminderService.getReminder(
      req.user.userId,
      req.params.id
    );
    res.status(200).json({ success: true, data: reminder });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const reminder = await reminderService.updateReminder(
      req.user.userId,
      req.params.id,
      req.body
    );
    res.status(200).json({ success: true, data: reminder });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    await reminderService.deleteReminder(req.user.userId, req.params.id);
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
