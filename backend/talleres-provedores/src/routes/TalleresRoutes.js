"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TalleresController_1 = __importDefault(require("../controllers/TalleresController"));
const router = (0, express_1.Router)();
router.get("/", TalleresController_1.default.getTalleres);
router.get("/:id", TalleresController_1.default.getTallerById);
router.post("/", TalleresController_1.default.createTaller);
router.put("/:id", TalleresController_1.default.updateTaller);
router.delete("/:id", TalleresController_1.default.deleteTaller);
exports.default = router;
