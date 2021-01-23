import { MessageEmbed } from "discord.js";
import { Message } from "discord.js";
import { CustomCommand } from "../../classes/Command";
import GuildConfig from "../../models/GuildConfig";

export default class PrefixCommand extends CustomCommand {
    public constructor() {
        super("config", {
            aliases: ["config", "settings"],
            category: "Config",
            description: {
                content: "Change the config for the current server",
                usage: "config [config setting] [new value]",
                examples: [
                    "config prefix !",
                    "config levelingChannel #levels",
                    "config leveling off",
                    "config leveling false"
                ]
            },
            userPermissions: ["MANAGE_GUILD"],
            ratelimit: 2,
            args: [
                {
                    id: "setting",
                    type: "string",
                    default: null
                },
                {
                    id: "value",
                    type: "string",
                    default: null
                }
            ]
        });
    }

    public async exec(
        message: Message,
        // @ts-ignore
        { setting, value }: { setting: string; value: string }
    ): Promise<Message> {
        // @ts-ignore
        const config: any = await GuildConfig.findOne({
            guildId: message.guild.id
        });

        if (!setting) {
            const embed = new MessageEmbed()
                .setAuthor(
                    "Settings",
                    this.client.user.displayAvatarURL({ dynamic: true })
                )
                .setColor(this.client.config.transparentColor);

            embed.addField(
                "Prefix",
                "Change the prefix for the current guild.\nUsage: `config prefix <new prefix>`\nExample: `config prefix !`"
            );

            return message.channel.send(embed);
        } else if (setting && !value) {
            switch (setting) {
                case "prefix":
                    return message.channel.send(
                        "Incorrect usage! Correct usage is `config prefix <new prefix>`"
                    );
                default:
                    return message.channel.send("Unknown setting");
            }
        } else if (setting && value) {
            switch (setting) {
                case "prefix":
                    config.settings.prefix = value;
                    config.markModified("settings.prefix");
                    await config.save();
                    return message.channel.send(
                        `Successfully set the current prefix to \`${value}\``
                    );
                default:
                    return message.channel.send("Unknown setting");
            }
        }
    }
}
