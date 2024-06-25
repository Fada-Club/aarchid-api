"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAuthToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateAuthToken = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (typeof process.env.AUTH_SECRET === 'undefined') {
            throw new Error('GEMINI_API_KEY is not set');
        }
        const token = yield jsonwebtoken_1.default.sign({
            _id: id,
        }, process.env.AUTH_SECRET);
        return token;
    }
    catch (error) {
        console.log(error);
    }
});
exports.generateAuthToken = generateAuthToken;
//# sourceMappingURL=index.js.map