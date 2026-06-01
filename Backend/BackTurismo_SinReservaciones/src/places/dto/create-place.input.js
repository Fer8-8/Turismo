"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePlaceInput = void 0;
var graphql_1 = require("@nestjs/graphql");
var graphql_type_json_1 = __importDefault(require("graphql-type-json"));
var class_validator_1 = require("class-validator");
var CreatePlaceInput = /** @class */ (function () {
    function CreatePlaceInput() {
    }
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, graphql_1.Field)(function () { return String; })
    ], CreatePlaceInput.prototype, "name", void 0);
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsOptional)(),
        (0, graphql_1.Field)(function () { return String; }, { nullable: true })
    ], CreatePlaceInput.prototype, "description", void 0);
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, graphql_1.Field)(function () { return String; })
    ], CreatePlaceInput.prototype, "address", void 0);
    __decorate([
        (0, class_validator_1.IsNumber)(),
        (0, class_validator_1.IsOptional)(),
        (0, graphql_1.Field)(function () { return graphql_1.Float; }, { nullable: true }),
        (0, class_validator_1.Max)(90),
        (0, class_validator_1.Min)(-90)
    ], CreatePlaceInput.prototype, "latitude", void 0);
    __decorate([
        (0, class_validator_1.IsNumber)(),
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.Max)(180),
        (0, class_validator_1.Min)(-180),
        (0, graphql_1.Field)(function () { return graphql_1.Float; }, { nullable: true })
    ], CreatePlaceInput.prototype, "longitude", void 0);
    __decorate([
        (0, class_validator_1.IsUUID)(),
        (0, class_validator_1.IsOptional)(),
        (0, graphql_1.Field)(function () { return graphql_1.ID; }, { nullable: true })
    ], CreatePlaceInput.prototype, "state_id", void 0);
    __decorate([
        (0, class_validator_1.IsUUID)(),
        (0, class_validator_1.IsOptional)(),
        (0, graphql_1.Field)(function () { return graphql_1.ID; }, { nullable: true })
    ], CreatePlaceInput.prototype, "id_category", void 0);
    __decorate([
        (0, class_validator_1.IsJSON)(),
        (0, class_validator_1.IsOptional)(),
        (0, graphql_1.Field)(function () { return graphql_type_json_1.default; }, { nullable: true })
    ], CreatePlaceInput.prototype, "details", void 0);
    __decorate([
        (0, class_validator_1.IsUUID)(),
        (0, class_validator_1.IsOptional)(),
        (0, graphql_1.Field)(function () { return graphql_1.ID; }, { nullable: true })
    ], CreatePlaceInput.prototype, "contactDetails_id", void 0);
    __decorate([
        (0, class_validator_1.IsJSON)(),
        (0, class_validator_1.IsOptional)(),
        (0, graphql_1.Field)(function () { return graphql_type_json_1.default; }, { nullable: true })
    ], CreatePlaceInput.prototype, "languages_details", void 0);
    CreatePlaceInput = __decorate([
        (0, graphql_1.InputType)()
    ], CreatePlaceInput);
    return CreatePlaceInput;
}());
exports.CreatePlaceInput = CreatePlaceInput;
