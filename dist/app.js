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
exports.startServer = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongodb_1 = __importDefault(require("./mongodb"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        const allowedOrigins = ['http://localhost:5173', 'https://aarkid-client.vercel.app'];
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.static("public"));
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.send({ message: "Hello From Aarchid API" });
});
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (process.env.MONGODB_URL)
            yield (0, mongodb_1.default)(process.env.MONGODB_URL);
        app.listen(8080, () => console.log("Aarchid Api started on http://localhost:8080"));
    }
    catch (error) {
        console.log(error);
    }
});
exports.startServer = startServer;
//# sourceMappingURL=app.js.map