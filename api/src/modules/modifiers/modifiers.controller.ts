import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from "@nestjs/common";
import ModifierEntity from "~/db/entities/modifier.entity";
import { CreateModifierDto, UpdateModifierDto } from "./modifiers.dto";
import ModifiersService from "./modifiers.service";

@Controller("/modifiers")
export default class ModifiersController {
  constructor(private readonly modifiersService: ModifiersService) {}

  @Get("/")
  getModifiers(): Promise<ModifierEntity[]> {
    return this.modifiersService.find();
  }

  @Get("/:modifierUUID/$")
  async getMofifier(
    @Param("modifierUUID", ParseUUIDPipe) modifierUUID: string
  ): Promise<ModifierEntity> {
    const foundModifier = await this.modifiersService.findOne({
      uuid: modifierUUID,
    });

    if (!foundModifier)
      throw new NotFoundException(
        `The modifier ${modifierUUID} does not exist`
      );

    return foundModifier;
  }

  @Post("/")
  createModifier(@Body() dto: CreateModifierDto): Promise<ModifierEntity> {
    return this.modifiersService.create(dto);
  }

  @Put("/:modifierUUID/$")
  updateModifier(
    @Param("modifierUUID", ParseUUIDPipe) modifierUUID: string,
    @Body() dto: UpdateModifierDto
  ): Promise<ModifierEntity> {
    return this.modifiersService.update(modifierUUID, dto);
  }

  @Delete("/:modifierUUID")
  deleteModifier(@Param("modifierUUID") modifierUUID: string): Promise<void> {
    return this.modifiersService.delete(modifierUUID);
  }
}
