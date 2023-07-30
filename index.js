import "dotenv/config";
import { createRestAPIClient } from "masto";
import osu from "node-os-utils";

const config = {
    intro: "", // text that will prefix the stats in the toot
    interval: 0, // time in seconds between toots (set to 0 if manually triggering or using crontab)
    filledBarChar: "▰", // the character for the filled-in usage bar (can be an emoji)
    emptyBarChar: "▱", // the character for the empty part of the usage bar (can also be an emoji)
    barLength: 16, // number of characters used for the usage bar
};

const masto = createRestAPIClient({
    url: process.env.INSTANCE_URL,
    accessToken: process.env.BOT_ACCESS_TOKEN,
});

function usageBar(perc) {
    const filledN = Math.round((perc / 100) * config.barLength);
    const filled = config.filledBarChar.repeat(filledN);
    const empty = config.emptyBarChar.repeat(config.barLength - filledN);
    return filled + empty;
}

async function toot() {
    const cpu = await osu.cpu.usage();
    const drive = await osu.drive.used();
    const ram = await osu.mem.info();
    const up = new Date((await osu.os.uptime()) * 1000);

    const upDays = up.getUTCDate() - 1;
    const upHours = up.getUTCHours();
    const upMinutes = up.getUTCMinutes();
    const upSeconds = up.getUTCSeconds();

    let humanReadableUp = "";
    if (upDays) {
        let plural = upDays !== 1 ? "s" : "";
        humanReadableUp += `${upDays} day${plural}, `;
    }
    if (upHours || upDays > 0) {
        let plural = upHours !== 1 ? "s" : "";
        humanReadableUp += `${upHours} hour${plural}, `;
    }
    if (upMinutes || upHours + upDays > 0) {
        let plural = upMinutes !== 1 ? "s" : "";
        humanReadableUp += `${upMinutes} minute${plural} and `;
    }
    let plural = upSeconds !== 1 ? "s" : "";
    humanReadableUp += `${upSeconds} second${plural}`;

    const toot = `${config.intro ? `${config.intro}\n\n` : ""}CPU:\n${usageBar(
        cpu
    )} (${cpu.toFixed(1)}%)\n\nRAM: ${Math.round(ram.usedMemMb)}MB/${Math.round(
        ram.totalMemMb
    )}MB\n${usageBar(ram.usedMemPercentage)} (${ram.usedMemPercentage.toFixed(
        1
    )}%)\n\nDisk (/): ${drive.usedGb}GB/${drive.totalGb}GB\n${usageBar(
        drive.usedPercentage
    )} (${parseFloat(drive.usedPercentage).toFixed(
        1
    )}%)\n\nUptime: ${humanReadableUp}`;

    const status = await masto.v1.statuses.create({
        status: toot,
        visibility: "public",
    });

    console.log(`Tooted on ${new Date()}! ${status?.url}`);
}

if (config.interval) {
    toot();
    setInterval(() => toot(), config.interval * 1000);
} else {
    toot();
}
