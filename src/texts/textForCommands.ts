import { remainingTime } from '../bot/microLogic/remainingTime';

//---------------------------LOOP FOR TEXT------------------------------------
let solid: string = '';

for (let i = 0; i < 40; i++) {
    solid += '-';
}
//----------------------------------------------------------------------------
const cryptoWallets = [
    'MONERO:<pre>4HR2jnRAwm3SFP4r8KzxBxEKsVHKLvZ29Pxz8Qm3uqHY5aD9Kj1De2Y1W8S18fYjh9acS9NkK4VNje5pC2gVq3aYVYczDMimK9jU999txx</pre>',
    'BITCOIN: <pre>bc1qj2ag78xdfxvmuqmp8y79mfyanx82q2mps4dp96</pre>',
    'DAI: <pre>0x49fD986f33c60FCb8520660966568c6bF3dB3C17</pre>',
    'ETHERIUM: <pre>0x1eCFFA7b5E4097893D6bAC23054Bdc9E2A3dEBa6</pre>',
    'TON COIN: <pre>UQDaGKC6GOQyDLisNvXvULYyfjsaIzu5TfZsx_K6ZS-_3L3M</pre>',
    'TRON: <pre>TEwxMZB8wpxzoptq27JKWWWovvRRd13m3G</pre>',
    'USDC: <pre>0x6A0742453491590a4c9c36187432dCdb27d8974c</pre>',
    'TETHER: <pre>0xcfF0e400A376D7aFADb32b1F75F4b45e893557c8</pre>',
];

export const startText = `*Hello my dear friend, {name}*\\!\n
🔥I'm your *__REMOTE CONTROLLING SYSTEM BOT__\\!*🔥\n
✅I can manage your Desktop remote, with having no problems\\!\n
✅This action will be done by using PowerShell script which you've seen below\n
✅This bot supports only Windows OS\\!\n
💡This bot will support another operating systems SOON\\.\\.\\.\n
_*__Download this attached file and run it on your computer__*_
⚠️ *WARNING⚠️: This file is executable only on Windows OS\\!*\n\n
If you have any issues, feel free to contact me at
🚀🚀🚀 __*||[ASD](https://t.me/React_Rogue)||*__ 🚀🚀🚀\n\n
OR USE THIS COMMAND /help FOR MORE INFORMATION ABOUT THE BOT`;

export const infoAboutPrem = `To get a premium status, you can contact with me directly at
🚀🚀🚀 https://t.me/React_Rogue 🚀🚀🚀 \nor pay via crypto:\n\n${solid}
${cryptoWallets.map((value) => `💰💰💰${value}\n${solid}`).join('\n')}\n\n
<blockquote>${solid}\n<strong>❗❗❗ATTENTION❗❗❗</strong>\n${solid}
${`After this maneuvers you will have to send me screenshot of transaction`.toUpperCase()}\n</blockquote>
💸💸💸 📣<b>Why you should purchase this premium status?</b>\n
🔥1️⃣ In the first step, you should do it for supporting my project for future updating and upgrading itself. 
Actually you gonna get more awesome stuff for remote controlling your PC.\n
🤫 Psss....
That will be all functional from powershell and automatically binding your device to telegram bot\n
🔥2️⃣ Secondly, you can get access to my private channel where I share useful resources for developers like tutorials, articles, etc.\n
🔥🚩 Finally, I'll go to a shop, for buying some edible stuff for my stomach

<blockquote>❕ Anyway you can get 🌟 <b>/premium</b> 🌟 by helping the project by contributing to the code.
In order to find out the details you need to click on /contribution
I will be very grateful for your help😅).</blockquote>
\n---BACK /help`;

export const helpMessage = `If you have any questions, please contact me at
🚀🚀🚀 ||[ASD](https://t.me/React_Rogue)|| 🚀🚀🚀 \n
///////////////////////////////////////////////////////////////
// *Here are a list of commands:*
// /help \\- Show this help message
// /start \\- Start bot with all information about the bot
// /premium \\- Check your status now
// /info\\_about\\_premium \\- Info about premium status
// /contribution \\- Contribution to the project for getting *FREE PREMIUM STATUS*
// /my\\_remote \\- Listing remote commands for your *PC*`;

