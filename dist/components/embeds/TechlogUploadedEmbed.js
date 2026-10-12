var i=require("discord.js");module.exports={name:"TechlogUploadedEmbed",builder:e=>new i.EmbedBuilder().setColor("Green").setTitle(`Techlog ${e.registration} subido`).setDescription(`Archivo: **${e.filename}** (${(e.size/1024).toFixed(1)} KB)
El techlog est\xE1 desbloqueado y disponible.`)};
