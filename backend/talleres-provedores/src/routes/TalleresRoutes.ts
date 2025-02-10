import { Router } from "express";
import TalleresController from "../controllers/TalleresController";

const router = Router();

router.get("/", TalleresController.getTalleres);
router.get("/:id", TalleresController.getTallerById);
router.post("/", TalleresController.createTaller);
router.put("/:id", TalleresController.updateTaller);
router.delete("/:id", TalleresController.deleteTaller);

export default router;
