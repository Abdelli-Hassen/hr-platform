"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const employees_1 = __importDefault(require("./routes/employees"));
const payroll_1 = __importDefault(require("./routes/payroll"));
const leaves_1 = __importDefault(require("./routes/leaves"));
const recruitment_1 = __importDefault(require("./routes/recruitment"));
const dashboard_1 = __importDefault(require("./routes/dashboard"));
dotenv_1.default.config();
console.log("Using DB", process.env.DB_NAME || "human_ressources");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use("/api/auth", auth_1.default);
app.use("/api/employees", employees_1.default);
app.use("/api/payroll", payroll_1.default);
app.use("/api/leaves", leaves_1.default);
app.use("/api/recruitment", recruitment_1.default);
app.use("/api/dashboard", dashboard_1.default);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map