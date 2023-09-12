import { Controller, Get, Request, Response } from "@nestjs/common";
import { Logger } from "@nestjs/common";

@Controller()
export class ConfigController {
    constructor(private readonly configController: ConfigController) {}
    logger: Logger = new Logger('Config Controller');
}