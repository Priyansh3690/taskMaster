import path from "path";
import { fileURLToPath } from "url";
import { sendTelegramMessage } from '../services/telegramService.js';

import {
    logOut,
    isCategoryExist,
    insertCategoty,
    getuserCategorys,
    insertTasks,
    isTaskExist,
    GetUserTOTasks,
    GetUserDateList,
    GetUserTaskListByDate,
    Deletetask,
    updateSpecificTask,
    taskCompletedOrNotUpdate,
    chetidget,
    totaltask,
    completetask,
    pendingtask,
    telegramalert,
    GetUserTOdayTasks
} from "../models/taskModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const redirectTOdeshbord = (req, res) => {
    res.sendFile(path.join(__dirname, '../..', 'client', 'deshbord.html'));
};

export const redirectTOtodayTask = (req, res) => {
    res.sendFile(path.join(__dirname, '../..', 'client', 'todayTask.html'));
};

export const redirectToPrevTask = (req, res) => {
    res.sendFile(path.join(__dirname, '../..', 'client', 't.html'));
};
export const redirectTOSetting = (req, res) => {
    res.sendFile(path.join(__dirname, '../..', 'client', 'setting.html'));
};

export const logout1 = async (req, res) => {
    const { token } = req.body;
    await logOut(token.uid);
    return res.json({ success: true });
};

export const InsertCategories = async (req, res) => {
    const { category, uid } = req.body;
    const result = await isCategoryExist(category, uid);
    if (result.exists) {
        return res.json({ success: false });
    }
    await insertCategoty(category, uid);
    return res.json({ success: true });
};

export const InsertTasks = async (req, res) => {
    const { task, description, categoryID, uid } = req.body;
    const result = await isTaskExist(task, uid);
    if (result.exists) {
        return res.json({ success: false });
    }
    await insertTasks(task, description, categoryID, uid);
    return res.json({ success: true });
};

export const GetUserCategory = async (req, res) => {
    const { uid } = req.body;
    const result = await getuserCategorys(uid);
    return res.json({ success: true, data: result });
};

export const GetUserTodayTasks = async (req, res) => {
    const { uid } = req.body;
    const resultOfCategory = await getuserCategorys(uid);
    const resultOfTasks = await GetUserTOTasks(uid);
    const finalArrOfBoj = resultOfCategory.map(val => {
        return {
            ...val,
            task: resultOfTasks.filter(task => task.taskCategoryID === val.Tcid)
        };
    }).filter(cat => cat.task.length > 0);

    return res.json({ success: true, todayTask: finalArrOfBoj });
};

export const GetUserPrevDates = async (req, res) => {
    const { uid } = req.body;
    const result = await GetUserDateList(uid);
    const onlydates = result.rows;
    return res.json({ success: true, date: onlydates });
};

export const getUserSpecificDateVisesTask = async (req, res) => {
    const { uid, date } = req.body;
    const resultOfCategory = await getuserCategorys(uid);
    const resultOfTasks = await GetUserTaskListByDate(uid, date);
    const finalArrOfBoj = resultOfCategory.map(val => {
        return {
            ...val,
            task: resultOfTasks.filter(task => task.taskCategoryID === val.Tcid)
        };
    }).filter(cat => cat.task.length > 0);
    return res.json({ success: true, tasks: finalArrOfBoj });
};

export const SpecificDeleteTask = async (req, res) => {
    const { uid, taskID } = req.body;
    await Deletetask(uid, taskID);
    return res.json({ success: true });
};

export const SpecificUpdateTask = async (req, res) => {
    const { uid, taskID, task, discription, categoryID } = req.body;
    const result = await isTaskExist(task, uid);
    if (result.exists) {
        if (result.tid == taskID) {
            await updateSpecificTask(uid, taskID, task, discription, categoryID);
            return res.json({ success: true });
        }
        return res.json({ success: false });
    }
    await updateSpecificTask(uid, taskID, task, discription, categoryID);
    return res.json({ success: true });
};

export const ToggleTaskCompletion = async (req, res) => {
    const { uid, taskID, completed } = req.body;
    await taskCompletedOrNotUpdate(uid, taskID, completed);
    res.json({ success: true });
};

export const getChatIDs = async (req, res) => {
    const { uid } = req.body;
    const result = await chetidget(uid);
    res.json({ success: true, chatid: result.rows[0].chatid });
};

export const sendExampleSMS = async (req, res) => {
    const { uid } = req.body;
    const result = await chetidget(uid);
    const text = "✅ Test Message from TaskMaster Bot Hello! This is a test SMS from your Telegram bot. If you received this, your bot is working fine. 🚀";
    await sendTelegramMessage(result.rows[0].chatid, text);
    res.json({ success: true });
};

export const fetchAALLCounts = async (req, res) => {
    const { token } = req.body;
    const totalTask = await totaltask(token);
    const completedTask = await completetask(token);
    const PendingTask = await pendingtask(token);
    const telegramAlert = await telegramalert(token);
    return res.json({ totalTask: totalTask.count, completedTask: completedTask.count, PendingTask: PendingTask.count, telegramAlert: telegramAlert.count });
};

export const fetchTodayTask = async (req, res) => {
    const { token } = req.body;
    const resultOfTasks = await GetUserTOdayTasks(token);
    if (resultOfTasks.isMore) {
        return res.json({ success: true, todayTask: resultOfTasks.rows });
    } else {
        return res.json({ success: false });
    }
};