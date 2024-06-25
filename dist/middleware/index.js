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
exports.upload = exports.isOwner = exports.isLoggedIn = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// import User from '../mongodb/models/user.js';
const multer_1 = __importDefault(require("multer"));
const isLoggedIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.header('Authorization');
    console.log(token);
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Please login to access resource',
        });
    }
    try {
        if (typeof process.env.AUTH_SECRET === 'undefined') {
            throw new Error('GEMINI_API_KEY is not set');
        }
        const userId = jsonwebtoken_1.default.verify(token, process.env.AUTH_SECRET);
        const user = yield User.findById(userId.id);
        req.user = user;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token',
            });
        }
        return res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
});
exports.isLoggedIn = isLoggedIn;
const isOwner = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const token = req.header('Authorization');
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.AUTH_SECRET);
        const currentUserId = decodedToken._id;
        if (!id || !currentUserId) {
            return res.status(400).json({
                success: false,
                message: 'User not authenticated',
            });
        }
        if (currentUserId.toString() !== id) {
            return res.status(403).json({
                success: false,
                message: 'User not authorized',
            });
        }
        next();
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: 'Server error',
        });
    }
});
exports.isOwner = isOwner;
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
exports.upload = (0, multer_1.default)({
    storage,
});
//# sourceMappingURL=index.js.map