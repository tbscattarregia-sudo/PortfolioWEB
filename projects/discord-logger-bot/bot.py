import discord
from discord.ext import commands
from database import add_log  # tu función para guardar logs
from dotenv import load_dotenv
import os

# ---------------- CARGAR VARIABLES ----------------
load_dotenv()
DISCORD_TOKEN = os.getenv("DISCORD_TOKEN")
_log_channel_id = os.getenv("LOG_CHANNEL_ID")
try:
    LOG_CHANNEL_ID = int(_log_channel_id.strip().strip('"').strip("'")) if _log_channel_id else None
except Exception:
    LOG_CHANNEL_ID = None

# ---------------- CONFIGURAR BOT ----------------
intents = discord.Intents.default()
intents.message_content = True
intents.guilds = True
intents.members = True
intents.voice_states = True
intents.messages = True

bot = commands.Bot(command_prefix="!", intents=intents)

# ---------------- FUNCIÓN DE LOGS ----------------
async def send_log(text, log_type="message"):
    """
    Envía un log visual en Discord con embed.
    """
    channel = bot.get_channel(LOG_CHANNEL_ID)
    if channel is None:
        print(f"[ERROR] No se encontró el canal con ID {LOG_CHANNEL_ID}")
        return

    colors = {
        "message": 0xFACC15,  # amarillo
        "edit": 0x10B981,     # verde
        "delete": 0xEF4444,   # rojo
        "channel": 0x3B82F6,  # azul
        "voice": 0x8B5CF6     # morado
    }

    icons = {
        "message": "✉️",
        "edit": "✏️",
        "delete": "❌",
        "channel": "📁",
        "voice": "🔊"
    }

    embed = discord.Embed(
        description=f"{icons.get(log_type, '')} {text}",
        color=colors.get(log_type, 0x38BDF8)
    )
    await channel.send(embed=embed)

    # Guardar en base de datos
    add_log(log_type, text)

# ---------------- EVENTOS ----------------
@bot.event
async def on_ready():
    print(f"Bot conectado como {bot.user}")

# Mensajes
@bot.event
async def on_message(message):
    if message.author.bot:
        return
    await send_log(f"Mensaje enviado por {message.author}: {message.content}", "message")

@bot.event
async def on_message_delete(message):
    if message.author.bot:
        return
    await send_log(f"Mensaje eliminado de {message.author}: {message.content}", "delete")

@bot.event
async def on_message_edit(before, after):
    if before.author.bot:
        return
    await send_log(f"Mensaje editado por {before.author}: {before.content} → {after.content}", "edit")

# Canales
@bot.event
async def on_guild_channel_create(channel):
    await send_log(f"Canal creado: {channel.name}", "channel")

@bot.event
async def on_guild_channel_delete(channel):
    await send_log(f"Canal eliminado: {channel.name}", "channel")

# Voz
@bot.event
async def on_voice_state_update(member, before, after):
    if before.channel != after.channel:
        if after.channel:
            await send_log(f"{member} se unió a {after.channel}", "voice")
        if before.channel:
            await send_log(f"{member} salió de {before.channel}", "voice")

# ---------------- INICIAR BOT ----------------
bot.run(DISCORD_TOKEN)
