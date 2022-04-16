const {MessageEmbed} = require('discord.js');

module.exports = class Ban extends Interaction {
    constructor() {
        super({
            name: "ban",
            description: "Bans a user from the server",
            options: [
                {
                    type: "6",
                    name: "user",
                    description: "The user to ban",
                    required: true
                },
                {
                    type: "3",
                    name: "reason",
                    description: "The reason for the ban",
                    required: true
                }
            ],
        });
    }
    async exec(int, data) {
        let isMod = data.modRoles.some((r) => int.member._roles.includes(r));

        if (!isMod && !int.member.permissions.has("BAN_MEMBERS") ) {
            return int.reply({
                content: "You don't have permission to do that!",
                ephemeral: true,
            });
        }

        let member = int.options.getMember("user")
        let reason = int.options.getString("reason")

        if(member.user.id === int.user.id) {
            return int.reply({
                content: "You can't moderate yourself!",
                ephemeral: true,
            });
        } else if(member.user.id === int.client.user.id) {
            return int.reply({
                content: "You can't moderate me!",
                ephemeral: true,
            });
        } else if(member.user.id === int.guild.ownerId) {
            return int.reply({
                content: "You can't moderate the server owner!",
                ephemeral: true,
            });
        }

        if(int.member.roles.highest.position <= member.roles.highest.position) {
            return int.reply({
                content: "<:myMetroCOMMUNICATIONS:963933515861352498> This user is apart of the Metro Staffing Team. To perform moderation on this user, please contact a Network Chief or Team Coordinator.",
                ephemeral: true,
            });
        }


        if(!member.bannable) {
            return int.reply({
                content: "I can't ban that user!",
                ephemeral: true,
            });
        }

        await member.ban({reason: `${reason}`}).then(async () => {
            if(data.modLogs) {
                let modChannel = await int.guild.channels.fetch(data.modLogs);
                if(modChannel) {
                    let embed = new MessageEmbed()
                        .setAuthor({name:`${int.user.username} ${int.member.nickname ? `(${int.member.nickname})` : ""}`, iconURL: `${int.user.avatarURL()}`})
                        .setTitle("User banned")
                        .setColor("#2f3136")
                        .setDescription(`Reason: ${reason}`)
                        .addFields(
                            {name: "User", value: `${member}`, inline: true},
                            {name: "Moderator", value:`${int.member}`, inline: true},
                        )
                        .setTimestamp();
                    modChannel.send({embeds: [embed]});
                }
            }

            return int.reply({
                content: `${member} has been banned! Reason: **${reason}**`,
                ephemeral: true,
            });
        });

    }
};
