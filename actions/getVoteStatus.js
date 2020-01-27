const { commandToString } = require('../utils/commands')
const playerNotInQueue = require('../utils/playerNotInQueue')

module.exports = (eventObj, queue) => {
  const { players, votes, lobby } = queue
  const channel = eventObj.author.lastMessage.channel
  const playerId = eventObj.author.id
  const remainingVotesRequired = 6 - (votes.r + votes.c)

  // Get a list of mentions for the players who haven't voted
  const playersWhoHaventVoted = players
    .map(playerObj => {
      if (!votes.playersWhoVoted[playerObj.id]) {
        return `<@${playerObj.id}>`
      }

      return undefined
    })
    .filter(mentionString => mentionString !== undefined)

  // Player is not in the queue
  if (playerNotInQueue({ playerId, channel, queue })) return

  // Player is in the queue
  if (players.length < 6) {
    // Voting does not start until 6 players are found
    return channel.send(`6 players have not been found yet.`)
  }

  // Voting is in progress
  channel.send({
    embed: {
      color: 2201331,
      title: `Lobby ${lobby.name} - Vote status`,
      description: `${remainingVotesRequired} votes remaining - Needs to vote: `,
      fields: [
        { name: 'Needs to Vote', value: playersWhoHaventVoted.join(', ') },
        { name: 'Random Teams', value: votes.r, inline: true },
        { name: 'Captains', value: votes.c, inline: true },
      ],
    },
  })
}
