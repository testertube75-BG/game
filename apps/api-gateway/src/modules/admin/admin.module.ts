import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module.js";
import { RolesGuard } from "../common/roles.guard.js";
import { AdminController } from "./admin.controller.js";

@Module({
  imports: [AuthModule],
  controllers: [AdminController],
  providers: [RolesGuard]
})
export class AdminModule {}
