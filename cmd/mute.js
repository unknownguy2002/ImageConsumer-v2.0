module.exports.run = async (client, message, args) => {

    // using try/catch because why not
    try {

        // If the message sender does not have permission to manage messages, stop.
        if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("You have insufficent permissions to mute a member!");

        // Specify the mutee
        let toMute = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);

        // If the mutee isn't present in the message, stop.
        if (!toMute) return message.channel.send("No user specified!");

        // If the message contains the message sender's information, stop.
        if (toMute.id === message.author.id) return message.channel.send("You can't mute yourself!")

        // If the mutee has a higher role than the message sender, stop.
        if (toMute.highestRole.position >= message.member.highestRole.position) return message.channel.send("You can't mute a member who has a higher role than you!");

        // Find the "Muted" role. If there is no such role, create.
        let role = message.guild.roles.find(r => r.name === "Muted");
        if (!role) {
            try {
                role = await message.guild.createRole({
                    name: "Muted",
                    color: "#111111",
                    permissions: []
                });
                message.guild.channels.forEach(async (channel, id) => {
                    await channel.overwritePermissions(role, {
                        SEND_MESSAGES: false,
                        ADD_REACTIONS: false,
                        CONNECT: false,
                        SPEAK: false
                    });
                })
            } catch (e) {
                message.channel.send("Oh no! An error occured while creating the role: ```javascript\n" + e + "```")
                console.log(e.stack)
            }
        }

        // If the mutee is already muted, stop.
        if (toMute.roles.has(role.id)) return message.channel.send("This user is already muted!")

        // Mute the mutee.
        await toMute.addRole(role);
        message.channel.send(`${toMute} has been muted.`)

        return;
    } catch (err) {
        message.channel.send("Oh no! An error occured: ```javascript\n" + err + "```");
        console.error(err.stack);
    }
}

module.exports.help = {
    name: "mute"
}