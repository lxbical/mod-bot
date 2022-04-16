module.exports = class Clean extends Interaction {
    constructor() {
        super({
            name: "clean",
            description: "Deletes bot messages in the channel",
            options: [
                {
                    type: "4",
                    name: "amount",
                    description: "The amount of messages to delete",
                    required: true
                },
                {
                    type: "3",
                    name: "filter",
                    description: "The filter to use",
                    required: false,
                    choices: [
                        {
                            name: "Bots",
                            value: "bots"
                        },
                        {
                            name: "Bot (Me)",
                            value: "me"
                        },
                        {
                            name: "Users",
                            value: "users"
                        }
                    ]
                }

            ],
        });
    }
    async exec(int, data) {

            let amount = int.options.getInteger("amount")
            let filter = int.options.getString("filter")

            if (amount > 100) {
                return int.reply({
                    content: "<:myMetroCOMMUNICATIONS:963933515861352498> MyMetro can't delete more than 100 messages at once due to department reasons. For this limit to be removed, please contact a team coordinator",
                    ephemeral: true,
                });
            }

              let messages = await int.channel.messages.fetch()
              let deleted = 0
              messages.forEach( m => {
                  if(deleted >= amount) return

                  if(filter) {
                      if(filter === "bots") {
                          if(m.author.bot) {
                              if(m.deletable) {
                                  m.delete().catch(err => console.log(err))
                                  deleted += 1
                              }
                          }
                      }
                      if(filter === "me") {
                          if(m.author.id === int.client.user.id) {
                              if(m.deletable) {
                                  m.delete().catch(err => console.log(err))
                                  deleted += 1
                              }
                          }
                      }
                      if(filter === "users") {
                          if(!m.author.bot) {
                              if(m.deletable) {
                                  m.delete().catch(err => console.log(err))
                                  deleted += 1
                              }
                          }
                      }
                  } else {
                      if(m.deletable) {
                          m.delete().catch(err => console.log(err))
                          deleted += 1
                      }

                  }

              })

          return int.reply({
              content: "<:myMetroCOMMUNICATIONS:963933515861352498> MyMetro has successfully purged and logged the chat successfully.",
              ephemeral: true,
          })
        }
};
