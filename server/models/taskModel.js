import { TIMEOUT } from "dns";
import dbQuery from "../utils/dbQuery.js";

export const checkUserExists = async (email) => {
    const result = await dbQuery('SELECT email,uid,chatid FROM public."user" WHERE email=$1', [email]);
    return {
        exists: result.rowCount > 0,
        email: result.rowCount > 0 ? result.rows[0].email : null,
        uid: result.rowCount > 0 ? result.rows[0].uid : null,
        chatid: result.rowCount > 0 ? result.rows[0].chatid : null
    };
};

export const registerUserq = async (username, email, chatid) => {
    return await dbQuery('INSERT INTO public."user"(username, email, chatid) VALUES ($1, $2, $3)', [username, email, chatid]);
};

export const SetOTP = async (otp, uid) => {
    return await dbQuery('INSERT INTO public.optstore(uid, otp) VALUES ($1, $2)', [uid, otp]);
};

export const validateOTP = async (otp, uid) => {
    const result = await dbQuery("SELECT * FROM public.optstore WHERE uid = $1 AND otp = $2 AND date_time >= NOW() - INTERVAL '5 minutes' ORDER BY date_time DESC", [uid, otp]);
    return {
        exists: result.rowCount > 0,
        uid: result.rowCount > 0 ? result.rows[0].uid : null
    };
};

export const invalidOTP = async (otp, uid) => {
    return await dbQuery("DELETE FROM public.optstore WHERE uid = $1 AND otp = $2", [uid, otp]);
};

export const setSessionData = async (SessionData, uid) => {
    return await dbQuery('INSERT INTO public."sessionData"(uid, session) VALUES($1,$2);', [uid, SessionData]);
};

export const logOut = async (uid) => {
    return await dbQuery('DELETE FROM public."sessionData" WHERE uid=$1', [uid]);
};

export const getUsernameq = async (uid) => {
    return await dbQuery('SELECT uid, username, email, chatid, date_time FROM public."user" WHERE uid=$1;', [uid]);
};

export const isCategoryExist = async (category, uid) => {
    const result = await dbQuery('SELECT "Tcid" FROM public.taskcategory WHERE uid=$1 AND category=$2', [uid, category]);
    return { exists: result.rowCount > 0 };
};

export const insertCategoty = async (category, uid) => {
    return await dbQuery('INSERT INTO public.taskcategory(uid, category) VALUES ($1,$2)', [uid, category]);
};

export const getuserCategorys = async (uid) => {
    const result = await dbQuery('SELECT "Tcid", category, date_time FROM public.taskcategory WHERE uid=$1', [uid]);
    return result.rows;
};

export const isTaskExist = async (task, uid) => {
    const result = await dbQuery('SELECT "taskID" FROM public.task WHERE task=$1 AND uid=$2 AND DATE(date_time) = CURRENT_DATE;', [task, uid]);
    return { exists: result.rowCount > 0, tid: result.rowCount > 0 ? result.rows[0].taskID : 0 };
};

export const insertTasks = async (task, description, categoryID, uid) => {
    return await dbQuery('INSERT INTO public.task( uid, "taskCategoryID", task, discription) VALUES ($1,$2,$3,$4)', [uid, categoryID, task, description]);
};

export const GetUserTOTasks = async (uid) => {
    const result = await dbQuery('SELECT "taskID", uid, "taskCategoryID", task, completed, date_time, discription FROM public.task WHERE uid=$1 AND  DATE(date_time) = CURRENT_DATE', [uid]);
    return result.rows;
};
export const GetUserTOdayTasks = async (uid) => {
    const result = await dbQuery('SELECT "taskID", uid, "taskCategoryID", task, completed, date_time, discription FROM public.task WHERE uid=$1 AND  DATE(date_time) = CURRENT_DATE', [uid]);
    return { isMore: result.rowCount > 0 ? true : false, rows: result.rows };
};

export const GetUserDateList = async (uid) => {
    return await dbQuery("SELECT DISTINCT TO_CHAR(date_time::date, 'YYYY-MM-DD') AS task_date FROM public.task WHERE date_time::date < CURRENT_DATE AND uid = $1 ORDER BY task_date DESC;", [uid]);
};

export const GetUserTaskListByDate = async (uid, date) => {
    const result = await dbQuery('SELECT "taskID", uid, "taskCategoryID", task, completed, date_time, discription FROM public.task WHERE uid=$1 AND date_time::date = $2::date;', [uid, date]);
    return result.rows;
};

export const Deletetask = async (uid, taskID) => {
    return await dbQuery('DELETE FROM public.task WHERE uid=$1 AND "taskID"=$2;', [uid, taskID]);
};

export const updateSpecificTask = async (uid, taskID, task, discription, categoryID) => {
    return await dbQuery('UPDATE public.task SET "taskCategoryID"=$1, task=$2, discription=$3 WHERE  "taskID"=$4 AND uid=$5;', [categoryID, task, discription, taskID, uid]);
};

export const taskCompletedOrNotUpdate = async (uid, taskID, completed) => {
    return await dbQuery('UPDATE public.task SET completed=$1 WHERE "taskID"=$2 AND uid=$3;', [completed, taskID, uid]);
};

export const GetAllUserIDToSendNoficYesterDayTaskNotCompleted = async () => {
    const result = await dbQuery(`SELECT DISTINCT t.uid, t.task, t."taskID", u.chatid FROM public.task t JOIN public.user u ON t.uid = u.uid WHERE t.completed = false AND DATE(t.date_time) = CURRENT_DATE - INTERVAL '1 day';`);
    return { isRows: result.rowCount > 0, count: result.rowCount > 0 ? result.rowCount : 0, rows: result.rowCount > 0 ? result.rows : [] }
};
export const GetAllUserIDToSendNoficTaskNotCompleted = async () => {
    const result = await dbQuery('SELECT t.uid, t.task, t."taskID", u.chatid FROM public.task t JOIN public.user u ON t.uid = u.uid WHERE t.completed = false ORDER BY t.date_time DESC;');
    return { isRows: result.rowCount > 0, count: result.rowCount > 0 ? result.rowCount : 0, rows: result.rowCount > 0 ? result.rows : 0 }
};

export const StoreMessageToDB = async (uid, taskID, mess) => {
    return await dbQuery('INSERT INTO public.massege(uid, taskid, massege) VALUES ($1,$2,$3);', [uid, taskID, mess]);
};

export const chetidget = async (uid) => {
    return await dbQuery('SELECT chatid FROM public."user" WHERE uid=$1;', [uid]);
};

export const totaltask = async (uid) => {
    const result = await dbQuery("SELECT * FROM public.task WHERE uid=$1;", [uid]);
    return {
        count: result.rowCount > 0 ? result.rowCount : 0
    };
};

export const completetask = async (uid) => {
    const result = await dbQuery("SELECT * FROM public.task WHERE uid=$1 AND completed=true", [uid]);
    return {
        count: result.rowCount > 0 ? result.rowCount : 0
    };
};

export const pendingtask = async (uid) => {
    const result = await dbQuery("SELECT * FROM public.task WHERE uid=$1 AND completed=false", [uid]);
    return {
        count: result.rowCount > 0 ? result.rowCount : 0
    };
};

export const telegramalert = async (uid) => {
    const result = await dbQuery("SELECT * FROM public.massege WHERE uid=$1", [uid]);
    return {
        count: result.rowCount > 0 ? result.rowCount : 0
    };
};



