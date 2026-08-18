import { aiService } from "../services/ai.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { send } from "../utils/ApiResponse.js";

export const aiController = {
  status: asyncHandler(async (req, res) => {
    send(res, 200, await aiService.status(req.user));
  }),
  context: asyncHandler(async (req, res) => {
    send(res, 200, await aiService.context(req.user));
  }),
  probe: asyncHandler(async (req, res) => {
    send(res, 200, await aiService.probe(req.body.baseUrl), "Ollama connected");
  }),
  chat: asyncHandler(async (req, res) => {
    send(res, 200, await aiService.chat(req.body.messages, req.user), "HireHub assistant");
  }),
  draftJob: asyncHandler(async (req, res) => {
    send(res, 200, await aiService.draftJob(req.body, req.user), "Draft ready");
  }),
  draftCoverLetter: asyncHandler(async (req, res) => {
    send(res, 200, await aiService.draftCoverLetter(req.user, req.body), "Cover letter ready");
  }),
};
