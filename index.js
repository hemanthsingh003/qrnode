/* 
1. Use the inquirer npm package to get user input.
2. Use the qr-image npm package to turn the user entered URL into a QR code image.
3. Create a txt file to save the user input using the native fs node module.
*/


import fs from "fs";
import inquirer from "inquirer";
import qrcode from "qrcode-terminal";
import qr from "qr-image";

const show = url => {
  qrcode.generate(url, {small: true}, qrcode => {
    console.log(`\n${qrcode}\n`);
  });
}

const download = url => {
  const qr_svg = qr.image(url, { size: 10, margin: 1 });
  qr_svg.pipe(fs.createWriteStream('qr-image.png'));
}

const promptUser = () => {
  console.log("\nWelcome to QR-code generator.\n\n");
  inquirer
    .prompt([
      {
        "message": "Would you like to (d)ownload the image, just (s)how in terminal, or (b)oth:",
        "name": "option"
      },
      {
          "message": "Enter the URL:", 
          "name": "URL"
      }
    ])
    .then((answers) => {
      const option = answers.option;
      const url = answers.URL;
      
      if (option === 'd' || option === 'download') download(url);
      else if (option === 's' || option === 'show') show(url);
      else if (option === 'b' || option === 'both') {
        show(url);
        download(url);
      } else {
        process.stdout.write("\u001b[2J\u001b[0;0H");
        console.log(`\n\nNot a valid input: \'${option}\'\n`);
        promptUser();
        return;
      }
  
      fs.writeFile('URL.txt', url, err => {
        if (err) throw err;
        console.log(`URL stored in \'URL.txt\'`);
      })
    })
    .catch((error) => {
      if (error.isTtyError) {
      //   Prompt couldn't be rendered in the current environment
      } else {
      //   Something else went wrong
      }
    });
}

process.stdout.write("\u001b[2J\u001b[0;0H");
promptUser();
