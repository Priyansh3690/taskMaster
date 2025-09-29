import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { redirectTOdeshbord, redirectTOtodayTask, redirectToPrevTask, logout1, InsertCategories, GetUserCategory, InsertTasks, GetUserTodayTasks, GetUserPrevDates, getUserSpecificDateVisesTask, SpecificDeleteTask, SpecificUpdateTask, ToggleTaskCompletion, redirectTOSetting, getChatIDs, sendExampleSMS, fetchAALLCounts, fetchTodayTask } from '../controller/D_controller.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.get('/home', redirectTOdeshbord);
router.get('/task', redirectTOtodayTask);
router.get('/setting', redirectTOSetting);
router.get(['/t', '/t/:date'], redirectToPrevTask);

router.post('/logout', logout1);
router.post('/AddCategories', InsertCategories);
router.post('/AddTask', InsertTasks);
router.post('/GetUserCategory', GetUserCategory);
router.post('/GetUserTodayTasks', GetUserTodayTasks);
router.post('/GetUserPrevDates', GetUserPrevDates);
router.post('/getUserSpecificDateVisesTask', getUserSpecificDateVisesTask);
router.post('/DeleteTask', SpecificDeleteTask);
router.post('/UpdateTask', SpecificUpdateTask);
router.post('/ToggleTaskCompletion', ToggleTaskCompletion);
router.post('/getChatID', getChatIDs);
router.post('/sendExampleSMS', sendExampleSMS);
router.post('/fetchAALLCounts', fetchAALLCounts);
router.post('/fetchTodayTask', fetchTodayTask);

export default router;