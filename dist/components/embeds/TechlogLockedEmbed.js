var o=require("discord.js");module.exports={name:"TechlogLockedEmbed",builder:e=>{let t=e.lockedAt?` <t:${Math.floor(e.lockedAt.getTime()/1e3)}:R>`:"";return new o.EmbedBuilder().setColor("Red").setTitle(`Techlog ${e.registration} bloqueado`).setDescription(`Lo descarg\xF3 <@${e.lockedBy}>${t} y todav\xEDa no lo ha subido.
No se puede descargar ni subir hasta que lo suba con \`/settechlog\`.`)}};
