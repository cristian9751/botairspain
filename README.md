# Bot de rutas XSN

Bot de Discord para una aerolínea virtual, construido sobre `discord-framework`.

## Comandos

| Comando | Quién puede usarlo | Qué hace |
| --- | --- | --- |
| `/getroute flight:<XSN123 o 123>` | Todos | Muestra la ruta de un vuelo |
| `/createroute` | Administradores y roles configurados | Crea una ruta (vuelo, origen, destino, aeronave, ruta opcional, duración opcional) |
| `/setadminrole role:<rol> [action:Añadir/Quitar]` | Solo Administradores | Define qué roles pueden usar `/createroute` |

## Puesta en marcha

1. `npm install`
2. Copia `.env.example` a `.env` y rellena `TOKEN`, `CLIENT_ID` y `MONGO_URI` (por defecto `mongodb://127.0.0.1:27017/xsn-airline`).
3. Con MongoDB en marcha: `npm run dev`.

## Permisos en los comandos

`src/events/interactions/Slash.ts` ahora lee la propiedad `permission` del comando:

- `"everyone"`: cualquiera
- `"staff"`: Administradores o roles de `/setadminrole`
- `"admin"`: solo Administradores
- sin propiedad: comportamiento original del framework

## Datos

- `routes`: una ruta por servidor y número de vuelo (índice único `guildId + flightNumber`).
- `guildconfigs`: `adminRoleIds` por servidor.
