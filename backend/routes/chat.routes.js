const express = require("express");
const { authUserMiddleware } = require("../middlewares/auth.middleware");
const { accessChat, getChats, createGroupChat, renameGroup, addToGroup, removeFromGroup, joinGroupAnonymous, exitGroup, deleteChatForUser, joinGroup } = require("../controller/chat.controller");

const router = express.Router()

router.route("/").post(authUserMiddleware, accessChat)
router.route("/").get(authUserMiddleware,getChats)
router.route("/group").post(authUserMiddleware, createGroupChat)
router.route("/rename").put(authUserMiddleware, renameGroup)
router.route("/group/user/add").put(authUserMiddleware, addToGroup)
router.route("/group/user/remove").put(authUserMiddleware, removeFromGroup)

router.route("group/anonymous/join").post(joinGroupAnonymous)
router.route("/group/user/join").post(authUserMiddleware, joinGroup)
router.route("/group/exit").post(authUserMiddleware, exitGroup)
router.route("/delete").post(authUserMiddleware, deleteChatForUser) 



module.exports = router;