"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const beneficiariosController_1 = require("../controllers/beneficiariosController");
const router = express_1.default.Router();
router.get('/', beneficiariosController_1.getBeneficiarios);
router.post('/', beneficiariosController_1.createBeneficiario);
router.put('/:id', beneficiariosController_1.updateBeneficiario);
router.delete('/:id', beneficiariosController_1.deleteBeneficiario);
exports.default = router;