export const errorRegistration = `<b>🚫To my great regret. You can't use the bot because, your data is not registered in database. Please contact with me. I am always open to reports🚫<a href="https://t.me/React_Rogue">DEVELOPER ASD</a></b>`;

export const contribution = `<b>✌️ Contributions is a great way to use all bot functionality for free.</b>\n
✨<strong>YOU WILL BE VERY USEFUL IF YOU:</strong>\n
<blockquote>
🔥<code>If you know TypeScript</code>
🔥<code>Know how to work with Telegraf library</code>
🔥<code>Have experience with NodeJS</code>
🔥<code>Are familiar with Git and GitHub</code>
🔥<code>Know that you can contribute to the development of the project</code>\n
</blockquote>
<u>⭐Waiting for you in my Contributors on my github⭐</u>
<a href="https://github.com/ASDlikeS/remote-bot">WELCOME TO MY GITHUB REPOSITORY</a>`;

// CHECKING PREMIUM STATUS OF USER ---------------------------
export const userIsPremium = (id: number, value: boolean) => {
    const time = remainingTime(id);
    if (value) {
        return `✅<b>Your account has a premium status</b>\n\n<blockquote>Your premium status will expire after ${time.days}ds ${time.hours}hrs ${time.minutes}min ${time.seconds}s</blockquote>\nFor using your remote controlling system <b>Write this commands</b>: ☑️/my_remote`;
    } else {
        return `❌<i>You dont't have a premium status</i>❌\n\nPlease buy it, if you want to use all features\nFor more information type \n☑️/info_about_premium`;
    }
};

//CHECKING USER CONNECTION -----------------------------------
export const notConnected = `🚫 You aren't connected with remote bot🚫\nPlease connect first, using command /connect. If you have some issues with this. Feel free to contact me <a href="https://t.me/React_Rogue">@ASD</a>`;

// CHECKING IS BANNED ----------------------------------------
export const isBanned = `<b>🚫To my greatest regret. You was banned from using this bot.\n If you think that it's a mistake, please contact with me.\n I am always open to reports🚫<a href="https://t.me/React_Rogue">DEVELOPER ASD</a></b>`;
// ------------------------------------------------------------

// LIST OF COMMANDS -----------------------------------------
// prettier-ignore
export const myRemoteCommands = (isPremium: string) => {
    let trigger: boolean = false;
    Boolean(isPremium.includes('❌')) ? trigger = true : false;
    return `<b><u>Here's your personal remote commands:</u></b>
    /close - Close current window
    /restart - Restart your PC
    /shutdown - Shutdown your PC
    /screenshot - Take a screenshot of your desktop
    -----------------------------------------------------
    ${trigger ? "\n\n\n🚫🚫🚫COMMANDS ONLY FOR PREMIUM HEROES!🚫🚫🚫<s>" : ""}\n/bind {powershell command} <blockquote>EXAMPLE: /bind {ping, ping google.com} "You've bound ping command with name ping, and now you can call it by typing /ping"</blockquote>${trigger ? "</s>" : ""}
    ${trigger ? "<s>" : ""}/volume {changing volume in proccent %} <blockquote>EXAMPLE: /volume 50 "Changing your volume to 50%"</blockquote>${trigger ? "</s>" : ""}
    ${trigger ? "<s>" : ""}/note - Open note file${trigger ? "</s>" : ""}
    ${trigger ? "<s>" : ""}/kill_process {process name} <blockquote>EXAMPLE: /kill_process {firefox} "You've killed firefox process"</blockquote>${trigger ? "</s>" : ""}
    ${trigger ? "<s>" : ""}/set_date {date} <blockquote>EXAMPLE: /set_date {2024:02:21} "You've set up your date to 2024 year February month day 21"</blockquote>${trigger ? "</s>" : ""}`;
}
//------------------------------------------------------------
