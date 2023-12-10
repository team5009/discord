import { ApplicationCommandType, AutocompleteInteraction, ChatInputCommandInteraction, InteractionReplyOptions, Message, MessageReplyOptions } from "discord.js";
import { IClient } from "types";

export interface Command {
    description: string;
    type?: ApplicationCommandType | null;
    options?: CommandOption[] | null;
    legacy?: boolean | "both";
    cooldown?: number;
    dev?: boolean;
    autocomplete?: (client: IClient, interaction: AutocompleteInteraction) => Promise<void>;
    execute: (client: IClient, interaction?: ChatInputCommandInteraction, message?: Message, args?: string[]) => Promise<void | MessageReplyOptions | InteractionReplyOptions>;
}

export type CommandOption = {
    name: string;
    description: string;
    type: number;
    required?: boolean;
    options?: CommandOption[];
    autocomplete?: boolean
}

export type CommandOptionChoice = {
    name: string;
    value: string | number;
}

export type botOption = {
    token: string;
    prefix: string;
    owners: string[];
    servers: string[];
    applicationId: string;
}

export type EventType = (client: IClient) => Promise<void>;