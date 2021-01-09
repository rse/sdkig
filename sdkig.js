#!/usr/bin/env node
/*!
**  SDKIG -- Stream-Deck Key-Image Generator
**  Copyright (c) 2020-2021 Dr. Ralf S. Engelschall <rse@engelschall.com>
**
**  Permission is hereby granted, free of charge, to any person obtaining
**  a copy of this software and associated documentation files (the
**  "Software"), to deal in the Software without restriction, including
**  without limitation the rights to use, copy, modify, merge, publish,
**  distribute, sublicense, and/or sell copies of the Software, and to
**  permit persons to whom the Software is furnished to do so, subject to
**  the following conditions:
**
**  The above copyright notice and this permission notice shall be included
**  in all copies or substantial portions of the Software.
**
**  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
**  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
**  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
**  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
**  CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
**  TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
**  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/*  own package information  */
const my          = require("./package.json")

/*  internal requirements  */
const fs          = require("fs")

/*  external requirements  */
const yargs       = require("yargs")
const chalk       = require("chalk")
const tmp         = require("tmp")
const Prince      = require("prince")
const execa       = require("execa")

;(async () => {
    /*  command-line option parsing  */
    const argv = yargs()
        /* eslint indent: off */
        .parserConfiguration({
            "duplicate-arguments-array": false,
            "set-placeholder-key":       true,
            "flatten-duplicate-arrays":  true,
            "camel-case-expansion":      true,
            "strip-aliased":             false,
            "dot-notation":              false,
            "halt-at-non-option":        true
        })
        .usage("Usage: sdkig " +
            "[-h|--help] " +
            "[-V|--version] " +
            "[-b|--background-color <rgb-color>] " +
            "[-i|--icon-name <name>] " +
            "[-I|--icon-color <rgb-color>] " +
            "[-s|--subicon-name <name>] " +
            "[-S|--subicon-color <rgb-color>] " +
            "[-t|--title-text <text>] " +
            "[-T|--title-color <rgb-color>] " +
            "[-o|--output-file <png-file>]"
        )
        .option("h", {
            describe: "show program help information",
            alias:    "help", type: "boolean", default: false
        })
        .option("V", {
            describe: "show program version information",
            alias:    "version", type: "boolean", default: false
        })
        .option("b", {
            describe: "background color",
            alias:    "background-color", type: "string", nargs: 1, default: "#000000"
        })
        .option("i", {
            describe: "icon name",
            alias:    "icon-name", type: "string", nargs: 1, default: ""
        })
        .option("I", {
            describe: "icon color",
            alias:    "icon-color", type: "string", nargs: 1, default: "#ffffff"
        })
        .option("s", {
            describe: "subicon name",
            alias:    "subicon-name", type: "string", nargs: 1, default: ""
        })
        .option("S", {
            describe: "subicon color",
            alias:    "subicon-color", type: "string", nargs: 1, default: "#ffffff"
        })
        .option("t", {
            describe: "title text",
            alias:    "title-text", type: "string", nargs: 1, default: ""
        })
        .option("T", {
            describe: "title color",
            alias:    "title-color", type: "string", nargs: 1, default: "#e0e0e0"
        })
        .option("o", {
            describe: "output file",
            alias:    "output-file", type: "string", nargs: 1, default: ""
        })
        .version(false)
        .strict(true)
        .showHelpOnFail(true)
        .demand(0)
        .parse(process.argv.slice(2))

    /*  short-circuit processing of "-V" (version) command-line option  */
    if (argv.version) {
        process.stderr.write(`${my.name} ${my.version} <${my.homepage}>\n`)
        process.stderr.write(`${my.description}\n`)
        process.stderr.write(`Copyright (c) 2020 ${my.author.name} <${my.author.url}>\n`)
        process.stderr.write(`Licensed under ${my.license} <http://spdx.org/licenses/${my.license}.html>\n`)
        process.exit(0)
    }

    /*  sanity check usage  */
    if (argv.iconName === "")
        throw new Error("option -i|--icon-name has to be given")
    if (argv.titleText === "")
        throw new Error("option -t|--title-text has to be given")
    if (argv.outputFile === "")
        throw new Error("option -o|--output-file has to be given")

    /*  generate HTML  */
    const htmlFile = tmp.fileSync()
    const html =
        `<!DOCTYPE html>
        <html>
            <head>
                <title></title>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style type="text/css">
                    @import "${require.resolve("@fortawesome/fontawesome-free/css/all.min.css")}";
                    @import "${require.resolve("typopro-web/web/TypoPRO-SourceSansPro/TypoPRO-SourceSansPro.css")}";
                    @page {
                        size: 288px 288px;
                        margin: 0;
                        padding: 0;
                    }
                    html, body {
                        margin: 0;
                        padding: 0;
                        width: 288px;
                        height: 288px;
                        background-color: #000000;
                        position: relative;
                    }
                    .canvas {
                        position: absolute;
                        left: 0;
                        top: 0;
                        border-radius: 40px;
                        width: 288px;
                        height: 288px;
                        background-color: #${argv.backgroundColor};
                    }
                    .icon {
                        position: absolute;
                        left: 0;
                        top: 25px;
                        width: 100%;
                        height: 100%;
                        text-align: center;
                        font-size: 200px;
                        color: #${argv.iconColor};
                    }
                    .icon-sub {
                        position: absolute;
                        left: 25px;
                        top: 25px;
                        font-size: 110px;
                        color: #${argv.subiconColor};
                    }
                    .icon-sup {
                        position: absolute;
                        right: 25px;
                        bottom: 40px;
                        font-size: 170px;
                        color: #${argv.iconColor};
                    }
                    .text {
                        position: absolute;
                        left: 0;
                        bottom: 0px;
                        width: 100%;
                        text-align: center;
                        font-family: "TypoPRO Source Sans Pro";
                        font-weight: 600;
                        font-size: 50px;
                        color: #${argv.titleColor};
                    }
                </style>
            </head>
            <body>
                <div class="canvas">` +
                    (argv.subiconName !== "" ?
                    `<div class="icon-sub"><i class="fa fa-${argv.subiconName}"></i></div>
                     <div class="icon-sup"><i class="fa fa-${argv.iconName}"></i></div>` :
                    `<div class="icon"><i class="fa fa-${argv.iconName}"></i></div>`) +
                    `<div class="text">${argv.titleText}</div>
                </div>
            </body>
        </html>`
    await fs.promises.writeFile(htmlFile.name, html, { encoding: "utf8" })

    /*  render HTML into PDF  */
    const pdfFile = tmp.fileSync()
    await Prince()
        .inputs(htmlFile.name)
        .output(pdfFile.name)
        .execute()
        .catch((err) => { throw err })

    /*  render PDF into PNG  */
    const pngFile = tmp.fileSync()
    await execa("pdftocairo", [
        "-png",
        "-singlefile",
        "-scale-to", "288",
        pdfFile.name,
        pngFile.name
    ])

    /*  copy PNG to output file
        (notice: pdftocairo(1) always appends a nasty ".png" extension)  */
    await fs.promises.copyFile(`${pngFile.name}.png`, argv.outputFile)

    /*  cleanup temporary files  */
    htmlFile.removeCallback()
    pdfFile.removeCallback()
    pngFile.removeCallback()

    /*  terminate gracefully  */
    process.exit(0)
})().catch((err) => {
    /*  fatal error  */
    process.stderr.write(`sdkig: ${chalk.red("ERROR:")} ${err.message}\n`)
    process.exit(1)
})

