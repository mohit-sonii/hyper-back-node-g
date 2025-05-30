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
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const property_routes_1 = __importDefault(require("./routes/property.routes"));
const favorite_routes_1 = __importDefault(require("./routes/favorite.routes"));
const recommend_route_1 = __importDefault(require("./routes/recommend.route"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
const PORT = process.env.PORT || 5000;
const localhost = process.env.LOCALHOST || '*';
const deployedHost = process.env.DEPLOYEDHOST || '*';
app.use((0, cors_1.default)({
    origin: [localhost, deployedHost],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type'],
}));
app.get('/', (req, res) => {
    res.send(`
    <h2>👋 Thank you for being here!</h2>
    <p>Please check the <a href="https://documenter.getpostman.com/view/34595465/2sB2qfBeu8" target="_blank">API Documentation</a> for available routes.</p>
  `);
});
app.use("/auth", auth_routes_1.default);
app.use("/properties", property_routes_1.default);
app.use("/:user_id/fav", favorite_routes_1.default);
app.use("/recommend", recommend_route_1.default);
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield connectToServer();
        app.listen(PORT, () => {
            console.log(`App is listening to PORT : ${PORT}`);
        });
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }
});
const connectToServer = () => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connect(`${process.env.DATABASE_URL}`);
    return;
});
startServer();
